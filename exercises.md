# Exercises

Practice for the [learning paths](learning-paths.md), run in the browser by the [C# runner](runner/README.md). Each `##` heading links the [jargon](readme.md) term the exercises belong to, and each `###` under it is one exercise:

- The paragraphs are the brief.
- The first `csharp` block is the starter code. It should compile but print the wrong thing, so the learner starts from a working program.
- The `text` block after "Expected output:" is what a correct program prints. A run passes when its output matches, ignoring trailing whitespace.
- `Hint:` items are revealed one at a time.
- `Rule:` items are checked by the [exercise analyzer](analyzers/README.md) as the learner types and when they run. A broken rule is an error, so the exercise doesn't pass even when the output matches. Rules also show as a checklist.
- The `csharp` block inside `<details>` is a model solution.

A rule reads `kind targets [in Function] | message [| praise]`. The message says what to do instead, and the optional praise is shown (as info) when the rule is kept.

| Kind | Targets | Broken when |
| --- | --- | --- |
| `avoid` | `Type.Member`, ... | any of them is used (in `Function`, if given) |
| `require` | `Type.Member`, ... | none of them is used (in `Function`, if given) |
| `pure` | function names | the function writes into its inputs or anything outside it, changes a collection it didn't create, or prints |
| `check` | the name of a check written in C# (`returns-new-function`) | whatever that check says; see `Checks.cs` |

`Type` is a simple name like `Option`, and either side can be `*`. A member counts as `Option`'s when it's declared on `Option` or called on one, so extension and trait methods count too.

The tests run every solution and check that it passes with no broken rules, and that the starter doesn't pass.

## [Pure Function](readme.md#pure-function)

### Leave the input alone

`AddTax` returns the taxed prices, but it also overwrites the caller's list, so `prices` changes behind your back. Make it pure: return a new list and leave `items` untouched.

```csharp
var prices = new List<decimal> { 10m, 20m };

List<decimal> AddTax(List<decimal> items)
{
    for (var i = 0; i < items.Count; i++) items[i] *= 1.2m;
    return items;
}

var taxed = AddTax(prices);
Console.WriteLine(string.Join(", ", prices));
Console.WriteLine(string.Join(", ", taxed));
```

Expected output:

```text
10, 20
12.0, 24.0
```

- Hint: Writing to `items[i]` is the side effect. Build the result somewhere else.
- Hint: LINQ's `Select` makes a new sequence from an old one, and `ToList` turns it into a list.
- Rule: pure AddTax | A pure function hands back new data and leaves what it was given alone. | AddTax leaves its input alone: calling it twice gives the same answer.

<details>
<summary>Solution</summary>

```csharp
var prices = new List<decimal> { 10m, 20m };

List<decimal> AddTax(List<decimal> items) =>
    items.Select(price => price * 1.2m).ToList();

var taxed = AddTax(prices);
Console.WriteLine(string.Join(", ", prices));
Console.WriteLine(string.Join(", ", taxed));
```

</details>

## [Higher-Order Functions (HOF)](readme.md#higher-order-functions-hof)

### Twice

Write `Twice`: it takes a function and returns a new function that applies it two times, so `Twice(addThree)(10)` is `addThree(addThree(10))`.

```csharp
Func<int, int> Twice(Func<int, int> f) => f;

var addThree = (int x) => x + 3;
var square = (int x) => x * x;

Console.WriteLine(Twice(addThree)(10));
Console.WriteLine(Twice(square)(3));
```

Expected output:

```text
16
81
```

- Hint: `Twice` has to return a function, so its body can be a lambda: `x => ...`.
- Hint: Inside that lambda, call `f` on the result of calling `f`.
- Rule: check returns-new-function in Twice | Return a new function, `x => ...`, that calls `f` twice.

<details>
<summary>Solution</summary>

```csharp
Func<int, int> Twice(Func<int, int> f) => x => f(f(x));

var addThree = (int x) => x + 3;
var square = (int x) => x * x;

Console.WriteLine(Twice(addThree)(10));
Console.WriteLine(Twice(square)(3));
```

</details>

## [Functor](readme.md#functor)

### Shout without unwrapping

`ShoutName` should return the user's name in capitals, or `None` when there's no such user. Don't take the name out of the `Option` with `Match` or `IfNone`: let `Map` work inside it.

```csharp
Option<string> FindUser(int id) => id == 1 ? Some("ada") : None;

Option<string> ShoutName(int id) => FindUser(id);

Console.WriteLine(ShoutName(1));
Console.WriteLine(ShoutName(2));
```

Expected output:

```text
Some(ADA)
None
```

- Hint: `Map` takes a function from `string` to something, and runs it only when there's a value.
- Hint: `name => name.ToUpper()` is the function you need.
- Rule: avoid Option.Match, Option.IfNone, Option.IfNoneUnsafe, Option.Case in ShoutName | That takes the name out of the `Option`, so you have to handle `None` yourself. Let `Map` work inside it instead.
- Rule: require Option.Map, Option.Select in ShoutName | `Map` runs your function only when there's a name. | `Map` kept the `None` case for you.

<details>
<summary>Solution</summary>

```csharp
Option<string> FindUser(int id) => id == 1 ? Some("ada") : None;

Option<string> ShoutName(int id) => FindUser(id).Map(name => name.ToUpper());

Console.WriteLine(ShoutName(1));
Console.WriteLine(ShoutName(2));
```

</details>
