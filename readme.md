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
* [First-Class Function](#first-class-function)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Closure](#closure)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Auto Currying](#auto-currying)
* [Function Composition](#function-composition)
* [Pipe](#pipe)
* [Continuation](#continuation)
* [Continuation-Passing Style](#continuation-passing-style)
* [IO](#io)
* [Recursion](#recursion)
* [Tail Call](#tail-call)
* [Trampoline](#trampoline)
* [Thunk](#thunk)
* [Algebraic Effects](#algebraic-effects)
* [Declarative Programming](#declarative-programming)
* [Pure Function](#pure-function)
* [Immutability](#immutability)
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
* [Laws](#laws)
* [Functor](#functor)
* [Endofunctor](#endofunctor)
* [Pointed Functor](#pointed-functor)
* [Lift](#lift)
* [Referential Transparency](#referential-transparency)
* [Equational Reasoning](#equational-reasoning)
* [Property-Based Testing](#property-based-testing)
* [Memoization](#memoization)
* [Lambda](#lambda)
* [Lambda Calculus](#lambda-calculus)
  * [Free and Bound Variables](#free-and-bound-variables)
  * [Alpha Conversion](#alpha-conversion)
  * [Beta Reduction](#beta-reduction)
  * [Eta Conversion](#eta-conversion)
  * [Reduction Strategy](#reduction-strategy)
  * [Church Encoding](#church-encoding)
  * [Fixed-Point Combinator](#fixed-point-combinator)
  * [Combinatory Logic](#combinatory-logic)
* [Functional Combinator](#functional-combinator)
* [Lazy evaluation](#lazy-evaluation)
* [Eager Evaluation](#eager-evaluation)
* [Generator](#generator)
* [Monoid](#monoid)
* [Group](#group)
* [Semiring](#semiring)
* [Monad](#monad)
* [Monad Comprehension](#monad-comprehension)
* [Comonad](#comonad)
* [Kleisli Composition](#kleisli-composition)
* [Kleisli Category](#kleisli-category)
* [Free Monad](#free-monad)
* [Monad Transformer](#monad-transformer)
* [Reader Monad](#reader-monad)
* [Writer Monad](#writer-monad)
* [State Monad](#state-monad)
* [Continuation Monad](#continuation-monad)
* [Fallible](#fallible)
* [Applicative Functor](#applicative-functor)
* [Monoidal Functor](#monoidal-functor)
* [Bifunctor](#bifunctor)
* [Variance](#variance)
* [Contravariant Functor](#contravariant-functor)
* [Profunctor](#profunctor)
* [Arrow](#arrow)
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
* [Functor Category](#functor-category)
* [Initial and Terminal Objects](#initial-and-terminal-objects)
* [Product and Coproduct](#product-and-coproduct)
* [Duality](#duality)
* [Monoidal Category](#monoidal-category)
* [Adjunction](#adjunction)
* [Yoneda Lemma](#yoneda-lemma)
* [Setoid](#setoid)
* [Magma](#magma)
* [Semigroup](#semigroup)
* [Foldable](#foldable)
* [Traversable](#traversable)
* [Lens](#lens)
* [Prism](#prism)
* [Iso](#iso)
* [Traversal](#traversal)
* [Zipper](#zipper)
* [Type Signatures](#type-signatures)
* [Parametricity](#parametricity)
* [Type Class](#type-class)
* [Higher-Kinded Type](#higher-kinded-type)
* [Phantom Type](#phantom-type)
* [Newtype](#newtype)
* [Smart Constructor](#smart-constructor)
* [Refinement Type](#refinement-type)
* [Dependent Type](#dependent-type)
* [Existential Type](#existential-type)
* [Rank-N Type](#rank-n-type)
* [Generalized Algebraic Data Type](#generalized-algebraic-data-type)
* [Type Inference](#type-inference)
* [Structural Typing](#structural-typing)
* [Linear Type](#linear-type)
* [Expression Problem](#expression-problem)
* [Algebraic data type](#algebraic-data-type)
  * [Sum type](#sum-type)
  * [Product type](#product-type)
  * [Unit type](#unit-type)
  * [Never type](#never-type)
* [Pattern Matching](#pattern-matching)
* [Option](#option)
* [Either](#either)
* [Expression Tree](#expression-tree)
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

## First-Class Function

A language has first-class functions when functions are [values](#value) like any other: they can be stored in variables and collections, passed as arguments and returned as results. In C# that value is a delegate, usually a `Func<...>` (or an `Action<...>` when nothing is returned), and a lambda is the usual way to write one.

```csharp
// Stored in a variable
Func<int, int> square = x => x * x;

// Stored in a collection
var ops = new Dictionary<string, Func<int, int, int>>
{
    ["+"] = (a, b) => a + b,
    ["*"] = (a, b) => a * b,
};

// Passed in, and returned
Func<int, int> Twice(Func<int, int> f) => x => f(f(x));

var twelve = ops["*"](3, 4);    // => 12
var eightyOne = Twice(square)(3); // => 81
```

A C# method is not itself a value, but naming it without calling it gives a method group, which converts to a delegate. When the method has a single overload the group even has a natural type, so `var` works; with overloads you have to say which delegate type you want.

```csharp
int Increment(int x) => x + 1;

var inc = Increment;          // a method group converted to Func<int, int>
Func<double, double> abs = Math.Abs; // Math.Abs is overloaded, so the type is needed

var three = inc(2);    // => 3
var two = abs(-2.0);   // => 2
```

Since C# 10 a lambda with typed parameters gets a natural `Func` type too (`var add = (int a, int b) => a + b;`); language-ext's `fun` helper does the same for older code.

First-class functions are what make [higher-order functions](#higher-order-functions-hof), [closures](#closure), [currying](#currying) and [function composition](#function-composition) possible.

__Further reading__
* [C# Functional Programming In-Depth (8) Higher-order Function, Currying and First Class Function](https://codingonwheels.com/posts/csharp-functional-programming-higher-order-function-currying-and-first-class-function/) on CodingOnWheels
* [First-class function](https://en.wikipedia.org/wiki/First-class_function) on Wikipedia

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

__Further reading__
* [C# Functional Programming In-Depth (8) Higher-order Function, Currying and First Class Function](https://codingonwheels.com/posts/csharp-functional-programming-higher-order-function-currying-and-first-class-function/) on CodingOnWheels

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
* [C# Functional Programming In-Depth (3) Local Function and Closure](https://codingonwheels.com/posts/csharp-functional-programming-local-function-and-closure/) on CodingOnWheels

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

__Further reading__
* [C# Functional Programming In-Depth (8) Higher-order Function, Currying and First Class Function](https://codingonwheels.com/posts/csharp-functional-programming-higher-order-function-currying-and-first-class-function/) on CodingOnWheels

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

__Further reading__
* [C# Functional Programming In-Depth (9) Function Composition and Chaining](https://codingonwheels.com/posts/csharp-functional-programming-function-composition-and-method-chaining/) on CodingOnWheels

## Pipe

Piping passes a value through a series of functions, written in the order they run. F# has an operator for it, `|>`, so `x |> f |> g` means `g(f(x))`: the data flows left to right instead of being read inside out.

```
// F#
// trim, length and isEven are the functions defined below
"  code " |> trim |> length |> isEven   // true
```

C# has no pipe operator, but language-ext defines `>>` (using C# 14 extension operators) for both forms. On two functions it is left-to-right [function composition](#function-composition). On a value wrapped with `Pure` it pipes the value through each function, and `>> lower` takes the final value back out:

```csharp
Func<string, string> trim = s => s.Trim();
Func<string, int> length = s => s.Length;
Func<int, bool> isEven = n => n % 2 == 0;

// Pipe a value through the functions, left to right
var piped = Pure("  code ") >> trim >> length >> isEven >> lower; // => true

// Compose the functions first, then call the result
var trimmedLengthIsEven = trim >> length >> isEven;
trimmedLengthIsEven(" hello "); // => false
```

Method chaining with extension methods is the everyday C# pipe, and LINQ is built on it: `xs.Where(...).Select(...)` reads in the order it runs. Any function can join a chain with a one-line extension method:

```csharp
var result = "  code ".Pipe(s => s.Trim()).Pipe(s => s.Length); // => 4

static class PipeExtensions
{
    public static B Pipe<A, B>(this A value, Func<A, B> f) => f(value);
}
```

Piping is to values what composition is to functions, and it suits [point-free style](#point-free-style): the pipeline names the steps and never the intermediate values.

__Further reading__
* [C# Functional Programming In-Depth (9) Function Composition and Chaining](https://codingonwheels.com/posts/csharp-functional-programming-function-composition-and-method-chaining/) on CodingOnWheels
* [Function associativity and composition](https://fsharpforfunandprofit.com/posts/function-composition/) on F# for fun and profit

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

__Further reading__
* [Category Theory via C# (22) Continuation Monad](https://codingonwheels.com/posts/category-theory-via-csharp-22-more-monad-continuation-monad-2017/) on CodingOnWheels

## Continuation-Passing Style

A way of writing functions in which they never return a result. Instead, each takes an extra argument, its [continuation](#continuation): a function to call with the result, which stands for "the rest of the program". Code written normally is said to be in direct style.

```csharp
// Direct style
int Factorial(int n) => n == 0 ? 1 : n * Factorial(n - 1);

// Continuation-passing style: the result goes to k
R FactorialK<R>(int n, Func<int, R> k) =>
    n == 0
        ? k(1)
        : FactorialK(n - 1, r => k(n * r)); // "when you have (n - 1)!, multiply by n, then carry on with k"

Factorial(5);                          // => 120
FactorialK(5, r => r);                 // => 120
FactorialK(5, r => $"5! is {r}");      // => "5! is 120"
```

In CPS every call is a [tail call](#tail-call), and the order of evaluation and what happens next are explicit in the code. That makes it easy to return early, to return more than once, or to stop and resume later: the idea behind `async`/`await` and generators (the C# compiler builds state machines for these, but some compilers use CPS internally). The pending work is not lost, though: it moves from the call stack into a chain of nested closures. Since C# doesn't optimise tail calls, deep CPS recursion still overflows the stack, unless it runs on a [trampoline](#trampoline).

Writing every function in CPS by hand gets unwieldy; the [Continuation Monad](#continuation-monad) hides the plumbing so CPS code can be written with LINQ.

__Further reading__
* [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style) on Wikipedia
* [Category Theory via C# (22) Continuation Monad](https://codingonwheels.com/posts/category-theory-via-csharp-22-more-monad-continuation-monad-2017/) on CodingOnWheels

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
* [Category Theory via C# (8) Advanced LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-8-more-linq-to-monads/) on CodingOnWheels

## Recursion

A function is recursive when it is defined in terms of itself. Every recursive function needs a base case, which answers directly, and a recursive case, which reduces the problem to a smaller one of the same shape and calls itself on that.

Structural recursion follows the shape of the data: a sequence is either empty (the base case) or a head followed by a tail (the recursive case).

```csharp
int Sum(Seq<int> xs) =>
    xs.IsEmpty
        ? 0                     // base case
        : xs[0] + Sum(xs.Tail); // recursive case on a smaller sequence

Sum(Seq(1, 2, 3, 4)); // => 10
```

Recursive data, such as trees, is most naturally processed with recursive functions:

```csharp
int Depth(Tree t) => t switch
{
    Leaf => 0,
    Node n => 1 + Math.Max(Depth(n.Left), Depth(n.Right)),
    _ => throw new InvalidOperationException()
};

var tree = new Node(new Node(new Leaf(), new Leaf()), new Leaf());
Depth(tree); // => 2

abstract record Tree;
record Leaf : Tree;
record Node(Tree Left, Tree Right) : Tree;
```

Functional programming prefers recursion to loops because it needs no mutable loop variables. Common recursion patterns are captured once and reused: a [fold](#foldable) (a [catamorphism](#catamorphism)) consumes a structure, and an unfold (an [anamorphism](#anamorphism)) builds one. Each recursive call uses a stack frame, so very deep recursion in C# can overflow the stack; see [Tail Call](#tail-call) and [Trampoline](#trampoline).

__Further reading__
* [Recursion (computer science)](https://en.wikipedia.org/wiki/Recursion_(computer_science)) on Wikipedia

## Tail Call

A call is in tail position when it is the very last thing a function does, so its result is returned as is. `Sum` from [Recursion](#recursion) is not tail recursive, because it still has to add `xs[0]` after the recursive call returns. Carrying the running total in an accumulator puts the recursive call in tail position:

```csharp
int Sum(Seq<int> xs, int acc) =>
    xs.IsEmpty
        ? acc
        : Sum(xs.Tail, acc + xs[0]); // nothing left to do after this call

Sum(Seq(1, 2, 3, 4), 0); // => 10
```

Since nothing in the caller's stack frame is needed after a tail call, the frame can be reused instead of a new one being pushed. That is tail-call optimisation (TCO), and it turns tail recursion into a loop that runs in constant stack space. Functional languages rely on it: the Scheme standard requires it, GHC does it for Haskell, and the F# compiler turns self-recursive tail calls into loops and marks other tail calls with the .NET `tail.` instruction.

```
// F#: compiled to a loop, so a million iterations is fine
let rec sum n acc = if n = 0 then acc else sum (n - 1) (acc + n)
```

The C# compiler makes no such promise and never emits `tail.`. The .NET JIT may still turn a tail call into a jump on some platforms in optimised (Release) builds, but you can't rely on it, so a tail-recursive C# function that recurses a million times can still throw `StackOverflowException`, which can't be caught and ends the process. In C#, deep recursion is written as a loop, or run on a [Trampoline](#trampoline).

__Further reading__
* [Tail call](https://en.wikipedia.org/wiki/Tail_call) on Wikipedia
* [OpCodes.Tailcall](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.tailcall) on Microsoft Learn
* [Tail calls in F#](https://learn.microsoft.com/en-us/archive/blogs/fsharpteam/tail-calls-in-f) on the F# team blog (archived)

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

## Declarative Programming

A style of programming that describes *what* result you want rather than *how* to compute it step by step. Its opposite is imperative programming, which spells out the steps: create a variable, loop, test, mutate. SQL, regular expressions and LINQ are declarative; a `for` loop is imperative.

Here are the squares of the even numbers, written both ways:

```csharp
var numbers = Seq(1, 2, 3, 4, 5, 6);

// Imperative: how to build the result, one mutation at a time
var squares = new List<int>();
foreach (var n in numbers)
{
    if (n % 2 == 0)
        squares.Add(n * n);
}
var imperative = squares; // => [4, 16, 36]

// Declarative: what the result is
numbers.Filter(n => n % 2 == 0).Map(n => n * n); // => [4, 16, 36]

// The same with LINQ query syntax
var evensSquared = from n in numbers where n % 2 == 0 select n * n; // => [4, 16, 36]
```

The declarative versions have no loop variable or mutable list to get wrong, and they read as a description of the answer. Declarative code is usually built from [pure functions](#pure-function) and [higher-order functions](#higher-order-functions-hof), which is why functional programming leans so heavily on it. It also leaves the "how" to the library: the same LINQ query can run in memory, or be turned into SQL by Entity Framework.

__Further reading__
* [Declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) on Wikipedia
* [C# Functional Programming In-Depth (1) Fundamentals](https://codingonwheels.com/posts/csharp-functional-programming-fundamentals/) on CodingOnWheels

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

__Further reading__
* [C# Functional Programming In-Depth (13) Pure Function](https://codingonwheels.com/posts/csharp-functional-programming-pure-function/) on CodingOnWheels

## Immutability

A value is immutable when it can't change after it has been created. To "change" it, you make a new value with the difference, and the old one stays as it was. Code that holds a reference to it can rely on that, so immutable values can be shared freely, between methods or threads, without defensive copies. Immutability is what makes [referential transparency](#referential-transparency) possible: a function can't have the [side effect](#side-effects) of modifying a value nobody can modify.

In C#, records with positional or `init` properties are immutable from the outside, and `with` makes a modified copy:

```csharp
var ada = new Person("Ada", 36);
var older = ada with { Age = 37 };

// ada.Age = 37;  // compile error: Age is init-only
var before = ada;  // => Person { Name = Ada, Age = 36 }
var after = older; // => Person { Name = Ada, Age = 37 }

record Person(string Name, int Age);
```

That immutability is shallow. A record only stops you replacing its properties; if a property holds a mutable object, such as a `List<T>`, that object can still change, and `with` copies the reference, not the list:

```csharp
var core = new Team("Core", new List<string> { "Ada" });
var platform = core with { Name = "Platform" };

core.Members.Add("Grace");
var members = platform.Members; // => ["Ada", "Grace"]

record Team(string Name, List<string> Members);
```

A value is deeply immutable only when everything it holds is immutable too. language-ext provides immutable collections for that: `Seq`, `Lst`, `Map` (sorted), `HashMap`, `Set`, `HashSet` and others. Every "change" returns a new collection and leaves the original alone, and the new one shares most of its structure with the old, so it isn't a full copy:

```csharp
var xs = Seq(1, 2, 3);
var ys = xs.Add(4);
var unchanged = xs; // => [1, 2, 3]
var extended = ys;  // => [1, 2, 3, 4]

var stock = Map(("apples", 3), ("pears", 5));
var sold = stock.SetItem("apples", 2);
var stillThree = stock.Find("apples"); // => Some(3)
var nowTwo = sold.Find("apples");      // => Some(2)
```

A record built from these (`record Squad(string Name, Seq<string> Members)`) is immutable all the way down.

__Further reading__
* [C# Functional Programming In-Depth (12) Immutability, Anonymous Type, and Tuple](https://codingonwheels.com/posts/csharp-functional-programming-immutability-anonymous-type-and-tuple/) on CodingOnWheels
* [Immutable Collections](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Immutable%20Collections) in language-ext
* [Immutable object](https://en.wikipedia.org/wiki/Immutable_object) on Wikipedia

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
* [Category Theory via C# (1) Fundamentals](https://codingonwheels.com/posts/category-theory-via-csharp-1-fundamentals/) on CodingOnWheels

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

## Laws

The equations that every instance of a [type class](#type-class) must satisfy, so that generic code written against the type class can rely on them. A [functor](#functor) must map the identity function to itself and preserve composition; a [monad](#monad) must treat `Pure` as an identity for `Bind` and bind associatively; a [monoid](#monoid) must have an identity element and an associative `Combine`. The type class interface only fixes the signatures: the C# compiler checks that `Map` or `Combine` exists and has the right type, never that it obeys the laws.

Checking a few of them for language-ext's `Option` and `Seq` with concrete values:

```csharp
Func<int, Option<int>> half = x => x % 2 == 0 ? Some(x / 2) : None;
Func<int, Option<int>> dec  = x => x > 0 ? Some(x - 1) : None;
Func<int, int> inc = x => x + 1;
Func<int, int> dbl = x => x * 2;
var m = Some(8);

// Functor: identity and composition
var fId   = m.Map(x => x) == m;                         // => true
var fComp = m.Map(x => dbl(inc(x))) == m.Map(inc).Map(dbl); // => true

// Monad: left identity, right identity and associativity
var leftId  = Some(8).Bind(half) == half(8);            // => true
var rightId = m.Bind(x => Some(x)) == m;                // => true
var assoc   = m.Bind(half).Bind(dec) == m.Bind(x => half(x).Bind(dec)); // => true

// Monoid: Seq with concatenation and the empty Seq
var xs = Seq(1, 2);
var mId    = xs + Seq<int>() == xs && Seq<int>() + xs == xs; // => true
var mAssoc = (xs + Seq(3)) + Seq(4) == xs + (Seq(3) + Seq(4)); // => true
```

Nothing stops you writing an instance that breaks a law, and code that relies on it then quietly gives wrong answers. This "max" monoid picks `0` as its identity, which is only an identity for non-negative numbers:

```csharp
var lawful = new BadMax(-5).Combine(BadMax.Empty) == new BadMax(-5); // => false

// So folding a list of negative numbers invents a maximum that isn't in the list
Monoid.combine(Seq(new BadMax(-5), new BadMax(-3))); // => BadMax { Value = 0 }

record BadMax(int Value) : Monoid<BadMax>
{
    public static BadMax Empty => new(0); // should be int.MinValue
    public BadMax Combine(BadMax rhs) => Value >= rhs.Value ? this : rhs;
}
```

Laws are what make [equational reasoning](#equational-reasoning) work: knowing `m.Map(f).Map(g)` equals `m.Map(x => g(f(x)))` lets a library, or you, fuse the two passes into one. A handful of hand-picked values like the ones above can only show a law holding for those values; [Property-Based Testing](#property-based-testing) checks each law against hundreds of generated inputs and is the usual way to test an instance.

__Further reading__
* [Typeclassopedia](https://wiki.haskell.org/Typeclassopedia) on the Haskell Wiki, which lists the laws for each type class
* [Monad laws](https://blog.ploeh.dk/2022/04/11/monad-laws/) by Mark Seemann
* [Functors](https://blog.ploeh.dk/2018/03/22/functors/) by Mark Seemann, with the functor laws in C#

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

__Further reading__
* [Category Theory via C# (3) Functor and LINQ to Functors](https://codingonwheels.com/posts/category-theory-via-csharp-3-functor-and-linq-to-functors/) on CodingOnWheels

## Endofunctor

A [functor](#functor) that maps a [category](#category) back into the same category. "Endo" means "within", as in [endomorphism](#endomorphism). In programming, the category is usually "C# types and the functions between them", and a functor such as `Option` sends every type `A` to another C# type `Option<A>` and every function `A -> B` to a function `Option<A> -> Option<B>` (that is what `Map` does). Both ends are still C# types and functions, so it never leaves the category: every language-ext `Functor` (`Option`, `Seq`, `Either<L>`, ...) is an endofunctor.

```csharp
// One generic function, any endofunctor on C# types
K<F, string> Label<F>(K<F, int> fa) where F : Functor<F> =>
    fa.Map(n => $"#{n}");

Label(Some(7));                  // => Some(#7)
Label(Seq(1, 2));                // => [#1, #2]
Label(Right<string, int>(3));    // => Right(#3)
```

This is where the famous line "a monad is just a monoid in the category of endofunctors" comes from. A [monoid](#monoid) is a way to combine two things into one (associatively) plus an empty element. For a [monad](#monad) `M`, the "things" are layers of `M`:

* combining is `Flatten` (Haskell's `join`), which squashes `M<M<A>>` into `M<A>`;
* the empty element is `Pure`, which adds a layer that changes nothing.

The monoid laws become the monad laws: flattening three layers gives the same result whichever pair you squash first, and a `Pure` layer on the inside or outside disappears when flattened.

```csharp
var three = Some(Some(Some(3)));

// Associativity: outer pair first, or inner pair first
var outerFirst = three.Flatten().Flatten();              // => Some(3)
var innerFirst = three.Map(o => o.Flatten()).Flatten();  // => Some(3)

// Identity: an extra Pure layer, outside or inside, flattens away
var x = Some(5);
var pureOutside = Some(x).Flatten();                     // => Some(5)
var pureInside  = x.Map(a => Some(a)).Flatten();         // => Some(5)
```

So the joke is accurate, just compressed: a monad is an endofunctor with a `Flatten` and a `Pure` that obey the monoid laws.

__Further reading__
* [Category Theory via C# (3) Functor and LINQ to Functors](https://codingonwheels.com/posts/category-theory-via-csharp-3-functor-and-linq-to-functors/) on CodingOnWheels
* [Monads: Programmer's Definition](https://bartoszmilewski.com/2016/11/21/monads-programmers-definition/) by Bartosz Milewski

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

## Property-Based Testing

Testing that a property holds for many generated inputs, instead of checking a handful of examples by hand. You state something that should be true for every input ("reversing a list twice gives back the list"), and a library generates hundreds of random inputs to try to prove you wrong. When one fails, the library shrinks it: it searches for smaller inputs that still fail, and reports the smallest one it finds, which is usually much easier to debug than the random input that first failed. The idea comes from Haskell's QuickCheck; in .NET, the main libraries are CsCheck and FsCheck.

It suits [pure functions](#pure-function) best, since their result depends only on their input, and the properties are often the [laws](#laws) a type should obey. With CsCheck, a generator such as `Gen.Int.Array` produces values, and `Sample` runs the property on them. In a real test you just call `Sample`, and a failure throws an exception that fails the test; here a small helper catches it so the outcome can be shown:

```csharp
using CsCheck;

string Outcome(Action test)
{
    try { test(); return "passed"; }
    catch (CsCheckException e) { return "failed on " + e.Message.Split('\n').Last().Trim(); }
}

// Reversing twice is the identity
var reverse = Outcome(() => Gen.Int.Array
    .Sample(xs => xs.Reverse().Reverse().SequenceEqual(xs))); // => "passed"

// The Monoid laws for string concatenation: associative, with "" as identity
var associative = Outcome(() => Gen.Select(Gen.String, Gen.String, Gen.String)
    .Sample((a, b, c) => a + (b + c) == (a + b) + c)); // => "passed"
var identity = Outcome(() => Gen.String
    .Sample(s => "" + s == s && s + "" == s)); // => "passed"
```

A property that doesn't hold is more interesting. This `Dedupe` has a bug: it only removes duplicates that sit next to each other. Lists of 0s and 1s are enough to expose it, and the extra iterations give shrinking room to work. The first failing list CsCheck generates can be long, but shrinking cuts it down to the smallest list that shows the bug:

```csharp
// Bug: only removes adjacent duplicates
int[] Dedupe(int[] xs) => xs.Where((x, i) => i == 0 || xs[i - 1] != x).ToArray();

var noDuplicates = Outcome(() => Gen.Int[0, 1].Array
    .Sample(xs => Dedupe(xs).Distinct().Count() == Dedupe(xs).Length, iter: 100_000));
// noDuplicates typically shrinks to "failed on [0, 1, 0]", but shrinking is randomised, so check just the outcome:
var failed = noDuplicates.StartsWith("failed on"); // => true
```

Finding good properties is the skill. Common ones are round trips (`Parse(Print(x)) == x`), [algebraic laws](#laws) such as those of a [Monoid](#monoid), invariants (a sorted list is ordered and has the same elements), and comparing a fast implementation with a slow, obviously correct one. They are the run-time counterpart of [equational reasoning](#equational-reasoning): instead of proving an equation, you look hard for a counterexample.

__Further reading__
* [CsCheck](https://github.com/AnthonyLloyd/CsCheck) on GitHub
* [QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf) by Koen Claessen and John Hughes
* [The "Property Based Testing" series](https://fsharpforfunandprofit.com/posts/property-based-testing/) by Scott Wlaschin

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

A branch of mathematics that uses functions to create a [universal model of computation](https://en.wikipedia.org/wiki/Lambda_calculus). Alonzo Church introduced it in the 1930s, and it is the theory underneath every functional language (and underneath C#'s [lambdas](#lambda), which are named after it). The whole language has only three kinds of term:

```
x          a variable
λx. M      an abstraction: a function with parameter x and body M
M N        an application: call the function M with the argument N
```

There are no numbers, booleans, `if` or loops, and no names for functions: everything is a function. Every function takes exactly one argument, so a function of two arguments is a function that returns a function ([currying](#currying)). By convention application groups to the left (`f a b` means `(f a) b`), the body of an abstraction extends as far right as it can, and `λx y. M` is shorthand for `λx. λy. M`.

In C#, an abstraction is a lambda and an application is a call:

```csharp
// λx. x
Func<int, int> identity = x => x;

// λx. λy. x  (two arguments, curried)
Func<int, Func<int, int>> first = x => y => x;

// (λx. λy. x) 1 2
var result = first(1)(2); // => 1
```

Despite having almost nothing in it, the lambda calculus can express any computation a Turing machine can: data can be encoded as functions ([Church encoding](#church-encoding)) and recursion can be built from self-application ([fixed-point combinator](#fixed-point-combinator)). Computing is done by one rule, [beta reduction](#beta-reduction), which replaces a call with the function's body. The subsections below cover the vocabulary. The version here is untyped; typed lambda calculi, which add a type to every variable, are the basis of type systems like Haskell's and, more loosely, C#'s.

__Further reading__
* [Lambda Calculus via C# (1) Fundamentals](https://codingonwheels.com/posts/lambda-calculus-via-csharp-1-fundamentals/) on CodingOnWheels
* [Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) on Wikipedia

### Free and Bound Variables

A variable is bound in a term if it is the parameter of an enclosing abstraction, and free otherwise. In `λx. x y`, `x` is bound by the `λx` and `y` is free: the term alone doesn't say what `y` is. A term with no free variables is called closed, and a closed term is also called a combinator (see [Functional Combinator](#functional-combinator)).

```
λx. x y          x is bound, y is free
λx. λy. x y      closed: both are bound
(λx. x) x        the first x is bound, the last one is free (a different x)
```

In C#, a lambda's parameters are its bound variables, and any other variable it mentions is free. The compiler resolves a free variable to one from the surrounding scope and captures it, which is what a [closure](#closure) is:

```csharp
var y = 10;

// x is bound (a parameter); y is free (captured from the enclosing scope)
Func<int, int> addY = x => x + y;

var result = addY(1); // => 11
```

Which variables are free matters for [alpha conversion](#alpha-conversion) and [beta reduction](#beta-reduction): renaming or substituting must never turn a free variable into a bound one.

__Further reading__
* [Free variables and bound variables](https://en.wikipedia.org/wiki/Free_variables_and_bound_variables) on Wikipedia

### Alpha Conversion

Renaming a bound variable, everywhere it is bound, doesn't change what a function means. `λx. x` and `λy. y` are both the identity function, and are called alpha-equivalent. The one rule is that the new name must not already be free in the body, or it would be captured:

```
λx. x y    ≡    λz. z y      fine
λx. x y    ≢    λy. y y      wrong: the free y has been captured
```

Alpha conversion is mostly used to make [beta reduction](#beta-reduction) safe. Reducing `(λx. λy. x) y` naively gives `λy. y`, the identity, when it should be a function that ignores its argument and returns the outer `y`. Renaming the inner `y` first avoids the clash:

```
(λx. λy. x) y
= (λx. λz. x) y      alpha: rename the bound y to z
→ λz. y              beta: a constant function returning the free y
```

In C# the same is true of lambda parameters: their names are private to the lambda, so renaming them consistently can't change the result.

```csharp
Func<int, int> f = x => x * 2;
Func<int, int> g = n => n * 2;

var same = f(21) == g(21); // => true
```

__Further reading__
* [α-conversion](https://en.wikipedia.org/wiki/Lambda_calculus_definition#%CE%B1-conversion) on Wikipedia

### Beta Reduction

The one computation rule of the lambda calculus: applying a function to an argument is done by substituting the argument for the parameter in the function's body. `(λx. M) N` reduces to `M` with every free `x` replaced by `N`, written `M[x := N]`. A term with nothing left to reduce is in normal form.

```
(λx. λy. x) a b
→ (λy. a) b          substitute a for x
→ a                  substitute b for y (y doesn't appear)
```

Not every term has a normal form. `Ω = (λx. x x) (λx. x x)` reduces to itself forever.

```
(λx. x x) (λx. x x)
→ (λx. x x) (λx. x x)
→ ...
```

Calling a [pure](#pure-function) C# function is beta reduction: you can replace the call with the function's body, the argument substituted in, without changing the result. That is what makes [equational reasoning](#equational-reasoning) and [referential transparency](#referential-transparency) work.

```csharp
Func<int, int> square = x => x * x;

var called = square(3 + 1);           // => 16
var substituted = (3 + 1) * (3 + 1);  // => 16
```

__Further reading__
* [β-reduction](https://en.wikipedia.org/wiki/Lambda_calculus_definition#%CE%B2-reduction) on Wikipedia

### Eta Conversion

A function that only passes its argument on to another function is the same as that other function: `λx. f x` is equivalent to `f`, provided `x` isn't free in `f`. Removing the wrapper is eta reduction; adding one is eta expansion.

```
λx. f x    ≡    f
```

In C#, eta reduction is passing a method group instead of a lambda that calls it, which is the core move of [point-free style](#point-free-style):

```csharp
int Increment(int x) => x + 1;

var etaExpanded = Seq(1, 2, 3).Map(x => Increment(x)); // => [2, 3, 4]
var etaReduced = Seq(1, 2, 3).Map(Increment);          // => [2, 3, 4]
```

In an eagerly evaluated language the two forms are not quite interchangeable. Evaluating `f` itself might do work or never finish, while `λx. f x` is already a value and postpones evaluating `f` until it is called. The [Z combinator](#fixed-point-combinator) uses exactly that trick.

__Further reading__
* [η-reduction](https://en.wikipedia.org/wiki/Lambda_calculus_definition#%CE%B7-reduction) on Wikipedia

### Reduction Strategy

When a term has more than one reducible call, a reduction strategy decides which to reduce first. The two classic ones:

- **Normal order**: reduce the leftmost, outermost call first, so a function receives its arguments unevaluated.
- **Applicative order**: reduce the arguments first (innermost first), then the call.

Programming languages use restricted versions that never reduce inside a function body: call-by-name (normal order), call-by-value (applicative order), and call-by-need, which is call-by-name that remembers each argument's value once computed, better known as [lazy evaluation](#lazy-evaluation).

The order can decide whether you get an answer at all. With `K = λx. λy. x` and the endless `Ω` from [beta reduction](#beta-reduction):

```
K a Ω
normal order:       (λy. a) Ω  →  a
applicative order:  K a Ω  →  K a Ω  →  ...    (Ω never finishes)
```

The Church-Rosser theorem says that whichever order you use, if two reductions both finish they reach the same normal form. Separately, normal order is guaranteed to find a normal form whenever one exists.

C# uses call-by-value ([eager evaluation](#eager-evaluation)): arguments are evaluated before the call, whether or not the method uses them. To get call-by-name, pass a `Func` ([thunk](#thunk)) and call it where the value is needed; for call-by-need, pass a `Lazy<T>`:

```csharp
var log = new List<string>();

int Arg(string name) { log.Add(name); return 0; }

int ByValue(int x, int y) => x;
int ByName(Func<int> x, Func<int> y) => x() + x();
int ByNeed(Lazy<int> x, Lazy<int> y) => x.Value + x.Value;

ByValue(Arg("a"), Arg("b"));
var byValue = log.ToList(); // => ["a", "b"]

log.Clear();
ByName(() => Arg("a"), () => Arg("b"));
var byName = log.ToList(); // => ["a", "a"]

log.Clear();
ByNeed(new Lazy<int>(() => Arg("a")), new Lazy<int>(() => Arg("b")));
var byNeed = log.ToList(); // => ["a"]
```

Call-by-value evaluated `b` though it was never used; call-by-name skipped `b` but evaluated `a` twice; call-by-need evaluated `a` once and skipped `b`.

__Further reading__
* [Evaluation strategy](https://en.wikipedia.org/wiki/Evaluation_strategy) on Wikipedia
* [Church-Rosser theorem](https://en.wikipedia.org/wiki/Church%E2%80%93Rosser_theorem) on Wikipedia

### Church Encoding

A way of representing data using nothing but functions, so that the lambda calculus can compute with values it doesn't have. Each value is encoded as what you can do with it. A boolean chooses between two alternatives, and a natural number `n` applies a function `n` times:

```
true  = λt. λf. t
false = λt. λf. f
not   = λb. λt. λf. b f t
and   = λp. λq. p q p

0     = λf. λx. x
1     = λf. λx. f x
2     = λf. λx. f (f x)
succ  = λn. λf. λx. f (n f x)
add   = λm. λn. λf. λx. m f (n f x)
mul   = λm. λn. λf. m (n f)

pair  = λa. λb. λs. s a b
first = λp. p true
second = λp. p false
```

The same encodings as C# `Func`s. To check a result, convert it back to an ordinary value: give a boolean `true` and `false` to choose between, or give a numeral "add one" and `0`:

```csharp
// Booleans: pick one of two values
Func<A, Func<A, A>> True<A>() => t => f => t;
Func<A, Func<A, A>> False<A>() => t => f => f;
Func<A, Func<A, A>> Not<A>(Func<A, Func<A, A>> b) => t => f => b(f)(t);
Func<A, Func<A, A>> And<A>(Func<A, Func<A, A>> p, Func<A, Func<A, A>> q) =>
    t => f => p(q(t)(f))(f);

bool ToBool(Func<bool, Func<bool, bool>> b) => b(true)(false);

var notTrue = ToBool(Not(True<bool>()));                     // => false
var trueAndTrue = ToBool(And(True<bool>(), Not(False<bool>()))); // => true

// A Church boolean is its own if/else
var answer = Not(True<string>())("yes")("no"); // => "no"
```

```csharp
// Numerals: apply f n times
Func<Func<A, A>, Func<A, A>> Zero<A>() => f => x => x;
Func<Func<A, A>, Func<A, A>> Succ<A>(Func<Func<A, A>, Func<A, A>> n) =>
    f => x => f(n(f)(x));
Func<Func<A, A>, Func<A, A>> Add<A>(Func<Func<A, A>, Func<A, A>> m, Func<Func<A, A>, Func<A, A>> n) =>
    f => x => m(f)(n(f)(x));
Func<Func<A, A>, Func<A, A>> Mul<A>(Func<Func<A, A>, Func<A, A>> m, Func<Func<A, A>, Func<A, A>> n) =>
    f => m(n(f));

int ToInt(Func<Func<int, int>, Func<int, int>> n) => n(x => x + 1)(0);

var two = Succ(Succ(Zero<int>()));
var three = Succ(two);

var sum = ToInt(Add(two, three));     // => 5
var product = ToInt(Mul(two, three)); // => 6

// The same numeral works on any type: "append a star", twice
var stars = Succ(Succ(Zero<string>()))(s => s + "*")(""); // => "**"
```

```csharp
// Pairs: hand both parts to a selector, which is a Church boolean
Func<Func<A, Func<A, A>>, A> Pair<A>(A a, A b) => s => s(a)(b);
A First<A>(Func<Func<A, Func<A, A>>, A> p) => p(t => f => t);
A Second<A>(Func<Func<A, Func<A, A>>, A> p) => p(t => f => f);

var point = Pair(3, 4);
var x = First(point);  // => 3
var y = Second(point); // => 4
```

C# needs a fixed type `A` for each use, and that is a real limitation. In the untyped calculus `and = λp. λq. p q p` passes one boolean to another, and a pair can hold two values of different types, because a Church value works at every type at once. Typing that needs [rank-N types](#rank-n-type), which C#'s `Func` can't express, hence the eta-expanded `And` and the single-typed `Pair` above.

The idea is still everywhere: a Church-encoded value is its own [catamorphism](#catamorphism). A [sum type](#sum-type) handled only through `Match`, such as language-ext's `Option<A>` (`opt.Match(Some: ..., None: ...)`), is used in exactly the way a Church boolean is.

__Further reading__
* [Lambda Calculus via C# (2) Church Encoding: Boolean and Logic](https://codingonwheels.com/posts/lambda-calculus-via-csharp-2-boolean-and-logic/) on CodingOnWheels
* [Lambda Calculus via C# (3) Numeral, Arithmetic and Predicate](https://codingonwheels.com/posts/lambda-calculus-via-csharp-3-numeral-arithmetic-and-predicate/) on CodingOnWheels
* [Church encoding](https://en.wikipedia.org/wiki/Church_encoding) on Wikipedia

### Fixed-Point Combinator

A combinator that gives an anonymous function the ability to call itself, so the lambda calculus can express [recursion](#recursion) even though it has no names. A fixed point of a function `g` is a value `v` with `g v = v`. A fixed-point combinator `fix` finds one for any `g`: `fix g = g (fix g)`. Write the recursive function as a `g` that takes "itself" as an extra first argument, and `fix g` is the recursive function.

The best known is Curry's Y combinator:

```
Y = λf. (λx. f (x x)) (λx. f (x x))

Y g
→ (λx. g (x x)) (λx. g (x x))
→ g ((λx. g (x x)) (λx. g (x x)))
= g (Y g)
```

Y only works under normal order. C# is strict ([eager evaluation](#eager-evaluation)), so evaluating `x x` before calling `g` recurses forever and overflows the stack. The Z combinator [eta-expands](#eta-conversion) the self-application into `λv. x x v`, which is already a value and only does the self-application when called:

```
Z = λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))
```

In C#, `x x` needs a delegate type that takes itself as its argument:

```csharp
Func<A, B> Z<A, B>(Func<Func<A, B>, Func<A, B>> f)
{
    SelfApplicable<A, B> x = self => v => f(self(self))(v);
    return x(x);
}

// Neither lambda refers to its own name: "next" is supplied by Z
var factorial = Z<int, int>(next => n => n <= 1 ? 1 : n * next(n - 1));
var fibonacci = Z<int, int>(next => n => n < 2 ? n : next(n - 1) + next(n - 2));

var f5 = factorial(5);   // => 120
var fib10 = fibonacci(10); // => 55

delegate Func<A, B> SelfApplicable<A, B>(SelfApplicable<A, B> self);
```

The Y translated directly, `self => f(self(self))`, compiles too, but it overflows the stack as soon as it is applied. In everyday C# you'd just name a local function and let it call itself; language-ext's `Combinators<A, B, C>.Y` does the same internally. The fixed-point combinator matters as proof that recursion needs no built-in support. See the [combinators reference](combinators.md) for the Y combinator alongside the others.

__Further reading__
* [Lambda Calculus via C# (7) Fixed Point Combinator and Recursion](https://codingonwheels.com/posts/lambda-calculus-via-csharp-7-fixed-point-combinator-and-recursion/) on CodingOnWheels
* [Fixed-point combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator) on Wikipedia

### Combinatory Logic

A variant of the lambda calculus with no variables and no `λ` at all: programs are built only by applying a few fixed [combinators](#functional-combinator) to each other. The standard set is SKI:

```
I x      = x                  identity
K x y    = x                  constant
S x y z  = x z (y z)          substitution
```

Every closed lambda term can be translated into S and K (a process called bracket abstraction), so S and K alone are as powerful as the whole lambda calculus. Even I is redundant:

```
S K K x
→ K x (K x)
→ x
```

language-ext defines typed S and K, so `I = S K K` can be checked in C#. The type arguments have to be spelled out, because the second `K` returns a function that the first `K` throws away:

```csharp
var S = Combinators<int, Func<int, int>, int>.S;
var K1 = Combinators<int, Func<int, int>>.K;
var K2 = Combinators<int, int>.K;

Func<int, int> I = S(K1)(K2);

var result = I(42); // => 42
```

It can be reduced further, to a single combinator. Chris Barker's Iota is `ι = λf. f S K`, and:

```
I = ι ι
K = ι (ι (ι ι))
S = ι (ι (ι (ι ι)))
```

Iota has no C# sample: `ι` applies its argument to S and K, which have different types, so typing it needs the same polymorphism that [Church encoding](#church-encoding) does. Combinatory logic shows that variables are a convenience rather than a necessity, which is the same idea as [point-free style](#point-free-style), and its single-letter combinators are the ones in the [combinators reference](combinators.md).

__Further reading__
* [Lambda Calculus via C# (6) Combinatory Logic](https://codingonwheels.com/posts/lambda-calculus-via-csharp-6-combinatory-logic/) on CodingOnWheels
* [SKI combinator calculus](https://en.wikipedia.org/wiki/SKI_combinator_calculus) on Wikipedia
* [Iota and Jot](https://en.wikipedia.org/wiki/Iota_and_Jot) on Wikipedia

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

__Further reading__
* [Lambda Calculus via C# (6) Combinatory Logic](https://codingonwheels.com/posts/lambda-calculus-via-csharp-6-combinatory-logic/) on CodingOnWheels

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

__Further reading__
* [LINQ to Objects in Depth (4) Deferred Execution, Lazy Evaluation and Eager Evaluation](https://codingonwheels.com/posts/linq-to-objects-deferred-execution-lazy-evaluation-and-eager-evaluation/) on CodingOnWheels

## Eager Evaluation

Eager (or strict) evaluation computes an expression as soon as it is bound to a variable or passed to a function, whether or not its value is ever used. It is the opposite of [lazy evaluation](#lazy-evaluation). C# is eager by default: arguments are evaluated, left to right, before the method is called.

```csharp
var log = new List<string>();
int Trace(string name, int value) { log.Add(name); return value; }
int First(int a, int b) => a;

First(Trace("a", 1), Trace("b", 2)); // => 1
var traced = log; // => ["a", "b"]
```

`b` was computed even though `First` ignores it. The exceptions are the short-circuiting operators (`&&`, `||`, `??`, `?:`), which only evaluate the side they need.

LINQ mixes the two. Operators such as `Select` and `Where` are lazy (deferred execution): building the query runs nothing, and the selector runs each time the query is enumerated. `ToList()`, `ToArray()`, `Count()` and `Sum()` are eager: they run the query immediately, and `ToList()` stores the results.

```csharp
var calls = 0;
var query = Enumerable.Range(1, 3).Select(x => { calls++; return x * 10; });

var afterQuery = calls;  // => 0

var list = query.ToList(); // => [10, 20, 30]
var afterToList = calls; // => 3

// The list is already computed; the query runs again every time
var listSum = list.Sum();   // => 60
var querySum = query.Sum(); // => 60
var afterSums = calls;   // => 6
```

Eager evaluation makes it easy to see when work and [side effects](#side-effects) happen. Lazy evaluation avoids work that isn't needed and allows infinite structures. A common C# bug is a lazy query that is enumerated several times and so repeats expensive work; calling `ToList()` once makes it eager.

__Further reading__
* [LINQ to Objects in Depth (4) Deferred Execution, Lazy Evaluation and Eager Evaluation](https://codingonwheels.com/posts/linq-to-objects-deferred-execution-lazy-evaluation-and-eager-evaluation/) on CodingOnWheels
* [Evaluation strategy](https://en.wikipedia.org/wiki/Evaluation_strategy) on Wikipedia

## Generator

A function that produces a sequence of values one at a time, pausing after each until the next one is asked for. In C#, a method that uses `yield return` is a generator (C# calls it an iterator): the compiler turns it into an `IEnumerable<T>` whose code runs only as far as the next `yield return` each time the consumer asks for an item.

Because values are produced on demand, a generator can describe an infinite sequence, as long as the consumer only takes a finite part of it:

```csharp
var produced = 0;

IEnumerable<long> Fibonacci()
{
    long a = 0, b = 1;
    while (true)
    {
        produced++;
        yield return a;
        (a, b) = (b, a + b);
    }
}

var first10 = Fibonacci().Take(10).ToList(); // => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
var count = produced; // => 10
```

The loop never ends, but only 10 values were produced, because `Take` stopped asking. Generators keep their local state (`a` and `b`) between items, which makes them a convenient way to write [lazy](#lazy-evaluation) sequences without building a class by hand. Enumerating a generator twice runs it twice; wrapping it with language-ext's `toSeq` caches each item the first time it is produced.

```csharp
var evens = toSeq(Fibonacci()).Filter(n => n % 2 == 0).Take(5); // => [0, 2, 8, 34, 144]
```

`IAsyncEnumerable<T>` with `yield return` and `await foreach` is the asynchronous version. An unfold ([anamorphism](#anamorphism)) is the functional way to describe the same kind of step-by-step sequence without writing a loop.

__Further reading__
* [LINQ to Objects in Depth (3) Generator](https://codingonwheels.com/posts/linq-to-objects-generator/) on CodingOnWheels
* [Iterators](https://learn.microsoft.com/en-us/dotnet/csharp/iterators) on Microsoft Learn
* [Generator (computer programming)](https://en.wikipedia.org/wiki/Generator_(computer_programming)) on Wikipedia

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

__Further reading__
* [Category Theory via C# (2) Monoid](https://codingonwheels.com/posts/category-theory-via-csharp-2-monoid/) on CodingOnWheels

## Group

A [monoid](#monoid) in which every element has an inverse: a value that combines with it to give the identity. Integers under addition form a group, since `n + (-n) == 0`. Rotations of a shape do too: rotating by 90 degrees is undone by rotating by 270. Strings under concatenation are only a monoid, because nothing appended to `"abc"` gives back `""`.

language-ext has no group trait. `Arithmetic<A>` (part of `Num<A>`) has `Negate` and `Subtract`, which give numbers their additive inverse, and `Patch<EqA, A>` (a diff between two lists) is a `Monoid` with an `Inverse()` that undoes it; its documentation calls it a groupoid, since only patches that line up can be composed. A group interface can be built on top of `Monoid<A>` in the same style as the `Max` monoid in [Type Class](#type-class):

```csharp
// Undo works for any group: combine with the inverse of the step
A Undo<A>(A total, A step) where A : Group<A> => total.Combine(step.Invert());

var turned = new Rotation(90).Combine(new Rotation(300)); // => Rotation { Degrees = 30 }
var back   = Undo(turned, new Rotation(300));              // => Rotation { Degrees = 90 }

var cancels = new Rotation(90).Combine(new Rotation(90).Invert()) == Rotation.Empty; // => true

interface Group<A> : Monoid<A> where A : Group<A>
{
    A Invert();
}

// Rotations by whole degrees, combined by adding modulo 360
record Rotation(int Degrees) : Group<Rotation>
{
    public static Rotation Empty => new(0);
    public Rotation Combine(Rotation rhs) => new((Degrees + rhs.Degrees) % 360);
    public Rotation Invert() => new((360 - Degrees) % 360);
}
```

Inverses are what make undo, diffs and running totals cheap: the sum of a range can be computed from two prefix sums by "subtracting" one from the other, which only works when there is an inverse. When the operation is also commutative (`a • b == b • a`, as for addition and rotation) the group is called abelian.

__Further reading__
* [Group (mathematics)](https://en.wikipedia.org/wiki/Group_(mathematics)) on Wikipedia
* [Data.Group](https://hackage.haskell.org/package/groups/docs/Data-Group.html) on Hackage

## Semiring

A type with two [monoids](#monoid) on it, usually called addition and multiplication, where multiplication distributes over addition (`a × (b + c) == a × b + a × c`) and the additive identity (zero) annihilates (`0 × a == 0`). Addition must be commutative; neither operation needs an inverse.

The familiar examples:

* Numbers, with `+` (identity `0`) and `×` (identity `1`).
* Booleans, with `||` (identity `false`) and `&&` (identity `true`).
* The tropical or min-plus semiring: "addition" is `min` (identity infinity) and "multiplication" is `+` (identity `0`). It computes shortest paths.

The payoff is that one algorithm written against the semiring operations means different things for each instance. Here each route is a list of legs, a route's value is the "product" of its legs, and the routes are "added" together:

```csharp
A Total<A>(Seq<Seq<A>> routes) where A : Semiring<A> =>
    routes.Fold(A.Zero, (acc, route) =>
        A.Add(acc, route.Fold(A.One, (r, leg) => A.Mul(r, leg))));

// Two routes from X to Z: X -> Y -> Z, or straight X -> Z

// Is any route open? Each leg is open or closed (or / and)
Total(Seq(Seq(new Open(true), new Open(true)), Seq(new Open(false))));
// => Open { Value = True }

// Shortest distance: legs are lengths in km (min / plus)
Total(Seq(Seq(new Distance(2), new Distance(3)), Seq(new Distance(7))));
// => Distance { Km = 5 }

// Number of ways to travel: legs are counts of trains (plus / times)
Total(Seq(Seq(new Ways(2), new Ways(3)), Seq(new Ways(1))));
// => Ways { Count = 7 }

interface Semiring<A> where A : Semiring<A>
{
    static abstract A Zero { get; }
    static abstract A One { get; }
    static abstract A Add(A x, A y);
    static abstract A Mul(A x, A y);
}

record Open(bool Value) : Semiring<Open>
{
    public static Open Zero => new(false);
    public static Open One => new(true);
    public static Open Add(Open x, Open y) => new(x.Value || y.Value);
    public static Open Mul(Open x, Open y) => new(x.Value && y.Value);
}

record Distance(double Km) : Semiring<Distance>
{
    public static Distance Zero => new(double.PositiveInfinity);
    public static Distance One => new(0);
    public static Distance Add(Distance x, Distance y) => new(Math.Min(x.Km, y.Km));
    public static Distance Mul(Distance x, Distance y) => new(x.Km + y.Km);
}

record Ways(int Count) : Semiring<Ways>
{
    public static Ways Zero => new(0);
    public static Ways One => new(1);
    public static Ways Add(Ways x, Ways y) => new(x.Count + y.Count);
    public static Ways Mul(Ways x, Ways y) => new(x.Count * y.Count);
}
```

The same idea scales up: matrix multiplication over a semiring computes reachability, shortest paths or path counts over a whole graph, depending only on which semiring you plug in. language-ext has no semiring trait; `Num<A>` provides `+` and `*` for numbers, but not as a general abstraction.

__Further reading__
* [Semiring](https://en.wikipedia.org/wiki/Semiring) on Wikipedia
* [Tropical semiring](https://en.wikipedia.org/wiki/Tropical_semiring) on Wikipedia
* [Data.Semiring](https://hackage.haskell.org/package/semirings/docs/Data-Semiring.html) on Hackage

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

__Further reading__
* [Category Theory via C# (7) Monad and LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-7-monad-and-linq-to-monads/) on CodingOnWheels

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
* [Category Theory via C# (7) Monad and LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-7-monad-and-linq-to-monads/) on CodingOnWheels

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

## Kleisli Category

A [category](#category) built from a [monad](#monad) `M`: the objects are ordinary types, but an arrow from `A` to `B` is a function `A -> M<B>` (a Kleisli arrow) rather than `A -> B`. Arrows are joined with [Kleisli composition](#kleisli-composition), and the identity arrow for each type is `Pure` (`A -> M<A>`). So the monad laws are exactly the category laws for this category: composing with `Pure` on either side changes nothing, and composition is associative.

Using [Option](#option), with `Then` as Kleisli composition (left to right) and `Id` as `Pure`:

```csharp
Func<A, Option<C>> Then<A, B, C>(Func<A, Option<B>> f, Func<B, Option<C>> g) =>
    a => f(a).Bind(g);

Option<A> Id<A>(A a) => Some(a);

Func<string, Option<int>> parse = s => parseInt(s);
Func<int, Option<int>> positive = n => n > 0 ? Some(n) : None;
Func<int, Option<int>> halve = n => n % 2 == 0 ? Some(n / 2) : None;

var inputs = Seq("8", "-8", "x", "3");

// Identity: Id on either side changes nothing
var plain   = inputs.Map(parse);                       // => [Some(8), Some(-8), None, Some(3)]
var idLeft  = inputs.Map(Then<string, string, int>(Id, parse)); // => [Some(8), Some(-8), None, Some(3)]
var idRight = inputs.Map(Then<string, int, int>(parse, Id));    // => [Some(8), Some(-8), None, Some(3)]

// Associativity: the grouping doesn't matter
var grouped1 = inputs.Map(Then(Then(parse, positive), halve)); // => [Some(4), None, None, None]
var grouped2 = inputs.Map(Then(parse, Then(positive, halve))); // => [Some(4), None, None, None]
```

Seeing Kleisli arrows as a category explains why monadic code composes as smoothly as plain functions: a pipeline of `A -> M<B>` steps is just function composition in a different category, where the monad takes care of the plumbing (here, stopping at the first `None`).

__Further reading__
* [Kleisli Categories](https://bartoszmilewski.com/2014/12/23/kleisli-categories/) by Bartosz Milewski
* [Kleisli category](https://en.wikipedia.org/wiki/Kleisli_category) on Wikipedia

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
* [Category Theory via C# (8) Advanced LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-8-more-linq-to-monads/) on CodingOnWheels

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
* [Category Theory via C# (8) Advanced LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-8-more-linq-to-monads/) on CodingOnWheels

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
* [Category Theory via C# (8) Advanced LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-8-more-linq-to-monads/) on CodingOnWheels

## Continuation Monad

A [monad](#monad) for computations written in [continuation-passing style](#continuation-passing-style). A value of type `Cont<R, A>` is a function `(A -> R) -> R`: give it a continuation that knows what to do with an `A`, and it produces the final result `R`. `Bind` threads the continuations through for you, so CPS code can be written as an ordinary LINQ query.

language-ext doesn't include one, but it takes only a few lines:

```csharp
Cont<R, int> Square<R>(int x) => new(k => k(x * x));
Cont<R, int> AddThree<R>(int x) => new(k => k(x + 3));

// Looks like direct style, runs in CPS
Cont<R, int> Calc<R>() =>
    from a in Square<R>(4)
    from b in AddThree<R>(a)
    select b;

// The caller decides what happens with the result
Calc<string>().Run(b => $"result {b}"); // => "result 19"
Calc<int>().Run(b => b * 2);            // => 38
```

Because the rest of the computation is a value, a computation can capture it and decide what to do with it. `CallCC` (call with current continuation) hands the code an `exit` function that jumps straight to the end, skipping whatever comes after it, much like `return` from the middle of a method:

```csharp
Cont<R, string> Classify<R>(int n) =>
    Cont.CallCC<R, string, Unit>(exit =>
        from _ in n < 0 ? exit("negative") : Cont.Pure<R, Unit>(unit)
        from s in Cont.Pure<R, string>(n % 2 == 0 ? "even" : "odd")
        select s);

Classify<string>(4).Run(s => s);  // => "even"
Classify<string>(-3).Run(s => s); // => "negative"
```

```csharp
public record Cont<R, A>(Func<Func<A, R>, R> Run)
{
    public Cont<R, B> Map<B>(Func<A, B> f) => new(k => Run(a => k(f(a))));
    public Cont<R, B> Bind<B>(Func<A, Cont<R, B>> f) => new(k => Run(a => f(a).Run(k)));

    // Select and SelectMany let LINQ query syntax work with Cont
    public Cont<R, B> Select<B>(Func<A, B> f) => Map(f);
    public Cont<R, C> SelectMany<B, C>(Func<A, Cont<R, B>> bind, Func<A, B, C> project) =>
        Bind(a => bind(a).Map(b => project(a, b)));
}

public static class Cont
{
    public static Cont<R, A> Pure<R, A>(A value) => new(k => k(value));

    // exit(a) ignores its own continuation and jumps to k, the continuation of CallCC
    public static Cont<R, A> CallCC<R, A, B>(Func<Func<A, Cont<R, B>>, Cont<R, A>> f) =>
        new(k => f(a => new Cont<R, B>(_ => k(a))).Run(k));
}
```

The continuation monad is sometimes called the mother of all monads, because any other monad can be expressed with it. `async`/`await` in C# is a continuation monad specialised to `Task`: everything after an `await` is the continuation.

__Further reading__
* [Category Theory via C# (22) Continuation Monad](https://codingonwheels.com/posts/category-theory-via-csharp-22-more-monad-continuation-monad-2017/) on CodingOnWheels
* [Control.Monad.Cont](https://hackage.haskell.org/package/mtl/docs/Control-Monad-Cont.html) on Hackage
* [The Mother of all Monads](https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/the-mother-of-all-monads) by Dan Piponi

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
* [Category Theory via C# (8) Advanced LINQ to Monads](https://codingonwheels.com/posts/category-theory-via-csharp-8-more-linq-to-monads/) on CodingOnWheels

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

__Further reading__
* [Category Theory via C# (6) Monoidal Functor and Applicative Functor](https://codingonwheels.com/posts/category-theory-via-csharp-6-monoidal-functor-and-applicative-functor/) on CodingOnWheels

## Monoidal Functor

A [functor](#functor) that preserves monoidal structure: it can make an "empty" value and it can pair up two values, so tuples and `Unit` inside the functor behave like tuples and `Unit` outside it. In Haskell notation:

```
unit :: f ()
(**) :: f a -> f b -> f (a, b)
```

`unit` lifts the unit value, and `**` (often called `zip`) combines two functor values into a functor of pairs. The laws say pairing with `unit` changes nothing and pairing is associative, exactly the [monoid](#monoid) laws with `(,)` as the operation and `()` as the identity. This is the [Monoidal Category](#monoidal-category) structure of types under tuples, carried through the functor.

A monoidal functor is equivalent in power to an [Applicative Functor](#applicative-functor): each can be defined from the other. language-ext defines `Zip` for every applicative, using `Map` and `Apply`:

```csharp
var unitOpt = pure<Option, Unit>(unit); // => Some(())

Some(1).Zip(Some("a"));           // => Some((1, a))
Some(1).Zip(Option<string>.None); // => None
```

(`Seq` has its own `Zip` that pairs elements by position, which hides this one when called on a `Seq`.)

Going the other way, `Apply` can be recovered from `Zip` and `Map`: pair the function with its argument, then call it. Since language-ext builds its `Zip` from `Apply`, this shows how the derivation goes rather than giving an independent implementation.

```csharp
K<F, B> ApplyViaZip<F, A, B>(K<F, Func<A, B>> ff, K<F, A> fa)
    where F : Applicative<F> =>
    ff.Zip(fa).Map(p => p.First(p.Second));

Func<int, int> addTen = x => x + 10;
ApplyViaZip(Some(addTen), Some(5));  // => Some(15)
ApplyViaZip(Some(addTen), Option<int>.None); // => None
```

The monoidal form is often easier to reason about (its laws are the monoid laws), while the applicative form is easier to program with, since it applies functions of any number of arguments.

__Further reading__
* [Category Theory via C# (6) Monoidal Functor and Applicative Functor](https://codingonwheels.com/posts/category-theory-via-csharp-6-monoidal-functor-and-applicative-functor/) on CodingOnWheels
* [Typeclassopedia](https://wiki.haskell.org/Typeclassopedia) on the Haskell Wiki, whose Applicative section covers the Monoidal presentation
* [Monoidal functor](https://en.wikipedia.org/wiki/Monoidal_functor) on Wikipedia

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
* [Category Theory via C# (5) Bifunctor](https://codingonwheels.com/posts/category-theory-via-csharp-5-bifunctor/) on CodingOnWheels

## Variance

How subtyping of a generic type follows subtyping of its type argument. A `string` is an `object`; variance answers whether a `Thing<string>` is then a `Thing<object>`, the other way round, or neither.

* **Covariant** (`out T`): the generic type varies the same way. A type that only produces `T`s can stand in for one that produces a supertype: an `IEnumerable<string>` is an `IEnumerable<object>`, and a `Func<string>` is a `Func<object>`.
* **Contravariant** (`in T`): it varies the opposite way. A type that only consumes `T`s can stand in for one that consumes a subtype: an `Action<object>` can handle any `string`, so it is an `Action<string>`.
* **Invariant**: no conversion either way. A `List<T>` both reads and writes `T`, so a `List<string>` is not a `List<object>` (someone could add an `int` to it).

`Func<in T, out R>` is both: contravariant in its input and covariant in its output.

```csharp
IEnumerable<string> names = ["Ada", "Grace"];
IEnumerable<object> things = names;          // covariant
var count = things.Count();                  // => 2

Action<object> log = o => Console.WriteLine(o);
Action<string> logName = log;                // contravariant

Func<object, string> describe = o => $"<{o}>";
Func<string, object> narrower = describe;    // in on the input, out on the output
var result = narrower("Ada");                // => "<Ada>"

// List<object> list = new List<string>();   // compile error: List<T> is invariant
```

You can declare variance on your own interfaces and delegates (not classes or structs), and the compiler checks that `out` parameters only appear in output positions and `in` only in input positions:

```csharp
interface IProducer<out T> { T Produce(); }
interface IConsumer<in T> { void Consume(T item); }
```

Arrays are the pitfall. C# lets a `string[]` be used as an `object[]`, even though arrays can be written to, so the check moves to run time:

```csharp
object[] items = new string[1];
string Store(object[] array)
{
    try { array[0] = 42; return "stored"; }
    catch (ArrayTypeMismatchException e) { return e.GetType().Name; }
}
Store(items); // => "ArrayTypeMismatchException"
```

Variance is the type-level view of [functors](#functor). A covariant type parameter is one you could `Map` over, changing what comes out; a contravariant one is one you could `Contramap` over, changing what goes in, as a [Contravariant Functor](#contravariant-functor) does; and `Func<in T, out R>`, contravariant on one side and covariant on the other, is the shape of a [Profunctor](#profunctor). language-ext's `Option<A>` and `Seq<A>` are structs, so they are invariant: `Map` is how you turn an `Option<string>` into an `Option<object>`.

__Further reading__
* [Covariance and contravariance in generics](https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance) on Microsoft Learn
* [C# Functional Programming In-Depth (11) Covariance and Contravariance](https://codingonwheels.com/posts/csharp-functional-programming-covariance-and-contravariance/) on CodingOnWheels
* [Covariance and contravariance (computer science)](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)) on Wikipedia

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
* [C# Functional Programming In-Depth (11) Covariance and Contravariance](https://codingonwheels.com/posts/csharp-functional-programming-covariance-and-contravariance/) on CodingOnWheels

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

## Arrow

A generalisation of functions: something that takes an input and produces an output, and can be composed and run on parts of a tuple. Haskell's `Control.Arrow` defines it as a [category](#category) (identity and composition) plus a few operations:

```
arr   :: (b -> c) -> a b c                       -- lift a plain function
(>>>) :: a b c -> a c d -> a b d                 -- compose left to right
first :: a b c -> a (b, d) (c, d)                -- run on the first of a pair
(***) :: a b c -> a b' c' -> a (b, b') (c, c')   -- run two side by side
(&&&) :: a b c -> a b c' -> a b (c, c')          -- feed one input to both
```

Plain functions are the basic arrow. In C#, `Func` already has composition (language-ext's `Compose` is `>>>`), and the rest are one-liners:

```csharp
Func<string, int> length = s => s.Length;
Func<string, string> shout = s => s.ToUpper();
Func<int, bool> isEven = n => n % 2 == 0;

length.Compose(isEven)("hello");             // => false
length.First<string, int, bool>()(("hi", true)); // => (2, True)
length.Split(isEven)(("hello", 4));          // => (5, True)
length.Fanout(shout)("hello");               // => (5, HELLO)

static class FuncArrow
{
    // first: apply f to the first element, pass the second through
    public static Func<(A, C), (B, C)> First<A, B, C>(this Func<A, B> f) =>
        p => (f(p.Item1), p.Item2);

    // *** : apply f and g to the two halves of a pair
    public static Func<(A, C), (B, D)> Split<A, B, C, D>(this Func<A, B> f, Func<C, D> g) =>
        p => (f(p.Item1), g(p.Item2));

    // &&& : apply f and g to the same input
    public static Func<A, (B, C)> Fanout<A, B, C>(this Func<A, B> f, Func<A, C> g) =>
        a => (f(a), g(a));
}
```

Other things are arrows too. Functions that return a monad, `A -> M<B>`, form an arrow under [Kleisli composition](#kleisli-composition), so the same plumbing works for steps that may fail or have effects. Arrows sit between [applicative functors](#applicative-functor) and [monads](#monad) in power: like a [profunctor](#profunctor), an arrow can pre-process its input and post-process its output, and it adds composition and pairing on top. In Haskell they are mostly used for parsers, stream processors and functional reactive programming, where the structure of a pipeline matters and is known before it runs.

__Further reading__
* [Control.Arrow](https://hackage.haskell.org/package/base/docs/Control-Arrow.html) on Hackage
* [Generalising Monads to Arrows](https://www.cse.chalmers.se/~rjmh/Papers/arrows.pdf) by John Hughes
* [Arrow (computer science)](https://en.wikipedia.org/wiki/Arrow_(computer_science)) on Wikipedia

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

__Further reading__
* [Category Theory via C# (1) Fundamentals](https://codingonwheels.com/posts/category-theory-via-csharp-1-fundamentals/) on CodingOnWheels

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

Unfold is the dual of fold. A [fold](#foldable) consumes a structure, combining its elements into one value; an unfold starts from a single seed and builds a structure from it, stopping when the function returns `None`. language-ext has one built in, `List.unfold` (in the `LanguageExt` namespace, written in full here to avoid clashing with the `List` helper in the Prelude):

```csharp
// Unfold a number into its digits, least significant first...
var digits = toSeq(LanguageExt.List.unfold(1234, n => n == 0 ? None : Some((n % 10, n / 10))));
// => [4, 3, 2, 1]

// ...and fold them back into the number
digits.FoldBack(0, (acc, d) => acc * 10 + d); // => 1234
```

The state doesn't have to be the same type as the elements, and the result can be infinite, as long as only part of it is used:

```csharp
var fibonacci = toSeq(LanguageExt.List.unfold((0, 1), s => Some((s.Item1, (s.Item2, s.Item1 + s.Item2)))));
fibonacci.Take(8); // => [0, 1, 1, 2, 3, 5, 8, 13]
```

An unfold followed by a fold is a [hylomorphism](#hylomorphism). Unfold does the same job as a [generator](#generator), with the loop written once inside `unfold` instead of in every generator.

__Further reading__
* [Data.List unfoldr](https://hackage.haskell.org/package/base/docs/Data-List.html#v:unfoldr) on Hackage
* [Anamorphism](https://en.wikipedia.org/wiki/Anamorphism) on Wikipedia

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
* [Category Theory via C# (4) Natural Transformation](https://codingonwheels.com/posts/category-theory-via-csharp-4-natural-transformation/) on CodingOnWheels

## Functor Category

A [category](#category) whose objects are [functors](#functor) and whose arrows are [natural transformations](#natural-transformation) between them. For two categories C and D, the functor category has one object for each functor from C to D. An arrow from `F` to `G` is a natural transformation `F<A> -> G<A>` (for every `A`); the identity arrow leaves each `F<A>` alone, and composing two natural transformations gives another one.

```csharp
// Two arrows in the functor category: Seq => Option, then Option => Seq
Option<A> First<A>(Seq<A> xs) => xs.Head;
Seq<A> ToSeq<A>(Option<A> o) => o.Match(Some: a => Seq(a), None: () => Seq<A>());

// Their composite is an arrow Seq => Seq, and it is still natural
Seq<A> FirstOnly<A>(Seq<A> xs) => ToSeq(First(xs));

FirstOnly(Seq(1, 2, 3).Map(x => x * 10)); // => [10]
FirstOnly(Seq(1, 2, 3)).Map(x => x * 10); // => [10]
```

Treating functors as objects in their own right is what lets category theory talk about the category of endofunctors (see [Endofunctor](#endofunctor)), the [Yoneda lemma](#yoneda-lemma), and [adjunctions](#adjunction).

__Further reading__
* [Category Theory via C# (4) Natural Transformation](https://codingonwheels.com/posts/category-theory-via-csharp-4-natural-transformation/) on CodingOnWheels
* [Functor category](https://en.wikipedia.org/wiki/Functor_category) on Wikipedia

## Initial and Terminal Objects

A **terminal** object is a type that every type has exactly one arrow (function) _to_. An **initial** object is a type that has exactly one arrow _to_ every type. In the category of C# types and functions, the terminal object is the [Unit type](#unit-type) and the initial object is the [Never type](#never-type).

There is exactly one function from any type to `Unit`, because there is only one value it can return:

```csharp
// The only possible A -> Unit: forget the input
Unit Discard<A>(A _) => unit;

var fromInt    = Discard(42);   // => ()
var fromString = Discard("hi"); // => ()
```

There is exactly one function from `Never` to any type, because it can never be called, so any two such functions can never disagree. It is `Absurd`:

```csharp
// The only possible Never -> A
A FromNever<A>(Never n) => n.Absurd<A>();

var toInt  = FromNever<int>;    // => <function>
var toText = FromNever<string>; // => <function>

public sealed class Never
{
    private Never() { }

    public A Absurd<A>() => throw new System.Diagnostics.UnreachableException();
}
```

The two are [duals](#duality): reverse every arrow and "exactly one arrow out to it" becomes "exactly one arrow in from it". They also play the role of the "1" and "0" in algebraic data types: `Unit` is the identity of [product types](#product-type) and `Never` is the identity of [sum types](#sum-type).

__Further reading__
* [Products and Coproducts](https://bartoszmilewski.com/2015/01/07/products-and-coproducts/) by Bartosz Milewski (starts with initial and terminal objects)
* [Initial and terminal objects](https://en.wikipedia.org/wiki/Initial_and_terminal_objects) on Wikipedia

## Product and Coproduct

The category-theory description of [product types](#product-type) and [sum types](#sum-type), given purely in terms of arrows.

A **product** of `A` and `B` is a type `(A, B)` with two projections, `p => p.Item1` and `p => p.Item2`, such that for any type `C` with functions `f: C -> A` and `g: C -> B` there is exactly one function `C -> (A, B)` that agrees with both: run them and pair the results.

```csharp
// The unique arrow into a product
Func<C, (A, B)> Both<C, A, B>(Func<C, A> f, Func<C, B> g) => c => (f(c), g(c));

var stats = Both((string s) => s.Length, (string s) => s.ToUpper());

var pair = stats("abc");  // => (3, ABC)
var len  = pair.Item1;    // => 3
var up   = pair.Item2;    // => "ABC"
```

A **coproduct** of `A` and `B` is a type `Either<A, B>` with two injections, `Left` and `Right`, such that for any type `C` with functions `f: A -> C` and `g: B -> C` there is exactly one function `Either<A, B> -> C` that agrees with both: case analysis, which language-ext calls `Match`.

```csharp
// The unique arrow out of a coproduct
Func<Either<A, B>, C> Cases<A, B, C>(Func<A, C> f, Func<B, C> g) =>
    e => e.Match(Left: f, Right: g);

var describe = Cases((int n) => $"number {n}", (string s) => $"text {s}");

describe(Left<int, string>(3));     // => "number 3"
describe(Right<int, string>("hi")); // => "text hi"
```

The two definitions are mirror images: the product has arrows _out_ (projections) and a unique arrow _in_, the coproduct has arrows _in_ (injections) and a unique arrow _out_. That makes them [duals](#duality). Defining them this way, by how they connect to everything else rather than what is inside, is why tuples, records and [Either](#either) all count as products or coproducts.

__Further reading__
* [Products and Coproducts](https://bartoszmilewski.com/2015/01/07/products-and-coproducts/) by Bartosz Milewski
* [Coproduct](https://en.wikipedia.org/wiki/Coproduct) on Wikipedia

## Duality

Every definition in category theory has a mirror image, obtained by reversing the direction of every arrow. The mirror image is called the dual, and usually gets the prefix "co". Anything proved about one comes for free for the other, because the proof works with the arrows reversed too.

| Concept | Dual | What reversing the arrows does |
| --- | --- | --- |
| [Product](#product-and-coproduct) `(A, B)` | Coproduct `Either<A, B>` | projections out become injections in |
| [Terminal object](#initial-and-terminal-objects) `Unit` | Initial object `Never` | one arrow in from everything becomes one arrow out to everything |
| [Monad](#monad) (`Pure: A -> M<A>`, `Flatten: M<M<A>> -> M<A>`) | [Comonad](#comonad) (`Extract: W<A> -> A`, `Duplicate: W<A> -> W<W<A>>`) | putting into a context becomes taking out of one (`Extend` is `Duplicate` followed by `Map`) |
| [Catamorphism](#catamorphism) (fold: `F<A> -> A`) | [Anamorphism](#anamorphism) (unfold: `A -> F<A>`) | tearing a structure down becomes building one up |

The arrows really are just flipped:

```
product:    C -> A,  C -> B   gives the unique   C -> (A, B)
coproduct:  A -> C,  B -> C   gives the unique   Either<A, B> -> C
```

In practice duality is a useful hint: when you meet a "co" thing, flip the arrows of the thing you already know and you have most of its definition.

__Further reading__
* [Duality (category theory)](https://en.wikipedia.org/wiki/Dual_(category_theory)) on Wikipedia
* [Products and Coproducts](https://bartoszmilewski.com/2015/01/07/products-and-coproducts/) by Bartosz Milewski

## Monoidal Category

A [category](#category) with a way to combine two objects into one (the tensor, written `⊗`) and a unit object `I`, where combining is associative and `I` changes nothing, but only up to [isomorphism](#isomorphism) rather than equality. It is a [monoid](#monoid) one level up: instead of combining values, it combines types.

C# types form a monoidal category with tuples as the tensor and [Unit](#unit-type) as the unit. `((A, B), C)` is not the same type as `(A, (B, C))`, and `(A, Unit)` is not the same type as `A`, but each pair converts back and forth without losing anything:

```csharp
// Associative up to isomorphism: ((A, B), C) ≅ (A, (B, C))
(A, (B, C)) Reassoc<A, B, C>(((A, B), C) t) => (t.Item1.Item1, (t.Item1.Item2, t.Item2));
((A, B), C) Unassoc<A, B, C>((A, (B, C)) t) => ((t.Item1, t.Item2.Item1), t.Item2.Item2);

var left  = ((1, "two"), true);
var right = Reassoc(left);              // => (1, (two, True))
var back  = Unassoc(right) == left;     // => true

// Unital up to isomorphism: (A, Unit) ≅ A
(A, Unit) AddUnit<A>(A a) => (a, unit);
A DropUnit<A>((A, Unit) t) => t.Item1;

var withUnit = AddUnit(5);              // => (5, ())
var without  = DropUnit(withUnit);      // => 5
```

Tuples are not the only choice: `Either` as the tensor with [Never](#never-type) as the unit makes another monoidal category on the same types. The idea matters because a [monoidal functor](#monoidal-functor), one that preserves this structure, is another way to describe an [applicative functor](#applicative-functor): combining `F<A>` and `F<B>` into `F<(A, B)>`.

__Further reading__
* [Category Theory via C# (5) Bifunctor](https://codingonwheels.com/posts/category-theory-via-csharp-5-bifunctor/) on CodingOnWheels (covers monoidal categories)
* [Monoidal category](https://en.wikipedia.org/wiki/Monoidal_category) on Wikipedia

## Adjunction

A pairing of two [functors](#functor) `F` and `G`, written `F ⊣ G`, such that arrows out of `F<A>` correspond one to one with arrows into `G<B>`:

```
Hom(F A, B)  ≅  Hom(A, G B)
```

Read it as "a function from `F<A>` to `B` is the same information as a function from `A` to `G<B>`", with two conversion functions that undo each other.

The example every C# developer already knows is [currying](#currying). Take `F` to be "pair with a `B`" (`F<A> = (A, B)`) and `G` to be "function from `B`" (`G<C> = Func<B, C>`). The adjunction says a function from `(A, B)` to `C` is the same as a function from `A` to `Func<B, C>`, and curry and uncurry are the two directions:

```csharp
Func<A, Func<B, C>> Curry<A, B, C>(Func<(A, B), C> f) => a => b => f((a, b));
Func<(A, B), C> Uncurry<A, B, C>(Func<A, Func<B, C>> g) => p => g(p.Item1)(p.Item2);

Func<(int, string), string> repeat = p => string.Concat(Enumerable.Repeat(p.Item2, p.Item1));

var curried = Curry(repeat)(3)("ab");          // => "ababab"
var original = repeat((3, "ab"));              // => "ababab"
var roundTrip = Uncurry(Curry(repeat))((2, "xy")); // => "xyxy"
```

Composing the two functors of an adjunction always gives a [monad](#monad). Here, with `S` in place of `B`, `G<F<A>>` is `Func<S, (A, S)>`: a function that takes a state and returns a value with a new state, which is exactly the [State Monad](#state-monad). Composing them the other way round, `(Func<S, A>, S)`, gives a [comonad](#comonad) (called Store).

__Further reading__
* [Adjunctions](https://bartoszmilewski.com/2016/04/18/adjunctions/) by Bartosz Milewski
* [Adjoint functors](https://en.wikipedia.org/wiki/Adjoint_functors) on Wikipedia

## Yoneda Lemma

A result that says, in programming terms, that a value of `F<A>` (for a [functor](#functor) `F`) carries exactly the same information as a generic function "give me any `A -> B` and I'll give you an `F<B>`", written `forall B. (A -> B) -> F<B>`. Going one way, `fa` becomes `f => fa.Map(f)`; going back, you call the function with the identity `x => x`.

C# can't write `forall B` as a delegate type, but an interface with a generic method can (see [Rank-N Type](#rank-n-type)):

```csharp
var yo = Yoneda.Lift(Some(20));

// Back again by passing the identity function
var lowered = yo.Lower();                         // => Some(20)
var none    = Yoneda.Lift(Option<int>.None).Lower(); // => None

// Maps are stored up and composed, then applied in one go at Lower
var mapped = yo.Map(x => x + 1).Map(x => x * 2).Map(x => $"#{x}").Lower();
// => Some(#42)

// Same answer as mapping the Option directly
var direct = Some(20).Map(x => x + 1).Map(x => x * 2).Map(x => $"#{x}");
// => Some(#42)

interface IYoneda<A>
{
    Option<B> Run<B>(Func<A, B> f);
}

// Option<A> into Yoneda form: wait for a function, then Map with it
sealed class Lifted<A>(Option<A> value) : IYoneda<A>
{
    public Option<B> Run<B>(Func<A, B> f) => value.Map(f);
}

// Map doesn't touch the Option: it composes f in front of whatever comes later
sealed class Mapped<X, A>(IYoneda<X> inner, Func<X, A> g) : IYoneda<A>
{
    public Option<B> Run<B>(Func<A, B> f) => inner.Run((X x) => f(g(x)));
}

static class Yoneda
{
    public static IYoneda<A> Lift<A>(Option<A> value) => new Lifted<A>(value);
    public static IYoneda<B> Map<A, B>(this IYoneda<A> y, Func<A, B> g) => new Mapped<A, B>(y, g);
    public static Option<A> Lower<A>(this IYoneda<A> y) => y.Run((A x) => x);
}
```

The practical upshot is map fusion: in Yoneda form, any number of `Map`s collapse into a single function, so the structure is traversed once instead of once per `Map`. That matters for a large `Seq` or a tree, and it is what Haskell's `Yoneda` and `Coyoneda` types are used for. The deeper idea is that an object is completely determined by its arrows: if you know every way to get out of something, you know what it is. It is the category-theory version of judging a type by what you can do with it.

__Further reading__
* [The Yoneda Lemma](https://bartoszmilewski.com/2015/09/01/the-yoneda-lemma/) by Bartosz Milewski
* [Yoneda lemma](https://en.wikipedia.org/wiki/Yoneda_lemma) on Wikipedia
* [Data.Functor.Yoneda](https://hackage.haskell.org/package/kan-extensions/docs/Data-Functor-Yoneda.html) on Hackage

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

## Magma

A set with a binary operation that is closed: combining any two values of the type gives another value of the same type. That is the whole definition, with no laws at all. It is the bottom of a hierarchy where each level adds one law:

```
Magma       closed binary operation       a • b is again in the set
Semigroup   + associativity               (a • b) • c == a • (b • c)
Monoid      + identity element            e • a == a == a • e
Group       + inverse for every element   a • a⁻¹ == e
```

Subtraction of integers is a magma but not a [semigroup](#semigroup), because the grouping changes the result. Averaging two numbers is another:

```csharp
var subLeft  = (10 - 5) - 2; // => 3
var subRight = 10 - (5 - 2); // => 7

double Avg(double a, double b) => (a + b) / 2;

var avgLeft  = Avg(Avg(2, 4), 8); // => 5.5
var avgRight = Avg(2, Avg(4, 8)); // => 4
```

Because a magma promises nothing about grouping, a list of values can't be reduced in an arbitrary order, split across threads or folded from either end with the same result. Most useful combining operations turn out to be associative, which is why [Semigroup](#semigroup) and [Monoid](#monoid) are the ones that appear as type classes.

__Further reading__
* [Magma (algebra)](https://en.wikipedia.org/wiki/Magma_(algebra)) on Wikipedia
* [Magmas](https://blog.ploeh.dk/2017/12/27/magmas/) by Mark Seemann

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

## Zipper

A way to walk around an immutable data structure with a cursor. A zipper splits the structure into the item in focus and the context needed to rebuild the rest. Moving the focus one step, or changing the item at the focus, is O(1) and makes a new zipper, leaving the old one intact.

For a list, the context is the items to the left, stored nearest first (so in reverse), and the items to the right:

```
list      [1, 2, 3, 4, 5]   focus on 3
zipper    left = [2, 1]   focus = 3   right = [4, 5]
```

Moving right pushes the focus onto the left and takes the next item from the right, so each move only touches the front of two lists:

```csharp
var start = ListZipper<int>.From(Seq(1, 2, 3, 4));

var edited =
    from z0 in start
    from z1 in z0.Right()
    from z2 in z1.Right()
    select z2.Modify(x => x * 10);

var focus = edited.Map(z => z.Focus);  // => Some(30)
var list = edited.Map(z => z.ToSeq()); // => Some([1, 2, 30, 4])
var tooFar = start.Bind(z => z.Left()); // => None

record ListZipper<A>(Seq<A> Before, A Focus, Seq<A> After)
{
    public static Option<ListZipper<A>> From(Seq<A> xs) =>
        xs.Head.Map(h => new ListZipper<A>([], h, xs.Tail));

    public Option<ListZipper<A>> Left() =>
        Before.Head.Map(h => new ListZipper<A>(Before.Tail, h, Focus.Cons(After)));

    public Option<ListZipper<A>> Right() =>
        After.Head.Map(h => new ListZipper<A>(Focus.Cons(Before), h, After.Tail));

    public ListZipper<A> Modify(Func<A, A> f) => this with { Focus = f(Focus) };

    public Seq<A> ToSeq() => toSeq(Before.Reverse()) + Focus.Cons(After);
}
```

The same idea works for trees, where the context is the path back to the root with the siblings at each step. A zipper suits editors and tree walks that make many small nearby changes. A [lens](#lens) is the other common way to edit inside [immutable](#immutability) data: it reaches a fixed part by a path, while a zipper keeps a cursor you move around.

__Further reading__
* [Zipper (data structure)](https://en.wikipedia.org/wiki/Zipper_(data_structure)) on Wikipedia
* [Zippers](https://learnyouahaskell.github.io/zippers.html) in Learn You a Haskell for Great Good!
* [Functional Pearl: The Zipper](https://www.cambridge.org/core/journals/journal-of-functional-programming/article/zipper/0C058890B8A9B588F26E6D68CF0CE204) by Gérard Huet

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

## Phantom Type

A type parameter that appears in a type but is never used by its data. It holds no values; it only tags the type, so the compiler can tell apart values that have the same representation but must not be mixed. In Haskell, `newtype Distance unit = Distance Double` never stores a `unit`.

```csharp
var run = new Distance<Metres>(5000);
var walk = new Distance<Metres>(1200);
var total = Add(run, walk); // => Distance { Value = 6200 }

var mast = new Distance<Feet>(100);
// Add(run, mast);          // compile error: Metres and Feet don't match
var inMetres = Add(run, ToMetres(mast)).Value; // => 5030.48

// Both arguments must carry the same unit
Distance<U> Add<U>(Distance<U> a, Distance<U> b) => new(a.Value + b.Value);
Distance<Metres> ToMetres(Distance<Feet> d) => new(d.Value * 0.3048);

record Distance<TUnit>(double Value);
abstract class Metres;
abstract class Feet;
```

`Metres` and `Feet` are never instantiated: they exist only to be type arguments. The same trick can track a value's state, so that a function only accepts values that have been through a particular step:

```csharp
var email = new Email<Unverified>("ada@example.com");
var verified = Verify(email, "1234").Map(Welcome); // => Some(Welcome, ada@example.com)
// Welcome(email);  // compile error: not verified yet

Option<Email<Verified>> Verify(Email<Unverified> e, string code) =>
    code == "1234" ? Some(new Email<Verified>(e.Address)) : None;
string Welcome(Email<Verified> e) => $"Welcome, {e.Address}";

record Email<TState>(string Address);
abstract class Unverified;
abstract class Verified;
```

It costs nothing at run time beyond the wrapper, and the check is entirely at compile time. To stop other code creating an `Email<Verified>` directly, combine it with a [smart constructor](#smart-constructor). A phantom type is often added to a [newtype](#newtype), and the idea is similar in spirit to F#'s units of measure.

__Further reading__
* [Phantom type](https://wiki.haskell.org/Phantom_type) on the Haskell Wiki

## Newtype

A wrapper around a single value that gives it a distinct type, without changing its representation. A `CustomerId` and an `OrderId` may both be `int`s underneath, but as separate types the compiler stops you passing one where the other is expected. In Haskell, `newtype CustomerId = CustomerId Int` is erased at compile time, so the wrapper costs nothing at run time.

C# has no `newtype` keyword. The closest is a `readonly record struct` with one field: it has the same size as the value it wraps, isn't allocated on the heap, and gets equality and `ToString` for free:

```csharp
var customer = new CustomerId(7);
var order = new OrderId(7);

string Lookup(CustomerId id) => $"customer {id.Value}";
Lookup(customer);  // => "customer 7"
// Lookup(order);  // compile error: an OrderId is not a CustomerId
// Lookup(7);      // compile error: neither is a bare int

var same = customer == new CustomerId(7); // => true

readonly record struct CustomerId(int Value);
readonly record struct OrderId(int Value);
```

language-ext v5's closest equivalent is its domain-type traits in `LanguageExt.Traits.Domain`: `DomainType<SELF, REPR>` converts to and from the underlying representation, and `Identifier<SELF>` adds equality. `From` returns a `Fin`, so it can validate, but here the positional constructor is still public, so nothing forces callers through it (see [Smart Constructor](#smart-constructor) for closing that gap):

```csharp
using LanguageExt.Traits.Domain;

var ticket = TicketId.From(42); // => Succ(TicketId { Value = 42 })
var bad = TicketId.From(-1);    // => Fail(ticket ids are positive)

readonly record struct TicketId(int Value) : Identifier<TicketId>, DomainType<TicketId, int>
{
    public static Fin<TicketId> From(int repr) =>
        repr > 0 ? new TicketId(repr) : Error.New("ticket ids are positive");
    public int To() => Value;
}
```

A newtype is often the base for a [phantom type](#phantom-type) or a [refinement type](#refinement-type), and it is how Haskell gives one type several [type class](#type-class) instances (`Sum` and `Product` are both `newtype`s over numbers, with different [Monoid](#monoid) instances).

__Further reading__
* [Newtype](https://wiki.haskell.org/Newtype) on the Haskell Wiki
* [Domain types](https://github.com/louthy/language-ext/tree/v5.0.0-beta-77/LanguageExt.Core/Traits/Domain) in language-ext
* [Designing with types: Making illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/) by Scott Wlaschin

## Smart Constructor

A function that is the only way to create a value of a type, and that checks the value is valid first. The real constructor is private, and the public factory returns an [Option](#option), [Either](#either), `Fin` or `Validation`, so an invalid input becomes a value the caller has to handle rather than an exception. Every value of the type that exists has passed the check, so code that receives one doesn't need to check again. This is the everyday way to "make illegal states unrepresentable".

```csharp
var ok = Age.From(36).Map(a => a.Value);  // => Succ(36)
var bad = Age.From(-3).Map(a => a.Value); // => Fail(-3 is not a valid age)
// new Age(36);                           // compile error: the constructor is private

sealed record Age
{
    public int Value { get; }
    private Age(int value) => Value = value;

    public static Fin<Age> From(int value) =>
        value is >= 0 and <= 150 ? new Age(value) : Error.New($"{value} is not a valid age");
}
```

Two C# details matter. A positional record (`record Age(int Value)`) would let anyone write `age with { Value = -3 }`, so `Value` is a get-only property instead. And a struct always has a `default` value that skips the constructor, so a struct smart-constructed type has to treat `default` as valid, or use a class.

Once values are checked at the edge, they combine without further checks, for example with LINQ:

```csharp
var person = from name in Name.From("Ada")
             from age in Age.From(36)
             select $"{name.Value}, {age.Value}"; // => Succ(Ada, 36)

sealed record Name
{
    public string Value { get; }
    private Name(string value) => Value = value;

    public static Fin<Name> From(string value) =>
        string.IsNullOrWhiteSpace(value) ? Error.New("name is empty") : new Name(value.Trim());
}
```

This is the idea behind "Parse, don't validate": instead of checking data and passing the unchanged input on, turn it into a type that records the check. It is the closest C# gets to a [dependent type](#dependent-type) or a [refinement type](#refinement-type), with the check done once at run time instead of proved by the compiler.

__Further reading__
* [Smart constructors](https://wiki.haskell.org/Smart_constructors) on the Haskell Wiki
* [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) by Alexis King
* [Designing with types: Making illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/) by Scott Wlaschin

## Refinement Type

A type together with a [predicate](#predicate) its values must satisfy, written like a set: `{ x : int | x > 0 }` is the type of positive ints. The compiler proves that every value given that type meets the predicate, usually with an automatic theorem prover (an SMT solver), so a division by a `Pos` can never divide by zero, and the proof costs nothing at run time. Liquid Haskell adds refinement types to Haskell, and F* has them built in:

```
{-@ type Pos = { v : Int | v > 0 } @-}

{-@ divide :: Int -> Pos -> Int @-}
divide :: Int -> Int -> Int
divide x y = x `div` y

ok  = divide 10 2   -- accepted
bad = divide 10 0   -- rejected at compile time: 0 is not a Pos
```

They sit between ordinary types and [dependent types](#dependent-type): the predicates can mention values, but are limited to what the solver can decide (arithmetic, comparisons, lengths), which keeps checking automatic.

C# can't prove predicates, but a [smart constructor](#smart-constructor) can check them once and let the type remember the result. With a static abstract interface member, the predicate itself can be a type argument, used only as a [phantom type](#phantom-type):

```csharp
var ten = Refined<int, Positive>.From(10).Map(y => Divide(100, y)); // => Some(10)
var zero = Refined<int, Positive>.From(0).Map(y => Divide(100, y)); // => None

// Can't divide by zero: the type says y > 0
int Divide(int x, Refined<int, Positive> y) => x / y.Value;

interface IPredicate<T> { static abstract bool Holds(T value); }

sealed class Positive : IPredicate<int> { public static bool Holds(int x) => x > 0; }

sealed class Refined<T, P> where P : IPredicate<T>
{
    public T Value { get; }
    private Refined(T value) => Value = value;

    public static Option<Refined<T, P>> From(T value) =>
        P.Holds(value) ? Some(new Refined<T, P>(value)) : None;
}
```

The difference from a real refinement type is where the check happens: here at run time, once per value, with an `Option` to handle; with Liquid Haskell, at compile time, for every call.

__Further reading__
* [Refinement type](https://en.wikipedia.org/wiki/Refinement_type) on Wikipedia
* [LiquidHaskell](https://ucsd-progsys.github.io/liquidhaskell/) by the UCSD Programming Systems group
* [F*](https://fstar-lang.org/) on fstar-lang.org

## Dependent Type

A type that depends on a value. In C#, types can depend on other types (`Seq<int>`), but values can't appear in a type. With dependent types they can, so a type can say "a list of exactly 3 ints" or "an index less than the length of this array", and the compiler checks it.

Languages such as Idris, Agda and Lean have them. Here is a vector in Idris whose length is part of its type:

```
data Vect : Nat -> Type -> Type where
  Nil  : Vect Z a
  (::) : a -> Vect k a -> Vect (S k) a

-- Only accepts vectors with at least one element, so it can't fail
head : Vect (S n) a -> a

-- The result's length is the sum of the inputs' lengths
append : Vect n a -> Vect m a -> Vect (n + m) a
```

`head` is a [total function](#total-function) without returning an [Option](#option): calling it on an empty vector is a type error, not a run-time one. A wrong `append` that dropped an element wouldn't compile, because its result wouldn't have length `n + m`.

C# can't express this, but the same idea guides everyday design: when a rule matters, make a type that can only hold values that follow it. The type can't carry a length, but it can guarantee "at least one":

```csharp
// A sequence that can't be empty, so Head needs no Option
record NonEmpty<A>(A Head, Seq<A> Tail)
{
    public int Count => 1 + Tail.Count;
}

// The check happens once, where the value is made
Option<NonEmpty<A>> FromSeq<A>(Seq<A> xs) =>
    xs.Head.Map(h => new NonEmpty<A>(h, xs.Tail));

var first = FromSeq(Seq(3, 1, 2)).Map(ne => ne.Head); // => Some(3)
var none  = FromSeq(Seq<int>()).Map(ne => ne.Head);   // => None
```

The difference is where the proof lives. Here the check runs once when the value is built, and the type remembers the result. With dependent types, the compiler proves it, even for values that are only known at run time.

__Further reading__
* [Dependent type](https://en.wikipedia.org/wiki/Dependent_type) on Wikipedia
* [Types and Functions](https://idris2.readthedocs.io/en/latest/tutorial/typesfuns.html) in the Idris 2 tutorial
* [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) by Alexis King

## Existential Type

A type that says "there exists some type `T`" without saying which one. A value of an existential type is a package: a value of a hidden type, together with the operations that work on it. Code that receives the package can use those operations, but can never learn what `T` was. It is the mirror image of a generic (universal) type: `Func<T, T>` with `T` generic means "for every `T` the caller picks", while an existential means "for one `T` the producer picked and isn't telling".

In Haskell the hidden type is written with `forall` on the constructor:

```
data Counter = forall s. MkCounter s (s -> s) (s -> String)

counters :: [Counter]
counters = [MkCounter 0 (+1) show, MkCounter "" ('*':) id]
```

C# has no syntax for this, but an interface does the same job. A generic class packs the state and its operations, and a non-generic interface is all the outside world sees, so values with different hidden types fit in one list:

```csharp
var counters = Seq<ICounter>(
    new Counter<int>(0, n => n + 1, n => n.ToString()),
    new Counter<string>("", s => s + "*", s => s));

// Only Next and Show are available; the state type is out of reach
var shown = counters.Map(c => c.Next().Next().Show()).ToArray(); // => ["2", "**"]

interface ICounter
{
    ICounter Next();
    string Show();
}

// S is chosen when the counter is made, then hidden behind ICounter
record Counter<S>(S State, Func<S, S> Step, Func<S, string> Render) : ICounter
{
    public ICounter Next() => this with { State = Step(State) };
    public string Show() => Render(State);
}
```

A closure gives the same effect without a class: a `Func<string>` that captured an `int` hides the `int` just as well. Hiding the type is what makes the package abstract. As with [parametricity](#parametricity), not being able to inspect `S` is a guarantee: callers can't depend on how the state is represented, so it can change freely. (In C# a caller could still cast or use reflection to look inside, which is a convention break rather than a type error.)

__Further reading__
* [Existential type](https://wiki.haskell.org/Existential_type) on the Haskell wiki
* [Existentially quantified types](https://en.wikibooks.org/wiki/Haskell/Existentially_quantified_types) on Wikibooks

## Rank-N Type

A type in which a function's argument is itself generic. An ordinary generic function is rank 1: the caller picks the type arguments. In a rank-2 function, one of the arguments must work for every type, and the function being called decides which types to use it at. Rank-N allows that nesting to any depth.

In Haskell, `forall` marks where the type is chosen. Moving it inside an argument's parentheses raises the rank:

```
-- Rank 1: the caller picks a
reverse :: forall a. [a] -> [a]

-- Rank 2: f must work for every a, because applyToBoth uses it at Int and at String
applyToBoth :: (forall a. [a] -> [a]) -> ([Int], [String]) -> ([Int], [String])
applyToBoth f (xs, ys) = (f xs, f ys)
```

C# can't write this with delegates: a lambda or `Func` always has fixed types, so a parameter of type `Func<Seq<A>, Seq<A>>` only works for the one `A` its caller chose. A generic method can be polymorphic, though, and an interface with a generic method can be passed as an argument. That interface stands in for the rank-2 argument:

```csharp
(Seq<int>, Seq<string>) ApplyToBoth(ISeqFunction f, Seq<int> xs, Seq<string> ys) =>
    (f.Apply(xs), f.Apply(ys));

var both = ApplyToBoth(new FirstTwo(), Seq(1, 2, 3), Seq("a", "b", "c"));
var ints = both.Item1;    // => [1, 2]
var strings = both.Item2; // => [a, b]

// Any implementation has to work for every A, which is the rank-2 promise
interface ISeqFunction
{
    Seq<A> Apply<A>(Seq<A> xs);
}

class FirstTwo : ISeqFunction
{
    public Seq<A> Apply<A>(Seq<A> xs) => xs.Take(2);
}
```

The same shape appears one kind up. A [natural transformation](#natural-transformation) is rank 2: it has to turn `F<A>` into `G<A>` for every `A`. language-ext declares it as the trait `Natural<F, G>` with the generic method `K<G, A> Transform<A>(K<F, A> fa)`, using [higher-kinded types](#higher-kinded-type) for `F` and `G` and a generic method for the inner `forall`.

__Further reading__
* [Rank-N types](https://wiki.haskell.org/Rank-N_types) on the Haskell wiki
* [Higher-rank polymorphism](https://en.wikipedia.org/wiki/Parametric_polymorphism#Higher-rank_polymorphism) on Wikipedia

## Generalized Algebraic Data Type

An [algebraic data type](#algebraic-data-type) whose constructors can each fix the type parameter to something specific. In an ordinary generic [sum type](#sum-type), such as `Option<A>`, every case has the same `A`. In a GADT (generalized algebraic data type), one case can build an `Expr<int>` and another an `Expr<bool>`, and matching on a case tells the compiler which one it has.

The classic use is a typed expression language, where ill-typed expressions can't be built at all:

```
data Expr a where
  IntLit  :: Int -> Expr Int
  BoolLit :: Bool -> Expr Bool
  Add     :: Expr Int -> Expr Int -> Expr Int
  IsZero  :: Expr Int -> Expr Bool
  If      :: Expr Bool -> Expr a -> Expr a -> Expr a

eval :: Expr a -> a
eval (IntLit n)  = n            -- here the compiler knows a is Int
eval (BoolLit b) = b            -- and here that a is Bool
eval (Add x y)   = eval x + eval y
eval (IsZero x)  = eval x == 0
eval (If c t e)  = if eval c then eval t else eval e
```

C# can encode the data with an abstract generic record and subclasses that pick the type argument. What it can't do is the refinement: in a `switch` over an `Expr<T>`, matching `IntLit` doesn't teach the compiler that `T` is `int`, so returning `i.Value` as a `T` needs a cast through `object`. A virtual method per case avoids the problem, because each override already knows its own `T`:

```csharp
var expr = new If<int>(
    new IsZero(new Add(new IntLit(2), new IntLit(-2))),
    new IntLit(10),
    new IntLit(20));

var result = expr.Eval(); // => 10
var isZero = new IsZero(new IntLit(5)).Eval(); // => false

// Rejected by the compiler: Add needs Expr<int>, not Expr<bool>
// new Add(new IntLit(1), new BoolLit(true));

abstract record Expr<T>
{
    public abstract T Eval();
}

record IntLit(int Value) : Expr<int> { public override int Eval() => Value; }

record BoolLit(bool Value) : Expr<bool> { public override bool Eval() => Value; }

record Add(Expr<int> Left, Expr<int> Right) : Expr<int> { public override int Eval() => Left.Eval() + Right.Eval(); }

record IsZero(Expr<int> Value) : Expr<bool> { public override bool Eval() => Value.Eval() == 0; }

record If<T>(Expr<bool> Cond, Expr<T> Then, Expr<T> Else) : Expr<T> { public override T Eval() => Cond.Eval() ? Then.Eval() : Else.Eval(); }
```

`Eval` returns a plain `int` or `bool`, with no `object`, no casts and no "type error" case. Moving the operation into the cases trades one side of the [expression problem](#expression-problem) for the other: a new operation now means touching every case.

__Further reading__
* [Generalized algebraic data type](https://en.wikipedia.org/wiki/Generalized_algebraic_data_type) on Wikipedia
* [GADT](https://en.wikibooks.org/wiki/Haskell/GADT) on Wikibooks

## Type Inference

The compiler working out types that the code doesn't write down. How much it can work out varies a lot between languages.

ML, OCaml, F# and Haskell use Hindley-Milner inference, which can find the most general type of a whole function from how its arguments are used, with no annotations at all:

```
compose f g x = f (g x)
-- inferred: compose :: (b -> c) -> (a -> b) -> a -> c
```

C# inference is local: it works within one expression or statement, from the types already known around it, and member signatures are always written out. Within those limits it does a lot:

```csharp
var count = 42;            // int, from the literal
var xs = Seq(1, 2, 3);     // Seq<int>: A inferred from the arguments
var doubled = xs.Map(x => x * 2); // => [2, 4, 6]
// x is an int because xs is a Seq<int>; Map's B is int because x * 2 is

// C# 10+: a lambda with typed parameters has a natural type, Func<string, int>
var parse = (string s) => int.Parse(s);
var seven = parse("7"); // => 7

// The target type can fill in what the expression alone can't
Option<int> nothing = None;
var orZero = nothing.IfNone(0); // => 0
```

It stops where there is nothing local to infer from:

```csharp
// var inc = x => x + 1;          // error: no type for x
// var empty = Seq();             // error: no element type; write Seq<int>()
// int n = Parse<int>("1") works, but int m = Parse("1") doesn't:
//   C# never infers a type argument from the return type alone
T Parse<T>(string s) where T : IParsable<T> => T.Parse(s, null);

var one = Parse<int>("1"); // => 1
```

The trade-off is deliberate. Whole-program inference makes types almost invisible, while C#'s style keeps every member's [type signature](#type-signatures) written down as documentation and keeps error messages close to the mistake.

__Further reading__
* [Hindley-Milner type system](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) on Wikipedia
* [Natural type of a lambda expression](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions#natural-type-of-a-lambda-expression) on Microsoft Learn

## Structural Typing

Deciding whether types are compatible by their shape (the members they have) instead of by their name. In a structural type system, anything with an `X` and a `Y` of the right types is a point. In a nominal type system, the one C# uses, only types declared as related are compatible, however similar they look.

TypeScript and OCaml are structural:

```
// TypeScript: any object with the right fields is a Point
interface Point { x: number; y: number }
const size = { x: 1, y: 2, label: "size" };
const p: Point = size; // fine, the shape fits

(* OCaml: area accepts any object with width and height methods *)
let area o = o#width * o#height
(* area : < height : int; width : int; .. > -> int *)
```

In C#, two records with identical fields are still different types:

```csharp
// Point p = new Size(1, 2); // error: cannot convert Size to Point
var p = new Point(1, 2);
var s = new Size(1, 2);
var equal = p.Equals(s); // => false

record Point(int X, int Y);
record Size(int X, int Y);
```

C# does have structural corners. Tuple types are compatible by element types, ignoring names. And several language features look for methods by name and shape instead of requiring an interface: `foreach` needs a `GetEnumerator()`, `await` needs a `GetAwaiter()`, and LINQ query syntax needs `Select` and `SelectMany`. That last one is how language-ext types such as `Option` and `Eff` work with `from ... select`, and any type can join in:

```csharp
(int X, int Y) point = (1, 2);
(int Width, int Height) size = point; // fine: same shape, names ignored

// No interface needed: query syntax only looks for Select and SelectMany
var total =
    from a in new Box<int>(20)
    from b in new Box<int>(22)
    select a + b;
var value = total.Value; // => 42

record Box<A>(A Value)
{
    public Box<B> Select<B>(Func<A, B> f) => new(f(Value));
    public Box<C> SelectMany<B, C>(Func<A, Box<B>> bind, Func<A, B, C> project) =>
        new(project(Value, bind(Value).Value));
}
```

Nominal typing makes intent explicit (a `CustomerId` is not an `OrderId`, even if both wrap an `int`, which is the point of a [newtype](#newtype)), while structural typing makes it easy to use values with types written by someone else.

__Further reading__
* [Structural type system](https://en.wikipedia.org/wiki/Structural_type_system) on Wikipedia
* [Nominal type system](https://en.wikipedia.org/wiki/Nominal_type_system) on Wikipedia

## Linear Type

A type whose values must be used exactly once: not copied, not dropped. If a file handle has a linear type, the compiler can check that every handle is closed, and closed only once, and that nothing uses it afterwards. Affine types are the relaxed version, at most once, which is what Rust's ownership gives you. Together they are called substructural types.

```
// Rust: assigning a String moves it, and the old name can't be used again
let s = String::from("hi");
let t = s;
println!("{}", s); // error: borrow of moved value `s`

-- Linear Haskell: %1 -> promises to use the argument exactly once
swap :: (a, b) %1 -> (b, a)
swap (x, y) = (y, x)
```

C# has no linear types. `using` and `IDisposable` make cleanup routine, but nothing stops code from using a value after it has been disposed; that is found at run time:

```csharp
string WriteAfterDispose()
{
    var stream = new MemoryStream();
    stream.Dispose();
    try { stream.WriteByte(1); return "wrote"; }
    catch (ObjectDisposedException) { return "disposed"; }
}

var outcome = WriteAfterDispose(); // => "disposed"
```

The nearest compile-time checks are the restrictions on `ref struct` types such as `Span<T>`: they can't be boxed, captured by a lambda or stored on the heap, so they can't outlive the stack frame. That limits where a value can go, not how many times it is used, so it is not linearity.

__Further reading__
* [Substructural type system](https://en.wikipedia.org/wiki/Substructural_type_system) on Wikipedia
* [Linear types](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/linear_types.html) in the GHC User's Guide
* [What is ownership?](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) in The Rust Programming Language

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

Before C# 15, the usual model is an abstract record with one derived record per case:

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

The `_` arm is there because the compiler can't know the hierarchy is closed: anyone could add another record that derives from `WeakLogic`.

Sum types are sometimes called union types, discriminated unions, or tagged unions.

**Union types in C# 15.** C# 15 (.NET 11) adds the `union` keyword. A union lists the types a value can be, and the compiler knows that list is complete, so a `switch` needs no `_` arm, and leaving out a case is a warning:

```csharp
// The cases are existing types; the union just says "one of these"
string Rate(Logic l) => l switch
{
    Known(true)  => "true",
    Known(false) => "false",
    HalfTrue     => "half-true",
};

Rate(new HalfTrue()); // => "half-true"

// Any type can be a case, including ones you don't own
IntOrText id = 42;
var shown = id switch { int n => $"#{n}", string s => s }; // => "#42"

union Logic(Known, HalfTrue);
union IntOrText(int, string);
```

Each case converts to the union implicitly, and patterns look inside it, so `HalfTrue` matches a `Logic` holding a `HalfTrue`. Two things follow from the cases being types rather than names. A union can't tell apart two cases that hold the same type, so each case needs its own type, as with `Known` and `HalfTrue`. And the generated union is a struct that keeps its value in an `object?` property, so a value type such as `int` is boxed, and `default(IntOrText)` holds `null`.

**OneOf.** Before C# 15, the [OneOf](https://github.com/mcintyre321/OneOf) library was the usual way to get union types in C#. `OneOf<T0, T1, ...>` is a struct with one case per type parameter, and `Match` takes one function per case:

```csharp
using OneOf;
using OneOf.Types;

OneOf<int, string> userId = "ada";
var label = userId.Match(n => $"#{n}", s => $"@{s}"); // => "@ada"

// A named union, generated from OneOfBase
Payment paid = new Cash(9.99m);
var how = paid.Match(card => $"card {card.Last4}", cash => $"cash {cash.Amount}"); // => "cash 9.99"

// Ready-made case types for common results
OneOf<int, NotFound> Find(string name) => name == "ada" ? 1 : new NotFound();
var found = Find("bob").Match(n => $"#{n}", _ => "not found"); // => "not found"

// TryPick takes one case out and narrows the rest
OneOf<int, string, bool> answer = true;
var narrowed = answer.TryPickT0(out var number, out var others)
    ? $"number {number}"
    : others.Match(s => "text", b => $"bool {b}"); // => "bool True"

record Card(string Last4);
record Cash(decimal Amount);
[GenerateOneOf]
partial class Payment : OneOfBase<Card, Cash>;
```

Now that unions are built in, these are the things OneOf still offers:

* It runs on any .NET version, back to .NET Framework 3.5, so it suits libraries that can't require .NET 11.
* `Match` and `Switch` take one function per case, so a missing case is a compile error, where a `switch` on a union only warns.
* Cases are distinguished by position, not type. `OneOf<string, string>` is valid (built with `FromT0` and `FromT1`), which a union can't express.
* `TryPickT0` and the other `TryPick` methods split one case off and narrow the rest, as above, and `MapT0`, `MapT1` and so on change one case and leave the others alone.
* Each case is stored in its own field, so value types aren't boxed.
* `OneOf.Types` has ready-made case types (`None`, `NotFound`, `Success`, `Error<T>`, `Unknown` and others).

The built-in union has the language on its side: full pattern matching with nested and positional patterns (`Known(true)`), no lambdas, any number of cases (`OneOf` goes up to 9, with more in the OneOf.Extended package), and no package to depend on.

Neither gives you composition. language-ext's [Option](#option) and [Either](#either) are ready-made sum types that are also [functors](#functor) and [monads](#monad), so a chain of steps that can each fail is written with `Map`, `Bind` or LINQ, rather than a `switch` after every step.

__Further reading__
* [Union types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/union) in the C# language reference
* [Explore union types in C# 15](https://devblogs.microsoft.com/dotnet/csharp-15-union-types/) on the .NET Blog
* [OneOf](https://github.com/mcintyre321/OneOf) on GitHub

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

## Pattern Matching

Taking data apart by its shape: testing which case a value is, and pulling out the pieces you need, in one step. It is how functional languages consume [algebraic data types](#algebraic-data-type), and C# has grown most of it: `switch` expressions with type, property, positional, relational and list patterns, combined with `and`, `or` and `not`, plus `when` guards for anything a pattern can't say.

```csharp
string Size(int n) => n switch
{
    < 0           => "negative",
    0             => "zero",
    > 0 and < 10  => "small",
    _             => "large"
};

string Ends(int[] xs) => xs switch
{
    []                        => "empty",
    [var only]                => $"just {only}",
    [var first, .., var last] => $"{first} to {last}"
};

string Greet(Person p) => p switch
{
    { Age: < 18 }                       => $"Hi {p.Name}",
    (var name, _) when name.Length > 10 => "Hello",
    (var name, _)                       => $"Hello {name}"
};

Size(7);                          // => "small"
Ends([3, 1, 4]);                  // => "3 to 4"
Greet(new Person("Ada", 36));     // => "Hello Ada"

record Person(string Name, int Age);
```

The compiler checks that a `switch` expression covers every case, and warns when it doesn't. With a [sum type](#sum-type) declared as a C# 15 `union`, it knows the full list of cases, so no `_` arm is needed, and adding a case later produces a warning at every `switch` that misses it:

```csharp
string Describe(Shape s) => s switch
{
    Circle(var r)                    => $"circle of radius {r}",
    Rect(var w, var h) when w == h   => $"square of side {w}",
    Rect(var w, var h)               => $"{w} by {h} rectangle"
};

Describe(new Rect(2, 2)); // => "square of side 2"

union Shape(Circle, Rect);
record Circle(double Radius);
record Rect(double Width, double Height);
```

language-ext's [Option](#option) and [Either](#either) offer the same thing as a `Match` method, with one function per case. Leaving a case out is a compile error, since every argument is required:

```csharp
var greeting = Some("Ada").Match(Some: n => $"Hi {n}", None: () => "Hi stranger"); // => "Hi Ada"

Either<string, int> parsed = Right(42);
var shown = parsed.Match(Left: e => $"error: {e}", Right: n => $"got {n}"); // => "got 42"

// Either's cases are records, so ordinary patterns work too
int Doubled(Either<string, int> e) => e switch
{
    Either<string, int>.Right(var n) => n * 2,
    _                                => 0
};
Doubled(parsed); // => 84
```

__Further reading__
* [Pattern matching overview](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/patterns/pattern-matching) on Microsoft Learn
* [C# Functional Programming In-Depth (15) Pattern matching](https://codingonwheels.com/posts/csharp-functional-programming-pattern-matching/) on CodingOnWheels

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

## Expression Tree

Code represented as data. When a lambda is assigned to an `Expression<Func<...>>` instead of a `Func<...>`, the C# compiler doesn't compile it to a method; it builds a tree of objects describing it (a multiplication, whose left and right are the parameter `x`), which your program can inspect, transform, translate or compile at run time:

```csharp
using System.Linq.Expressions;

Expression<Func<int, int>> square = x => x * x;

var text = square.Body.ToString(); // => "(x * x)"
var kind = square.Body.NodeType;   // => Multiply
var nine = square.Compile()(3);    // => 9

// Trees can also be built by hand
var n = Expression.Parameter(typeof(int), "n");
var plusOne = Expression.Lambda<Func<int, int>>(Expression.Add(n, Expression.Constant(1)), n);
var shown = plusOne.ToString();    // => "n => (n + 1)"
```

Because it is data, a tree can be given meaning by more than one interpreter. `Compile` is one; a small evaluator written with [pattern matching](#pattern-matching) is another; and LINQ providers such as Entity Framework are a third, translating the same `x => x.Age > 18` into SQL instead of running it:

```csharp
int Eval(Expression e, int x) => e switch
{
    ConstantExpression c                                  => (int)c.Value!,
    ParameterExpression                                   => x,
    BinaryExpression { NodeType: ExpressionType.Add } b      => Eval(b.Left, x) + Eval(b.Right, x),
    BinaryExpression { NodeType: ExpressionType.Multiply } b => Eval(b.Left, x) * Eval(b.Right, x),
    _ => throw new NotSupportedException(e.NodeType.ToString())
};

Eval(square.Body, 7);  // => 49
Eval(plusOne.Body, 7); // => 8
```

Representing programs as data is an old FP idea. In Lisp, code is written as lists, the language's main data structure, so programs can build and rewrite other programs; this is called homoiconicity. Typed functional programs do the same with an abstract syntax tree and an interpreter for it, which is the idea behind the [Free Monad](#free-monad): describe a program as data first, and decide what it means later.

__Further reading__
* [Expression trees](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/expression-trees/) on Microsoft Learn
* [C# Functional Programming In-Depth (7) Expression Tree: Function as Data](https://codingonwheels.com/posts/csharp-functional-programming-function-as-data-and-expression-tree/) on CodingOnWheels
* [Homoiconicity](https://en.wikipedia.org/wiki/Homoiconicity) on Wikipedia

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
Fortunately a partial function can be converted to a regular (or total) one. We can provide default values or use guards to deal with inputs for which the (previously) partial function is undefined. Utilizing the [`Option`](#option) type, we can yield either `Some(value)` or `None` where we would otherwise have behaved unexpectedly:

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
