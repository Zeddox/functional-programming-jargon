using System.Collections.Immutable;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

namespace Jargon.Exercises.Analyzers.Tests;

/// <summary>Compiles learner code as the browser runner does and runs the exercise rules over it.</summary>
static class Harness
{
    // Same as runner/Program.cs
    const string Prelude = """
        global using System;
        global using System.Collections.Generic;
        global using System.IO;
        global using System.Linq;
        global using System.Threading;
        global using System.Threading.Tasks;
        global using LanguageExt;
        global using LanguageExt.Common;
        global using LanguageExt.Traits;
        global using static LanguageExt.Prelude;
        """;

    static readonly CSharpParseOptions ParseOptions = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Preview);

    static readonly Lazy<MetadataReference[]> References = new(() =>
        ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator)
            .Append(typeof(LanguageExt.Prelude).Assembly.Location)
            .Distinct()
            .Select(p => (MetadataReference)MetadataReference.CreateFromFile(p))
            .ToArray());

    /// <summary>The rule diagnostics for a program; fails the test if it doesn't compile.</summary>
    public static async Task<ImmutableArray<Diagnostic>> Analyze(string code, string rules)
    {
        var compilation = CSharpCompilation.Create("Learner",
            [
                CSharpSyntaxTree.ParseText(Prelude, ParseOptions, path: "Prelude.cs"),
                CSharpSyntaxTree.ParseText(code, ParseOptions, path: "Program.cs")
            ],
            References.Value,
            new CSharpCompilationOptions(OutputKind.ConsoleApplication).WithNullableContextOptions(NullableContextOptions.Enable));

        var errors = compilation.GetDiagnostics().Where(d => d.Severity == DiagnosticSeverity.Error).ToList();
        Assert.True(errors.Count == 0, "The test program doesn't compile:\n" + string.Join("\n", errors));

        return await ExerciseAnalysis.AnalyzeAsync(compilation, rules, TestContext.Current.CancellationToken);
    }

    public static string[] Ids(this ImmutableArray<Diagnostic> diagnostics, DiagnosticSeverity? severity = null) => diagnostics
        .Where(d => severity is null || d.Severity == severity)
        .Select(d => d.Id)
        .Order()
        .ToArray();

    /// <summary>Where a diagnostic points, as the text it covers.</summary>
    public static string Covers(this Diagnostic diagnostic) =>
        diagnostic.Location.SourceTree!.GetText().ToString(diagnostic.Location.SourceSpan);
}

/// <summary>An exercise from the repo's exercises.md, so the tests check the rules learners actually get.</summary>
record Exercise(string Title, string Starter, string Solution, string Rules)
{
    static readonly Lazy<string> Source = new(() =>
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
            if (File.Exists(Path.Combine(dir.FullName, "exercises.md")))
                return File.ReadAllText(Path.Combine(dir.FullName, "exercises.md")).ReplaceLineEndings("\n");
        throw new FileNotFoundException("exercises.md not found above " + AppContext.BaseDirectory);
    });

    public static Exercise Named(string title)
    {
        var block = Regex.Split(Source.Value, @"^#{2,3} ", RegexOptions.Multiline)
            .Single(b => b.StartsWith(title + "\n", StringComparison.Ordinal));
        var code = Regex.Matches(block, @"```csharp\n([\s\S]*?)\n```").Select(m => m.Groups[1].Value).ToList();
        var rules = Regex.Matches(block, @"^- Rule:\s*(.+)$", RegexOptions.Multiline).Select(m => m.Groups[1].Value.Trim());
        return new Exercise(title, code[0], code[^1], string.Join("\n", rules));
    }
}
