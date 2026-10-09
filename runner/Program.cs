using System.Diagnostics;
using System.Reflection;
using System.Reflection.Metadata;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

// The runner has no Main work of its own: JavaScript calls Runner.Run.
Console.WriteLine("C# runner ready");

[SupportedOSPlatform("browser")]
public static partial class Runner
{
    // The usings every readme snippet assumes (as in samples/csharp/GlobalUsings.cs)
    const string Prelude = """
        global using System;
        global using System.Collections.Generic;
        global using System.Linq;
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
    public static string Warmup() => Run("System.Console.Write(\"\");");

    /// <summary>Compiles and runs a C# program; returns JSON with diagnostics, output and timings.</summary>
    [JSExport]
    public static string Run(string code)
    {
        var total = Stopwatch.StartNew();
        var refsMs = References.IsValueCreated ? 0 : Time(() => _ = References.Value);

        var compileWatch = Stopwatch.StartNew();
        var compilation = CSharpCompilation.Create(
            $"Learner{Guid.NewGuid():N}",
            [
                CSharpSyntaxTree.ParseText(Prelude, ParseOptions, path: "Prelude.cs"),
                CSharpSyntaxTree.ParseText(code, ParseOptions, path: "Program.cs")
            ],
            References.Value,
            CompileOptions);

        using var image = new MemoryStream();
        var emit = compilation.Emit(image);
        var compileMs = compileWatch.Elapsed.TotalMilliseconds;

        var diagnostics = emit.Diagnostics
            .Where(d => d.Severity >= DiagnosticSeverity.Warning && d.Location.SourceTree?.FilePath == "Program.cs")
            .Select(d =>
            {
                var span = d.Location.GetLineSpan();
                return new RunDiagnostic(
                    d.Id, d.Severity.ToString().ToLowerInvariant(), d.GetMessage(),
                    span.StartLinePosition.Line + 1, span.StartLinePosition.Character + 1);
            })
            .ToArray();

        if (!emit.Success)
            return Json(new Result(false, diagnostics, "", null, refsMs, compileMs, 0, total.Elapsed.TotalMilliseconds));

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
            var entry = assembly.EntryPoint!;
            var result = entry.Invoke(null, entry.GetParameters().Length == 0 ? null : [Array.Empty<string>()]);
            if (result is Task task) task.GetAwaiter().GetResult();
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
            refsMs, compileMs, runWatch.Elapsed.TotalMilliseconds, total.Elapsed.TotalMilliseconds));
    }

    static double Time(Action action)
    {
        var watch = Stopwatch.StartNew();
        action();
        return watch.Elapsed.TotalMilliseconds;
    }

    static string Json(Result result) => JsonSerializer.Serialize(result, RunnerJson.Default.Result);
}

public record RunDiagnostic(string Id, string Severity, string Message, int Line, int Column);

public record Result(
    bool Compiled, RunDiagnostic[] Diagnostics, string Output, string? Exception,
    double ReferencesMs, double CompileMs, double RunMs, double TotalMs);

[System.Text.Json.Serialization.JsonSourceGenerationOptions(PropertyNamingPolicy = System.Text.Json.Serialization.JsonKnownNamingPolicy.CamelCase)]
[System.Text.Json.Serialization.JsonSerializable(typeof(Result))]
public partial class RunnerJson : System.Text.Json.Serialization.JsonSerializerContext;
