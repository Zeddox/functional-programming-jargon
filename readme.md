# Functional Programming Jargon

Functional programming (FP) provides many advantages, and its popularity has been increasing as a result. However, each programming paradigm comes with its own unique jargon and FP is no exception. By providing a glossary, we hope to make learning FP easier.

Examples are presented in C# using [language-ext](https://github.com/louthy/language-ext) v5 (currently pre-release, `5.0.0-beta-77`). Every snippet assumes these usings:

```
using LanguageExt;
using LanguageExt.Common;
using LanguageExt.Traits;
using static LanguageExt.Prelude;
```

All of the samples are compiled and run by [`samples/csharp`](samples/csharp), and a `// => value` comment marks a result that is checked when they run.

Where applicable, names follow language-ext's traits (`Functor`, `Monad`, `Foldable` and so on), which in turn follow Haskell's type classes.

**Interactive Graph**: [hemanth.github.io/functional-programming-jargon](https://hemanth.github.io/functional-programming-jargon)

__Translations__
* [Portuguese](https://github.com/alexmoreno/jargoes-programacao-funcional)
* [Spanish](https://github.com/idcmardelplata/functional-programming-jargon/tree/master)
* [Chinese](https://github.com/shfshanyue/fp-jargon-zh)
* [Bahasa Indonesia](https://github.com/wisn/jargon-pemrograman-fungsional)
* [Python World](https://github.com/jmesyou/functional-programming-jargon.py)
* [Scala World](https://github.com/ikhoon/functional-programming-jargon.scala)
* [Rust World](https://github.com/JasonShin/functional-programming-jargon.rs)
* [Korean](https://github.com/sphilee/functional-programming-jargon)
* [Polish](https://github.com/Deloryn/functional-programming-jargon)
* [Haskell Turkish](https://github.com/mrtkp9993/functional-programming-jargon)
* [Haskell Russian](https://github.com/epogrebnyak/functional-programming-jargon)
* [Julia World](https://github.com/Moelf/functional-programming-jargon.jl)
* [French](https://github.com/marcwrobel/functional-programming-jargon-fr)

__Table of Contents__
<!-- RM(noparent,notop) -->

* [Arity](#arity)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Closure](#closure)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Auto Currying](#auto-currying)
* [Function Composition](#function-composition)
* [Continuation](#continuation)
* [IO](#io)
* [Trampoline](#trampoline)
* [Thunk](#thunk)
* [Algebraic Effects](#algebraic-effects)
* [Pure Function](#pure-function)
* [Side effects](#side-effects)
* [Idempotence](#idempotence)
* [Point-Free Style](#point-free-style)
* [Predicate](#predicate)
* [Contracts](#contracts)
* [Category](#category)
* [Semigroupoid](#semigroupoid)
* [Value](#value)
* [Constant](#constant)
  * [Constant Function](#constant-function)
  * [Constant Functor](#constant-functor)
  * [Constant Monad](#constant-monad)
* [Functor](#functor)
* [Pointed Functor](#pointed-functor)
* [Lift](#lift)
* [Referential Transparency](#referential-transparency)
* [Equational Reasoning](#equational-reasoning)
* [Memoization](#memoization)
* [Lambda](#lambda)
* [Lambda Calculus](#lambda-calculus)
* [Functional Combinator](#functional-combinator)
* [Lazy evaluation](#lazy-evaluation)
* [Monoid](#monoid)
* [Monad](#monad)
* [Monad Comprehension](#monad-comprehension)
* [Comonad](#comonad)
* [Kleisli Composition](#kleisli-composition)
* [Free Monad](#free-monad)
* [Monad Transformer](#monad-transformer)
* [Reader Monad](#reader-monad)
* [Writer Monad](#writer-monad)
* [State Monad](#state-monad)
* [Fallible](#fallible)
* [Applicative Functor](#applicative-functor)
* [Bifunctor](#bifunctor)
* [Contravariant Functor](#contravariant-functor)
* [Profunctor](#profunctor)
* [Alternative](#alternative)
* [Morphism](#morphism)
  * [Homomorphism](#homomorphism)
  * [Endomorphism](#endomorphism)
  * [Isomorphism](#isomorphism)
  * [Catamorphism](#catamorphism)
  * [Anamorphism](#anamorphism)
  * [Hylomorphism](#hylomorphism)
  * [Paramorphism](#paramorphism)
  * [Apomorphism](#apomorphism)
* [Natural Transformation](#natural-transformation)
* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Foldable](#foldable)
* [Traversable](#traversable)
* [Lens](#lens)
* [Prism](#prism)
* [Iso](#iso)
* [Traversal](#traversal)
* [Type Signatures](#type-signatures)
* [Parametricity](#parametricity)
* [Type Class](#type-class)
* [Higher-Kinded Type](#higher-kinded-type)
* [Expression Problem](#expression-problem)
* [Algebraic data type](#algebraic-data-type)
  * [Sum type](#sum-type)
  * [Product type](#product-type)
  * [Unit type](#unit-type)
  * [Never type](#never-type)
* [Option](#option)
* [Either](#either)
* [Function](#function)
* [Partial function](#partial-function)
  * [Dealing with partial functions](#dealing-with-partial-functions)
* [Total Function](#total-function)
* [Functional Programming Libraries for .NET](#functional-programming-libraries-for-net)


<!-- /RM -->

## Arity

The number of arguments a function takes. From words like unary, binary, ternary, etc.

```csharp
Func<int, int, int> sum = (a, b) => a + b;
// The arity of sum is 2 (binary)
Func<int, int> inc = a => a + 1;
// The arity of inc is 1 (unary)
Func<int> zero = () => 0;
// The arity of zero is 0 (nullary)
```

__Further reading__

* [Arity](https://en.wikipedia.org/wiki/Arity) on Wikipedia

## Higher-Order Functions (HOF)

A function which takes a function as an argument and/or returns a function.

```csharp
IEnumerable<A> Filter<A>(Func<A, bool> predicate, IEnumerable<A> xs) =>
    xs.Where(predicate);
```

```csharp
Func<object?, bool> Is<T>() => x => x is T;
```

```csharp
Filter(Is<int>(), new object?[] { 0, "1", 2, null }); // => [0, 2]
```

## Closure

A closure is a scope which captures local variables of a function for access even after the execution has moved out of the block in which it is defined.
This allows the values in the closure to be accessed by returned functions.

```csharp
Func<int, int> AddTo(int x) => y => x + y;
var addToFive = AddTo(5);
addToFive(3); // => 8
```

In this case the `x` is retained in `addToFive`'s closure with the value `5`. `addToFive` can then be called with the `y`
to get back the sum.

__Further reading/Sources__
* [Lambda Vs Closure](http://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [Capture of outer variables and variable scope in lambda expressions](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions#capture-of-outer-variables-and-variable-scope-in-lambda-expressions) on Microsoft Learn

## Partial Application

Partially applying a function means creating a new function by pre-filling some of the arguments to the original function.

```csharp
// Helper to create partially applied functions:
// takes a function and some arguments...
Func<C, R> Partial<A, B, C, R>(Func<A, B, C, R> f, A a, B b) =>
    // ...returns a function that takes the rest of the arguments
    // and calls the original function with all of them
    c => f(a, b, c);

// Something to apply
Func<int, int, int, int> add3 = (a, b, c) => a + b + c;

// Partially applying `2` and `3` to `add3` gives a one-argument function
var fivePlus = Partial(add3, 2, 3); // (c) => 2 + 3 + c

fivePlus(4); // => 9
```

language-ext provides this as `par`:

```csharp
var add1More = par(add3, 2, 3); // (c) => 2 + 3 + c
add1More(4); // => 9
```

Partial application helps create simpler functions from more complex ones by baking in data when you have it. [Curried](#currying) functions are automatically partially applied.

## Currying

The process of converting a function that takes multiple arguments into a function that takes them one at a time.

Each time the function is called it only accepts one argument and returns a function that takes one argument until all arguments are passed.

```csharp
Func<int, int, int> sum = (a, b) => a + b;

Func<int, Func<int, int>> curriedSum = a => b => a + b;

curriedSum(40)(2); // => 42

var add2 = curriedSum(2); // (b) => 2 + b

add2(10); // => 12
```

## Auto Currying

Transforming a function that takes multiple arguments into one that if given less than its correct number of arguments returns a function that takes the rest. When the function gets the correct number of arguments it is then evaluated.

language-ext's `curry` converts a multi-argument `Func` into a chain of single-argument functions, and `uncurry` converts it back. C# can't vary the number of arguments at a call site, so the curried form is called one argument at a time:

```csharp
Func<int, int, int> add = (x, y) => x + y;

var curriedAdd = curry(add);
curriedAdd(1)(2);           // => 3
var add1 = curriedAdd(1);   // (y) => 1 + y
add1(2);                    // => 3
uncurry(curriedAdd)(1, 2);  // => 3
```

__Further reading__
* [Currying](https://fsharpforfunandprofit.com/posts/currying/) on F# for fun and profit
* [Partial application](https://fsharpforfunandprofit.com/posts/partial-application/) on F# for fun and profit
* [Currying and Partial Application](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Prelude/Currying%20and%20Partial%20Application) in language-ext

## Function Composition

The act of putting two functions together to form a third function where the output of one function is the input of the other. This is one of the most important ideas of functional programming.

```csharp
// Definition
Func<A, C> Compose<A, B, C>(Func<B, C> f, Func<A, B> g) => a => f(g(a));

// Usage
Func<double, double> floor = Math.Floor;
var floorAndToString = Compose((double x) => x.ToString(), floor);
floorAndToString(121.212121); // => "121"
```

language-ext's `compose` reads left-to-right instead: the first function runs first.

```csharp
var floorThenToString = compose(floor, (double x) => x.ToString());
floorThenToString(121.212121); // => "121"
```

## Continuation

At any given point in a program, the part of the code that's yet to be executed is known as a continuation.

```csharp
string PrintAsString(int num) => $"Given {num}";

R AddOneAndContinue<R>(int num, Func<int, R> cc)
{
    var result = num + 1;
    return cc(result);
}

AddOneAndContinue(2, PrintAsString); // => "Given 3"
```

Continuations are often seen in asynchronous programming when the program needs to wait to receive data before it can continue. The response is often passed off to the rest of the program, which is the continuation, once it's been received. In C#, `await` does this for you: the compiler turns the rest of the method into the continuation of the awaited `Task`.

```csharp
void ContinueProgramWith(string data)
{
    // Continues program with data
}

async Task ReadAndContinue(string path)
{
    try
    {
        var response = await File.ReadAllTextAsync(path);
        // Everything after the `await` is the continuation:
        ContinueProgramWith(response);
    }
    catch (IOException)
    {
        // handle error
    }
}
```

## IO

A pure data structure that encapsulates a side effect. Instead of performing the effect immediately, `IO` wraps the action in a nullary function ([thunk](#thunk)), allowing effectful operations to be transformed, chained, and composed as pure [values](#value) without actually executing them until explicitly triggered.

language-ext provides `IO<A>`:

```csharp
var count = 0;

// Pure description - nothing executes yet
var tick = IO.lift(() => ++count);
var formatted = tick.Map(n => $"tick {n}");

// Side effect executes only when calling .Run()
formatted.Run(); // => "tick 1"
formatted.Run(); // => "tick 2"
```

__Further reading__
* [The IO Container](https://blog.ploeh.dk/2020/06/08/the-io-container/) by Mark Seemann
* [IO container in a parallel C# universe](https://blog.ploeh.dk/2020/06/15/io-container-in-a-parallel-c-universe/) by Mark Seemann
* [IO](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Effects/IO) in language-ext

## Trampoline

A mechanism that enables deep or mutually recursive functions to run without exceeding the maximum call stack limit.

C# does not guarantee Tail Call Optimization (TCO), so instead of invoking themselves directly, recursive calls return a description of the next step (a thunk). The trampoline runs a loop that unwinds each step until a final value is reached.

language-ext provides `Trampoline<A>`: `Trampoline.More` wraps the next step in a thunk, `Trampoline.Pure` ends with a value, and `Run()` is the loop:

```csharp
// Plain recursion with n = 1_000_000 would overflow the stack
Trampoline<long> SumBelow(long n, long acc) =>
    n == 0
        ? Trampoline.Pure(acc)
        // returns a thunk instead of recursing directly
        : Trampoline.More(() => SumBelow(n - 1, acc + n));

SumBelow(1_000_000, 0).Run(); // => 500000500000
```

__Further reading__
* [Trampoline (computing)](https://en.wikipedia.org/wiki/Trampoline_(computing)) on Wikipedia
* [Stackless Scala With Free Monads](https://blog.higher-order.com/assets/trampolines.pdf) (the design language-ext's `Trampoline` is based on)
* [Trampoline](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/Trampoline) in language-ext

## Thunk

A nullary function (a function taking zero arguments) that wraps an expression to delay its evaluation until called. Thunks are the fundamental mechanism for implementing [lazy evaluation](#lazy-evaluation), [trampolines](#trampoline), and deferred side effects.

```csharp
// An eager calculation executes immediately:
// var data = ExpensiveCalculation();

// A thunk wraps the expression in a function, deferring execution:
Func<int> thunk = () => 42 * 2;

// The expression is only evaluated when explicitly called:
thunk(); // => 84
```

__Further reading__
* [Thunk](https://en.wikipedia.org/wiki/Thunk) on Wikipedia

## Algebraic Effects

A computational effect system that separates the invocation of an effect from its handling. Rather than coupling a function directly to its runtime environment, the function "performs" an effect operation (such as reading state, requesting configuration, or logging). An enclosing "handler" intercepts the performed effect and supplies the result, with the ability to resume or abort the computation—generalizing exceptions, async/await, and generators without requiring complex monad transformer stacks.

C# has no native algebraic effects. language-ext's `Eff<RT, A>` gets close: a program declares the effects it needs as constraints on its runtime `RT`, and whoever runs it supplies a runtime that handles them.

```csharp
// The effects a program may perform:
interface IConfig { string ApiUrl { get; } }
interface ILog { Unit Log(string message); }

record User(int Id, string Name);
```

```csharp
// Program performs effects without knowing who handles them:
Eff<RT, User> FetchUserProfile<RT>(int userId)
    where RT : IConfig, ILog =>
    from url in Eff<RT, string>.Lift(rt => rt.ApiUrl)
    from _   in Eff<RT, Unit>.Lift(rt =>
                    rt.Log($"Fetching user {userId} from {url}"))
    select new User(userId, "Alice");
```

```csharp
// A handler interprets the effects, here by collecting log lines:
record TestHandler(string ApiUrl) : IConfig, ILog
{
    public List<string> Logged { get; } = [];
    public Unit Log(string message) { Logged.Add(message); return unit; }
}

var handler = new TestHandler("https://api.test.local");

// Running the program with that handler:
var user = FetchUserProfile<TestHandler>(42).Run(handler);
// => Succ(User { Id = 42, Name = Alice })
var log = handler.Logged;
// => ["Fetching user 42 from https://api.test.local"]
```

`Eff` fixes its error type to language-ext's `Error`. Effect types such as ZIO (Scala) and Effect (TypeScript) make the error a type parameter too, giving the `<R, E, A>` shape: needs an `R`, fails with an `E`, succeeds with an `A`. The [Never type](#never-type) entry builds a small `Fx<R, E, A>` like that.

__Further reading__
* [Algebraic Effects for the Rest of Us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)
* [What is Algebraic Effects?](https://koka-lang.github.io/koka/doc/book.html#why-effects)
* [Eff](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Effects/Eff) in language-ext
* [ZIO](https://zio.dev/reference/core/zio/), the `ZIO[R, E, A]` effect type in Scala

## Pure Function

A function is pure if the return value is only determined by its input values, and does not produce side effects. The function must always return the same result when given the same input.

```csharp
string Greet(string name) => $"Hi, {name}";

Greet("Brianne"); // => "Hi, Brianne"
```

As opposed to each of the following:

```csharp
Globals.Name = "Brianne";

string GreetGlobal() => $"Hi, {Globals.Name}";

GreetGlobal(); // => "Hi, Brianne"

static class Globals { public static string Name = ""; }
```

The above example's output is based on data stored outside of the function...

```csharp
var greeting = "";

void GreetInPlace(string name) => greeting = $"Hi, {name}";

GreetInPlace("Brianne");
var result = greeting; // => "Hi, Brianne"
```

... and this one modifies state outside of the function.

## Side effects

A function or expression is said to have a side effect if apart from returning a value, it interacts with (reads from or writes to) external mutable state.

```csharp
var differentEveryTime = DateTime.Now;
```

```csharp
Console.WriteLine("IO is a side effect!");
```

## Idempotence

A function is idempotent if reapplying it to its result does not produce a different result.

```csharp
Math.Abs(Math.Abs(10)); // => 10
```

```csharp
Seq<int> Sort(Seq<int> xs) => toSeq(xs.OrderBy(x => x));

Sort(Sort(Sort(Seq(2, 1)))); // => [1, 2]
```

## Point-Free Style

Writing functions where the definition does not explicitly identify the arguments used. This style usually requires [currying](#currying) or other [Higher-Order functions](#higher-order-functions-hof). A.K.A Tacit programming.

```csharp
// Given
Func<Func<int, int>, Func<Seq<int>, Seq<int>>> map =
    f => xs => xs.Map(f);
Func<int, Func<int, int>> add = a => b => a + b;

// Then

// Not point-free - `numbers` is an explicit argument
Func<Seq<int>, Seq<int>> incrementAll = numbers => map(add(1))(numbers);

// Point-free - The list is an implicit argument
Func<Seq<int>, Seq<int>> incrementAll2 = map(add(1));

incrementAll2(Seq(1, 2, 3)); // => [2, 3, 4]
```

Point-free function definitions look just like normal assignments without a lambda (`=>`). It's worth mentioning that point-free functions are not necessarily better than their counterparts, as they can be more difficult to understand when complex.

## Predicate

A predicate is a function that returns true or false for a given value. A common use of a predicate is as the callback for filtering a collection.

```csharp
Func<int, bool> predicate = a => a > 2;

Seq(1, 2, 3, 4).Filter(predicate); // => [3, 4]
```

## Contracts

A contract specifies the obligations and guarantees of the behavior from a function or expression at runtime. This acts as a set of rules that are expected from the input and output of a function or expression, and errors are generally reported whenever a contract is violated.

In C# the type system already enforces "the input is an `int`" at compile time, so a runtime contract checks what the types can't, such as a range:

```csharp
using LanguageExt.Common;

// Define our contract: the input must be non-negative
Fin<int> Contract(int input) =>
    input >= 0
        ? input
        : Error.New("Contract violated: expected a non-negative int");

Fin<int> AddOne(int num) => Contract(num).Map(n => n + 1);

AddOne(2);  // => Succ(3)
AddOne(-1); // => Fail(Contract violated: expected a non-negative int)
```

## Category

A category in category theory is a collection of objects and morphisms between them. In programming, typically types
act as the objects and functions as morphisms.

To be a valid category, three rules must be met:

1. There must be an identity morphism that maps an object to itself.
    Where `a` is an object in some category,
    there must be a function from `a -> a`.
2. Morphisms must compose.
    Where `a`, `b`, and `c` are objects in some category,
    and `f` is a morphism from `a -> b`, and `g` is a morphism from `b -> c`;
    `g(f(x))` must be equivalent to `(g • f)(x)`.
3. Composition must be associative
    `f • (g • h)` is the same as `(f • g) • h`.

Since these rules govern composition at very abstract level, category theory is great at uncovering new ways of composing things.

As an example we can define a category Max as a record:

```csharp
new Max(2).Compose(new Max(3)).Compose(new Max(5)).Id().Id();
// => Max(5)

record Max(int A)
{
    public Max Id() => this;
    public Max Compose(Max b) => A > b.A ? this : b;
    public override string ToString() => $"Max({A})";
}
```

__Further reading__

* [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

## Semigroupoid

An algebraic structure with objects and morphisms that can be associatively composed, but does not guarantee the existence of an identity morphism for each object.

A semigroupoid satisfies the associativity property for [composition](#function-composition): `f.Compose(g).Compose(h) == f.Compose(g.Compose(h))`

Every [category](#category) is a semigroupoid, but a semigroupoid does not require an identity (`id`) morphism. Functions under composition form a natural semigroupoid. language-ext's `BackCompose` composes right-to-left, like `∘` (`g.BackCompose(f)` is `x => g(f(x))`):

```csharp
Func<string, string> toUpper = s => s.ToUpper();
Func<string, string> exclaim = s => $"{s}!";

var loudGreeting = exclaim.BackCompose(toUpper);
loudGreeting("hello"); // => "HELLO!"
```

__Further reading__
* [Semigroupoid](https://en.wikipedia.org/wiki/Semigroupoid) on Wikipedia
* [Data.Semigroupoid](https://hackage.haskell.org/package/semigroupoids/docs/Data-Semigroupoid.html) on Hackage

## Value

Anything that can be assigned to a variable.

```csharp
object[] values =
[
    5,
    new Person("John", 30), // A record with init-only properties.
    (Func<int, int>)(a => a),
    Seq(1),
    unit,                   // `Unit`: the value that carries no information.
];

record Person(string Name, int Age);
```

## Constant

A variable that cannot be reassigned once defined.

```csharp
static class Constants
{
    public const int Five = 5;
    public static readonly Person John = new("John", 30);
}

record Person(string Name, int Age);
```

Constants are [referentially transparent](#referential-transparency). That is, they can be replaced with the values that they represent without affecting the result.

With the above two constants the following expression will always return `true`.

```csharp
var same = Constants.John.Age + Constants.Five
        == new Person("John", 30).Age + 5;
// => true
```

### Constant Function

A [curried](#currying) function that ignores its second argument. language-ext calls it `constant`:

```csharp
Seq(1, 2).Map(constant<int, int>(0)); // => [0, 0]
```

### Constant Functor

Object whose `Map` doesn't transform the contents. See [Functor](#functor). language-ext has no `Const` functor type, so here is a minimal one:

```csharp
new Constant<int, int>(1).Map(n => n + 1); // => Constant(1)

// `A` is a "phantom" type: no value of it is ever stored.
record Constant<C, A>(C Value)
{
    public Constant<C, B> Map<B>(Func<A, B> f) => new(Value);
    public override string ToString() => $"Constant({Value})";
}
```

### Constant Monad

Object whose `Bind` doesn't transform the contents. See [Monad](#monad).

```csharp
new Constant<int, int>(1).Bind(n => new Constant<int, int>(n + 1));
// => Constant(1)

record Constant<C, A>(C Value)
{
    public Constant<C, B> Bind<B>(Func<A, Constant<C, B>> f) =>
        new(Value);
    public override string ToString() => $"Constant({Value})";
}
```

## Functor

An object that implements a `map` function that takes a function which is run on the contents of that object. A functor must adhere to two rules:

__Preserves identity__

```
fa.Map(x => x)
```

is equivalent to just `fa`.

__Composable__

```
fa.Map(x => g(f(x)))
```

is equivalent to

```
fa.Map(f).Map(g)
```

(`f`, `g` are arbitrary composable functions)

In language-ext, a functor is any type `F` that implements the `Functor<F>` trait, which means providing `Map` for values of type `K<F, A>` (read as "an `F` of `A`"). [Option](#option) is a functor as it satisfies the rules:

```csharp
Some(1).Map(x => x); // => Some(1)
```

and

```csharp
Func<int, int> f = x => x + 1;
Func<int, int> g = x => x * 2;

Some(1).Map(x => g(f(x))); // => Some(4)
Some(1).Map(f).Map(g);     // => Some(4)
```

Because `Functor<F>` is a trait, you can write code that works for *any* functor:

```csharp
K<F, string> Describe<F>(K<F, int> fa) where F : Functor<F> =>
    fa.Map(x => $"got {x}");

Describe(Some(1));          // => Some(got 1)
Describe(Seq(1, 2));        // => [got 1, got 2]
```

## Pointed Functor

An object with an `of` function that puts _any_ single value into it.

In language-ext every applicative functor provides `Pure` (exposed as `pure<F, A>`), which makes it a pointed functor.

```csharp
pure<Seq, int>(1);    // => [1]
pure<Option, int>(1); // => Some(1)
```

## Lift

Lifting is when you take a value and put it into an object like a [functor](#pointed-functor). If you lift a function into an [Applicative Functor](#applicative-functor) then you can make it work on values that are also in that functor.

Some implementations have a function called `lift`, or `liftA2` to make it easier to run functions on functors.

In language-ext that function is `Applicative.lift`:

```csharp
Func<int, Func<int, int>> mult = a => b => a * b;

// This function now works on any applicative, like Seq or Option
K<F, int> LiftedMult<F>(K<F, int> a, K<F, int> b)
    where F : Applicative<F> =>
    Applicative.lift(mult, a, b);

LiftedMult(Seq(1, 2), Seq(3));  // => [3, 6]
LiftedMult(Some(2), Some(3));   // => Some(6)

Applicative.lift((int a, int b) => a + b, Seq(1, 2), Seq(30, 40));
// => [31, 41, 32, 42]
```

Lifting a one-argument function and applying it does the same thing as `Map`.

```csharp
Func<int, int> increment = x => x + 1;

Applicative.lift(increment, Seq(2)); // => [3]
Seq(2).Map(increment);               // => [3]
```

Lifting simple values can be simply creating the object.

```csharp
pure<Seq, int>(1); // => [1]
```

## Referential Transparency

An expression that can be replaced with its value without changing the
behavior of the program is said to be referentially transparent.

Given the function greet:

```csharp
string Greet() => "Hello World!";

Greet(); // => "Hello World!"
```

Any invocation of `Greet()` can be replaced with `"Hello World!"` hence `Greet` is referentially transparent. This would be broken if greet depended on external state like configuration or a database call. See also [Pure Function](#pure-function) and [Equational Reasoning](#equational-reasoning).

## Equational Reasoning

When an application is composed of expressions and devoid of side effects,
truths about the system can be derived from the parts. You can also be confident
about details of your system without having to go through every function.

```csharp
Func<string, string> grainIntoChicken = grain => $"chicken({grain})";
Func<string, string> chickenIntoDogs  = chicken => $"dogs({chicken})";
Func<string, string> dogsIntoCats     = dogs => $"cats({dogs})";

// language-ext's `compose` runs left-to-right: first, then second.
var grainToDogs = compose(grainIntoChicken, chickenIntoDogs);
var grainToCats = compose(grainToDogs, dogsIntoCats);

grainToCats("grain"); // => "cats(dogs(chicken(grain)))"
```

In the example above, if you know that `chickenIntoDogs` and `grainIntoChicken`
are [pure](#pure-function) then you know that the composition is pure. This can be taken further
when more is known about the functions (associative, commutative, idempotent, etc...).

## Memoization

An optimization technique that caches the return value of a function based on its input parameters. Memoization is only valid and safe for [pure functions](#pure-function) possessing [referential transparency](#referential-transparency), because calling the function with identical arguments must always yield identical results without producing observable [side effects](#side-effects).

A hand-rolled version just keeps a dictionary of results:

```csharp
Func<A, B> Memoize<A, B>(Func<A, B> fn) where A : notnull
{
    var cache = new Dictionary<A, B>();
    return arg => cache.TryGetValue(arg, out var hit)
        ? hit
        : cache[arg] = fn(arg);
}
```

language-ext provides `memo`, which is thread-safe and holds its cache in weak references so it can be garbage collected, and `memoUnsafe`, which never evicts anything (so the count below is deterministic):

```csharp
var calls = 0;
Func<int, long> factorial = null!;
factorial = memoUnsafe((int n) =>
{
    calls++;
    return n <= 1 ? 1L : n * factorial(n - 1);
});

factorial(5); // => 120
factorial(5); // => 120
var computed = calls; // => 5
// 5, not 10: the second call was answered from the cache
```

__Further reading__
* [Memoization](https://en.wikipedia.org/wiki/Memoization) on Wikipedia

## Lambda

An anonymous function that can be treated like a value.

```csharp
// An anonymous method...
Func<int, int> f1 = delegate (int a) { return a + 1; };

// ...and the same thing as a lambda expression
Func<int, int> f2 = a => a + 1;
```

Lambdas are often passed as arguments to Higher-Order functions:

```csharp
Seq(1, 2).Map(a => a + 1); // => [2, 3]
```

You can assign a lambda to a variable. With explicit parameter types, C# infers the delegate type:

```csharp
var add1 = (int a) => a + 1;

add1(2); // => 3
```

## Lambda Calculus

A branch of mathematics that uses functions to create a [universal model of computation](https://en.wikipedia.org/wiki/Lambda_calculus).

## Functional Combinator

A higher-order function, usually curried, which returns a new function changed in some way. Functional combinators are often used in [Point-Free Style](#point-free-style) to write especially terse programs.

```csharp
// The "C" combinator takes a curried two-argument function and returns
// one which calls the original function with the arguments reversed.
Func<A, Func<B, R>> C<A, B, R>(Func<B, Func<A, R>> f) =>
    a => b => f(b)(a);

Func<double, Func<double, double>> divide = a => b => a / b;

var divideBy = C(divide);

var divBy10 = divideBy(10);

divBy10(30); // => 3
```

language-ext ships the C combinator as `flip`:

```csharp
flip(divide)(10)(30); // => 3
```

See also [Function Combinators in C#](combinators.md), a C# take on Avaq's [List of Functional Combinators in JavaScript](https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45), which includes links to more references.

## Lazy evaluation

Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

In C#, an iterator method (one that uses `yield return`) is evaluated lazily:

```csharp
IEnumerable<double> Rand()
{
    while (true) yield return Random.Shared.NextDouble();
}
```

```csharp
using var randIter = Rand().GetEnumerator();
// Each call computes a new random value, evaluated only on need.
randIter.MoveNext();
var r = randIter.Current;
```

Because nothing is computed until it is asked for, an infinite sequence is fine as long as you only consume part of it. language-ext's `Seq` is lazy too, and caches each item once it has been evaluated:

```csharp
IEnumerable<int> Naturals()
{
    for (var n = 0; ; n++) yield return n;
}

toSeq(Naturals()).Map(n => n * n).Take(4); // => [0, 1, 4, 9]
```

## Monoid

An object with a function that "combines" that object with another of the same type (semigroup) which has an "identity" value.

One simple monoid is the addition of numbers:

```csharp
var two = 1 + 1; // => 2
```

In this case `int` is the object and `+` is the function.

When any value is combined with the "identity" value the result must be the original value. The identity must also be commutative.

The identity value for addition is `0`.

```csharp
var right = 1 + 0;          // => 1
var left = 0 + 1;           // => 1
var same = 1 + 0 == 0 + 1;  // => true
```

It's also required that the grouping of operations will not affect the result (associativity):

```csharp
var assoc = 1 + (2 + 3) == (1 + 2) + 3; // => true
```

In language-ext, a type is a monoid when it implements the `Monoid<A>` trait: a `Combine` method (from `Semigroup<A>`, which also gives you the `+` operator) and a static `Empty` identity. `Seq` concatenation is a monoid:

```csharp
var xs = Seq(1, 2) + Seq(3, 4); // => [1, 2, 3, 4]
```

The identity value is the empty sequence:

```csharp
var ys = Seq(1, 2) + Monoid.empty<Seq<int>>(); // => [1, 2]
```

You can make your own monoids. Wrapping `int` lets us say *which* monoid we mean, since numbers form one under addition and another under multiplication:

```csharp
record Sum(int Value) : Monoid<Sum>
{
    public Sum Combine(Sum rhs) => new(Value + rhs.Value);
    public static Sum Empty { get; } = new(0);
}
```

Once you have a monoid, you can collapse any number of values (even none) into one:

```csharp
Monoid.combine(Seq(new Sum(1), new Sum(2), new Sum(3)));
// => Sum { Value = 6 }

Monoid.combine(Seq<Sum>()); // => Sum { Value = 0 }
```

As a counterexample, subtraction does not form a monoid because there is no commutative identity value:

```csharp
var commutes = 0 - 4 == 4 - 0; // => false
```

## Monad

A monad is an object with [`of`](#pointed-functor) and `chain` functions. `chain` is like [`map`](#functor) except it un-nests the resulting nested object.

In language-ext, `of` is `Pure` (from the `Applicative<M>` trait) and `chain` is `Bind` (from the `Monad<M>` trait). `Seq` is a monad:

```csharp
var pets = Seq("cat,dog", "fish,bird");

// Usage
pets.Bind(a => toSeq(a.Split(','))); // => [cat, dog, fish, bird]

// Contrast to map
pets.Map(a => toSeq(a.Split(','))); // => [[cat, dog], [fish, bird]]
```

C#'s LINQ query syntax is sugar for `Bind` (`SelectMany`), so it works with any language-ext monad:

```csharp
var shouted = from pet  in pets
              from name in toSeq(pet.Split(','))
              select name.ToUpper();
// => [CAT, DOG, FISH, BIRD]
```

And because `Monad<M>` is a trait, you can write code once for every monad:

```csharp
K<M, int> AddM<M>(K<M, int> mx, K<M, int> my) where M : Monad<M> =>
    mx.Bind(x => my.Map(y => x + y));

AddM(Some(1), Some(2));        // => Some(3)
AddM(Some(1), Option<int>.None); // => None
AddM(Seq(1, 2), Seq(10, 20));  // => [11, 21, 12, 22]
```

`of` is also known as `return` in other functional languages.
`chain` is also known as `flatmap` and `bind` in other languages.

## Monad Comprehension

Syntax for writing a chain of [monadic](#monad) binds as if it were a sequence of plain statements. Each step binds the value inside a monad to a name, the rest of the block runs "inside" it, and the compiler rewrites the whole thing into nested `Bind` calls. Haskell calls it do-notation, Scala a for-comprehension and F# a computation expression; in C# it is LINQ query syntax.

```csharp
Option<int> ParseInt(string s) => int.TryParse(s, out var n) ? Some(n) : None;

var sum = from x in ParseInt("3")
          from y in ParseInt("4")
          select x + y;
// => Some(7)

// The compiler turns the query above into SelectMany, which is Bind plus a projection:
var desugared = ParseInt("3").SelectMany(x => ParseInt("4"), (x, y) => x + y);
// => Some(7)

// As with Bind, one None short-circuits the rest
var failed = from x in ParseInt("3")
             from y in ParseInt("four")
             select x + y;
// => None
```

`let` names an intermediate value, and `where` filters, for types that can be empty such as `Option` and `Seq`:

```csharp
var area = from w in ParseInt("3")
           from h in ParseInt("4")
           let a = w * h
           where a > 10
           select a;
// => Some(12)
```

C# finds `Select` and `SelectMany` by name rather than through an interface, so any type with the right methods can be used in a query, as the `Fx<R, E, A>` in [Never type](#never-type) is.

__Further reading__
* [Query expression basics](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/query-expression-basics) on Microsoft Learn
* [Monads](https://blog.ploeh.dk/2022/03/28/monads/) by Mark Seemann, which covers query syntax for each monad
* [do notation](https://en.wikibooks.org/wiki/Haskell/do_notation) in the Haskell Wikibook

## Comonad

An object that has `extract` and `extend` functions.

language-ext doesn't define a comonad trait, so here is a minimal hand-rolled one:

```csharp
record CoIdentity<A>(A Value)
{
    public A Extract() => Value;

    public CoIdentity<B> Extend<B>(Func<CoIdentity<A>, B> f) =>
        new(f(this));
}
```

`Extract` takes a value out of a functor:

```csharp
new CoIdentity<int>(1).Extract(); // => 1
```

`Extend` runs a function on the comonad. The function should return the same type as the comonad:

```csharp
new CoIdentity<int>(1).Extend(co => co.Extract() + 1);
// => CoIdentity { Value = 2 }
```

## Kleisli Composition

An operation for composing two [monad](#monad)-returning functions (Kleisli Arrows) where they have compatible types. In Haskell this is the `>=>` operator.

Using [Option](#option):

```csharp
// SafeParseNum :: string -> Option<int>
// (language-ext's parseInt already returns an Option)
Option<int> SafeParseNum(string s) => parseInt(s);

// ValidatePositive :: int -> Option<int>
Option<int> ValidatePositive(int a) => a > 0 ? Some(a) : None;

// KleisliCompose :: Monad M => (B -> M C, A -> M B) -> A -> M C
Func<A, K<M, C>> KleisliCompose<M, A, B, C>(
    Func<B, K<M, C>> g, Func<A, K<M, B>> f)
    where M : Monad<M> =>
    x => f(x).Bind(g);

// ParseAndValidate :: string -> Option<int>
// (Option<A> is a struct, so we wrap the functions in lambdas to
// convert their results to K<Option, A>.)
var parseAndValidate = KleisliCompose<Option, string, int, int>(
    x => ValidatePositive(x), s => SafeParseNum(s));

parseAndValidate("1");    // => Some(1)
parseAndValidate("asdf"); // => None
parseAndValidate("-5");   // => None
parseAndValidate("999");  // => Some(999)
```

This works because:

 * [option](#option) is a [monad](#monad),
 * both `validatePositive` and `safeParseNum` return the same kind of monad (Option),
 * the type of `validatePositive`'s argument matches `safeParseNum`'s unwrapped return.

## Free Monad

A Free Monad is a construction that builds a [monad](#monad) out of any [functor](#functor) without adding any domain-specific behavior. It cleanly separates the description of a program (an Abstract Syntax Tree of commands) from its execution (an interpreter that evaluates the AST).

A Free Monad has two cases:
* `Pure`: wraps a final value and terminates computation.
* `Free` (called `Bind` in language-ext): wraps a functor containing the next step of the computation.

language-ext provides `Free<F, A>`, with the cases `Pure<F, A>` and `Bind<F, A>`. All you supply is the instruction set, as a functor:

```csharp
// The instruction set: a functor of logging commands.
// `Next` is the continuation: what to do once the command has run.
abstract record Cmd<A> : K<Cmd, A>;
record Log<A>(string Message, Func<Unit, A> Next) : Cmd<A>;

class Cmd : Functor<Cmd>
{
    public static K<Cmd, B> Map<A, B>(Func<A, B> f, K<Cmd, A> ma) =>
        ma switch
        {
            Log<A>(var msg, var next) => new Log<B>(msg, x => f(next(x))),
            _                         => throw new NotSupportedException()
        };
}
```

A program built from those instructions only *describes* what to do; nothing runs yet:

```csharp
Free<Cmd, Unit> LogMsg(string msg) =>
    Free.lift(new Log<Unit>(msg, identity));

var program = from _1 in LogMsg("Starting")
              from _2 in LogMsg("Done")
              select 42;
```

An interpreter walks the instruction tree and gives it meaning. Here it collects the log; another interpreter could write to a console, a file or a test double instead:

```csharp
(A, Seq<string>) Interpret<A>(K<Free<Cmd>, A> fa, Seq<string> log) =>
    fa switch
    {
        Pure<Cmd, A>(var value) =>
            (value, log),

        Bind<Cmd, A>(Log<Free<Cmd, A>>(var msg, var next)) =>
            Interpret(next(unit), log.Add(msg)),

        _ => throw new NotSupportedException()
    };

Interpret(program, []); // => (42, [Starting, Done])
```

__Further reading__
* [Song recommendations with C# free monads](https://blog.ploeh.dk/2025/09/01/song-recommendations-with-c-free-monads/) by Mark Seemann
* [Why free monads matter](https://www.haskellforall.com/2012/06/you-could-have-invented-free-monads.html) by Gabriella Gonzalez
* [Free](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/Free) in language-ext

## Monad Transformer

While [functors](#functor) and [applicative functors](#applicative-functor) compose naturally, [monads](#monad) do not compose generally without knowing their specific types. A Monad Transformer is a type constructor that takes an existing monad and produces a new monad with combined capabilities (such as combining error handling, asynchronous tasks, and state).

Monad transformers typically end in `T` (e.g. `MaybeT`, `ReaderT`, `StateT`). language-ext ships `OptionT`, `EitherT`, `FinT`, `TryT`, `ValidationT`, `ReaderT`, `StateT`, `WriterT` and more.

`OptionT<M, A>` wraps any monad `M` to add optionality. Wrapping the `Identity` monad (which adds no effect of its own) shows the mechanics most plainly:

```csharp
OptionT<Identity, User> FindUser(int id) =>
    id == 1
        ? OptionT.Some<Identity, User>(new User("Alice", 30))
        : OptionT.None<Identity, User>();

Option<int> GetAge(int id) =>
    FindUser(id)
        .Map(user => user.Age)
        .Run()          // unwrap the transformer: Identity<Option<int>>
        .As().Value;    // unwrap the Identity

GetAge(1); // => Some(30)
GetAge(2); // => None

record User(string Name, int Age);
```

The payoff comes with a real outer monad. Here `OptionT<IO, A>` adds "might not find a user" on top of `IO`'s side effects, and LINQ sequences both. The lookup stops early on `None`:

```csharp
var log = new List<string>();

OptionT<IO, User> FindUserIO(int id) =>
    OptionT.liftIO<IO, User>(IO.lift(() =>
    {
        log.Add($"looking up {id}");
        return id == 1 ? Some(new User("Alice", 30)) : None;
    }));

var ages = from a in FindUserIO(1)
           from b in FindUserIO(2)
           select a.Age + b.Age;

ages.Run().As().Run(); // => None
string.Join(", ", log); // => "looking up 1, looking up 2"
```

__Further reading__
* [Monad Transformers Step by Step](https://page.mi.fu-berlin.de/scravy/realworldhaskell/materialien/monad-transformers-step-by-step.pdf)

## Reader Monad

A computation that reads from a shared, read-only environment. Instead of passing configuration through every function by hand, each step asks for what it needs, and the environment is supplied once, when the whole computation is run. It is dependency injection done with a [monad](#monad).

```csharp
Reader<Config, string> Greet(string name) =>
    from greeting in Reader.asks<Config, string>(c => c.Greeting)
    select $"{greeting}, {name}";

Reader<Config, string> Shout(string name) =>
    from line   in Greet(name)
    from repeat in Reader.asks<Config, int>(c => c.Repeat)
    select string.Join(" ", Enumerable.Repeat(line + "!", repeat));

Shout("Ada").Run(new Config("Hello", 2)); // => "Hello, Ada! Hello, Ada!"

// local runs a computation in a modified environment
Reader.local<Config, string>(c => c with { Repeat = 1 }, Shout("Ada"))
      .Run(new Config("Hello", 2)); // => "Hello, Ada!"

record Config(string Greeting, int Repeat);
```

language-ext describes the ability to read an environment with the `Readable` trait, so the runtime of `Eff<RT, A>` in [Algebraic Effects](#algebraic-effects) and `ReaderT` (Reader stacked on another monad, see [Monad Transformer](#monad-transformer)) work the same way.

__Further reading__
* [The Reader monad](https://blog.ploeh.dk/2022/11/14/the-reader-monad/) by Mark Seemann
* [Reader](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/State%20and%20Environment%20Monads/Reader) in language-ext
* [Reader? Ugh, not this joke again](https://learnyouahaskell.github.io/for-a-few-monads-more.html#reader) in Learn You a Haskell

## Writer Monad

A computation that produces a value and, alongside it, accumulates output, typically a log. Each step adds to the output with `tell`, and the pieces are joined with a [monoid](#monoid), so steps never see or overwrite each other's output.

```csharp
Writer<Seq<string>, int> Double(int x) =>
    from _ in Writer.tell(Seq($"doubled {x}"))
    select x * 2;

Writer<Seq<string>, int> AddOne(int x) =>
    from _ in Writer.tell(Seq($"added one to {x}"))
    select x + 1;

var result = (from a in Double(5)
              from b in AddOne(a)
              select b).Run();

var value = result.Value;  // => 11
var log   = result.Output; // => [doubled 5, added one to 10]
```

__Further reading__
* [Writer](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/State%20and%20Environment%20Monads/Writer) in language-ext
* [Writer? I hardly know her!](https://learnyouahaskell.github.io/for-a-few-monads-more.html#writer) in Learn You a Haskell

## State Monad

A computation that threads a piece of state from one step to the next. Each step can read the current state (`get`), replace it (`put`) or update it (`modify`), and the state is passed along behind the scenes, so pure code can describe a stateful algorithm without a mutable variable.

```csharp
// Hand out sequential ids, threading the counter through
State<int, int> NextId() =>
    from id in State.get<int>()
    from _  in State.put(id + 1)
    select id;

var labels = from a in NextId()
             from b in NextId()
             from c in NextId()
             select $"#{a} #{b} #{c}";

var run  = labels.Run(100);
var text = run.Value; // => "#100 #101 #102"
var next = run.State; // => 103
```

Reader and Writer are State with restrictions: a Reader's state can only be read, and a Writer's can only be appended to.

__Further reading__
* [The State monad](https://blog.ploeh.dk/2022/06/20/the-state-monad/) by Mark Seemann
* [State](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/State%20and%20Environment%20Monads/State) in language-ext
* [Tasteful stateful computations](https://learnyouahaskell.github.io/for-a-few-monads-more.html#state) in Learn You a Haskell

## Fallible

A [type class](#type-class) for computations that can fail with an error and recover from it, so error handling can be written once for every type that supports it. It has two operations: `Fail` produces a failure, and `Catch` handles one, optionally only errors that match a predicate. Haskell calls it `MonadError`.

In language-ext it is `Fallible<E, F>`, where `E` is the error type. `Either<L, _>` fails with an `L`, `Option` with nothing at all (`Unit`), and `Fin`, `IO` and `Eff` with language-ext's `Error`; `Fallible<F>` is short for `Fallible<Error, F>`.

```csharp
// Written once, for any monad that can fail with a string
K<M, int> ParseAge<M>(string s) where M : Monad<M>, Fallible<string, M> =>
    int.TryParse(s, out var n) && n >= 0
        ? M.Pure(n)
        : M.Fail<int>($"'{s}' is not an age");

// Catch recovers; here every failure becomes a default of 0
K<M, int> AgeOrZero<M>(string s) where M : Monad<M>, Fallible<string, M> =>
    M.Catch(ParseAge<M>(s), _ => true, _ => M.Pure(0));

ParseAge<Either<string>>("42");   // => Right(42)
ParseAge<Either<string>>("old");  // => Left('old' is not an age)
AgeOrZero<Either<string>>("old"); // => Right(0)
```

The same code with `Error` as the error type runs in `Fin`, and just as well in `IO` or `Eff`:

```csharp
K<M, int> ParseAgeE<M>(string s) where M : Monad<M>, Fallible<M> =>
    int.TryParse(s, out var n) ? M.Pure(n) : M.Fail<int>(Error.New($"'{s}' is not an age"));

ParseAgeE<Fin>("42");  // => Succ(42)
ParseAgeE<Fin>("old"); // => Fail('old' is not an age)
```

Compared with exceptions, the possibility of failure is part of the type, and the code that fails doesn't decide how the failure is handled: whoever runs it picks the monad, and so picks what failing means. It is the error-handling counterpart of [Reader](#reader-monad), which abstracts over where an environment comes from.

__Further reading__
* [Fallible](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Fallible) in language-ext
* [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) by Scott Wlaschin
* [Control.Monad.Except](https://hackage.haskell.org/package/mtl/docs/Control-Monad-Except.html) (`MonadError`) on Hackage

## Applicative Functor

An applicative functor is an object with an `ap` function. `ap` applies a function in the object to a value in another object of the same type.

In language-ext this is the `Applicative<F>` trait, which provides `Pure` and `Apply`:

```csharp
// A sequence containing a function, applied to a sequence of values
Seq<Func<int, int>>(a => a + 1).Apply(Seq(1)); // => [2]
```

This is useful if you have two objects and you want to apply a binary function to their contents.

```csharp
// Sequences that you want to combine
var arg1 = Seq(1, 3);
var arg2 = Seq(4, 5);

// combining function - must be curried for this to work
Func<int, Func<int, int>> add = x => y => x + y;

// [y => 1 + y, y => 3 + y]
var partiallyAppliedAdds = Seq(add).Apply(arg1);
```

This gives you a sequence of functions that you can call `Apply` on to get the result:

```csharp
partiallyAppliedAdds.Apply(arg2); // => [5, 6, 7, 8]
```

language-ext curries for you, so a tuple of applicatives can be applied to an ordinary multi-argument function directly:

```csharp
(arg1, arg2).Apply((x, y) => x + y);      // => [5, 6, 7, 8]
(Some(1), Some(2)).Apply((x, y) => x + y); // => Some(3)
```

## Bifunctor

A structure with two independent type parameters that can map over both of them simultaneously. A Bifunctor provides `bimap`, which takes two functions and maps the first over the first type parameter and the second over the second type parameter.

In language-ext this is the `Bifunctor<F>` trait, which provides `BiMap`, `MapFirst` and `MapSecond`. `Either<L, R>` is a bifunctor: `BiMap` maps whichever side is present.

```csharp
Either<string, int> found   = Right(10);
Either<string, int> missing = Left("no score for alice");

found.BiMap(Left: e => e.ToUpper(), Right: n => n * 2);
// => Right(20)
missing.BiMap(Left: e => e.ToUpper(), Right: n => n * 2);
// => Left(NO SCORE FOR ALICE)
```

`MapFirst` and `MapSecond` map just one side:

```csharp
missing.MapFirst(e => e.Length);  // => Left(18)
found.MapSecond(n => n + 1);      // => Right(11)
```

__Further reading__
* [Bifunctors](https://blog.ploeh.dk/2018/12/24/bifunctors/) by Mark Seemann
* [Bifunctor](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Bifunctor) in language-ext
* [Data.Bifunctor](https://hackage.haskell.org/package/base/docs/Data-Bifunctor.html) on Hackage

## Contravariant Functor

A structure similar to a [functor](#functor), but whose transformation flows in the opposite direction. While a covariant functor transforms a producer `F<A>` into `F<B>` via `(a -> b)`, a contravariant functor transforms a consumer `F<A>` into `F<B>` via `(b -> a)` using `cmap` (or `contramap`).

Contravariant functors are commonly used to model predicates, validators, encoders, and sorting comparators by preprocessing inputs before feeding them to the consumer.

In language-ext the trait is `Cofunctor<F>`, and its operation is `Comap`:

```csharp
// A Validator wraps a test function A -> bool
record Validator<A>(Func<A, bool> Test) : K<Validator, A>;

class Validator : Cofunctor<Validator>
{
    // Comap :: (A -> B) -> Validator<B> -> Validator<A>
    public static K<Validator, A> Comap<A, B>(
        Func<A, B> f, K<Validator, B> fb) =>
        new Validator<A>(a => ((Validator<B>)fb).Test(f(a)));
}

record User(string Bio);
```

```csharp
// An existing validator checking if a string is long
var isLongString = new Validator<string>(s => s.Length > 5);

// Comap pre-processes a User into a string (its Bio)
var hasLongBio = (Validator<User>)isLongString.Comap((User u) => u.Bio);

hasLongBio.Test(new User("Hello World")); // => true
hasLongBio.Test(new User("Hi"));          // => false
```

__Further reading__
* [Contravariant functors](https://blog.ploeh.dk/2021/09/02/contravariant-functors/) by Mark Seemann
* [Cofunctor](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Cofunctor), language-ext's contravariant functor trait
* [Data.Functor.Contravariant](https://hackage.haskell.org/package/base/docs/Data-Functor-Contravariant.html) on Hackage

## Profunctor

A Profunctor is a [bifunctor](#bifunctor) that is **contravariant** in its first argument and **covariant** in its second argument.

Given a structure `P<A, B>` representing a computation that consumes `A` and produces `B`, `promap` takes two functions `(a' -> a)` and `(b -> b')` to yield `P<A', B'>`.

Functions `(a -> b)` are canonical profunctors: you can pre-process the input `(a' -> a)` and post-process the output `(b -> b')`. Profunctors form the mathematical foundation of profunctor optics.

language-ext has no profunctor trait, but for functions `promap` is a one-liner:

```csharp
// Promap :: (A2 -> A) -> (B -> B2) -> Func<A, B> -> Func<A2, B2>
Func<A2, B2> Promap<A, B, A2, B2>(
    Func<A, B> f, Func<A2, A> pre, Func<B, B2> post) =>
    x => post(f(pre(x)));

// An existing function: string -> int
Func<string, int> stringLength = s => s.Length;

// Pre-process input (trim whitespace), post-process output (is it even?)
var isTrimmedLengthEven = Promap(
    stringLength,
    (string raw) => raw.Trim(), // contravariant: pre-process input
    (int len) => len % 2 == 0); // covariant: post-process output

// "code" has 4 characters, "hello" has 5:
isTrimmedLengthEven("   code   "); // => true
isTrimmedLengthEven(" hello ");    // => false
```

__Further reading__
* [Profunctors](https://blog.ploeh.dk/2021/11/01/profunctors/) by Mark Seemann
* [Data.Profunctor](https://hackage.haskell.org/package/profunctors/docs/Data-Profunctor.html) on Hackage

## Alternative

An [applicative functor](#applicative-functor) that also forms a [monoid](#monoid), providing a binary choice operator `alt` (often written `<|>`) and an identity element for failure recovery and fallback logic.

When combining computations with `alt`, the structure typically represents "first success wins," falling back to subsequent alternatives if the previous computation failed or returned empty.

In language-ext the choice operator is `|` (from the `Choice` and `Alternative` traits), and the identity element for `Option` is `None`:

```csharp
// Fallback configuration chain: first valid value wins
Option<Config> primaryConfig   = None;
Option<Config> secondaryConfig = Some(new Config(8080));
Option<Config> defaultConfig   = Some(new Config(3000));

var finalConfig = primaryConfig | secondaryConfig | defaultConfig;
// => Some(Config { Port = 8080 })

record Config(int Port);
```

__Further reading__
* [Choice](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Choice) in language-ext (the "alt" operation, `|`)
* [Alternative](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Alternative) in language-ext
* [Alternative](https://hackage.haskell.org/package/base/docs/Control-Applicative.html#t:Alternative) on Hackage

## Morphism

A relationship between objects within a [category](#category). In the context of functional programming all functions are morphisms.

### Homomorphism

A function where there is a structural property that is the same in the input as well as the output.

For example, in a [Monoid](#monoid) homomorphism both the input and the output are monoids even if their types are different.

```csharp
// Concat :: Seq<string> -> string
string Concat(Seq<string> xs) => string.Concat(xs);
```

`Concat` is a homomorphism because:
* `Seq` is a monoid - has a `+` (concatenate) operation and an identity value (`[]`),
* `string` is a monoid - has a `+` (concatenate) operation and an identity value (`""`),

and `Concat` preserves both of them:

```csharp
var (xs, ys) = (Seq("functional", " "), Seq("jargon"));

var preservesAppend = Concat(xs + ys) == Concat(xs) + Concat(ys);
// => true
var preservesEmpty = Concat([]) == "";  // => true
```

In this way, a homomorphism relates to whatever property you care about in the input and output of a transformation.

[Endomorphisms](#endomorphism) and [Isomorphisms](#isomorphism) are examples of homomorphisms.

__Further Reading__
* [Homomorphism | Learning Functional Programming in Go](https://subscription.packtpub.com/book/application-development/9781787281394/11/ch11lvl1sec90/homomorphism#:~:text=A%20homomorphism%20is%20a%20correspondence,pointing%20to%20it%20from%20A.)

### Endomorphism

A function where the input type is the same as the output. Since the types are identical, endomorphisms are also [homomorphisms](#homomorphism).

```csharp
// Uppercase :: string -> string
Func<string, string> uppercase = s => s.ToUpper();

// Decrement :: int -> int
Func<int, int> decrement = x => x - 1;
```

### Isomorphism

A morphism made of a pair of transformations between 2 types of objects that is structural in nature and no data is lost.

For example, 2D coordinates could be stored as a tuple `(2, 3)` or a record `new Coords(2, 3)`.

```csharp
// Functions to convert in both directions make the two
// representations of 2D coordinates isomorphic.
Coords PairToCoords((int, int) pair) => new(pair.Item1, pair.Item2);

(int, int) CoordsToPair(Coords c) => (c.X, c.Y);

CoordsToPair(PairToCoords((1, 2)));          // => (1, 2)

PairToCoords(CoordsToPair(new Coords(1, 2))); // => Coords { X = 1, Y = 2 }

record Coords(int X, int Y);
```

Isomorphisms are an interesting example of [morphism](#morphism) because more than single function is necessary for it to be satisfied. Isomorphisms are also [homomorphisms](#homomorphism) since both input and output types share the property of being reversible.

### Catamorphism

A function which deconstructs a structure into a single value. `FoldBack` (a right fold, provided for every `Foldable`) is an example of a catamorphism.

```csharp
// Sum is a catamorphism from Seq<int> -> int
int Sum(Seq<int> xs) => xs.FoldBack(0, (acc, x) => acc + x);

Sum(Seq(1, 2, 3, 4, 5)); // => 15
```

### Anamorphism

A function that builds up a structure by repeatedly applying a function to its argument. `Unfold` is an example which generates a sequence from a function and a seed value. This is the opposite of a [catamorphism](#catamorphism). You can think of this as an anamorphism builds up a structure and catamorphism breaks it down.

```csharp
// Keeps producing values until `f` returns None
Seq<A> Unfold<A, S>(Func<S, Option<(A Value, S Next)>> f, S seed) =>
    f(seed).Match(
        Some: r => r.Value.Cons(Unfold(f, r.Next)),
        None: () => Seq<A>());
```

```csharp
Seq<int> CountDown(int n) =>
    Unfold(k => k <= 0 ? None : Some((k, k - 1)), n);

CountDown(5); // => [5, 4, 3, 2, 1]
```

### Hylomorphism

The function which composes an [anamorphism](#anamorphism) followed by a [catamorphism](#catamorphism).

```csharp
// CountDown (an anamorphism) and Sum (a catamorphism) from above:
Seq<int> CountDown(int n) => n <= 0 ? [] : n.Cons(CountDown(n - 1));
int Sum(Seq<int> xs) => xs.FoldBack(0, (acc, x) => acc + x);

int SumUpTo(int x) => Sum(CountDown(x));

SumUpTo(5); // => 15
```

### Paramorphism

A function just like `FoldBack`. However, there's a difference:

In paramorphism, your reducer's arguments are the current value, the reduction of all previous values, and the list of values that formed that reduction.

```csharp
B Para<A, B>(Func<A, Seq<A>, B, B> reducer, B acc, Seq<A> xs) =>
    xs.Head.Match(
        Some: head => reducer(head, xs.Tail, Para(reducer, acc, xs.Tail)),
        None: () => acc);

Seq<Seq<A>> Suffixes<A>(Seq<A> list) =>
    Para((A x, Seq<A> xs, Seq<Seq<A>> suffxs) => xs.Cons(suffxs),
         Seq<Seq<A>>(),
         list);

Suffixes(Seq(1, 2, 3, 4, 5));
// => [[2, 3, 4, 5], [3, 4, 5], [4, 5], [5], []]
```

The second parameter in the reducer (in the above example, `xs`) is kind of like having a history of what got you to your current acc value.

### Apomorphism

The opposite of paramorphism, just as anamorphism is the opposite of catamorphism. With paramorphism, you retain access to the accumulator and what has been accumulated, apomorphism lets you `unfold` with the potential to return early.

## Natural Transformation

A structure-preserving mapping between two [functors](#functor), transforming `F<A>` into `G<A>` without altering or inspecting the underlying value `A`.

In functional programming, a natural transformation is a function that changes the container type while preserving the contents and obeying the naturality law: `nat(fa.Map(f)) == nat(fa).Map(f)`.

```csharp
// nat :: Seq<A> -> Option<A>  (taking the head element)
Option<A> SeqToOption<A>(Seq<A> xs) => xs.Head;

Func<int, int> twice = x => x * 2;

// Naturality law: transforming after map equals mapping after transform
SeqToOption(Seq(1, 2, 3).Map(twice)); // => Some(2)
SeqToOption(Seq(1, 2, 3)).Map(twice); // => Some(2)
```

language-ext models these with the `Natural<F, G>` trait. For example, `Option` implements `Natural<Option, Seq>`, turning `None` into `[]` and `Some(x)` into `[x]`:

```csharp
K<Seq, A> OptionToSeq<A>(K<Option, A> fa) =>
    Natural.transform<Option, Seq, A>(fa);

OptionToSeq(Some(1).Map(twice)); // => [2]
OptionToSeq(Some(1)).Map(twice); // => [2]
```

__Further reading__
* [Natural transformation](https://en.wikipedia.org/wiki/Natural_transformation) on Wikipedia

## Setoid

An object that has an `equals` function which can be used to compare other objects of the same type.

In language-ext a setoid is a type with an instance of the `Eq<A>` trait. Instances already exist for the common types, and they compose: `EqArray<EqInt, int>` compares arrays of `int` element by element.

```csharp
using LanguageExt.ClassInstances;

EqArray<EqInt, int>.Equals([1, 2], [1, 2]); // => true
EqArray<EqInt, int>.Equals([1, 2], [0]);    // => false
```

You can also define your own notion of equality:

```csharp
equals<EqIgnoreCase, string>("Haskell", "HASKELL"); // => true

struct EqIgnoreCase : Eq<string>
{
    public static bool Equals(string x, string y) =>
        string.Equals(x, y, StringComparison.OrdinalIgnoreCase);

    public static int GetHashCode(string x) =>
        StringComparer.OrdinalIgnoreCase.GetHashCode(x);
}
```

## Semigroup

An object that has a `concat` function that combines it with another object of the same type.

In language-ext that function is `Combine`, from the `Semigroup<A>` trait, which also gives you the `+` operator:

```csharp
Seq(1).Combine(Seq(2)); // => [1, 2]
var both = Seq(1) + Seq(2);  // => [1, 2]
```

Code can then work with any semigroup:

```csharp
A Twice<A>(A x) where A : Semigroup<A> => x + x;

Twice(Seq(1, 2)); // => [1, 2, 1, 2]
```

## Foldable

An object that has a `reduce` function that applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

In language-ext that function is `Fold`, from the `Foldable<T>` trait:

```csharp
int Sum(Seq<int> list) => list.Fold(0, (acc, val) => acc + val);

Sum(Seq(1, 2, 3)); // => 6
```

## Traversable

A [Foldable](#foldable) and [Functor](#functor) that can turn a collection of wrapped values inside-out via `sequence` or `traverse`, transforming `F<G<A>>` into `G<F<A>>`.

This is commonly used to take a list of asynchronous operations or nullable values and pull the wrapper effect to the outside.

```csharp
// parseInt :: string -> Option<int>
// Traverse runs it on every item, then flips the result inside-out:
// Seq<Option<int>> becomes Option<Seq<int>>
Seq("1", "2", "3").Traverse(s => parseInt(s)).As(); // => Some([1, 2, 3])

// a single None makes the whole result None
Seq("1", "x", "3").Traverse(s => parseInt(s)).As(); // => None
```

__Further reading__
* [Higher Kinds in C# with language-ext: Traversables](https://paullouth.com/higher-kinds-in-csharp-part6-traversables/) by Paul Louth
* [Traversals](https://blog.ploeh.dk/2024/11/11/traversals/) by Mark Seemann
* [Traversable](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Traversable) in language-ext

## Lens

A lens is a structure (often an object or function) that pairs a getter and a non-mutating setter for some other data
structure.

```csharp
// Using language-ext's Lens<A, B>
var nameLens = Lens<Person, string>.New(
    // getter for the Name property
    Get: p => p.Name,
    // non-mutating setter for the Name property
    Set: name => p => p with { Name = name });

record Person(string Name);
```

Having the pair of get and set for a given data structure enables a few key features.

```csharp
var person = new Person("Gertrude Blanch");

// invoke the getter
nameLens.Get(person); // => "Gertrude Blanch"

// invoke the setter
nameLens.Set("Shafi Goldwasser", person);
// => Person { Name = Shafi Goldwasser }

// run a function on the value in the structure
nameLens.Update(s => s.ToUpper(), person);
// => Person { Name = GERTRUDE BLANCH }
```

Lenses are also composable. This allows easy immutable updates to deeply nested data.

```csharp
// This lens focuses on the first item in a non-empty sequence
Lens<Seq<A>, A> FirstLens<A>() => Lens<Seq<A>, A>.New(
    // get first item in the sequence
    Get: xs => xs[0],
    // non-mutating setter for first item in the sequence
    Set: x => xs => x.Cons(xs.Tail));

var people = Seq(new Person("Gertrude Blanch"),
                 new Person("Shafi Goldwasser"));

// `lens` composes left-to-right: first focus on the head, then on its name.
lens(FirstLens<Person>(), nameLens).Update(s => s.ToUpper(), people);
// => [Person { Name = GERTRUDE BLANCH }, Person { Name = Shafi Goldwasser }]
```

## Prism

An optic that focuses on a sub-case or variant of a [sum type](#sum-type). Unlike a [Lens](#lens), which always assumes the target field exists on a product structure, a Prism may fail to match because the target variant might not be present.

A Prism consists of a `preview` function (which returns an [Option](#option)) and a `review` function (which reconstructs the whole data structure from the focused part).

language-ext's `Prism<A, B>` pairs the `preview` (called `Get`) with a setter that only applies when the case matches. The `review` direction is simply the case's constructor (here, `new Circle(r)`).

```csharp
var radius = Prism<Shape, double>.New(
    Get: s => s is Circle c ? Some(c.Radius) : None,
    Set: r => s => s is Circle ? new Circle(r) : s);

radius.Get(new Circle(2)); // => Some(2)
radius.Get(new Square(3)); // => None

// Update only touches values of the focused case
radius.Update(r => r * 2, new Circle(2)); // => Circle { Radius = 4 }
radius.Update(r => r * 2, new Square(3)); // => Square { Side = 3 }

abstract record Shape;
record Circle(double Radius) : Shape;
record Square(double Side) : Shape;
```

__Further reading__
* [Prism](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Prism) in language-ext
* [Control.Lens.Prism](https://hackage.haskell.org/package/lens/docs/Control-Lens-Prism.html) on Hackage

## Iso

An optic that defines a lossless, reversible two-way mapping between two representations of the same information (`s` and `a`). An Iso consists of a `to` function (`s -> a`) and a `from` function (`a -> s`) such that `from(to(x)) == x` and `to(from(y)) == y`.

Isos form the foundation of reversible transformations like temperature conversions, coordinate systems, or encoding/decoding data structures.

language-ext has no `Iso` type, but one is just a pair of functions:

```csharp
// Conversion between Celsius and Fahrenheit
var tempIso = new Iso<double, double>(
    To:   c => c * 9 / 5 + 32,   // to Fahrenheit
    From: f => (f - 32) * 5 / 9); // from Fahrenheit

tempIso.To(100);   // => 212
tempIso.From(212); // => 100

record Iso<S, A>(Func<S, A> To, Func<A, S> From);
```

__Further reading__
* [Isomorphism](https://en.wikipedia.org/wiki/Isomorphism) on Wikipedia
* [Software design isomorphisms](https://blog.ploeh.dk/2018/01/08/software-design-isomorphisms/) by Mark Seemann
* [Control.Lens.Iso](https://hackage.haskell.org/package/lens/docs/Control-Lens-Iso.html) on Hackage

## Traversal

An optic that focuses on zero, one, or multiple values (`0..*`) inside a data structure simultaneously.

While a [Lens](#lens) focuses on exactly 1 value and a [Prism](#prism) focuses on 0 or 1 value, a Traversal generalizes optics to collections, trees, or filtered subsets.

A traversal provides:
* `getAll`: extracts all focused values into a sequence.
* `modify`: immutably transforms every focused value using a mapping function.

language-ext has no `Traversal` type, so here is a minimal one:

```csharp
// Traversal focusing only on even numbers in a sequence:
var evens = new Traversal<Seq<int>, int>(
    GetAll: xs => xs.Filter(n => n % 2 == 0),
    Modify: f => xs => xs.Map(n => n % 2 == 0 ? f(n) : n));

var numbers = Seq(1, 2, 3, 4, 5, 6);

evens.GetAll(numbers);           // => [2, 4, 6]
evens.Modify(n => n * 10)(numbers); // => [1, 20, 3, 40, 5, 60]

record Traversal<S, A>(
    Func<S, Seq<A>> GetAll,
    Func<Func<A, A>, Func<S, S>> Modify);
```

__Further reading__
* [Control.Lens.Traversal](https://hackage.haskell.org/package/lens/docs/Control-Lens-Traversal.html) on Hackage

## Type Signatures

In C# the types of arguments and return values are part of every function's signature. Even so, functional programmers often describe functions with Haskell-style type signatures in comments, because they are short and easy to read.

There's quite a bit of variance across the community, but they often follow the following patterns:

```csharp
// functionName :: firstArgType -> secondArgType -> returnType

// add :: int -> int -> int
Func<int, Func<int, int>> add = x => y => x + y;

// increment :: int -> int
Func<int, int> increment = x => x + 1;

add(1)(2);    // => 3
increment(2); // => 3
```

If a function accepts another function as an argument it is wrapped in parentheses.

```csharp
// call :: (a -> b) -> a -> b
Func<A, B> Call<A, B>(Func<A, B> f) => x => f(x);
```

The letters `a`, `b`, `c`, `d` are used to signify that the argument can be of any type; in C# they become generic type parameters. The following version of `map` takes a function that transforms a value of some type `a` into another type `b`, a sequence of values of type `a`, and returns a sequence of values of type `b`.

```csharp
// map :: (a -> b) -> [a] -> [b]
Func<Seq<A>, Seq<B>> Map<A, B>(Func<A, B> f) => list => list.Map(f);

Map<int, int>(x => x + 1)(Seq(1, 2)); // => [2, 3]
```

__Further reading__
* [Function signatures](https://fsharpforfunandprofit.com/posts/function-signatures/) on F# for fun and profit
* [Func delegate](https://learn.microsoft.com/en-us/dotnet/api/system.func-2) on Microsoft Learn
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) on Stack Overflow

## Parametricity

The property that a generic function behaves the same way for every type it is given, because it can't inspect values of a type it knows nothing about. Generic code of this kind is called parametric polymorphism: one piece of code that works for every type. The useful consequence is that a generic signature alone limits what a function can do, often enough to prove things about it without reading its body (Philip Wadler called these "theorems for free").

A function `A F<A>(A x)` has no way to make a new `A` or change the one it got, so the only thing it can return is `x`: it must be the identity function. A function `Seq<A> F<A>(Seq<A> xs)` can only drop, repeat or reorder the elements it is given. So whatever it does, applying it before or after a `Map` gives the same result:

```csharp
// Parametric: it can only pick from the elements it is given
Seq<A> FirstTwo<A>(Seq<A> xs) => xs.Take(2);

Func<int, int> tenfold = x => x * 10;
var xs = Seq(1, 2, 3);

var mapThenTake = FirstTwo(xs.Map(tenfold)); // => [10, 20]
var takeThenMap = FirstTwo(xs).Map(tenfold); // => [10, 20]
```

That equation holds for any `Seq<A> -> Seq<A>` function and any `tenfold`, without looking at either. It is what lets you trust that a generic library function treats your type the same way it treats every other.

C# only offers parametricity by convention. A generic method can test the type at run time with `is`, `typeof` or a cast, call `ToString` or `GetHashCode` (every value has them), return `default` or `null`, or use reflection, and each one breaks the guarantee:

```csharp
// Not parametric: it inspects A, so the free theorems no longer hold
A Sneaky<A>(A x) => x is int n ? (A)(object)(n + 1) : x;

Sneaky("hi"); // => "hi"
Sneaky(41);   // => 42
```

Keeping generic code free of those tricks keeps it parametric, and [type class](#type-class) constraints are the honest way to say "this function needs to know something about `A`".

__Further reading__
* [Parametricity](https://en.wikipedia.org/wiki/Parametricity) on Wikipedia
* [Theorems for free!](https://people.mpi-sws.org/~dreyer/tor/papers/wadler.pdf) by Philip Wadler

## Type Class

An interface that describes what a type can do, written separately from the type, so that generic code can require it. Haskell calls them type classes; language-ext calls them traits. Unlike an ordinary interface, a type class describes the type rather than an object: its members are static, and the compiler chooses the implementation from the type, with no virtual call at run time. This is called ad hoc polymorphism: one name with a different implementation for each type, picked at compile time (static dispatch), where an overridden method is picked at run time from the object's actual class (dynamic dispatch).

C# 11's static abstract interface members make this possible. Here a constraint on `Monoid<A>` (see [Monoid](#monoid)) lets a generic function call `A.Empty`, which belongs to the type, not to any value:

```csharp
A ConcatAll<A>(Seq<A> xs) where A : Monoid<A> =>
    xs.Aggregate(A.Empty, (acc, x) => acc + x);

ConcatAll(Seq(Seq(1, 2), Seq(3))); // => [1, 2, 3]
ConcatAll(Seq(new Max(3), new Max(9), new Max(4))); // => Max { Value = 9 }

// An instance for our own type: Max combines by keeping the larger value
record Max(int Value) : Monoid<Max>
{
    public static Max Empty => new(int.MinValue);
    public Max Combine(Max rhs) => Value >= rhs.Value ? this : rhs;
}
```

A type class can take more than one type parameter. A single-parameter class says something about one type, such as `Monoid<A>` or `Functor<F>`. A multi-parameter class describes how types relate: `Natural<F, G>` says an `F` can be turned into a `G` (a [natural transformation](#natural-transformation)), `Readable<M, Env>` says `M` can read an environment of type `Env`, and `Fallible<E, F>` says `F` can fail with an `E`.

Separately, each parameter has a kind. `Monoid<A>`'s `A` is a plain type such as `int`, but `Functor<F>`'s `F` is a type constructor such as `Option`, which is why `Functor` needs [higher-kinded types](#higher-kinded-type).

__Further reading__
* [Type class](https://en.wikipedia.org/wiki/Type_class) on Wikipedia
* [Ad hoc polymorphism](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism) on Wikipedia
* [Explore static virtual members in interfaces](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/static-virtual-interface-members) on Microsoft Learn

## Higher-Kinded Type

A type that is parameterised by a type constructor rather than by a plain type. `int` is a complete type, but `Option` is not: it needs an argument to become `Option<int>`. Kinds classify types the way types classify values:

```
int, string, Option<int>   :: *             a complete type
Option, Seq, Task          :: * -> *        needs one type argument
Either, Dictionary         :: * -> * -> *   needs two
```

A higher-kinded type abstracts over the `* -> *` part: "some container `F`, holding an `A`". That is what a [functor](#functor) needs, a single `Map` that works for every `F`. C# can't say this directly, because a type parameter can't itself take type arguments:

```
// Not valid C#
F<B> Map<F, A, B>(F<A> fa, Func<A, B> f);
```

language-ext works around it with `K<F, A>`, an interface that stands for "`F` applied to `A`". A type takes part by implementing it, with a non-generic class (often called the brand) standing in for `F`: `Option<A>` implements `K<Option, A>`, and the class `Option` implements the traits. A cast, or language-ext's `.As()`, gets the concrete type back:

```csharp
// A tiny container that takes part in higher-kinded code
record Box<A>(A Value) : K<Box, A>;

// The brand: Box with its type argument left open, implementing Functor
class Box : Functor<Box>
{
    public static K<Box, B> Map<A, B>(Func<A, B> f, K<Box, A> fa) =>
        new Box<B>(f(((Box<A>)fa).Value));
}
```

```csharp
// Written once, for any F that is a Functor
K<F, int> Double<F>(K<F, int> fa) where F : Functor<F> =>
    fa.Map(x => x * 2);

var boxed = ((Box<int>)Double(new Box<int>(21))).Value; // => 42
Double(Some(21));     // => Some(42)
Double(Seq(1, 2, 3)); // => [2, 4, 6]
```

This is what `K<F, A>` means throughout this document: [Functor](#functor), [Monad](#monad), [Foldable](#foldable) and the other traits are all written this way.

__Further reading__
* [Higher Kinds in C# with language-ext [Part 1]](https://paullouth.com/higher-kinds-in-c-with-language-ext/) by Paul Louth
* [Kind (type theory)](https://en.wikipedia.org/wiki/Kind_(type_theory)) on Wikipedia

## Expression Problem

The difficulty of designing data so that both new cases and new operations can be added without editing existing code. Each common design makes one of the two easy and the other hard.

A [sum type](#sum-type) with pattern matching is closed over its cases. Adding an operation is just another function, but adding a case means changing every existing `switch`:

```csharp
int Eval(Expr e) => e switch
{
    Num n  => n.Value,
    Plus p => Eval(p.Left) + Eval(p.Right),
    _      => throw new ArgumentOutOfRangeException(nameof(e))
};

// A new operation leaves Eval untouched...
string Show(Expr e) => e switch
{
    Num n  => n.Value.ToString(),
    Plus p => $"({Show(p.Left)} + {Show(p.Right)})",
    _      => throw new ArgumentOutOfRangeException(nameof(e))
};

var expr = new Plus(new Num(1), new Plus(new Num(2), new Num(3)));
Eval(expr); // => 6
Show(expr); // => "(1 + (2 + 3))"

// ...but a new case, such as Times, means revisiting Eval, Show and every other switch
abstract record Expr;
record Num(int Value) : Expr;
record Plus(Expr Left, Expr Right) : Expr;
```

Interfaces (and [type classes](#type-class)) are the reverse: open over cases. A new case is just a new class, but a new operation must be added to the interface and to every class that implements it:

```csharp
var tree = new PlusNode(new NumNode(1), new NumNode(2));
tree.Eval(); // => 3

interface INode { int Eval(); }
record NumNode(int Value) : INode { public int Eval() => Value; }
record PlusNode(INode Left, INode Right) : INode { public int Eval() => Left.Eval() + Right.Eval(); }
// A new case is one new class, with no other changes:
record TimesNode(INode Left, INode Right) : INode { public int Eval() => Left.Eval() * Right.Eval(); }
```

The two designs also dispatch differently: the `switch` picks a branch by testing the value's case, while `tree.Eval()` is a virtual call that runs whichever `Eval` the object's class overrides. The choice between them is about which kind of change you expect more often. Functional code tends to fix the cases and add operations; object-oriented code tends to fix the operations and add cases. Techniques such as the visitor pattern and "tagless final" (operations as type classes over [higher-kinded types](#higher-kinded-type)) try to get both.

__Further reading__
* [Expression problem](https://en.wikipedia.org/wiki/Expression_problem) on Wikipedia
* [The Expression Problem](https://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt), Philip Wadler's original 1998 email

## Algebraic data type

A composite type made from putting other types together. Two common classes of algebraic types are [sum](#sum-type) and [product](#product-type).

### Sum type

A Sum type is the combination of two types together into another one. It is called sum because the number of possible values in the result type is the sum of the input types.

C# has no built-in closed union types, but an abstract record with one derived record per case models them well:

```csharp
// Known has 2 possible values (true, false) and HalfTrue has 1,
// so WeakLogic has 2 + 1 = 3 possible values.
string Describe(WeakLogic w) => w switch
{
    Known(true)  => "true",
    Known(false) => "false",
    HalfTrue     => "half-true",
    _            => throw new ArgumentOutOfRangeException(nameof(w))
};

Describe(new HalfTrue()); // => "half-true"

abstract record WeakLogic;
record Known(bool Value) : WeakLogic;
record HalfTrue : WeakLogic;
```

Sum types are sometimes called union types, discriminated unions, or tagged unions.

language-ext's [Option](#option) and [Either](#either) are ready-made sum types.

### Product type

A **product** type combines types together in a way you're probably more familiar with:

```csharp
// Point :: (int, int) -> Point
var p = new Point(1, 2); // => Point { X = 1, Y = 2 }

record Point(int X, int Y);
```
It's called a product because the total possible values of the data structure is the product of the different values. Many languages have a tuple type which is the simplest formulation of a product type; in C# that is `(int X, int Y)`.

__Further reading__
* [Set theory](https://en.wikipedia.org/wiki/Set_theory) on Wikipedia

### Unit type

A type with exactly one value. Since there is only one, a `Unit` carries no information: it is what a function returns when it has nothing to say. It is the identity of [product types](#product-type): a pair `(A, Unit)` has exactly as many possible values as `A` alone.

C#'s `void` is not a type you can use: there is no `Func<void>` or `Option<void>`, which is why .NET needs both `Func` and `Action`, and both `Task<T>` and `Task`. language-ext's `Unit` (whose one value is `unit`) fills the gap, so a single generic type also covers "returns nothing":

```csharp
var saved = new List<string>();

// Option<Unit>: "it worked, and there's nothing more to say", or None
Option<Unit> Save(string name)
{
    if (name.Length == 0) return None;
    saved.Add(name);
    return Some(unit);
}

Save("report"); // => Some(())
Save("");       // => None
// There is only one Unit value, so all Units are equal
var same = unit == unit; // => true
```

A program that runs only for its effects returns `Unit` too, as in the `Eff<RT, Unit>` of [Algebraic Effects](#algebraic-effects).

__Further reading__
* [Unit type](https://en.wikipedia.org/wiki/Unit_type) on Wikipedia

### Never type

A type with no values at all. Nothing can produce one, so a function that returns `Never` can only throw or run forever, and code that is handed a `Never` can never actually run. It is the identity of [sum types](#sum-type): `Either<A, Never>` has exactly as many possible values as `A`, because the `Never` case can't happen.

C# has no built-in Never type, but a class that nobody can construct gets close:

```csharp
public sealed class Never
{
    private Never() { }

    // Holding a Never is impossible, so claiming it is any type you like is safe:
    // this line can never run. (Throwing rather than returning default means a
    // null smuggled in as a Never fails loudly.)
    public A Absurd<A>() => throw new System.Diagnostics.UnreachableException();
}
```

`Absurd` is named after the logic principle "from a falsehood, anything follows".

Never earns its keep in effect types such as `Fx<R, E, A>`: a program that needs an environment `R`, can fail with an `E`, and succeeds with an `A` (the same shape as ZIO in Scala and Effect in TypeScript). Putting `Never` in a slot closes it off: `Fx<R, Never, A>` cannot fail, and `Fx<R, E, Never>` cannot succeed, so it only fails or runs forever.

```csharp
public record Fx<R, E, A>(Func<R, Either<E, A>> Run)
{
    public Fx<R, E, B> Map<B>(Func<A, B> f) => new(r => Run(r).Map(f));
    public Fx<R, E2, A> MapError<E2>(Func<E, E2> f) => new(r => Run(r).MapLeft(f));
    public Fx<R, E, B> Bind<B>(Func<A, Fx<R, E, B>> f) => new(r => Run(r).Bind(a => f(a).Run(r)));

    // Select and SelectMany let LINQ query syntax work with Fx
    public Fx<R, E, B> Select<B>(Func<A, B> f) => Map(f);
    public Fx<R, E, C> SelectMany<B, C>(Func<A, Fx<R, E, B>> bind, Func<A, B, C> project) =>
        Bind(a => bind(a).Map(b => project(a, b)));
}

public static class Fx
{
    public static Fx<R, E, A> Pure<R, E, A>(A value) => new(_ => Right<E, A>(value));

    // Failing never produces a value, so Fail doesn't have to pick an A
    public static Fx<R, E, Never> Fail<R, E>(E error) => new(_ => Left<E, Never>(error));
}
```

The catch is that a `Fx<R, E, Never>` is not a `Fx<R, E, Unit>`, and the two branches of a `?:` must have the same type. `Absurd` converts one to the other, since mapping over a value that can never exist is free:

```csharp
Fx<int, string, Unit> Guard(bool ok, string error) =>
    ok ? Fx.Pure<int, string, Unit>(unit)
       : Fx.Fail<int, string>(error).Map(n => n.Absurd<Unit>());

// Reading the minimum age from the environment can't fail
Fx<int, Never, int> minAge = new(r => Right<Never, int>(r));
```

The same trick widens an error type of `Never` to whatever error the rest of a LINQ query (C#'s syntax for chaining [monads](#monad)) uses:

```csharp
Fx<int, string, int> Admit(int age) =>
    from _1    in Guard(age >= 0, "negative age")
    from limit in minAge.MapError(n => n.Absurd<string>())
    from _2    in Guard(age >= limit, $"must be at least {limit}")
    select age;

Admit(20).Run(18); // => Right(20)
Admit(16).Run(18); // => Left(must be at least 18)
Admit(-1).Run(18); // => Left(negative age)
```

The Never type is also called the bottom type or the empty type; Haskell calls it `Void`, Scala `Nothing`, and TypeScript `never`.

__Further reading__
* [Bottom type](https://en.wikipedia.org/wiki/Bottom_type) on Wikipedia
* [The algebra (and calculus!) of algebraic data types](https://codewords.recurse.com/issues/three/algebra-and-calculus-of-algebraic-data-types) by Joel Burget

## Option

Option is a [sum type](#sum-type) with two cases often called `Some` and `None`.

Option is useful for composing functions that might not return a value.

language-ext provides `Option<A>`, constructed with `Some(value)` or `None`:

```csharp
// Lookups in a dictionary might not find anything, so return an Option:
Option<V> MaybeProp<V>(string key, IReadOnlyDictionary<string, V> obj) =>
    obj.TryGetValue(key, out var value) ? Some(value) : None;
```

Use `Bind` to sequence functions that return `Option`s:

```csharp
// GetItem :: Cart -> Option<Item>
Option<Item> GetItem(Cart cart) => Optional(cart.Item);

// GetPrice :: Item -> Option<decimal>
Option<decimal> GetPrice(Item item) => Optional(item.Price);

// GetNestedPrice :: Cart -> Option<decimal>
Option<decimal> GetNestedPrice(Cart cart) => GetItem(cart).Bind(GetPrice);

GetNestedPrice(new Cart(null));                       // => None
GetNestedPrice(new Cart(new Item(null)));             // => None
GetNestedPrice(new Cart(new Item(9.99m)));            // => Some(9.99)

record Cart(Item? Item);
record Item(decimal? Price);
```

`Optional` turns a possibly-`null` value into an `Option`, so `null` never escapes into the rest of the program.

`Option` is also known as `Maybe`. `Some` is sometimes called `Just`. `None` is sometimes called `Nothing`.

## Either

A [sum type](#sum-type) with two cases, `Left` and `Right`. By convention, `Right` represents a successful computation and `Left` contains an error or failure reason ("right is right").

`Either` is useful for error handling without exceptions, allowing computations to fail gracefully while remaining [pure](#pure-function) and composable.

```csharp
using System.Text.Json;

// ParseJson :: string -> Either<string, JsonElement>
Either<string, JsonElement> ParseJson(string json)
{
    try   { return Right(JsonDocument.Parse(json).RootElement); }
    catch (JsonException e) { return Left(e.Message); }
}

string? User(JsonElement obj) => obj.GetProperty("user").GetString();

ParseJson("""{"user": "hemanth"}""").Map(User); // => Right(hemanth)
var failed = ParseJson("invalid json").Map(User).IsLeft; // => true
```

`Match` handles both cases, folding an `Either` down to a single value:

```csharp
ParseJson("invalid json").Match(
    Left:  _ => "could not parse",
    Right: obj => $"hello {User(obj)}");
// => "could not parse"
```

__Further reading__
* [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) by Scott Wlaschin
* [An Either monad](https://blog.ploeh.dk/2022/05/09/an-either-monad/) by Mark Seemann
* [Either](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Monads/Alternative%20Monads/Either) in language-ext

## Function

A **function** `f :: A => B` is an expression - often called arrow or lambda expression - with **exactly one (immutable)** parameter of type `A` and **exactly one** return value of type `B`. That value depends entirely on the argument, making functions context-independent, or [referentially transparent](#referential-transparency). What is implied here is that a function must not produce any hidden [side effects](#side-effects) - a function is always [pure](#pure-function), by definition. These properties make functions pleasant to work with: they are entirely deterministic and therefore predictable. Functions enable working with code as data, abstracting over behaviour:

```csharp
// times2 :: int -> int
Func<int, int> times2 = n => n * 2;

Seq(1, 2, 3).Map(times2); // => [2, 4, 6]
```

## Partial function

A partial function is a [function](#function) which is not defined for all arguments - it might return an unexpected result or may never terminate. Partial functions add cognitive overhead, they are harder to reason about and can lead to runtime errors. Some examples:

```csharp
// example 1: sum of the list
// sum :: [int] -> int
int Sum(int[] xs) => xs.Aggregate((a, b) => a + b);
Sum([1, 2, 3]); // => 6
// Sum([]);  InvalidOperationException: Sequence contains no elements

// example 2: get the first item in list
// first :: [A] -> A
A First<A>(A[] xs) => xs[0];
First([42]); // => 42
// First(Array.Empty<int>());  IndexOutOfRangeException

// example 3: repeat function N times
// times :: int -> (int -> ()) -> ()
void Times(int n, Action<int> f)
{
    if (n == 0) return;
    f(n);
    Times(n - 1, f);
}
Times(3, Console.WriteLine);
// 3
// 2
// 1
// Times(-1, Console.WriteLine);  StackOverflowException
```

### Dealing with partial functions

Partial functions are dangerous as they need to be treated with great caution. You might get an unexpected (wrong) result or run into runtime errors. Sometimes a partial function might not return at all. Being aware of and treating all these edge cases accordingly can become very tedious.
Fortunately a partial function can be converted to a regular (or total) one. We can provide default values or use guards to deal with inputs for which the (previously) partial function is undefined. Utilizing the [`Option`](#Option) type, we can yield either `Some(value)` or `None` where we would otherwise have behaved unexpectedly:

```csharp
// example 1: sum of the list
// we can provide a default value so it will always return a result
// sum :: [int] -> int
int Sum(Seq<int> xs) => xs.Fold(0, (a, b) => a + b);
Sum([1, 2, 3]); // => 6
Sum([]);        // => 0

// example 2: get the first item in list
// change result to Option
// first :: [A] -> Option<A>
Option<A> First<A>(Seq<A> xs) => xs.Head;
First<int>([42]); // => Some(42)
First<int>([]);   // => None
// The Option return type tells you to deal with the missing case,
// e.g. with Map, Match or IfNone, so you can't forget to check.
First<int>([]).Map(x => x + 1).IfNone(0); // => 0

// example 3: repeat function N times
// we should make the function always terminate by changing conditions:
// times :: int -> (int -> ()) -> ()
void Times(int n, Action<int> f)
{
    if (n <= 0) return;
    f(n);
    Times(n - 1, f);
}
Times(3, Console.WriteLine);
// 3
// 2
// 1
Times(-1, Console.WriteLine);
// won't execute anything
```

Making your partial functions total ones, these kinds of runtime errors can be prevented. Always returning a value will also make for code that is both easier to maintain and to reason about.

## Total Function

A function which returns a valid result for all inputs defined in its type. This is as opposed to [Partial Functions](#partial-function) which may throw an error, return an unexpected result, or fail to terminate.

## Functional Programming Libraries for .NET

* [language-ext](https://github.com/louthy/language-ext) - Functional base class library: immutable collections, `Option`, `Either`, `Fin`, `IO`, `Eff`, monad transformers, optics and a trait system for functors, applicatives and monads (used for every example in this document)
* [System.Collections.Immutable](https://learn.microsoft.com/en-us/dotnet/api/system.collections.immutable) - Immutable collections built into .NET
* [MoreLINQ](https://github.com/morelinq/MoreLINQ) - Extra LINQ operators for working with sequences
* [OneOf](https://github.com/mcintyre321/OneOf) - Discriminated unions (sum types) with exhaustive matching
* [Dunet](https://github.com/domn1995/dunet) - Source generator for discriminated unions
* [CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions) - `Result` and `Maybe` types for railway-oriented error handling
* [Optional](https://github.com/nlkl/Optional) - A robust option type
* [FluentResults](https://github.com/altmann/FluentResults) - `Result` objects instead of exceptions
* [ErrorOr](https://github.com/amantinband/error-or) - Discriminated union of a result or a list of errors
* [Pidgin](https://github.com/benjamin-hodgson/Pidgin) - Fast parser combinators
* [Sprache](https://github.com/sprache/Sprache) - Tiny monadic parser combinators built on LINQ

---

__P.S:__ This repo is successful due to the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
