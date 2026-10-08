using System.Collections;

namespace Jargon;

/// <summary>Verifies the `// => expected` result comments in readme snippets.</summary>
public static class Check
{
    public static readonly List<string> Failures = [];
    public static string Section = "";

    public static void That<T>(T actual, string expected, int line, string file = "readme.md")
    {
        var shown = Render(actual);
        if (Normalise(shown) != Normalise(expected))
            Failures.Add($"{file}:{line} [{Section}]\n    expected: {expected}\n    actual:   {shown}");
    }

    static string Normalise(string s) => string.Concat(s.Where(c => !char.IsWhiteSpace(c)));

    public static string Render(object? value) => value switch
    {
        null      => "null",
        bool b    => b ? "true" : "false",
        string s  => $"\"{s}\"",
        char c    => $"'{c}'",
        double d  => d.ToString(System.Globalization.CultureInfo.InvariantCulture),
        decimal m => m.ToString(System.Globalization.CultureInfo.InvariantCulture),
        Delegate  => "<function>",
        IEnumerable e when value.GetType().Namespace?.StartsWith("System") == true
                  => $"[{string.Join(", ", e.Cast<object?>().Select(Render))}]",
        _         => value.ToString() ?? "null"
    };
}
