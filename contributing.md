# Contributing

This project is a work in progress. Contributions are very welcome.

## Hard rules
There is a pre-commit hook that runs:  `npm run test && npm run roadmarks` for linting the readme and creating the TOC.
Now that the samples are C#, `npm run test` (eslint) no longer checks any code.

Every C# sample in the readme must build and run. Check them with `npm run test:csharp` (or `samples/csharp/run.sh [section filter]`),
which needs the .NET 11 SDK (the Sum type samples use C# 15 union types). Set `DOTNET` to use a dotnet other than the one on your PATH.

That said, we'd like to maintain some consistency across the document.

## Style guide
1. Every definition should include at least one C# code example using [language-ext](https://github.com/louthy/language-ext) v5.
1. Definitions should be written using the simplest language possible. Every word should tell.
1. Target programmers that have no functional programming experience.
1. We value understandability more than accuracy. e.g. It's okay to describe a functor as a container.
1. Don't overuse jargon even if defined elsewhere in the document.
1. Link to terms defined in the document when you use them in a definition.
1. Avoid big walls of text

## Code conventions
* Be consistent with other examples
* Fence samples as ` ```csharp `. Use a bare ` ``` ` fence for notation that isn't meant to compile (laws, type signatures).
* Snippets assume `using LanguageExt;`, `using LanguageExt.Traits;` and `using static LanguageExt.Prelude;`.
* All of a section's `csharp` blocks are joined, in order, into one method body, so use local functions rather than methods.
  Type declarations (`record`, `class`, `interface`, ...) written at column 0 are moved out to namespace level for you.
* Put output values in comments as `// => value`. These are checked when the samples run, either at the end of the
  statement or on their own line just after it. The statement must be valid C# by itself, so write
  `var sum = 1 + 1; // => 2` rather than `1 + 1; // => 2`.
* Prefer the real language-ext API; when it has nothing that fits, hand-roll a small version and say so.
* Keep code lines under ~75 characters; the interactive graph's code panel is narrow.
* Keep it short and simple

This styleguide is a WIP too! Send PRs :)
