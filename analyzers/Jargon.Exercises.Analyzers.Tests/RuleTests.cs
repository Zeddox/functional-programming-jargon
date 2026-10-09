using Microsoft.CodeAnalysis;
using static Jargon.Exercises.Analyzers.Tests.Harness;

namespace Jargon.Exercises.Analyzers.Tests;

// Each rule is tested with programs whose output is right but which break the
// rule, since the runner's own tests (output only) can't tell those apart.
public class FunctorRules
{
    static readonly Exercise Exercise = Exercise.Named("Shout without unwrapping");

    const string Find = "Option<string> FindUser(int id) => id == 1 ? Some(\"ada\") : None;\n";
    const string Print = "\nConsole.WriteLine(ShoutName(1));\nConsole.WriteLine(ShoutName(2));\n";

    [Fact]
    public async Task Solution_keeps_the_rules_and_is_praised()
    {
        var diagnostics = await Analyze(Exercise.Solution, Exercise.Rules);
        Assert.Equal(["FPJ010"], diagnostics.Ids());
        Assert.Equal("Map", diagnostics[0].Covers());
        Assert.Equal(DiagnosticSeverity.Info, diagnostics[0].Severity);
    }

    [Fact]
    public async Task Starter_is_missing_Map()
    {
        var diagnostics = await Analyze(Exercise.Starter, Exercise.Rules);
        var missing = Assert.Single(diagnostics);
        Assert.Equal("FPJ002", missing.Id);
        Assert.Equal("ShoutName", missing.Covers());
        Assert.Contains("`Map` or `Select` in ShoutName", missing.GetMessage());
    }

    [Theory]
    [InlineData("Match", "FindUser(id).Match(Some: name => Some(name.ToUpper()), None: () => Option<string>.None)")]
    [InlineData("IfNone", "FindUser(id).IsSome ? Some(FindUser(id).IfNone(\"\").ToUpper()) : None")]
    [InlineData("Match", "FindUser(id).Match(name => Some(name.ToUpper()), () => None)")]
    public async Task Unwrapping_is_an_error_even_when_the_output_is_right(string member, string body)
    {
        var diagnostics = await Analyze($"{Find}Option<string> ShoutName(int id) => {body};{Print}", Exercise.Rules);
        Assert.Equal(["FPJ001", "FPJ002"], diagnostics.Ids());
        Assert.Equal(member, diagnostics.Single(d => d.Id == "FPJ001").Covers());
    }

    [Fact]
    public async Task Linq_query_syntax_counts_as_Map()
    {
        var diagnostics = await Analyze($"{Find}Option<string> ShoutName(int id) => from name in FindUser(id) select name.ToUpper();{Print}", Exercise.Rules);
        Assert.Equal(["FPJ010"], diagnostics.Ids());
    }

    [Fact]
    public async Task Rules_only_apply_in_their_function()
    {
        var code = $"{Find}Option<string> ShoutName(int id) => FindUser(id).Map(n => n.ToUpper());\n"
                   + "Console.WriteLine(ShoutName(1).IfNone(\"nobody\"));\nConsole.WriteLine(ShoutName(2));\n";
        Assert.Equal(["FPJ010"], (await Analyze(code, Exercise.Rules)).Ids());
    }
}

public class PureFunctionRules
{
    static readonly Exercise Exercise = Exercise.Named("Leave the input alone");

    static string Program(string addTax) =>
        $"var prices = new List<decimal> {{ 10m, 20m }};\n{addTax}\nvar taxed = AddTax(prices);\n"
        + "Console.WriteLine(string.Join(\", \", prices));\nConsole.WriteLine(string.Join(\", \", taxed));\n";

    [Fact]
    public async Task Solution_is_pure_and_is_praised()
    {
        var diagnostics = await Analyze(Exercise.Solution, Exercise.Rules);
        Assert.Equal(["FPJ010"], diagnostics.Ids());
        Assert.Equal("AddTax", diagnostics[0].Covers());
    }

    [Fact]
    public async Task Starter_writes_into_its_input()
    {
        var diagnostics = await Analyze(Exercise.Starter, Exercise.Rules);
        var effect = Assert.Single(diagnostics);
        Assert.Equal("FPJ003", effect.Id);
        Assert.Equal("items[i] *= 1.2m", effect.Covers());
        Assert.StartsWith("`items[i] *= 1.2m` changes `items`, which AddTax was given.", effect.GetMessage());
    }

