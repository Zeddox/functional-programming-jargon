# C# runner (prototype)

Compiles and runs C# in the browser, for exercises on the learning paths.
Roslyn (C# preview, so C# 15 `union` works) compiles learner code against the
.NET 11 reference assemblies and language-ext v5, then runs it in the same
WebAssembly runtime inside a Web Worker. Everything is static files, so it
can be hosted on GitHub Pages.

- `Program.cs`: `Runner.Run(code)` compiles, runs and returns JSON (diagnostics, output, exception, timings)
- `wwwroot/runner-worker.js`: hosts .NET in a module worker
- `wwwroot/main.js`, `index.html`: a test page with samples. A run that takes longer than 5 s terminates the worker and starts a new one

Build with the .NET 11 SDK (RC1 or later):

    dotnet publish -c Release -o out
    # serve out/wwwroot with any static server

Measured: 13.1 MB gzip (trimmed), about 1.8 s to start .NET, warm compiles in about 75–100 ms.

Learner code can use only what's embedded as `ref/*.dll` (see `LearnerRefs` in
`Runner.csproj`). The implementations behind those references are kept whole by the trimmer,
so anything that compiles also runs.
