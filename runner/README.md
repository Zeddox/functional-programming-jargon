# C# runner (prototype)

Compiles and runs C# in the browser, for exercises on the learning paths.
Roslyn (C# preview, so C# 15 `union` works) compiles learner code against the
.NET 11 reference assemblies and language-ext v5, then runs it in the same
WebAssembly runtime inside a Web Worker. Everything is static files, so it
can be hosted on GitHub Pages.

- `Program.cs`: `Runner.Run(code, rules)` compiles and runs a program (async, so learner code can `await`); `Runner.Diagnose(code, rules)` only type-checks it, for live squiggles. Both check the code against an exercise's rules with the [exercise analyzer](../analyzers/README.md) when there are rules and the code compiles, and both return JSON
- `wwwroot/runner-worker.js`: hosts .NET in a module worker and runs jobs one at a time
- `wwwroot/runner-client.js`: the page-side API (`createRunner()` → `run(code, { rules })`, `diagnose(code, { rules })`, `subscribe`). A run that takes longer than 5 s terminates the worker and starts a new one. The jargon app imports this file at runtime
- `wwwroot/index.html`, `main.js`: a test page with samples

The SDK is pinned in the repo root's `global.json` (.NET 11 RC1 or later). From `app/`:

    npm run build:runner   # publishes into app/public/runner (gitignored); DOTNET=... picks a dotnet
    npm run test:runner    # every exercise and readme playground, through the runner in Chromium

The app builds without the runner: "Try it" then says the runner isn't built.

Measured locally: 13.1 MB when the host gzips `.wasm` (38 MB if not; still to be confirmed on GitHub Pages), about 1.8 s to start .NET, warm compiles in about 75–100 ms, and rule checks in about 20–90 ms more.

Learner code can use only what's embedded as `ref/*.dll` (see `LearnerRefs` in
`Runner.csproj`). The implementations behind those references are kept whole by the trimmer,
so anything that compiles also runs.
