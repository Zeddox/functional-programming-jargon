// Publishes the C# runner (../runner) and copies its static files into
// public/runner, so Vite serves it in dev and ships it in the build.
// Needs the .NET 11 SDK; set DOTNET to use a dotnet other than the one on PATH.
// The app works without this step: the editor reports that the runner isn't built.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const project = path.join(app, '../runner')
const out = path.join(project, 'bin/site')
const target = path.join(app, 'public/runner')

fs.rmSync(out, { recursive: true, force: true })
execFileSync(process.env.DOTNET || 'dotnet', ['publish', '-c', 'Release', '-o', out, '--nologo'], {
  // From the project folder, so dotnet finds the repo's global.json (the pinned SDK)
  cwd: project,
  stdio: 'inherit'
})

fs.rmSync(target, { recursive: true, force: true })
fs.cpSync(path.join(out, 'wwwroot'), target, { recursive: true })
console.log(`Runner copied to ${path.relative(app, target)}`)
