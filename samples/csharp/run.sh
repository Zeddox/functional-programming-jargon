#!/usr/bin/env bash
# Extract the C# samples from readme.md, then build and run them all.
# Usage: samples/csharp/run.sh [section-title-filter]
set -euo pipefail
cd "$(dirname "$0")"
node extract.mjs
dotnet build --nologo -v q -clp:ErrorsOnly
dotnet bin/Debug/net10.0/Jargon.Samples.dll "$@"
