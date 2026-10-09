# Exercise analyzer

A Roslyn analyzer that checks learner code against an exercise's rules (the `Rule:` items in [exercises.md](../exercises.md)), so an exercise can ask for more than the right output: "use `Map`, not `Match`", "keep `AddTax` pure". The diagnostics are written to teach, and they name what to do instead.

The [browser runner](../runner/README.md) runs the analyzer next to the compiler. Rules are checked as the learner types and on every run, but only once the code compiles. A broken rule is an error, so the exercise doesn't pass even if the output matches.

| Id | Severity | Reported when |
| --- | --- | --- |
| FPJ000 | error | a rule line can't be read (an unknown kind, a malformed member or an unknown check) |
| FPJ001 | error | an `avoid` member is used |
| FPJ002 | error | no `require` member is used |
| FPJ003 | error | a `pure` function has a side effect: it writes into its input or into anything declared outside it, changes a collection it didn't create, or prints |
| FPJ010 | info | a `require` or `pure` rule is kept and the rule has praise text |
| FPJ101 | error | `returns-new-function`: the function hands back its input function unchanged |
| FPJ102 | warning | `returns-new-function`: the function calls its input before the returned function is called |
| AD0001 / FPJ999 | error | the analyzer itself failed, which stops the exercise passing, so a broken rule never passes quietly |

The rule syntax is documented at the top of `exercises.md`.

## Files

- `Jargon.Exercises.Analyzers/`: the analyzer.
  - `ExerciseRule.cs` parses rule lines.
  - `ExerciseRulesAnalyzer.cs` implements `avoid`, `require` and `pure`.
  - `Checks.cs` holds the checks written in C#.
  - `ExerciseAnalysis.cs` runs the analyzer for hosts other than the compiler (the runner and the tests).
  - It targets netstandard2.0, so it would also work as an ordinary analyzer in an IDE.
- `Jargon.Exercises.Analyzers.Tests/`: xunit tests. They read the real rules, starters and solutions from `exercises.md`, and check each rule against programs that print the right output while breaking it. The runner's tests can't do that, because they only compare output.

## Adding a check

When the general kinds aren't enough, write a check in C#:

1. Add a method to `Checks.cs` with the signature `(CompilationStartAnalysisContext, ExerciseRule)` and list it in `Checks.Known`. If it needs new diagnostics, add them to `Descriptors.cs` (with ids FPJ1xx) and to `SupportedDiagnostics`.
2. Use it from `exercises.md` with `- Rule: check <name> in <Function> | <message>`.
3. Add tests, including a program with the right output that breaks the check.

```sh
dotnet test analyzers/Jargon.Exercises.Analyzers.Tests   # needs the .NET 11 SDK (global.json)
```

The runner picks up changes on its next build (`npm run build:runner` in `app/`).
