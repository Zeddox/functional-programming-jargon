// Runs every C# sample extracted from readme.md. See extract.mjs.
using Jargon;

var filter = args.FirstOrDefault();
var errors = new List<string>();
var ran = 0;

foreach (var (title, run) in Registry.Sections)
{
    if (filter is not null && !title.Contains(filter, StringComparison.OrdinalIgnoreCase)) continue;
    Check.Section = title;
    Console.WriteLine($"── {title}");
    try { await run(); ran++; }
    catch (Exception e) { errors.Add($"[{title}] threw {e.GetType().Name}: {e.Message}"); }
}

Console.WriteLine();
foreach (var f in Check.Failures) Console.WriteLine($"MISMATCH {f}");
foreach (var e in errors) Console.WriteLine($"ERROR {e}");
Console.WriteLine($"{ran} sections ran, {Check.Failures.Count} result mismatches, {errors.Count} exceptions.");
return Check.Failures.Count + errors.Count == 0 ? 0 : 1;
