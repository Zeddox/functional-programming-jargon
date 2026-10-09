using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Operations;

namespace Jargon.Exercises.Analyzers;

/// <summary>
/// Checks learner code against the current exercise's rules, read from an
/// additional file named <see cref="ExerciseAnalysis.RulesFileName"/>.
/// With no rules file it does nothing.
/// </summary>
[DiagnosticAnalyzer(Microsoft.CodeAnalysis.LanguageNames.CSharp)]
public sealed class ExerciseRulesAnalyzer : DiagnosticAnalyzer
{
    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get; } = ImmutableArray.Create(
        Descriptors.RuleNotUnderstood, Descriptors.Avoided, Descriptors.Missing, Descriptors.SideEffect,
        Descriptors.Praise, Descriptors.ReturnsInput, Descriptors.CallsTooSoon);

    public override void Initialize(AnalysisContext context)
    {
        context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
        context.EnableConcurrentExecution();
        context.RegisterCompilationStartAction(Start);
    }

    static void Start(CompilationStartAnalysisContext context)
    {
        var file = context.Options.AdditionalFiles.FirstOrDefault(f =>
            f.Path.EndsWith(ExerciseAnalysis.RulesFileName, StringComparison.OrdinalIgnoreCase));
        var text = file?.GetText(context.CancellationToken)?.ToString();
        if (string.IsNullOrWhiteSpace(text)) return;

        var rules = ExerciseRule.ParseAll(text!);
        foreach (var rule in rules)
        {
            if (rule.Problem is not null)
            {
                var problem = rule;
                context.RegisterCompilationEndAction(end => end.ReportDiagnostic(Diagnostic.Create(
                    Descriptors.RuleNotUnderstood, Code.Anchor(end.Compilation, null),
                    $"Exercise rule {problem.Number} isn't understood: {problem.Problem}. The rule was: {problem.Text}")));
                continue;
            }
            switch (rule.Kind)
            {
                case "avoid": Avoid(context, rule); break;
                case "require": Require(context, rule); break;
                case "pure": Pure(context, rule); break;
                case "check": Checks.Known[rule.Targets[0]](context, rule); break;
            }
        }
    }

    static readonly OperationKind[] MemberUses = [OperationKind.Invocation, OperationKind.MethodReference, OperationKind.PropertyReference];

    // Every use of a listed member is an error
    static void Avoid(CompilationStartAnalysisContext context, ExerciseRule rule) =>
        context.RegisterOperationAction(op =>
        {
            if (!Code.InScope(op.Operation.Syntax, rule.Scope)) return;
            if (Code.Matching(op.Operation, rule.Targets) is not { } member) return;
            op.ReportDiagnostic(Diagnostic.Create(Descriptors.Avoided, Code.NameLocation(op.Operation),
                rule.Message.Length > 0 ? rule.Message : $"This exercise asks you not to use `{member}`."));
        }, MemberUses);

    // At least one listed member must be used; the first use earns the praise, if any
    static void Require(CompilationStartAnalysisContext context, ExerciseRule rule)
    {
        var uses = new ConcurrentBag<Location>();
        context.RegisterOperationAction(op =>
        {
            if (Code.InScope(op.Operation.Syntax, rule.Scope) && Code.Matching(op.Operation, rule.Targets) is not null)
                uses.Add(Code.NameLocation(op.Operation));
        }, MemberUses);

        context.RegisterCompilationEndAction(end =>
        {
            var first = uses.OrderBy(l => l.SourceTree?.FilePath).ThenBy(l => l.SourceSpan.Start).FirstOrDefault();
            if (first is not null)
            {
                if (rule.Praise is not null) end.ReportDiagnostic(Diagnostic.Create(Descriptors.Praise, first, rule.Praise));
                return;
            }
            var names = string.Join(" or ", rule.Targets.Select(t => $"`{ExerciseRule.SplitMember(t)!.Value.Member}`"));
            var where = rule.Scope is null ? "" : $" in {rule.Scope}";
            end.ReportDiagnostic(Diagnostic.Create(Descriptors.Missing, Code.Anchor(end.Compilation, rule.Scope),
                $"This exercise asks you to use {names}{where}. {rule.Message}".TrimEnd()));
        });
    }

    static readonly OperationKind[] Writes =
    [
        OperationKind.SimpleAssignment, OperationKind.CompoundAssignment, OperationKind.CoalesceAssignment,
        OperationKind.DeconstructionAssignment, OperationKind.Increment, OperationKind.Decrement, OperationKind.Invocation
    ];

    static readonly HashSet<string> MutatingMethods =
    [
        "Add", "AddRange", "Clear", "Insert", "InsertRange", "Remove", "RemoveAt", "RemoveAll", "RemoveRange",
        "Sort", "Reverse", "Push", "Pop", "Enqueue", "Dequeue", "TryAdd", "TryRemove", "TryPop", "TryDequeue",
        "UnionWith", "IntersectWith", "ExceptWith", "SymmetricExceptWith", "AddFirst", "AddLast", "RemoveFirst", "RemoveLast"
    ];

    // Inside each named function: no writes into its inputs or anything declared
    // outside it, no mutating collection calls on them, no printing
    static void Pure(CompilationStartAnalysisContext context, ExerciseRule rule)
    {
        var broken = new ConcurrentDictionary<string, bool>();
        context.RegisterOperationAction(op =>
        {
            var function = Code.EnclosingFunction(op.Operation.Syntax, rule.Targets);
            if (function is null) return;
            if (SideEffect(op.Operation, function) is not { } detail) return;
            broken[Code.FunctionName(function)!] = true;
            op.ReportDiagnostic(Diagnostic.Create(Descriptors.SideEffect, op.Operation.Syntax.GetLocation(),
                $"{detail} {rule.Message}".TrimEnd()));
        }, Writes);

        if (rule.Praise is null) return;
        context.RegisterCompilationEndAction(end =>
        {
            foreach (var name in rule.Targets.Where(n => !broken.ContainsKey(n)))
                if (Code.FindFunction(end.Compilation, name) is { } declaration)
                    end.ReportDiagnostic(Diagnostic.Create(Descriptors.Praise, Code.NameOf(declaration).GetLocation(), rule.Praise));
        });
    }

    static string? SideEffect(IOperation operation, SyntaxNode function)
    {
        var name = Code.FunctionName(function);
        switch (operation)
        {
            case IInvocationOperation call when call.TargetMethod.ContainingType?.ToDisplayString() == "System.Console":
                return $"`{Code.Short(call.Syntax)}` prints from inside {name}, which is a side effect.";

            case IInvocationOperation call when call.Instance is not null && MutatingMethods.Contains(call.TargetMethod.Name)
                                                && IsMutableCollection(call.Instance.Type):
                return Owner(Code.Root(call.Instance), function) is { } owner
                    ? $"`{Code.Short(call.Syntax)}` changes {owner}."
                    : null;

            case IInvocationOperation:
                return null;

            case IDeconstructionAssignmentOperation deconstruction:
                return deconstruction.Target is ITupleOperation tuple
                    ? tuple.Elements.Select(e => Written(e, operation, function)).FirstOrDefault(d => d is not null)
                    : null;

            case IAssignmentOperation assignment:
                return Written(assignment.Target, operation, function);

            case IIncrementOrDecrementOperation step:
                return Written(step.Target, operation, function);
        }
        return null;
    }

    static string? Written(IOperation target, IOperation write, SyntaxNode function)
    {
        // Rebinding a parameter or local is invisible to the caller; writing
        // through it (items[i] = ..., user.Name = ...) is not
        var direct = target is ILocalReferenceOperation or IParameterReferenceOperation;
        if (target is IFieldReferenceOperation { Field.IsStatic: true } or IPropertyReferenceOperation { Property.IsStatic: true })
            return $"`{Code.Short(write.Syntax)}` changes shared state outside {Code.FunctionName(function)}.";

        var root = Code.Root(target);
        if (direct && root is IParameterReferenceOperation p && Code.IsParameterOf(p.Parameter, function)) return null;
        return Owner(root, function, direct) is { } owner ? $"`{Code.Short(write.Syntax)}` changes {owner}." : null;
    }

    // Describes whose data a write lands in, or null when it's the function's own
    static string? Owner(IOperation root, SyntaxNode function, bool direct = false)
    {
        var name = Code.FunctionName(function);
        switch (root)
        {
            case IParameterReferenceOperation p when Code.IsParameterOf(p.Parameter, function):
                return direct ? null : $"`{p.Parameter.Name}`, which {name} was given";
            case IParameterReferenceOperation p when !Code.DeclaredInside(p.Parameter, function):
            case ILocalReferenceOperation l when !Code.DeclaredInside(l.Local, function):
                var symbol = root is IParameterReferenceOperation pr ? (ISymbol)pr.Parameter : ((ILocalReferenceOperation)root).Local;
                return $"`{symbol.Name}`, which lives outside {name}";
            case IInstanceReferenceOperation:
                return $"the object {name} belongs to";
            case IFieldReferenceOperation f when f.Instance is null:
                return $"`{f.Field.Name}`, which lives outside {name}";
            default:
                return null;
        }
    }

    static bool IsMutableCollection(ITypeSymbol? type)
    {
        var ns = type?.ContainingNamespace?.ToDisplayString() ?? "";
        return ns.StartsWith("System.Collections", StringComparison.Ordinal)
               && !ns.StartsWith("System.Collections.Immutable", StringComparison.Ordinal)
               || type is IArrayTypeSymbol;
    }
}
