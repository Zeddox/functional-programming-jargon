using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Operations;

namespace Jargon.Exercises.Analyzers;

/// <summary>Finding things in learner code: functions by name, member uses, where to point.</summary>
static class Code
{
    // Learner functions are usually local functions in top-level statements,
    // but methods and lambdas stored in a variable count too
    public static string? FunctionName(SyntaxNode node) => node switch
    {
        LocalFunctionStatementSyntax f => f.Identifier.Text,
        MethodDeclarationSyntax m => m.Identifier.Text,
        VariableDeclaratorSyntax { Initializer.Value: AnonymousFunctionExpressionSyntax } v => v.Identifier.Text,
        _ => null
    };

    public static SyntaxToken NameOf(SyntaxNode function) => function switch
    {
        LocalFunctionStatementSyntax f => f.Identifier,
        MethodDeclarationSyntax m => m.Identifier,
        VariableDeclaratorSyntax v => v.Identifier,
        _ => function.GetFirstToken()
    };

    public static SyntaxNode? EnclosingFunction(SyntaxNode node, IReadOnlyList<string> names) =>
        node.AncestorsAndSelf().FirstOrDefault(a => FunctionName(a) is { } name && names.Contains(name));

    public static bool InScope(SyntaxNode node, string? scope) =>
        scope is null || EnclosingFunction(node, [scope]) is not null;

    public static SyntaxNode? FindFunction(Compilation compilation, string name) => compilation.SyntaxTrees
        .SelectMany(t => t.GetRoot().DescendantNodes())
        .FirstOrDefault(n => FunctionName(n) == name);

    /// <summary>
    /// Where to report something that's missing rather than wrong: the named
    /// function, or else the start of the learner's code (the first file with
    /// more in it than usings).
    /// </summary>
    public static Location Anchor(Compilation compilation, string? scope)
    {
        if (scope is not null && FindFunction(compilation, scope) is { } function)
            return NameOf(function).GetLocation();
        var code = compilation.SyntaxTrees
            .Select(t => (CompilationUnitSyntax)t.GetRoot())
            .FirstOrDefault(root => root.Members.Count > 0);
        return code is null ? Location.None : code.Members[0].GetFirstToken().GetLocation();
    }

    /// <summary>The member an operation uses, as "Type.Member", when it matches one of the targets.</summary>
    public static string? Matching(IOperation operation, IReadOnlyList<string> targets)
    {
        var (member, receiver) = operation switch
        {
            IInvocationOperation call => ((ISymbol)call.TargetMethod, call.Instance
                ?? (call.TargetMethod.IsExtensionMethod && call.Arguments.Length > 0 ? call.Arguments[0].Value : null)),
            IMethodReferenceOperation reference => (reference.Method, reference.Instance),
            IPropertyReferenceOperation property => (property.Property, property.Instance),
            _ => default((ISymbol, IOperation?))
        };
        if (member is null) return null;

        var types = TypeNames(member, receiver).ToList();
        foreach (var target in targets)
        {
            var (type, name) = ExerciseRule.SplitMember(target)!.Value;
            if (name != "*" && name != member.Name) continue;
            if (type == "*" || types.Contains(type)) return $"{type}.{member.Name}";
        }
        return null;
    }

    // A member counts as belonging to its declaring type and to the type of
    // whatever it's called on (so extension methods and trait methods on
    // K<Option, A> both count as Option's)
    static IEnumerable<string> TypeNames(ISymbol member, IOperation? receiver)
    {
        foreach (var name in Names(member.ContainingType)) yield return name;
        if (member is IMethodSymbol { ReducedFrom: { } reduced })
            foreach (var name in Names(reduced.ContainingType)) yield return name;
        var operand = receiver;
        while (operand is IConversionOperation conversion) operand = conversion.Operand;
        foreach (var name in Names(operand?.Type)) yield return name;
        foreach (var name in Names(receiver?.Type)) yield return name;
    }

    static IEnumerable<string> Names(ITypeSymbol? type)
    {
        if (type is null) yield break;
        yield return type.Name;
        yield return type.OriginalDefinition.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat
            .WithGlobalNamespaceStyle(SymbolDisplayGlobalNamespaceStyle.Omitted)
            .WithGenericsOptions(SymbolDisplayGenericsOptions.None));
        // K<Option, A> is language-ext's higher-kinded stand-in for Option<A>
        if (type is INamedTypeSymbol { Name: "K", TypeArguments.Length: 2 } k)
            yield return k.TypeArguments[0].Name;
    }

    /// <summary>Points at the member's name: <c>Match</c> in <c>user.Match(...)</c>.</summary>
    public static Location NameLocation(IOperation operation)
    {
        var syntax = operation.Syntax;
        var expression = syntax is InvocationExpressionSyntax invocation ? invocation.Expression : syntax;
        return expression switch
        {
            MemberAccessExpressionSyntax access => access.Name.GetLocation(),
            MemberBindingExpressionSyntax binding => binding.Name.GetLocation(),
            _ => expression.GetLocation()
        };
    }

    /// <summary>What a write ultimately writes into: <c>items</c> for <c>items[i].Price</c>.</summary>
    public static IOperation Root(IOperation target)
    {
        while (true)
        {
            switch (target)
            {
                case IArrayElementReferenceOperation element: target = element.ArrayReference; break;
                case IPropertyReferenceOperation { Instance: { } instance }: target = instance; break;
                case IFieldReferenceOperation { Instance: { } instance }: target = instance; break;
                case IConversionOperation conversion: target = conversion.Operand; break;
                default: return target;
            }
        }
    }

    public static bool IsParameterOf(IParameterSymbol parameter, SyntaxNode function) =>
        parameter.DeclaringSyntaxReferences.Any(r =>
        {
            // (int x) sits in a parameter list; the x in x => ... doesn't
            var parent = r.GetSyntax().Parent;
            var owner = parent is ParameterListSyntax ? parent.Parent : parent;
            return owner is not null && (owner == function || function is VariableDeclaratorSyntax v && v.Initializer?.Value == owner);
        });

    public static bool DeclaredInside(ISymbol symbol, SyntaxNode function) =>
        symbol.DeclaringSyntaxReferences.Any(r => r.SyntaxTree == function.SyntaxTree && function.Span.Contains(r.Span));

    public static string Short(SyntaxNode syntax)
    {
        var text = string.Join(" ", syntax.ToString().Split((char[])['\n', '\r', '\t', ' '], StringSplitOptions.RemoveEmptyEntries));
        return text.Length <= 40 ? text : text.Substring(0, 37) + "...";
    }
}
