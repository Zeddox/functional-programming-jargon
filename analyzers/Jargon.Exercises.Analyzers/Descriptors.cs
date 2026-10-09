using Microsoft.CodeAnalysis;

namespace Jargon.Exercises.Analyzers;

/// <summary>
/// The FPJ diagnostics. Messages come from the exercise's rules, so each
/// descriptor's format is just "{0}". Errors stop an exercise passing;
/// warnings and info are guidance.
/// </summary>
public static class Descriptors
{
    const string Category = "Exercise";

    static DiagnosticDescriptor Make(string id, string title, DiagnosticSeverity severity, params string[] tags) =>
        new(id, title, "{0}", Category, severity, isEnabledByDefault: true, customTags: tags);

    public static readonly DiagnosticDescriptor RuleNotUnderstood =
        Make("FPJ000", "Exercise rule not understood", DiagnosticSeverity.Error, WellKnownDiagnosticTags.CompilationEnd);

    public static readonly DiagnosticDescriptor Avoided =
        Make("FPJ001", "This exercise asks you not to use this", DiagnosticSeverity.Error);

    public static readonly DiagnosticDescriptor Missing =
        Make("FPJ002", "This exercise asks you to use something you haven't yet", DiagnosticSeverity.Error, WellKnownDiagnosticTags.CompilationEnd);

    public static readonly DiagnosticDescriptor SideEffect =
        Make("FPJ003", "A function that should be pure has a side effect", DiagnosticSeverity.Error);

    public static readonly DiagnosticDescriptor Praise =
        Make("FPJ010", "Nicely done", DiagnosticSeverity.Info, WellKnownDiagnosticTags.CompilationEnd);

    public static readonly DiagnosticDescriptor ReturnsInput =
        Make("FPJ101", "Hands back the function it was given", DiagnosticSeverity.Error);

    public static readonly DiagnosticDescriptor CallsTooSoon =
        Make("FPJ102", "Calls the function it was given straight away", DiagnosticSeverity.Warning);
}