    [Theory]
    // Right output, but each has a side effect
    [InlineData("var calls = 0;\nList<decimal> AddTax(List<decimal> items) { calls++; return items.Select(p => p * 1.2m).ToList(); }", "calls++")]
    [InlineData("var log = new List<string>();\nList<decimal> AddTax(List<decimal> items) { log.Add(\"tax\"); return items.Select(p => p * 1.2m).ToList(); }", "log.Add(\"tax\")")]
    [InlineData("List<decimal> AddTax(List<decimal> items) { var copy = items.ToList(); items.Clear(); items.AddRange(copy); return copy.Select(p => p * 1.2m).ToList(); }", "items.Clear()")]
    [InlineData("List<decimal> AddTax(List<decimal> items) { Console.Write(\"\"); return items.Select(p => p * 1.2m).ToList(); }", "Console.Write(\"\")")]
    public async Task Side_effects_are_errors(string addTax, string first)
    {
        var diagnostics = await Analyze(Program(addTax), Exercise.Rules);
        Assert.NotEmpty(diagnostics);
        Assert.All(diagnostics, d => Assert.Equal("FPJ003", d.Id));
        Assert.Equal(first, diagnostics.OrderBy(d => d.Location.SourceSpan.Start).First().Covers());
    }

    [Fact]
    public async Task Changing_its_own_new_data_is_fine()
    {
        var addTax = "List<decimal> AddTax(List<decimal> items)\n{\n    var result = new List<decimal>();\n    foreach (var price in items) result.Add(price * 1.2m);\n"
                     + "    var count = 0;\n    count++;\n    items = result;\n    return items;\n}";
        Assert.Equal(["FPJ010"], (await Analyze(Program(addTax), Exercise.Rules)).Ids());
    }
}

public class TwiceRules
{
    static readonly Exercise Exercise = Exercise.Named("Twice");

    const string Rest = "\nvar addThree = (int x) => x + 3;\nConsole.WriteLine(Twice(addThree)(10));\n";

    [Fact]
    public async Task Solution_keeps_the_rule() =>
        Assert.Empty(await Analyze(Exercise.Solution, Exercise.Rules));

    [Fact]
    public async Task Starter_hands_back_f()
    {
        var returned = Assert.Single(await Analyze(Exercise.Starter, Exercise.Rules));
        Assert.Equal("FPJ101", returned.Id);
        Assert.Equal("f", returned.Covers());
    }

    [Fact]
    public async Task Returning_f_from_a_block_body_is_caught()
    {
        var code = "Func<int, int> Twice(Func<int, int> f)\n{\n    return f;\n}" + Rest;
        Assert.Equal(["FPJ101"], (await Analyze(code, Exercise.Rules)).Ids());
    }

    [Fact]
    public async Task Calling_f_while_building_the_function_is_a_warning()
    {
        var code = "Func<int, int> Twice(Func<int, int> f)\n{\n    var once = f(0);\n    return x => f(f(x));\n}" + Rest;
        var early = Assert.Single(await Analyze(code, Exercise.Rules));
        Assert.Equal(("FPJ102", DiagnosticSeverity.Warning, "f(0)"), (early.Id, early.Severity, early.Covers()));
    }

    [Fact]
    public async Task A_lambda_stored_in_a_variable_counts_as_the_function()
    {
        var code = "Func<Func<int, int>, Func<int, int>> Twice = f => f;" + Rest;
        Assert.Equal(["FPJ101"], (await Analyze(code, Exercise.Rules)).Ids());
    }
}

public class RuleText
{
    const string Code = "Console.WriteLine(Some(1).Map(x => x + 1));";

    [Fact]
    public async Task No_rules_means_no_analysis() =>
        Assert.Empty(await Analyze(Code, " \n"));

    [Theory]
    [InlineData("frobnicate Option.Map", "isn't a rule kind")]
    [InlineData("avoid Map", "\"Map\" isn't Type.Member")]
    [InlineData("check nope in Main", "isn't a known check")]
    [InlineData("check returns-new-function", "needs the function")]
    [InlineData("require", "names nothing")]
    public async Task Rules_that_cant_be_read_are_errors(string rule, string problem)
    {
        var bad = Assert.Single(await Analyze(Code, rule));
        Assert.Equal("FPJ000", bad.Id);
        Assert.Contains(problem, bad.GetMessage());
        Assert.Equal("Console", bad.Covers());
    }

    [Fact]
    public async Task Wildcards_and_comments()
    {
        var diagnostics = await Analyze(Code, "# no mapping at all\navoid *.Map | No Map here.");
        Assert.Equal("No Map here.", Assert.Single(diagnostics).GetMessage());
    }
}
