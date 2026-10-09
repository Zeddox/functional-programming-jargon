using System;
using System.Collections.Generic;
using System.Linq;

namespace Jargon.Exercises.Analyzers;

/// <summary>
/// One line of an exercise's rules (the <c>- Rule:</c> items in exercises.md):
/// <code>
/// kind targets [in Function] | message [| praise]
///
/// avoid   Option.Match, Option.IfNone in ShoutName | Match takes the value out of the Option...
/// require Option.Map in ShoutName | Let Map work inside the Option. | Map kept the None case for you.
/// pure    AddTax | A pure function hands back new data and leaves its input alone.
/// check   returns-new-function in Twice | Twice should hand back a new function.
/// </code>
/// Members are <c>Type.Member</c> by simple name; either side can be <c>*</c>.
/// </summary>
public sealed class ExerciseRule
{
    public static readonly string[] Kinds = ["avoid", "require", "pure", "check"];

    public int Number { get; }
    public string Text { get; }
    public string Kind { get; }
    public IReadOnlyList<string> Targets { get; }
    public string? Scope { get; }
    public string Message { get; }
    public string? Praise { get; }
    /// <summary>Why the line couldn't be read, or null when it could.</summary>
    public string? Problem { get; }

    ExerciseRule(int number, string text, string kind, IReadOnlyList<string> targets, string? scope, string message, string? praise, string? problem)
    {
        Number = number;
        Text = text;
        Kind = kind;
        Targets = targets;
        Scope = scope;
        Message = message;
        Praise = praise;
        Problem = problem;
    }

    public static IReadOnlyList<ExerciseRule> ParseAll(string text) => text
        .Split('\n')
        .Select(line => line.Trim())
        .Where(line => line.Length > 0 && !line.StartsWith("#", StringComparison.Ordinal))
        .Select((line, i) => Parse(i + 1, line))
        .ToList();

    public static ExerciseRule Parse(int number, string line)
    {
        var parts = line.Split('|').Select(p => p.Trim()).ToArray();
        var spec = parts[0];
        var message = parts.Length > 1 ? parts[1] : "";
        var praise = parts.Length > 2 && parts[2].Length > 0 ? parts[2] : null;

        var space = spec.IndexOf(' ');
        var kind = space < 0 ? spec : spec.Substring(0, space);
        var rest = space < 0 ? "" : spec.Substring(space + 1).Trim();

        string? scope = null;
        var inAt = rest.LastIndexOf(" in ", StringComparison.Ordinal);
        if (inAt >= 0)
        {
            scope = rest.Substring(inAt + 4).Trim();
            rest = rest.Substring(0, inAt).Trim();
        }
        var targets = rest.Split(',').Select(t => t.Trim()).Where(t => t.Length > 0).ToList();

        string? problem =
            !Kinds.Contains(kind) ? $"\"{kind}\" isn't a rule kind (expected {string.Join(", ", Kinds)})"
            : targets.Count == 0 ? "it names nothing to check"
            : kind is "avoid" or "require" && targets.FirstOrDefault(t => SplitMember(t) is null) is { } bad ? $"\"{bad}\" isn't Type.Member"
            : kind == "check" && (targets.Count != 1 || !Checks.Known.ContainsKey(targets[0])) ? $"\"{rest}\" isn't a known check (expected one of {string.Join(", ", Checks.Known.Keys)})"
            : kind == "check" && scope is null ? "a check needs the function it applies to: \"in Name\""
            : null;

        return new ExerciseRule(number, line, kind, targets, scope, message, praise, problem);
    }

    /// <summary>"Option.Map" → ("Option", "Map"); the type may itself contain dots.</summary>
    public static (string Type, string Member)? SplitMember(string target)
    {
        var dot = target.LastIndexOf('.');
        return dot <= 0 || dot == target.Length - 1 ? null : (target.Substring(0, dot), target.Substring(dot + 1));
    }
}
