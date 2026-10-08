# Function Combinators in C#

A C#-centred take on Avaq's [Common combinators in JavaScript](https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45).

A [functional combinator](readme.md#functional-combinator) is a higher-order function that builds a new function only out of the functions and values it is given. The classics have single-letter names from combinatory logic, and bird names from Raymond Smullyan's *To Mock a Mockingbird* (K is the Kestrel, S the Starling, and so on).

JavaScript defines them as curried, untyped lambdas. C# is typed, so each combinator here is a small generic function. They take ordinary multi-argument `Func`s, because that is how C# code is usually written; [currying](readme.md#currying) them is a `curry` call away.

## Reference

| Name         | #       | [Haskell](https://www.haskell.org/) | [language-ext](https://github.com/louthy/language-ext) | Signature
|-------------:|:--------|------------------------------|---------------------------------------------|----------
| identity     | **I**   | `id`                         | `identity`, `Combinators<A>.I`              | `a → a`
| constant     | **K**   | `const`                      | `constant`, `Combinators<A, B>.K`           | `a → b → a`
| apply        | **A**   | `($)`                        | ¹                                           | `(a → b) → a → b`
| thrush       | **T**   | `(&)`                        | `Combinators<A, B>.T`                       | `a → (a → b) → b`
| duplication  | **W**   | `join`²                      |                                             | `(a → a → b) → a → b`
| flip         | **C**   | `flip`                       | `flip`                                      | `(a → b → c) → b → a → c`
| compose      | **B**   | `(.)`, `fmap`²               | `BackCompose`, `compose`³                   | `(b → c) → (a → b) → a → c`
| substitution | **S**   | `(<*>)`²                     | `Combinators<A, B, C>.S`, `Apply`²          | `(a → b → c) → (a → b) → a → c`
| chain⁴       | **S_**  | `(=<<)`²                     | `Bind`²                                     | `(b → a → c) → (a → b) → a → c`
| converge⁴    | **S2**  | `liftA2`²                    | `Applicative.lift`²                         | `(b → c → d) → (a → b) → (a → c) → a → d`
| psi          | **P**   | `on`                         |                                             | `(b → b → c) → (a → b) → a → a → c`
| fix-point⁵   | **Y**   | `fix`                        | `Combinators<A, B, C>.Y`                    | `(a → a) → a`

¹) In C# applying a function is just `f(x)`. A named `Apply` only earns its keep when you want to pass "application" itself around as a function.

²) These are really the operations of an algebra (`Apply`, `Bind`, `lift`) specialised to functions. language-ext implements them for every [applicative](readme.md#applicative-functor) and [monad](readme.md#monad), such as `Option`, `Seq` and `Reader`; on plain functions they behave like the combinators here.

³) language-ext's `compose(f, g)` runs left to right (`f` first), which makes it the flipped B, also known as the Q (Queer) bird, `Combinators<A, B, C>.Q`. `g.BackCompose(f)` is B: `f` first, then `g`.

⁴) Avaq could find no consistent name for these two, so named them for the implementation. The names are kept here.

⁵) C#, like JavaScript, evaluates eagerly, so the textbook Y combinator would loop forever. The strict version, known as the Z combinator, wraps the self-application in a lambda to delay it. language-ext's `Combinators.Y` takes a shortcut and simply calls itself by name.

## The combinators

Each sample below stands alone: it defines the combinator as a generic local function, then uses it. A `// => value` comment shows the result.

### I - identity

Returns its argument unchanged. Handy as the "do nothing" function wherever a function is required.

```csharp
A Identity<A>(A x) => x;

Identity(42);                                // => 42
Seq(1, 2, 3).Map(Identity);                  // => [1, 2, 3]
```

### K - constant

Takes a value and returns a function that ignores its argument and always returns that value.

```csharp
Func<B, A> Constant<A, B>(A x) => _ => x;

Seq(1, 2, 3).Map(Constant<string, int>("x")); // => [x, x, x]
Seq(1, 2, 3).Map(constant<string, int>("x")); // => [x, x, x]
```

### A - apply

Applies a function to a value.

```csharp
B Apply<A, B>(Func<A, B> f, A x) => f(x);

Func<int, int> inc = x => x + 1;

Apply(inc, 1); // => 2
```

### T - thrush

Apply with the arguments swapped: the value first, then the function. Applied to a sequence of functions, it is a pipeline.

```csharp
B Thrush<A, B>(A x, Func<A, B> f) => f(x);

Func<int, int> inc = x => x + 1;
Func<int, int> dbl = x => x * 2;

Thrush(Thrush(5, inc), dbl);                 // => 12
Combinators<int, int>.T(5)(inc);             // => 6
```

### W - duplication

Passes one argument to a two-argument function twice.

```csharp
Func<A, B> Duplicate<A, B>(Func<A, A, B> f) => x => f(x, x);

Func<int, int, int> mul = (a, b) => a * b;
var square = Duplicate(mul);

square(5); // => 25
```

