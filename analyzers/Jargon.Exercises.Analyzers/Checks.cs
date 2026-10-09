using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Operations;

namespace Jargon.Exercises.Analyzers;

/// <summary>
/// Checks too specific for the general rule kinds, written in C# and named
/// by <c>check name in Function</c> rules. To add one: write a method with
/// this signature and list it in <see cref="Known"/>.
/// </summary>
public static class Checks
{
    public static readonly IReadOnlyDictionary<string, Action<CompilationStartAnalysisContext, ExerciseRule>> Known =
        new Dictionary<string, Action<CompilationStartAnalysisContext, ExerciseRule>>
        {
            ["returns-new-function"] = ReturnsNewFunction,
        };

    /// <summary>
    /// For a higher-order function that takes a function and should return a
    /// new one (Twice, Compose...): handing back the input as it is is an
    /// error, and calling the input before the returned function is called is
    /// a warning, since that runs it too early (and only once).
    /// </summary>
    static void ReturnsNewFunction(CompilationStartAnalysisContext context, ExerciseRule rule)
    {
        var name = rule.Scope!;

        context.RegisterOperationAction(op =>
        {
            var returned = op.Operation switch
            {
                IReturnOperation r => r.ReturnedValue,
                _ => null
            };
            while (returned is IConversionOperation or IDelegateCreationOperation)
                returned = returned is IConversionOperation c ? c.Operand : ((IDelegateCreationOperation)returned).Target;
            if (returned is not IParameterReferenceOperation { Parameter: var parameter } reference) return;
            if (Code.EnclosingFunction(op.Operation.Syntax, [name]) is not { } function) return;
            if (!Code.IsParameterOf(parameter, function) || !IsFunction(parameter.Type)) return;
            // Only returns from the function itself, not from a lambda inside it
            if (NearestFunction(op.Operation.Syntax) != function) return;
            op.ReportDiagnostic(Diagnostic.Create(Descriptors.ReturnsInput, reference.Syntax.GetLocation(),
                $"{name} hands back `{parameter.Name}` itself, so calling the result does just what `{parameter.Name}` does. {rule.Message}".TrimEnd()));
        }, OperationKind.Return);

        context.RegisterOperationAction(op =>
        {
            var call = (IInvocationOperation)op.Operation;
            if (call.Instance is not IParameterReferenceOperation { Parameter: var parameter }) return;
            if (call.TargetMethod.MethodKind != MethodKind.DelegateInvoke) return;
            if (Code.EnclosingFunction(call.Syntax, [name]) is not { } function) return;
            if (!Code.IsParameterOf(parameter, function) || NearestFunction(call.Syntax) != function) return;
            op.ReportDiagnostic(Diagnostic.Create(Descriptors.CallsTooSoon, call.Syntax.GetLocation(),
                $"{name} calls `{parameter.Name}` straight away, once, while it builds the new function. Call it inside the function you return, so it runs each time that's called."));
        }, OperationKind.Invocation);
    }

    static bool IsFunction(ITypeSymbol type) => type.TypeKind == TypeKind.Delegate;

    // The innermost function around a node; a lambda stored in a variable is that variable's function
    static SyntaxNode? NearestFunction(SyntaxNode node)
    {
        var nearest = node.Ancestors().FirstOrDefault(a =>
            a is AnonymousFunctionExpressionSyntax or LocalFunctionStatementSyntax or MethodDeclarationSyntax);
        return nearest is AnonymousFunctionExpressionSyntax { Parent: EqualsValueClauseSyntax { Parent: VariableDeclaratorSyntax declarator } }
            ? declarator
            : nearest;
    }
}
