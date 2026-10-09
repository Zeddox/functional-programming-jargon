using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Text;

namespace Jargon.Exercises.Analyzers;

/// <summary>Runs <see cref="ExerciseRulesAnalyzer"/> over a compilation, for hosts other than the compiler (the browser runner, tests).</summary>
public static class ExerciseAnalysis
{
    public const string RulesFileName = "exercise.rules";

    /// <summary>
    /// The rule diagnostics for a compilation, plus an AD0001 for any analyzer
    /// that threw (so a broken rule shows up rather than passing quietly).
    /// Single-threaded, so it also works on WebAssembly without threads.
    /// </summary>
    public static async Task<ImmutableArray<Diagnostic>> AnalyzeAsync(Compilation compilation, string? rules, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(rules)) return ImmutableArray<Diagnostic>.Empty;

        var failures = new List<Diagnostic>();
        var options = new CompilationWithAnalyzersOptions(
            new AnalyzerOptions(ImmutableArray.Create<AdditionalText>(new RulesText(rules!))),
            onAnalyzerException: (_, _, diagnostic) => { lock (failures) failures.Add(diagnostic); },
            concurrentAnalysis: false,
            logAnalyzerExecutionTime: false);
        var analysis = compilation.WithAnalyzers(ImmutableArray.Create<DiagnosticAnalyzer>(new ExerciseRulesAnalyzer()), options);
        var diagnostics = await analysis.GetAnalyzerDiagnosticsAsync(cancellationToken).ConfigureAwait(false);

        lock (failures)
            return diagnostics.AddRange(failures.Where(f => !diagnostics.Any(d => d.Id == f.Id && d.GetMessage() == f.GetMessage())));
    }

    sealed class RulesText(string text) : AdditionalText
    {
        public override string Path => RulesFileName;
        public override SourceText GetText(CancellationToken cancellationToken = default) => SourceText.From(text);
    }
}
