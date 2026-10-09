// Prototype page for the in-browser C# runner. The .NET runtime lives in a
// worker; a run that takes longer than TIMEOUT_MS is stopped by terminating
// the worker and starting a fresh one.
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
};

const $ = (id) => document.getElementById(id);
const code = $('code'), output = $('output'), status = $('status'), runButton = $('run'), sample = $('sample');

for (const name of Object.keys(SAMPLES)) sample.add(new Option(name, name));
sample.onchange = () => { code.value = SAMPLES[sample.value]; };
code.value = SAMPLES[sample.value];

let worker, ready, nextId = 0;
const pending = new Map();

function startWorker() {
  worker = new Worker('runner-worker.js', { type: 'module' });
  ready = new Promise((resolve) => {
    worker.onmessage = (e) => {
      if (e.data.type === 'ready') {
        resolve(e.data);
        return;
      }
      pending.get(e.data.id)?.(e.data.result);
      pending.delete(e.data.id);
    };
  });
  return ready;
}

function run(source) {
  const id = nextId++;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      worker.terminate();
      startWorker();
      resolve({ timedOut: true });
    }, TIMEOUT_MS);
    pending.set(id, (result) => { clearTimeout(timer); resolve(result); });
    worker.postMessage({ id, type: 'run', code: source });
  });
}

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
  line(`compile ${result.compileMs.toFixed(0)} ms · run ${result.runMs.toFixed(0)} ms`, 'ok');
}

runButton.onclick = async () => {
  runButton.disabled = true;
  status.textContent = 'Running…';
  await ready;
  const result = await run(code.value);
  show(result);
  window.lastResult = result;
  if (result.timedOut) {
    status.textContent = 'Restarting .NET…';
    await ready;
  }
  status.textContent = 'Ready';
  runButton.disabled = false;
};

const boot = await startWorker();
window.bootInfo = boot;
status.textContent = `Ready (.NET started in ${(boot.bootMs / 1000).toFixed(1)} s)`;
runButton.disabled = false;