### C - flip

Swaps the first two arguments of a function.

```csharp
Func<B, A, C> Flip<A, B, C>(Func<A, B, C> f) => (b, a) => f(a, b);

Func<int, int, int> sub = (a, b) => a - b;

sub(10, 1);           // => 9
Flip(sub)(10, 1);     // => -9
flip(sub)(10, 1);     // => -9
```

### B - compose

Combines two functions: `Compose(f, g)` runs `g`, then `f` on the result.

```csharp
Func<A, C> Compose<A, B, C>(Func<B, C> f, Func<A, B> g) =>
    x => f(g(x));

Func<int, int> inc = x => x + 1;
Func<int, int> dbl = x => x * 2;

Compose(inc, dbl)(5);    // => 11
inc.BackCompose(dbl)(5); // => 11
compose(dbl, inc)(5);    // => 11
```

### S - substitution

Feeds the argument to `f` both directly and through `g`: `f(x, g(x))`.

```csharp
Func<A, C> Substitute<A, B, C>(Func<A, B, C> f, Func<A, B> g) =>
    x => f(x, g(x));

Func<int, int, int> sub = (a, b) => a - b;
Func<int, int> dbl = x => x * 2;

Substitute(sub, dbl)(3); // => -3
```

### S_ - chain

S with the order of `f`'s arguments reversed: `f(g(x), x)`. For functions this is exactly what `Bind` does.

```csharp
Func<A, C> Chain<A, B, C>(Func<B, A, C> f, Func<A, B> g) =>
    x => f(g(x), x);

Func<int, int, int> sub = (a, b) => a - b;
Func<int, int> dbl = x => x * 2;

Chain(sub, dbl)(3); // => 3
```

### S2 - converge

Runs two functions on the same argument, then combines their results with a third.

```csharp
Func<A, D> Converge<A, B, C, D>(
    Func<B, C, D> f, Func<A, B> g, Func<A, C> h) =>
    x => f(g(x), h(x));

Func<int, int, int> add = (a, b) => a + b;
Func<int, int> inc = x => x + 1;
Func<int, int> dbl = x => x * 2;

Converge(add, inc, dbl)(5); // => 16
```

For other applicatives, language-ext calls this `lift`:

```csharp
Applicative.lift(add, Some(6), Some(10)); // => Some(16)
```

### P - psi

Applies `g` to both arguments before combining them with `f`. Useful for comparing things "on" some property.

```csharp
Func<A, A, C> Psi<A, B, C>(Func<B, B, C> f, Func<A, B> g) =>
    (x, y) => f(g(x), g(y));

Func<int, int, bool> same = (a, b) => a == b;
Func<string, int> length = s => s.Length;
var sameLength = Psi(same, length);

sameLength("abc", "xyz");  // => true
sameLength("abc", "wxyz"); // => false
```

### Y - fix-point

Gives an anonymous function a way to call itself, which makes recursion possible without naming the function. This is the strict Z variant (see footnote ⁵): `h(h)` is only evaluated when the inner lambda is called.

```csharp
Func<A, B> Fix<A, B>(Func<Func<A, B>, Func<A, B>> f)
{
    SelfApply<A, B> g = h => x => f(h(h))(x);
    return g(g);
}

var factorial = Fix<int, int>(self => n => n <= 1 ? 1 : n * self(n - 1));
factorial(5); // => 120

// language-ext's version passes "self" and the argument together:
var fact = Combinators<int, int, int>.Y(
    (self, n) => n <= 1 ? 1 : n * self(n - 1));
fact(5); // => 120

// A function that takes itself as its argument.
delegate Func<A, B> SelfApply<A, B>(SelfApply<A, B> self);
```

## Further reading

* [Common combinators in JavaScript](https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45) - Avaq's original list, which this page adapts
* [language-ext `Combinators`](https://github.com/louthy/language-ext/blob/main/LanguageExt.Core/Combinators.cs) - typed I, K, T, Q, S, M and Y
* [To Mock a Mockingbird](https://en.wikipedia.org/wiki/To_Mock_a_Mockingbird) - Raymond Smullyan's book of combinator puzzles that named the birds
* [Lambda calculus combinators and birds](http://dkeenan.com/Lambda/) - a table of the bird combinators
* [Collected Lambdas](http://jwodder.freeshell.org/lambda.html) - a collection of noteworthy combinators
* [Combinatory logic](https://en.wikipedia.org/wiki/Combinatory_logic) (Wikipedia)
* [SKI combinator calculus](https://en.wikipedia.org/wiki/SKI_combinator_calculus) (Wikipedia)
* [B, C, K, W system](https://en.wikipedia.org/wiki/B,_C,_K,_W_system) (Wikipedia)
* [Fixed-point combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator) (Wikipedia)
