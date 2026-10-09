// Prototype page for the in-browser C# runner. The .NET runtime lives in a
// worker; a run that takes longer than TIMEOUT_MS is stopped by terminating
// the worker and starting a fresh one.
import { createRunner } from './runner-client.js';

const TIMEOUT_MS = 5000;

const SAMPLES = {
  'C# 15 union': `string Rate(Logic l) => l switch
{
    Known(true)  => "true",
    Known(false) => "false",
    HalfTrue     => "half-true",
};

Console.WriteLine(Rate(new HalfTrue()));
Console.WriteLine(Rate(new Known(true)));

IntOrText id = 42;
Console.WriteLine(id switch { int n => $"#{n}", string s => s });

record Known(bool Value);
record HalfTrue;
union Logic(Known, HalfTrue);
union IntOrText(int, string);
`,
  'language-ext': `Option<int> ParseInt(string s) =>
    int.TryParse(s, out var n) ? Some(n) : None;

var total =
    from a in ParseInt("20")
    from b in ParseInt("22")
    select a + b;

Console.WriteLine(total);
Console.WriteLine(ParseInt("nope").Map(n => n * 2));
Console.WriteLine(Seq(1, 2, 3, 4).Fold(0, (acc, x) => acc + x));
`,
  'BCL extras': `using System.Collections.Immutable;
using System.Text.RegularExpressions;

var words = ImmutableList.Create("map", "bind", "fold");
Console.WriteLine(string.Join(",", words.Add("unfold")));
Console.WriteLine(Regex.Replace("f(g(x))", @"\\w\\(", "→"));
Console.WriteLine(System.Numerics.BigInteger.Pow(2, 100));
Console.WriteLine(new System.Collections.Concurrent.ConcurrentDictionary<int, int>().GetOrAdd(1, 7));
Console.WriteLine(Enumerable.Range(1, 5).Aggregate((a, b) => a * b));
`,
  'Outside the surface': `// System.Text.Json isn't part of the runner, so this is a compile error
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(new { a = 1 }));
`,
  'Async': `Console.WriteLine("waiting…");
await Task.Delay(50);
var io = IO.lift(() => 21).Map(x => x * 2);
Console.WriteLine(await io.RunAsync());
`,
  'Compile error': `int x = "not a number";
Console.WriteLine(x);
`,
  'Exception': `var list = new List<int>();
Console.WriteLine("before");
Console.WriteLine(list[0]);
`,
  'Infinite loop': `Console.WriteLine("spinning…");
while (true) { }
`,
  // Right output, but it breaks the exercise's rules (FPJ001, FPJ002)
  'Exercise rules': {
    code: `Option<string> FindUser(int id) => id == 1 ? Some("ada") : None;

Option<string> ShoutName(int id) =>
    FindUser(id).Match(name => Some(name.ToUpper()), () => None);

Console.WriteLine(ShoutName(1));
Console.WriteLine(ShoutName(2));
`,
    rules: `avoid Option.Match, Option.IfNone in ShoutName | That takes the name out of the Option. Let Map work inside it instead.
require Option.Map in ShoutName | Map runs your function only when there's a name. | Map kept the None case for you.`,
  },
};

const $ = (id) => document.getElementById(id);
const code = $('code'), rules = $('rules'), output = $('output'), status = $('status'), runButton = $('run'), sample = $('sample');

for (const name of Object.keys(SAMPLES)) sample.add(new Option(name, name));
const load = () => {
  const chosen = SAMPLES[sample.value];
  code.value = chosen.code ?? chosen;
  rules.value = chosen.rules ?? '';
};
sample.onchange = load;
load();

const runner = createRunner({ timeoutMs: TIMEOUT_MS });
runner.subscribe(({ status: s, boot }) => {
  status.textContent = s === 'ready' && boot ? `Ready (.NET started in ${(boot.bootMs / 1000).toFixed(1)} s)` : s;
  runButton.disabled = s !== 'ready';
  if (boot) window.bootInfo = boot;
});

function show(result) {
  output.replaceChildren();
  const line = (text, cls) => {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    span.textContent = text + '\n';
    output.append(span);
  };
  if (result.timedOut) {
    line(`Stopped after ${TIMEOUT_MS / 1000} s (infinite loop?). Restarting .NET…`, 'error');
    return;
  }
  for (const d of result.diagnostics) line(`(${d.line},${d.column}) ${d.severity} ${d.id}: ${d.message}`, d.severity);
  if (result.output) line(result.output.replace(/\n$/, ''));
  if (result.exception) line(result.exception.split('\n')[0], 'error');
  const rulesMs = result.rulesMs ? ` · rules ${result.rulesMs.toFixed(0)} ms` : '';
  line(`compile ${result.compileMs.toFixed(0)} ms${rulesMs} · run ${result.runMs.toFixed(0)} ms`, 'ok');
}

runButton.onclick = async () => {
  const result = await runner.run(code.value, { rules: rules.value });
  show(result);
  window.lastResult = result;
};

// For tests: compile without running
window.runner = runner;
