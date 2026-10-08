#!/usr/bin/env bash
# Extract the C# samples from readme.md, then build and run them all.
# Usage: samples/csharp/run.sh [section-title-filter]
# Needs the .NET 11 SDK (the samples use C# 15 union types); set DOTNET to
# point at a dotnet other than the one on PATH.
set -euo pipefail
cd "$(dirname "$0")"
node extract.mjs
"${DOTNET:-dotnet}" build --nologo -v q -clp:ErrorsOnly
"${DOTNET:-dotnet}" bin/Debug/net11.0/Jargon.Samples.dll "$@"
