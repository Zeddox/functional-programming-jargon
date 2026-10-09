using System.Diagnostics;
using System.Reflection;
using System.Reflection.Metadata;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;
using Jargon.Exercises.Analyzers;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

// The runner has no Main work of its own: JavaScript calls Runner.Run.
Console.WriteLine("C# runner ready");

[SupportedOSPlatform("browser")]
public static partial class Runner
{
    // .NET's implicit usings (less System.Net.Http, which the runner doesn't
    // offer) plus language-ext's, as in samples/csharp
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

    static readonly CSharpParseOptions ParseOptions =
        CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Preview);

    static readonly CSharpCompilationOptions CompileOptions =
        new CSharpCompilationOptions(OutputKind.ConsoleApplication)
            .WithNullableContextOptions(NullableContextOptions.Enable)
            .WithOptimizationLevel(OptimizationLevel.Release)
            .WithAllowUnsafe(false)
            // Single-threaded WebAssembly can't wait on Roslyn's worker threads
            .WithConcurrentBuild(false);

    static readonly Lazy<MetadataReference[]> References = new(LoadReferences);

    // Reference assemblies (the framework surface and language-ext) are
    // embedded as resources named ref/<file>.dll
    static MetadataReference[] LoadReferences()
    {
        var self = typeof(Runner).Assembly;
        return self.GetManifestResourceNames()
            .Where(n => n.StartsWith("ref/") && n.EndsWith(".dll"))
            .Select(n =>
            {
                using var stream = self.GetManifestResourceStream(n)!;
                return (MetadataReference)MetadataReference.CreateFromStream(stream, filePath: n);
            })
            .ToArray();
    }

    /// <summary>Loads the references and compiles a trivial program once, so the first real run is quick.</summary>
    [JSExport]
    public static Task<string> Warmup() => Run("System.Console.Write(\"\");", "");

    /// <summary>
    /// Type-checks a program without running it, for live squiggles in the
    /// editor, and checks it against the exercise's rules (see exercises.md).
    /// </summary>
    /// <remarks>Async because Roslyn's analyzer host only offers async results, and WebAssembly here can't block on a Task.</remarks>
    [JSExport]
    public static async Task<string> Diagnose(string code, string rules)
    {
        var watch = Stopwatch.StartNew();
        var compilation = Compile(code);
        var diagnostics = compilation.GetDiagnostics();
        var checkMs = watch.Elapsed.TotalMilliseconds;
        var (ruled, rulesMs) = await Rules(compilation, diagnostics, rules);
        return JsonSerializer.Serialize(new Diagnosis([.. Learner(diagnostics), .. ruled], checkMs, rulesMs), RunnerJson.Default.Diagnosis);
    }

    /// <summary>
    /// Compiles a C# program, checks it against the exercise's rules (if any)
    /// and runs it; returns JSON with diagnostics, output and timings.
    /// </summary>
    /// <remarks>Async so learner code that awaits (Task.Delay and so on) completes on the browser's event loop.</remarks>
    [JSExport]
    public static async Task<string> Run(string code, string rules)
    {
        var total = Stopwatch.StartNew();
        var refsMs = References.IsValueCreated ? 0 : Time(() => _ = References.Value);

        var compileWatch = Stopwatch.StartNew();
        using var image = new MemoryStream();
        var compilation = Compile(code);
        var emit = compilation.Emit(image);
        var compileMs = compileWatch.Elapsed.TotalMilliseconds;
        // Rules are checked separately from emitting, so a rule problem never stops a run
        var (ruled, rulesMs) = await Rules(compilation, emit.Diagnostics, rules);
        RunDiagnostic[] diagnostics = [.. Learner(emit.Diagnostics), .. ruled];

        if (!emit.Success)
            return Json(new Result(false, diagnostics, "", null, refsMs, compileMs, rulesMs, 0, total.Elapsed.TotalMilliseconds));

        // Mono on WebAssembly can't unload assemblies (no collectible load
        // contexts), so each run's small assembly stays loaded for the session
        var output = new StringWriter();
        var originalOut = Console.Out;
        string? exception = null;
        var runWatch = Stopwatch.StartNew();
        try
        {
            Console.SetOut(output);
            var assembly = Assembly.Load(image.ToArray());
            var entry = AwaitableEntryPoint(assembly.EntryPoint!);
            var result = entry.Invoke(null, entry.GetParameters().Length == 0 ? null : [Array.Empty<string>()]);
            if (result is Task task) await task;
        }
        catch (TargetInvocationException e) when (e.InnerException is not null)
        {
            exception = e.InnerException.ToString();
        }
        catch (Exception e)
        {
            exception = e.ToString();
        }
        finally
        {
            Console.SetOut(originalOut);
        }

        return Json(new Result(true, diagnostics, output.ToString(), exception,
            refsMs, compileMs, rulesMs, runWatch.Elapsed.TotalMilliseconds, total.Elapsed.TotalMilliseconds));
    }

    // The exercise rules' diagnostics (FPJ*), checked only once the code
    // compiles. An analyzer that throws comes back as AD0001, and anything
    // else that goes wrong as FPJ999, so a broken rule never passes quietly.
    static async Task<(RunDiagnostic[] Diagnostics, double Ms)> Rules(Compilation compilation, IEnumerable<Diagnostic> compiled, string rules)
    {
        if (string.IsNullOrWhiteSpace(rules) || compiled.Any(d => d.Severity == DiagnosticSeverity.Error)) return ([], 0);
        var watch = Stopwatch.StartNew();
        try
        {
            var found = await ExerciseAnalysis.AnalyzeAsync(compilation, rules);
            return (found.Select(ToRunDiagnostic).ToArray(), watch.Elapsed.TotalMilliseconds);
        }
        catch (Exception e)
        {
            return ([new RunDiagnostic("FPJ999", "error", $"The exercise rules couldn't be checked: {e.Message}", 1, 1, 1, 1)],
                watch.Elapsed.TotalMilliseconds);
        }
    }

    // For an async program the compiler's entry point is a synchronous
    // wrapper (<Main>) that blocks on the real one, which single-threaded
    // WebAssembly can't do, so call the Task-returning method it wraps:
    // <Main>$ for top-level statements, Main for an explicit async Main
    static MethodInfo AwaitableEntryPoint(MethodInfo entry)
    {
        if (entry.Name != "<Main>") return entry;
        const BindingFlags any = BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;
        return entry.DeclaringType!.GetMethods(any).FirstOrDefault(m =>
            m.Name is "<Main>$" or "Main" && typeof(Task).IsAssignableFrom(m.ReturnType)) ?? entry;
    }

    static CSharpCompilation Compile(string code) => CSharpCompilation.Create(
        $"Learner{Guid.NewGuid():N}",
        [
            CSharpSyntaxTree.ParseText(Prelude, ParseOptions, path: "Prelude.cs"),
            CSharpSyntaxTree.ParseText(code, ParseOptions, path: "Program.cs")
        ],
        References.Value,
        CompileOptions);

    // Compiler warnings and errors in the learner's own code
    static IEnumerable<RunDiagnostic> Learner(IEnumerable<Diagnostic> diagnostics) => diagnostics
        .Where(d => d.Severity >= DiagnosticSeverity.Warning && d.Location.SourceTree?.FilePath == "Program.cs")
        .Select(ToRunDiagnostic);

    // 1-based positions, as Monaco expects; anything without a place in the
    // learner's code (an analyzer failure, say) goes on the first line
    static RunDiagnostic ToRunDiagnostic(Diagnostic d)
    {
        var inCode = d.Location.SourceTree?.FilePath == "Program.cs";
        var span = d.Location.GetLineSpan();
        var (start, end) = inCode ? (span.StartLinePosition, span.EndLinePosition) : default;
        return new RunDiagnostic(
            d.Id, d.Severity.ToString().ToLowerInvariant(), d.GetMessage(),
            start.Line + 1, start.Character + 1, end.Line + 1, end.Character + 1);
    }

    static double Time(Action action)
    {
        var watch = Stopwatch.StartNew();
        action();
        return watch.Elapsed.TotalMilliseconds;
    }

    static string Json(Result result) => JsonSerializer.Serialize(result, RunnerJson.Default.Result);
}

public record RunDiagnostic(string Id, string Severity, string Message, int Line, int Column, int EndLine, int EndColumn);

public record Diagnosis(RunDiagnostic[] Diagnostics, double CheckMs, double RulesMs);

public record Result(
    bool Compiled, RunDiagnostic[] Diagnostics, string Output, string? Exception,
    double ReferencesMs, double CompileMs, double RulesMs, double RunMs, double TotalMs);

[System.Text.Json.Serialization.JsonSourceGenerationOptions(PropertyNamingPolicy = System.Text.Json.Serialization.JsonKnownNamingPolicy.CamelCase)]
[System.Text.Json.Serialization.JsonSerializable(typeof(Result))]
[System.Text.Json.Serialization.JsonSerializable(typeof(Diagnosis))]
public partial class RunnerJson : System.Text.Json.Serialization.JsonSerializerContext;
