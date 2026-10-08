# Learning Paths

Guided routes through the [jargon](readme.md). Each path is an ordered list of terms, and each step says why it comes next. They assume you know C#, and nothing about functional programming.

## Functions to monads

From "a function is a value" to LINQ query syntax over `Option` and `IO`. Start here if you're new to functional programming.

1. [Function](readme.md#function): everything else is built from functions that map an input to an output and do nothing else.
2. [Pure Function](readme.md#pure-function): purity is the property that makes functions safe to combine, cache and test.
3. [Lambda](readme.md#lambda): C#'s `x => ...` lets you write a function inline, wherever you need one.
4. [First-Class Function](readme.md#first-class-function): once a function is a value, you can store it, pass it and return it.
5. [Higher-Order Functions (HOF)](readme.md#higher-order-functions-hof): `Select`, `Where` and `Aggregate` are functions that take functions; now you can write your own.
6. [Closure](readme.md#closure): a returned lambda remembers the variables around it, which is how functions get configured.
7. [Partial Application](readme.md#partial-application): fix some arguments now and supply the rest later, which builds on closures.
8. [Currying](readme.md#currying): turning a many-argument function into a chain of one-argument functions makes partial application automatic.
9. [Function Composition](readme.md#function-composition): with one-argument functions, small steps snap together into pipelines.
10. [Functor](readme.md#functor): `Map` composes a function with whatever is inside a box (a list, an `Option`, an `IO`) without opening it.
11. [Applicative Functor](readme.md#applicative-functor): `Map` handles one boxed value; applicative apply combines several independent ones.
12. [Monad](readme.md#monad): `Bind` handles the step functors can't, where the next computation depends on the previous result.
13. [Monad Comprehension](readme.md#monad-comprehension): LINQ's `from ... select` is monad syntax, so chains of `Bind` read like ordinary code.

## Errors without exceptions

Model failure as a value the compiler can see, instead of a `throw` it can't.

1. [Partial function](readme.md#partial-function): `int.Parse` and `list[0]` don't have an answer for every input, and the signature doesn't say so.
2. [Total Function](readme.md#total-function): the goal is a function that returns something for every input it accepts.
3. [Dealing with partial functions](readme.md#dealing-with-partial-functions): the usual fixes are narrowing the input or widening the output; the rest of the path widens the output.
4. [Option](readme.md#option): `Option` widens the output with "no answer" for failures that need no explanation.
5. [Either](readme.md#either): when the caller needs to know why, `Either` carries an error value on the left.
6. [Pattern Matching](readme.md#pattern-matching): `Match` makes the caller handle both cases before getting at the value.
7. [Functor](readme.md#functor): `Map` lets you keep working on the success value and leave the failure untouched.
8. [Monad](readme.md#monad): `Bind` chains steps that can each fail and stops at the first failure, without nested `if`s.
9. [Applicative Functor](readme.md#applicative-functor): validating a form should report every error, not just the first; applicatives combine independent checks.
10. [Alternative](readme.md#alternative): `|` tries a fallback when the first attempt fails.
11. [Fallible](readme.md#fallible): language-ext's trait for "can fail and can catch", shared by `Option`, `Either`, `Eff` and `IO`.
12. [Traversable](readme.md#traversable): `Traverse` turns a list of results that might have failed into one result holding a list.

## Modelling data with types

Make illegal states unrepresentable, so the compiler checks your business rules.

1. [Value](readme.md#value): data in functional code is plain values, compared by what they hold rather than by reference.
2. [Immutability](readme.md#immutability): values that can't change can be shared freely; C# records give you this cheaply.
3. [Product type](readme.md#product-type): a record holds this *and* that, and its possible values multiply.
4. [Sum type](readme.md#sum-type): a union holds this *or* that, which is what products can't express.
5. [Algebraic data type](readme.md#algebraic-data-type): sums of products describe most domain data exactly.
6. [Pattern Matching](readme.md#pattern-matching): `switch` takes an algebraic data type apart, and the compiler warns about cases you missed.
7. [Unit type](readme.md#unit-type): the type with one value stands in for `void`, so every function returns something.
8. [Never type](readme.md#never-type): the type with no values marks code that can't return, and impossible cases.
9. [Newtype](readme.md#newtype): wrap an `int` as a `CustomerId` so it can't be passed where an `OrderId` belongs.
10. [Smart Constructor](readme.md#smart-constructor): validate once when the value is created, and every later use can trust it.
11. [Refinement Type](readme.md#refinement-type): the idea behind smart constructors, a type that is a base type plus a rule.
12. [Phantom Type](readme.md#phantom-type): a type parameter that holds no data can still tag values, so metres and miles can't be added together.
13. [Lens](readme.md#lens): with immutable nested records, lenses read and update deep fields without long `with` chains.

## Category theory for C# developers

The ideas behind the names, using code you already write.

1. [Category](readme.md#category): types as objects and functions as arrows, with composition and identity as the only rules.
2. [Morphism](readme.md#morphism): the arrows; in C# these are mostly functions.
3. [Isomorphism](readme.md#isomorphism): two types are "the same" when you can convert there and back without loss.
4. [Functor](readme.md#functor): a functor maps one category to another and keeps the arrows working; `Map` is that mapping.
5. [Endofunctor](readme.md#endofunctor): C#'s functors all map types to types, so they are endofunctors.
6. [Natural Transformation](readme.md#natural-transformation): a conversion between functors, such as taking the head of a `Seq` as an `Option`, that commutes with `Map`.
7. [Monoid](readme.md#monoid): an associative combine with an identity; you've met it as `+` with `0` and string concatenation.
8. [Monad](readme.md#monad): "a monoid in the category of endofunctors", which makes sense once you've seen the previous three steps.
9. [Kleisli Category](readme.md#kleisli-category): functions that return a monad form their own category, with `Bind` as composition.
10. [Product and Coproduct](readme.md#product-and-coproduct): tuples and unions described by their arrows instead of their fields.
11. [Duality](readme.md#duality): reverse every arrow and products become coproducts; many concepts come in such pairs.
12. [Catamorphism](readme.md#catamorphism): fold, generalised to any recursive data type.
13. [Anamorphism](readme.md#anamorphism): unfold, which is the dual of the fold you just met.
14. [Adjunction](readme.md#adjunction): a pair of functors that are almost inverses; currying is one, and composing the pair always gives a monad (here, State).
15. [Yoneda Lemma](readme.md#yoneda-lemma): a value is determined by how it relates to everything else, which is why any number of `Map`s can fuse into one pass.

## Lambda calculus foundations

The tiny language every functional language is built on.

1. [Lambda](readme.md#lambda): start from the anonymous functions you already write in C#.
2. [Lambda Calculus](readme.md#lambda-calculus): a language with nothing except functions, variables and application.
3. [Free and Bound Variables](readme.md#free-and-bound-variables): a variable is either a parameter of an enclosing lambda or comes from outside; closures capture the outside ones.
4. [Alpha Conversion](readme.md#alpha-conversion): renaming a parameter doesn't change the function, but captured names need care.
5. [Beta Reduction](readme.md#beta-reduction): applying a function means substituting the argument, which is the only computation rule.
6. [Eta Conversion](readme.md#eta-conversion): `x => f(x)` is just `f`, the rule behind point-free style.
7. [Reduction Strategy](readme.md#reduction-strategy): the order you reduce in decides whether a program finishes.
8. [Lazy evaluation](readme.md#lazy-evaluation): reducing only what's needed, the strategy behind `IEnumerable` and Haskell.
9. [Church Encoding](readme.md#church-encoding): booleans, numbers and pairs built out of nothing but functions.
10. [Fixed-Point Combinator](readme.md#fixed-point-combinator): recursion without names, using the Y combinator.
11. [Combinatory Logic](readme.md#combinatory-logic): lambda calculus without variables at all, using only S and K.
12. [Functional Combinator](readme.md#functional-combinator): the same combinators as everyday C# helpers, such as `identity`, `constant` and `flip`.

## Pure core, effectful shell

Keep business logic pure and push I/O to the edges.

1. [Side effects](readme.md#side-effects): name the problem; reading the clock or writing a file makes code hard to test and reason about.
2. [Pure Function](readme.md#pure-function): the opposite, where output depends only on input.
3. [Referential Transparency](readme.md#referential-transparency): pure calls can be replaced by their results, which is what makes refactoring safe.
4. [IO](readme.md#io): describe an effect as a value and run it later, so building the program stays pure.
5. [Reader Monad](readme.md#reader-monad): pass configuration and dependencies implicitly, the functional answer to dependency injection.
6. [Writer Monad](readme.md#writer-monad): collect logs alongside a result without a global logger.
7. [State Monad](readme.md#state-monad): thread changing state through pure steps instead of mutating a field.
8. [Monad Transformer](readme.md#monad-transformer): real code needs reader, state and IO at once; transformers stack them.
9. [Free Monad](readme.md#free-monad): write the program as data and choose the interpreter later, such as real or test.
10. [Algebraic Effects](readme.md#algebraic-effects): the newer approach, where effects are declared operations and handlers decide what they do.
11. [Property-Based Testing](readme.md#property-based-testing): pure cores make it possible to test laws over thousands of generated inputs.
