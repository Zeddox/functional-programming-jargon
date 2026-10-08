const fs = require('fs');
const path = require('path');

const readmePath = fs.existsSync(path.join(__dirname, '../../readme.md'))
  ? path.join(__dirname, '../../readme.md')
  : path.join(__dirname, '../readme.md');
const content = fs.readFileSync(readmePath, 'utf8');

// Category mapping helper
const CATEGORY_MAP = {
  // Core Functions
  'function': 'core-functions',
  'pure-function': 'core-functions',
  'higher-order-functions-hof': 'core-functions',
  'lambda': 'core-functions',
  'closure': 'core-functions',
  'arity': 'core-functions',
  'predicate': 'core-functions',
  'total-function': 'core-functions',
  'partial-function': 'core-functions',
  'dealing-with-partial-functions': 'core-functions',
  'trampoline': 'core-functions',
  'thunk': 'core-functions',

  // Composition & Execution
  'function-composition': 'composition',
  'currying': 'composition',
  'auto-currying': 'composition',
  'partial-application': 'composition',
  'point-free-style': 'composition',
  'functional-combinator': 'composition',
  'continuation': 'composition',
  'lazy-evaluation': 'composition',

  // Purity & State
  'side-effects': 'purity-state',
  'referential-transparency': 'purity-state',
  'equational-reasoning': 'purity-state',
  'idempotence': 'purity-state',
  'value': 'purity-state',
  'constant': 'purity-state',
  'constant-function': 'purity-state',
  'contracts': 'purity-state',
  'memoization': 'purity-state',

  // Category Theory & Morphisms
  'category': 'category-morphisms',
  'semigroupoid': 'category-morphisms',
  'morphism': 'category-morphisms',
  'homomorphism': 'category-morphisms',
  'endomorphism': 'category-morphisms',
  'isomorphism': 'category-morphisms',
  'catamorphism': 'category-morphisms',
  'anamorphism': 'category-morphisms',
  'hylomorphism': 'category-morphisms',
  'paramorphism': 'category-morphisms',
  'apomorphism': 'category-morphisms',
  'natural-transformation': 'category-morphisms',

  // Algebraic Structures
  'functor': 'algebraic-structures',
  'pointed-functor': 'algebraic-structures',
  'applicative-functor': 'algebraic-structures',
  'monad': 'algebraic-structures',
  'monad-comprehension': 'algebraic-structures',
  'type-class': 'algebraic-structures',
  'comonad': 'algebraic-structures',
  'monoid': 'algebraic-structures',
  'semigroup': 'algebraic-structures',
  'setoid': 'algebraic-structures',
  'foldable': 'algebraic-structures',
  'kleisli-composition': 'algebraic-structures',
  'constant-functor': 'algebraic-structures',
  'constant-monad': 'algebraic-structures',
  'lift': 'algebraic-structures',
  'bifunctor': 'algebraic-structures',
  'profunctor': 'algebraic-structures',
  'traversable': 'algebraic-structures',
  'contravariant-functor': 'algebraic-structures',
  'alternative': 'algebraic-structures',

  // Effects
  'io': 'effects',
  'algebraic-effects': 'effects',
  'free-monad': 'effects',
  'monad-transformer': 'effects',
  'reader-monad': 'effects',
  'writer-monad': 'effects',
  'state-monad': 'effects',
  'fallible': 'effects',

  // Types & Modeling
  'type-signatures': 'types-data',
  'parametricity': 'types-data',
  'dependent-type': 'types-data',
  'higher-kinded-type': 'types-data',
  'expression-problem': 'types-data',
  'algebraic-data-type': 'types-data',
  'sum-type': 'types-data',
  'product-type': 'types-data',
  'unit-type': 'types-data',
  'never-type': 'types-data',
  'option': 'types-data',
  'either': 'types-data',
  'lens': 'types-data',
  'prism': 'types-data',
  'iso': 'types-data',
  'traversal': 'types-data',
  'lambda-calculus': 'lambda-calculus',
  'functional-programming-libraries-for-net': 'types-data',
  'free-and-bound-variables': 'lambda-calculus',
  'alpha-conversion': 'lambda-calculus',
  'beta-reduction': 'lambda-calculus',
  'eta-conversion': 'lambda-calculus',
  'reduction-strategy': 'lambda-calculus',
  'church-encoding': 'lambda-calculus',
  'fixed-point-combinator': 'lambda-calculus',
  'combinatory-logic': 'lambda-calculus',
  'first-class-function': 'core-functions',
  'declarative-programming': 'core-functions',
  'recursion': 'core-functions',
  'tail-call': 'core-functions',
  'pipe': 'composition',
  'continuation-passing-style': 'composition',
  'eager-evaluation': 'composition',
  'generator': 'composition',
  'continuation-monad': 'effects',
  'immutability': 'purity-state',
  'property-based-testing': 'purity-state',
  'pattern-matching': 'types-data',
  'variance': 'types-data',
  'expression-tree': 'types-data',
  'phantom-type': 'types-data',
  'newtype': 'types-data',
  'smart-constructor': 'types-data',
  'refinement-type': 'types-data',
  'existential-type': 'types-data',
  'rank-n-type': 'types-data',
  'generalized-algebraic-data-type': 'types-data',
  'type-inference': 'types-data',
  'structural-typing': 'types-data',
  'linear-type': 'types-data',
  'zipper': 'types-data',
  'endofunctor': 'category-morphisms',
  'kleisli-category': 'category-morphisms',
  'functor-category': 'category-morphisms',
  'initial-and-terminal-objects': 'category-morphisms',
  'product-and-coproduct': 'category-morphisms',
  'duality': 'category-morphisms',
  'monoidal-category': 'category-morphisms',
  'adjunction': 'category-morphisms',
  'yoneda-lemma': 'category-morphisms',
  'laws': 'algebraic-structures',
  'magma': 'algebraic-structures',
  'group': 'algebraic-structures',
  'semiring': 'algebraic-structures',
  'monoidal-functor': 'algebraic-structures',
  'arrow': 'algebraic-structures'
};

const CATEGORIES = {
  'core-functions': {
    id: 'core-functions',
    name: 'Core Functions',
    description: 'First-class citizens, closures, predicates, and functional building blocks.',
    color: '#3b82f6', // blue
    accent: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
  },
  'composition': {
    id: 'composition',
    name: 'Composition & Flow',
    description: 'Chaining, currying, partial application, and execution pipelines.',
    color: '#10b981', // emerald
    accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
  },
  'purity-state': {
    id: 'purity-state',
    name: 'Purity & Reasoning',
    description: 'Referential transparency, determinism, side effects, and equational proofs.',
    color: '#f59e0b', // amber
    accent: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
  },
  'category-morphisms': {
    id: 'category-morphisms',
    name: 'Category & Morphisms',
    description: 'Abstract mappings, homomorphisms, isomorphisms, and recursive fold/unfolds.',
    color: '#a855f7', // purple
    accent: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
  },
  'algebraic-structures': {
    id: 'algebraic-structures',
    name: 'Algebraic Structures',
    description: 'Functors, Monads, Monoids, Semigroups, and the language-ext traits behind them.',
    color: '#ec4899', // pink
    accent: 'text-pink-500 bg-pink-500/10 border-pink-500/30'
  },
  'effects': {
    id: 'effects',
    name: 'Effects',
    description: 'IO, effect systems, and the Reader, Writer and State monads that thread context through a computation.',
    color: '#ef4444', // red
    accent: 'text-red-500 bg-red-500/10 border-red-500/30'
  },
  'lambda-calculus': {
    id: 'lambda-calculus',
    name: 'Lambda Calculus',
    description: 'The tiny model of computation underneath functional programming: variables, abstraction, application, reduction and combinators.',
    color: '#84cc16', // lime
    accent: 'text-lime-500 bg-lime-500/10 border-lime-500/30'
  },
  'types-data': {
    id: 'types-data',
    name: 'Types & Data Modeling',
    description: 'Algebraic data types, Option/Maybe, Lenses, and Type Signatures.',
    color: '#06b6d4', // cyan
    accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30'
  }
};

const ALIASES_MAP = {
  'lambda-calculus': ['λ-calculus', 'untyped lambda calculus', 'alonzo church', 'abstraction', 'application'],
  'free-and-bound-variables': ['free variable', 'bound variable', 'closed term', 'open term', 'variable capture'],
  'alpha-conversion': ['α-conversion', 'alpha equivalence', 'alpha renaming', 'capture-avoiding substitution', 'renaming'],
  'beta-reduction': ['β-reduction', 'substitution', 'redex', 'normal form', 'omega'],
  'eta-conversion': ['η-conversion', 'eta reduction', 'eta expansion', 'method group', 'extensionality'],
  'reduction-strategy': ['evaluation strategy', 'normal order', 'applicative order', 'call-by-name', 'call-by-value', 'call-by-need', 'church-rosser'],
  'church-encoding': ['church numerals', 'church booleans', 'church pairs', 'scott encoding', 'encoding data as functions'],
  'fixed-point-combinator': ['y combinator', 'z combinator', 'fix', 'fixpoint', 'anonymous recursion', 'sage bird'],
  'combinatory-logic': ['ski', 'ski calculus', 's k i combinators', 'iota', 'bracket abstraction'],
  'first-class-function': ['first-class functions', 'functions as values', 'delegate', 'func', 'method group', 'function value'],
  'declarative-programming': ['declarative', 'imperative', 'what not how', 'query syntax'],
  'recursion': ['recursive function', 'base case', 'structural recursion', 'self-reference'],
  'tail-call': ['tail call optimisation', 'tco', 'tail recursion', 'tail position', 'stack overflow'],
  'pipe': ['pipe operator', '|>', 'forward application', 'forward composition', 'method chaining', 'pipeline', 'fluent'],
  'continuation-passing-style': ['cps', 'continuation passing', 'callback', 'direct style'],
  'eager-evaluation': ['strict evaluation', 'eager', 'call by value', 'deferred execution', 'tolist'],
  'generator': ['yield return', 'iterator', 'ienumerable', 'infinite sequence', 'lazy sequence', 'coroutine'],
  'continuation-monad': ['cont', 'cont monad', 'callcc', 'call/cc', 'mother of all monads'],
  'immutability': ['immutable', 'immutable data', 'persistent data structure', 'records', 'with expression', 'init-only', 'shallow immutability'],
  'property-based-testing': ['property testing', 'property-based tests', 'quickcheck', 'cscheck', 'fscheck', 'generative testing', 'shrinking', 'counterexample', 'pbt'],
  'pattern-matching': ['switch expression', 'destructuring', 'list patterns', 'guards', 'exhaustiveness', 'match'],
  'variance': ['covariance', 'contravariance', 'invariance', 'in and out', 'array covariance', 'generic variance'],
  'expression-tree': ['expression trees', 'code as data', 'homoiconicity', 'ast', 'abstract syntax tree', 'interpreter'],
  'phantom-type': ['phantom type parameter', 'type tag', 'marker type', 'units of measure', 'typestate'],
  'newtype': ['wrapper type', 'strongly typed id', 'value object', 'domaintype', 'identifier', 'record struct'],
  'smart-constructor': ['parse don\'t validate', 'validating constructor', 'factory', 'illegal states unrepresentable', 'private constructor'],
  'refinement-type': ['liquid haskell', 'f star', 'subset type', 'refined type', 'predicate type'],
  'existential-type': ['existential', 'existential quantification', 'exists', 'hidden type', 'abstract type', 'packed type'],
  'rank-n-type': ['rank-n', 'rank-2', 'rank n type', 'higher-rank polymorphism', 'higher rank', 'rankntypes'],
  'generalized-algebraic-data-type': ['gadt', 'gadts', 'generalised algebraic data type', 'typed expression', 'indexed type', 'type refinement'],
  'type-inference': ['hindley-milner', 'hm', 'var', 'inferred types', 'local type inference', 'natural type', 'lambda inference'],
  'structural-typing': ['duck typing', 'nominal typing', 'structural type system', 'shape', 'query pattern'],
  'linear-type': ['linear types', 'affine types', 'substructural types', 'ownership', 'use once', 'linear haskell', 'borrow checker', 'resource safety'],
  'zipper': ['list zipper', 'tree zipper', 'cursor', 'focus', 'huet zipper'],
  'endofunctor': ['endo functor', 'monoid in the category of endofunctors', 'join', 'flatten'],
  'kleisli-category': ['kleisli arrow', 'monadic arrows', 'a -> m b', 'fish operator'],
  'functor-category': ['category of functors', 'endofunctor category'],
  'initial-and-terminal-objects': ['initial object', 'terminal object', 'final object', 'absurd', 'empty type'],
  'product-and-coproduct': ['coproduct', 'categorical product', 'categorical sum', 'projection', 'injection', 'universal property'],
  'duality': ['dual', 'co-', 'opposite category', 'reversing arrows'],
  'monoidal-category': ['tensor product', 'tensor', 'unit object', 'associator', 'unitor'],
  'adjunction': ['adjoint functors', 'left adjoint', 'right adjoint', 'curry uncurry', 'hom-set isomorphism'],
  'yoneda-lemma': ['yoneda', 'coyoneda', 'map fusion', 'functor fusion'],
  'laws': ['type class laws', 'functor laws', 'monad laws', 'monoid laws', 'lawful instance'],
  'magma': ['binary operation', 'closed operation', 'groupoid (algebra)', 'algebraic hierarchy'],
  'group': ['inverse', 'abelian group', 'commutative group', 'monoid with inverses'],
  'semiring': ['rig', 'tropical semiring', 'min-plus', 'max-plus', 'shortest path'],
  'monoidal-functor': ['lax monoidal functor', 'zip', 'product of functors'],
  'arrow': ['arrows', 'control.arrow', 'fanout', 'split', 'first'],
  'option': ['maybe', 'some', 'none', 'just', 'nothing'],
  'either': ['result', 'left and right', 'right is right'],
  'point-free-style': ['tacit programming', 'tacit', 'point-free', 'pointfree'],
  'monad': ['flatmap', 'bind', 'chain', 'return'],
  'type-class': ['trait', 'traits', 'typeclass', 'instance', 'multi-parameter type class', 'static abstract', 'ad hoc polymorphism', 'overloading', 'static dispatch', 'polymorphism'],
  'higher-kinded-type': ['hkt', 'higher kinds', 'kind', 'type constructor', 'k<f, a>', 'brand'],
  'expression-problem': ['open closed', 'open/closed', 'visitor pattern', 'tagless final', 'extensibility', 'dispatch', 'dynamic dispatch', 'virtual call', 'subtype polymorphism'],
  'monad-comprehension': ['do notation', 'do-notation', 'for comprehension', 'linq', 'query syntax', 'query expression', 'selectmany'],
  'reader-monad': ['reader', 'environment', 'dependency injection', 'ask', 'readable'],
  'writer-monad': ['writer', 'tell', 'logging', 'writable'],
  'fallible': ['monaderror', 'monad error', 'error handling', 'fail', 'catch', 'fin', 'exceptions', 'failure'],
  'dependent-type': ['dependent types', 'dependently typed', 'idris', 'agda', 'lean', 'vect', 'pi type', 'non-empty', 'parse don\'t validate'],
  'parametricity': ['free theorems', 'theorems for free', 'parametric', 'generic', 'generics', 'free theorem', 'parametric polymorphism'],
  'state-monad': ['state', 'get', 'put', 'modify', 'stateful'],
  'sum-type': ['union type', 'discriminated union', 'tagged union', 'union', 'oneof', 'c# 15 union', 'closed hierarchy'],
  'product-type': ['tuple', 'pair', 'record', 'struct'],
  'unit-type': ['unit', 'void', 'empty tuple'],
  'never-type': ['never', 'bottom type', 'empty type', 'nothing', 'absurd', 'fx'],
  'arity': ['unary', 'binary', 'ternary', 'nullary', 'variadic'],
  'higher-order-functions-hof': ['hof', 'higher order function'],
  'pure-function': ['deterministic function', 'purity'],
  'catamorphism': ['fold', 'reduce', 'reduceright'],
  'anamorphism': ['unfold', 'generate', 'unfoldr', 'list.unfold', 'seed', 'dual of fold', 'corecursion'],
  'hylomorphism': ['refold', 'unfold-then-fold'],
  'paramorphism': ['para', 'reductive history'],
  'apomorphism': ['apo', 'early return unfold'],
  'algebraic-data-type': ['adt'],
  'referential-transparency': ['referential transparent', 'substitution model'],
  'equational-reasoning': ['algebraic reasoning'],
  'currying': ['curried'],
  'lambda': ['anonymous function', 'arrow function'],
  'functor': ['map', 'mappable'],
  'applicative-functor': ['applicative', 'ap'],
  'bifunctor': ['bimap', 'pair map'],
  'traversable': ['sequence', 'traverse'],
  'monoid': ['empty', 'identity', 'semigroup with identity'],
  'lens': ['getter', 'setter', 'optics'],
  'prism': ['affine traversal', 'sum optics'],
  'lazy-evaluation': ['call-by-need', 'deferred execution', 'generators'],
  'io': ['task', 'effect container', 'side effect recipe'],
  'trampoline': ['thunk loop', 'tail recursion optimization'],
  'thunk': ['deferred computation', 'nullary function', 'lazy thunk'],
  'memoization': ['memoize', 'memoized', 'caching'],
  'contravariant-functor': ['contravariant', 'cmap', 'contramap'],
  'alternative': ['alt', 'choice operator', 'fallback'],
  'natural-transformation': ['nat', 'functor transformation'],
  'iso': ['isomorphism optic', 'lossless conversion', 'reversible mapping']
};

// Explicit semantic connections between concepts in FP
const EXPLICIT_RELATIONSHIPS = [
  // Currying & Applications
  ['currying', 'partial-application'],
  ['currying', 'arity'],
  ['auto-currying', 'currying'],
  ['partial-application', 'higher-order-functions-hof'],
  ['point-free-style', 'currying'],
  ['point-free-style', 'function-composition'],
  ['point-free-style', 'higher-order-functions-hof'],
  ['functional-combinator', 'point-free-style'],
  ['functional-combinator', 'higher-order-functions-hof'],

  // Purity & State
  ['pure-function', 'side-effects'],
  ['pure-function', 'referential-transparency'],
  ['pure-function', 'idempotence'],
  ['pure-function', 'equational-reasoning'],
  ['referential-transparency', 'equational-reasoning'],
  ['referential-transparency', 'constant'],
  ['constant', 'constant-function'],
  ['constant-function', 'constant-functor'],
  ['constant-functor', 'constant-monad'],
  ['value', 'constant'],

  // Category Theory & Morphisms
  ['category', 'morphism'],
  ['category', 'function-composition'],
  ['morphism', 'homomorphism'],
  ['homomorphism', 'endomorphism'],
  ['homomorphism', 'isomorphism'],
  ['catamorphism', 'anamorphism'],
  ['catamorphism', 'foldable'],
  ['anamorphism', 'hylomorphism'],
  ['catamorphism', 'hylomorphism'],
  ['paramorphism', 'catamorphism'],
  ['apomorphism', 'anamorphism'],

  // Algebraic Structures
  ['semigroup', 'monoid'],
  ['monoid', 'foldable'],
  ['functor', 'pointed-functor'],
  ['functor', 'applicative-functor'],
  ['pointed-functor', 'applicative-functor'],
  ['applicative-functor', 'monad'],
  ['monad', 'kleisli-composition'],
  ['monad', 'comonad'],
  ['monad', 'option'],
  ['lift', 'applicative-functor'],
  ['lift', 'functor'],
  ['setoid', 'semigroup'],

  // Functions & Types
  ['function', 'pure-function'],
  ['function', 'lambda'],
  ['lambda', 'closure'],
  ['lambda', 'lambda-calculus'],
  ['higher-order-functions-hof', 'closure'],
  ['higher-order-functions-hof', 'predicate'],
  ['higher-order-functions-hof', 'function-composition'],
  ['continuation', 'higher-order-functions-hof'],
  ['lazy-evaluation', 'pure-function'],
  ['partial-function', 'total-function'],
  ['partial-function', 'dealing-with-partial-functions'],
  ['dealing-with-partial-functions', 'option'],
  ['algebraic-data-type', 'sum-type'],
  ['algebraic-data-type', 'product-type'],
  ['unit-type', 'product-type'],
  ['never-type', 'sum-type'],
  ['unit-type', 'never-type'],
  ['never-type', 'either'],
  ['never-type', 'algebraic-effects'],
  ['never-type', 'monad-comprehension'],
  ['parametricity', 'type-signatures'],
  ['dependent-type', 'total-function'],
  ['dependent-type', 'higher-kinded-type'],
  ['dependent-type', 'option'],
  ['dependent-type', 'type-signatures'],
  ['parametricity', 'type-class'],
  ['parametricity', 'functor'],
  ['parametricity', 'natural-transformation'],
  ['fallible', 'either'],
  ['fallible', 'monad'],
  ['fallible', 'type-class'],
  ['fallible', 'side-effects'],
  ['fallible', 'reader-monad'],
  ['fallible', 'monad-transformer'],
  ['type-class', 'higher-kinded-type'],
  ['type-class', 'monoid'],
  ['type-class', 'functor'],
  ['type-class', 'natural-transformation'],
  ['higher-kinded-type', 'functor'],
  ['higher-kinded-type', 'monad'],
  ['expression-problem', 'sum-type'],
  ['expression-problem', 'type-class'],
  ['monad-comprehension', 'monad'],
  ['monad-comprehension', 'kleisli-composition'],
  ['reader-monad', 'monad'],
  ['writer-monad', 'monad'],
  ['state-monad', 'monad'],
  ['writer-monad', 'monoid'],
  ['state-monad', 'reader-monad'],
  ['state-monad', 'writer-monad'],
  ['state-monad', 'side-effects'],
  ['reader-monad', 'algebraic-effects'],
  ['monad-transformer', 'reader-monad'],
  ['monad-transformer', 'state-monad'],
  ['option', 'sum-type'],
  ['option', 'monad'],
  ['either', 'option'],
  ['either', 'sum-type'],
  ['either', 'monad'],
  ['either', 'bifunctor'],
  ['traversable', 'foldable'],
  ['traversable', 'functor'],
  ['traversable', 'applicative-functor'],
  ['bifunctor', 'functor'],
  ['bifunctor', 'product-type'],
  ['lens', 'function-composition'],
  ['lens', 'pure-function'],
  ['prism', 'lens'],
  ['prism', 'sum-type'],
  ['prism', 'option'],
  ['io', 'side-effects'],
  ['io', 'monad'],
  ['io', 'lazy-evaluation'],
  ['trampoline', 'higher-order-functions-hof'],
  ['trampoline', 'continuation'],
  ['thunk', 'lazy-evaluation'],
  ['thunk', 'trampoline'],
  ['thunk', 'io'],
  ['memoization', 'pure-function'],
  ['memoization', 'referential-transparency'],
  ['memoization', 'idempotence'],
  ['contravariant-functor', 'functor'],
  ['contravariant-functor', 'predicate'],
  ['alternative', 'applicative-functor'],
  ['alternative', 'monoid'],
  ['alternative', 'option'],
  ['natural-transformation', 'functor'],
  ['natural-transformation', 'morphism'],
  ['natural-transformation', 'category'],
  ['iso', 'lens'],
  ['iso', 'prism'],
  ['iso', 'isomorphism'],
  ['contracts', 'type-signatures'],
  ['free-monad', 'monad'],
  ['free-monad', 'functor'],
  ['free-monad', 'io'],
  ['monad-transformer', 'monad'],
  ['monad-transformer', 'kleisli-composition'],
  ['monad-transformer', 'either'],
  ['profunctor', 'bifunctor'],
  ['profunctor', 'contravariant-functor'],
  ['profunctor', 'lens'],
  ['semigroupoid', 'category'],
  ['semigroupoid', 'function-composition'],
  ['semigroupoid', 'semigroup'],
  ['traversal', 'lens'],
  ['traversal', 'prism'],
  ['traversal', 'traversable'],
  ['algebraic-effects', 'continuation'],
  ['algebraic-effects', 'side-effects'],
  ['algebraic-effects', 'free-monad'],
  ['lambda-calculus', 'currying'],
  ['lambda-calculus', 'beta-reduction'],
  ['lambda-calculus', 'church-encoding'],
  ['free-and-bound-variables', 'closure'],
  ['free-and-bound-variables', 'functional-combinator'],
  ['free-and-bound-variables', 'alpha-conversion'],
  ['alpha-conversion', 'beta-reduction'],
  ['beta-reduction', 'equational-reasoning'],
  ['beta-reduction', 'referential-transparency'],
  ['beta-reduction', 'pure-function'],
  ['beta-reduction', 'reduction-strategy'],
  ['eta-conversion', 'point-free-style'],
  ['eta-conversion', 'fixed-point-combinator'],
  ['reduction-strategy', 'lazy-evaluation'],
  ['reduction-strategy', 'eager-evaluation'],
  ['reduction-strategy', 'thunk'],
  ['church-encoding', 'catamorphism'],
  ['church-encoding', 'rank-n-type'],
  ['church-encoding', 'sum-type'],
  ['fixed-point-combinator', 'recursion'],
  ['fixed-point-combinator', 'eager-evaluation'],
  ['fixed-point-combinator', 'functional-combinator'],
  ['combinatory-logic', 'functional-combinator'],
  ['combinatory-logic', 'point-free-style'],
  ['combinatory-logic', 'lambda-calculus'],
  ['first-class-function', 'higher-order-functions-hof'],
  ['first-class-function', 'closure'],
  ['first-class-function', 'value'],
  ['first-class-function', 'function-composition'],
  ['declarative-programming', 'higher-order-functions-hof'],
  ['declarative-programming', 'pure-function'],
  ['declarative-programming', 'monad-comprehension'],
  ['recursion', 'tail-call'],
  ['recursion', 'trampoline'],
  ['recursion', 'catamorphism'],
  ['recursion', 'anamorphism'],
  ['tail-call', 'trampoline'],
  ['tail-call', 'continuation-passing-style'],
  ['pipe', 'function-composition'],
  ['pipe', 'point-free-style'],
  ['pipe', 'higher-order-functions-hof'],
  ['continuation-passing-style', 'continuation'],
  ['continuation-passing-style', 'continuation-monad'],
  ['continuation-passing-style', 'trampoline'],
  ['eager-evaluation', 'lazy-evaluation'],
  ['eager-evaluation', 'side-effects'],
  ['eager-evaluation', 'thunk'],
  ['generator', 'lazy-evaluation'],
  ['generator', 'anamorphism'],
  ['generator', 'eager-evaluation'],
  ['anamorphism', 'foldable'],
  ['continuation-monad', 'monad'],
  ['continuation-monad', 'continuation'],
  ['continuation-monad', 'monad-comprehension'],
  ['immutability', 'referential-transparency'],
  ['immutability', 'side-effects'],
  ['immutability', 'pure-function'],
  ['property-based-testing', 'laws'],
  ['property-based-testing', 'pure-function'],
  ['property-based-testing', 'equational-reasoning'],
  ['property-based-testing', 'monoid'],
  ['pattern-matching', 'sum-type'],
  ['pattern-matching', 'algebraic-data-type'],
  ['pattern-matching', 'option'],
  ['pattern-matching', 'either'],
  ['variance', 'functor'],
  ['variance', 'contravariant-functor'],
  ['variance', 'profunctor'],
  ['expression-tree', 'free-monad'],
  ['expression-tree', 'pattern-matching'],
  ['expression-tree', 'lambda'],
  ['phantom-type', 'newtype'],
  ['phantom-type', 'smart-constructor'],
  ['phantom-type', 'refinement-type'],
  ['newtype', 'smart-constructor'],
  ['newtype', 'type-class'],
  ['smart-constructor', 'dependent-type'],
  ['smart-constructor', 'refinement-type'],
  ['smart-constructor', 'option'],
  ['smart-constructor', 'either'],
  ['refinement-type', 'dependent-type'],
  ['refinement-type', 'predicate'],
  ['existential-type', 'parametricity'],
  ['existential-type', 'rank-n-type'],
  ['existential-type', 'type-class'],
  ['rank-n-type', 'natural-transformation'],
  ['rank-n-type', 'higher-kinded-type'],
  ['rank-n-type', 'parametricity'],
  ['generalized-algebraic-data-type', 'algebraic-data-type'],
  ['generalized-algebraic-data-type', 'sum-type'],
  ['generalized-algebraic-data-type', 'expression-problem'],
  ['generalized-algebraic-data-type', 'dependent-type'],
  ['type-inference', 'type-signatures'],
  ['type-inference', 'parametricity'],
  ['type-inference', 'lambda'],
  ['structural-typing', 'newtype'],
  ['structural-typing', 'monad-comprehension'],
  ['structural-typing', 'type-class'],
  ['linear-type', 'side-effects'],
  ['linear-type', 'immutability'],
  ['zipper', 'lens'],
  ['zipper', 'immutability'],
  ['zipper', 'algebraic-data-type'],
  ['zipper', 'traversal'],
  ['endofunctor', 'functor'],
  ['endofunctor', 'monad'],
  ['endofunctor', 'monoid'],
  ['endofunctor', 'endomorphism'],
  ['kleisli-category', 'kleisli-composition'],
  ['kleisli-category', 'monad'],
  ['kleisli-category', 'category'],
  ['kleisli-category', 'option'],
  ['functor-category', 'natural-transformation'],
  ['functor-category', 'functor'],
  ['functor-category', 'category'],
  ['initial-and-terminal-objects', 'unit-type'],
  ['initial-and-terminal-objects', 'never-type'],
  ['initial-and-terminal-objects', 'duality'],
  ['initial-and-terminal-objects', 'category'],
  ['product-and-coproduct', 'product-type'],
  ['product-and-coproduct', 'sum-type'],
  ['product-and-coproduct', 'either'],
  ['product-and-coproduct', 'duality'],
  ['duality', 'comonad'],
  ['duality', 'catamorphism'],
  ['duality', 'anamorphism'],
  ['monoidal-category', 'monoid'],
  ['monoidal-category', 'isomorphism'],
  ['monoidal-category', 'monoidal-functor'],
  ['monoidal-category', 'unit-type'],
  ['monoidal-category', 'bifunctor'],
  ['adjunction', 'currying'],
  ['adjunction', 'state-monad'],
  ['adjunction', 'functor'],
  ['adjunction', 'comonad'],
  ['yoneda-lemma', 'functor'],
  ['yoneda-lemma', 'rank-n-type'],
  ['yoneda-lemma', 'natural-transformation'],
  ['yoneda-lemma', 'functor-category'],
  ['laws', 'type-class'],
  ['laws', 'functor'],
  ['laws', 'monad'],
  ['laws', 'equational-reasoning'],
  ['magma', 'semigroup'],
  ['magma', 'monoid'],
  ['magma', 'group'],
  ['group', 'monoid'],
  ['group', 'type-class'],
  ['group', 'semiring'],
  ['semiring', 'monoid'],
  ['semiring', 'type-class'],
  ['monoidal-functor', 'applicative-functor'],
  ['monoidal-functor', 'functor'],
  ['monoidal-functor', 'monoid'],
  ['arrow', 'category'],
  ['arrow', 'kleisli-composition'],
  ['arrow', 'profunctor'],
  ['arrow', 'function-composition'],
  ['arrow', 'applicative-functor']
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Slice out main content after TOC
const tocEndMarker = '<!-- /RM -->';
const tocIndex = content.indexOf(tocEndMarker);
const mainBody = tocIndex !== -1 ? content.slice(tocIndex + tocEndMarker.length) : content;

// Match ## or ### headings
const sectionRegex = /(?:^|\n)(#{2,3})\s+([^\n]+)\n([\s\S]*?)(?=(?:\n#{2,3}\s+[^\n]+|$))/g;

const entries = [];
let match;

while ((match = sectionRegex.exec(mainBody)) !== null) {
  const depth = match[1].length;
  const rawTitle = match[2].trim();
  const rawBody = match[3].trim();

  // If this is the "Functional Programming Libraries for .NET" section, handle specially or include as a term
  const slug = slugify(rawTitle);

  // Extract code snippets
  const codeBlocks = [];
  const codeRegex = /```(csharp|cs|js|javascript)?\n([\s\S]*?)```/g;
  let codeMatch;
  while ((codeMatch = codeRegex.exec(rawBody)) !== null) {
    codeBlocks.push({
      // A fence with no language is notation, not C#
      lang: codeMatch[1] || 'text',
      code: codeMatch[2].trim()
    });
  }

  // Extract further reading links
  const furtherReading = [];
  const readingRegex = /\*\s+\[([^\]]+)\]\(([^)]+)\)/g;
  let rMatch;
  while ((rMatch = readingRegex.exec(rawBody)) !== null) {
    // Only capture if in further reading context
    if (rawBody.indexOf(rMatch[0]) > rawBody.toLowerCase().indexOf('further reading') ||
        rawBody.toLowerCase().indexOf('further reading') === -1) {
      furtherReading.push({
        title: rMatch[1],
        url: rMatch[2]
      });
    }
  }

  // Extract cross references from markdown links pointing to #slug
  const internalRefRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  const crossRefs = new Set();
  let refMatch;
  while ((refMatch = internalRefRegex.exec(rawBody)) !== null) {
    crossRefs.add(refMatch[2].toLowerCase());
  }

  // Generate plain-text summary (first paragraph)
  const paragraphs = rawBody
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith('```') && !p.startsWith('__Further') && !p.startsWith('*'));

  let summary = '';
  if (slug === 'functional-programming-libraries-for-net') {
    summary = 'A curated catalog of functional programming libraries and toolkits for C# and .NET including language-ext, OneOf, MoreLINQ, and Pidgin.';
  } else if (paragraphs[0]) {
    summary = paragraphs[0]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
  } else {
    summary = rawTitle;
  }

  const categoryId = CATEGORY_MAP[slug] || 'core-functions';

  entries.push({
    id: slug,
    title: rawTitle,
    depth,
    category: categoryId,
    aliases: ALIASES_MAP[slug] || [],
    summary,
    body: rawBody,
    codeBlocks,
    furtherReading,
    crossRefs: Array.from(crossRefs)
  });
}

// Build node and links graph
const termIds = new Set(entries.map(e => e.id));
const linksSet = new Set();
const links = [];

function addLink(source, target, type = 'semantic') {
  if (!termIds.has(source) || !termIds.has(target) || source === target) return;
  const key = [source, target].sort().join('---');
  if (linksSet.has(key)) return;
  linksSet.add(key);
  links.push({ source, target, type });
}

// Add explicit relationships
EXPLICIT_RELATIONSHIPS.forEach(([src, tgt]) => {
  addLink(src, tgt, 'core');
});

// Add cross references detected in markdown
entries.forEach(entry => {
  entry.crossRefs.forEach(targetSlug => {
    addLink(entry.id, targetSlug, 'reference');
  });
});

// Add relatedIds to each entry
entries.forEach(entry => {
  const related = new Set();
  links.forEach(link => {
    if (link.source === entry.id) related.add(link.target);
    if (link.target === entry.id) related.add(link.source);
  });
  entry.relatedIds = Array.from(related);
});

// The C# combinator reference (combinators.md) is shown in the app as a popup
const combinatorsPath = [path.join(__dirname, '../../combinators.md'), path.join(__dirname, '../combinators.md')]
  .find(p => fs.existsSync(p));
const combinatorsSource = combinatorsPath ? fs.readFileSync(combinatorsPath, 'utf8') : '';
const combinatorsTitle = (/^#\s+(.+)$/m.exec(combinatorsSource) || [])[1] || 'Function Combinators';

// One search entry per `### X - name` section: its first paragraph as summary,
// plus the Haskell / language-ext names from the reference table as aliases
const combinatorAliases = {};
for (const [, name, letter, haskell, lext] of combinatorsSource.matchAll(/^\|\s*([\w-]+)\W*\|\s*\*\*(\w+)\*\*\s*\|([^|]*)\|([^|]*)\|/gm)) {
  combinatorAliases[letter] = [...`${haskell} ${lext}`.matchAll(/`([^`]+)`/g)].map(m => m[1]);
}
const combinatorEntries = [...combinatorsSource.matchAll(/^###\s+(\S+)\s+-\s+(.+)\n+([^\n`][^\n]*)/gm)]
  .map(([, letter, name, summary]) => ({
    letter,
    name: name.trim(),
    summary: summary.replace(/`/g, '').trim(),
    aliases: combinatorAliases[letter] || []
  }));

const combinators = combinatorsSource
  ? {
      title: combinatorsTitle.trim(),
      markdown: combinatorsSource.replace(/^#\s+.+\n+/m, '').trim(),
      entries: combinatorEntries
    }
  : null;

// Levels behind the graph's simpler views: Essentials is the first ~30 terms a
// C# developer meets, Everything adds the niche ones, the rest are Practical
const ESSENTIAL_TERMS = `
  function pure-function first-class-function higher-order-functions-hof lambda closure recursion
  partial-function total-function
  currying partial-application function-composition pipe lazy-evaluation
  immutability side-effects referential-transparency value idempotence
  algebraic-data-type sum-type product-type option either pattern-matching type-signatures unit-type
  functor monad monoid applicative-functor foldable monad-comprehension
  io`.split(/\s+/).filter(Boolean);
const NICHE_TERMS = `
  auto-currying continuation-passing-style
  algebraic-effects free-monad continuation-monad
  constant equational-reasoning
  semigroupoid endofunctor kleisli-category endomorphism hylomorphism paramorphism apomorphism
  functor-category initial-and-terminal-objects product-and-coproduct duality monoidal-category
  adjunction yoneda-lemma
  constant-functor constant-monad pointed-functor group semiring comonad monoidal-functor profunctor
  arrow magma setoid
  alpha-conversion eta-conversion reduction-strategy church-encoding fixed-point-combinator combinatory-logic
  prism iso traversal zipper dependent-type existential-type rank-n-type generalized-algebraic-data-type
  linear-type refinement-type phantom-type`.split(/\s+/).filter(Boolean);

for (const id of [...ESSENTIAL_TERMS, ...NICHE_TERMS]) {
  if (!termIds.has(id)) throw new Error(`Unknown term in level lists: ${id}`);
}
entries.forEach(entry => {
  entry.level = ESSENTIAL_TERMS.includes(entry.id) ? 'essentials'
    : NICHE_TERMS.includes(entry.id) ? 'everything'
    : 'practical';
});

// Learning paths (learning-paths.md): each `## Title` section is a path, its
// first paragraph the intro, and each numbered `[Term](readme.md#id): note`
// item a step
const pathsPath = [path.join(__dirname, '../../learning-paths.md'), path.join(__dirname, '../learning-paths.md')]
  .find(p => fs.existsSync(p));
const pathsSource = pathsPath ? fs.readFileSync(pathsPath, 'utf8') : '';
const learningPaths = pathsSource.split(/^## /m).slice(1).map(section => {
  const [titleLine, ...rest] = section.split('\n');
  const title = titleLine.trim();
  const body = rest.join('\n').trim();
  const intro = body.split(/\n\s*\n/)[0].trim();
  const steps = [...body.matchAll(/^\d+\.\s+\[[^\]]+\]\(readme\.md#([\w-]+)\):\s*(.+)$/gm)]
    .map(([, termId, note]) => {
      if (!termIds.has(termId)) throw new Error(`Learning path "${title}" links to unknown term: ${termId}`);
      // Notes follow a colon in the markdown; shown alone they start a sentence
      const text = note.trim();
      return { termId, note: text[0].toUpperCase() + text.slice(1) };
    });
  return { id: slugify(title.replace(/C#/g, 'csharp')), title, intro, steps };
});

const output = {
  meta: {
    title: "FP Jargon",
    subtitle: "The vocabulary of functional programming mapped into an interactive graph",
    totalTerms: entries.length,
    totalRelationships: links.length,
    sourceRepo: "https://github.com/hemanth/functional-programming-jargon",
    originalAuthor: "Hemanth HM"
  },
  categories: CATEGORIES,
  terms: entries,
  combinators,
  paths: learningPaths,
  graph: {
    nodes: entries.map(e => ({
      id: e.id,
      name: e.title,
      category: e.category,
      level: e.level,
      val: e.relatedIds.length + (e.depth === 2 ? 4 : 2),
      summary: e.summary
    })),
    links
  }
};

const outputPath = path.join(__dirname, '../src/data/jargons.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

// Also export to public directory for direct agent access
const publicDataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
fs.writeFileSync(path.join(publicDataDir, 'jargons.json'), JSON.stringify(output, null, 2), 'utf8');

// Generate agent-readable full text reference (llms-full.txt)
let llmsFull = `# FP Jargon - Full Reference

> Complete catalog of ${entries.length} functional programming concepts, morphisms, algebraic structures, and category theory terms with C# (language-ext) examples.
> Source: https://github.com/hemanth/functional-programming-jargon
> Live app: https://hemanth.github.io/functional-programming-jargon/

`;

entries.forEach(e => {
  llmsFull += `## ${e.title}\n\n`;
  llmsFull += `- Category: ${CATEGORIES[e.category]?.name || e.category}\n`;
  llmsFull += `- ID: #${e.id}\n`;
  if (e.aliases && e.aliases.length > 0) {
    llmsFull += `- Aliases: ${e.aliases.join(', ')}\n`;
  }
  if (e.relatedIds && e.relatedIds.length > 0) {
    llmsFull += `- Related concepts: ${e.relatedIds.map(id => `#${id}`).join(', ')}\n`;
  }
  llmsFull += `\n### Definition\n${e.summary}\n\n`;
  
  if (e.codeBlocks && e.codeBlocks.length > 0) {
    llmsFull += `### Code Examples\n\n`;
    e.codeBlocks.forEach(cb => {
      llmsFull += `\`\`\`${cb.lang}\n${cb.code}\n\`\`\`\n\n`;
    });
  }
  
  llmsFull += `---\n\n`;
});

if (combinators) {
  llmsFull += `## ${combinators.title}\n\n${combinators.markdown}\n`;
}

const llmsFullPath = path.join(__dirname, '../public/llms-full.txt');
fs.writeFileSync(llmsFullPath, llmsFull, 'utf8');

// Also generate llms.txt index per llmstxt.org specification
let llmsTxt = `# FP Jargon

> Interactive functional programming knowledge graph and specification exploring ${entries.length} concepts, category theory morphisms, and algebraic structures with C# (language-ext) examples.

FP Jargon maps out the entire vocabulary of functional programming into an interconnected graph with deterministic explanations, formal properties, and executable C# (language-ext) examples.

## Links

- [Interactive Knowledge Graph](https://hemanth.github.io/functional-programming-jargon/): The live interactive application
- [Full Text Specification (llms-full.txt)](https://hemanth.github.io/functional-programming-jargon/llms-full.txt): Complete catalog with all definitions and code blocks
- [Raw JSON Dataset](https://hemanth.github.io/functional-programming-jargon/data/jargons.json): Structured JSON dataset of terms, categories, and graph edges
- [GitHub Repository](https://github.com/hemanth/functional-programming-jargon): Source code and collaborative community specification
- [Author](https://h3manth.com): Hemanth HM

## Categories & Concepts

`;

Object.keys(CATEGORIES).forEach(catKey => {
  const cat = CATEGORIES[catKey];
  const catEntries = entries.filter(e => e.category === catKey);
  if (catEntries.length > 0) {
    llmsTxt += `### ${cat.name}\n`;
    catEntries.forEach(e => {
      const summaryClean = (e.summary || '').replace(/\n+/g, ' ').slice(0, 120);
      llmsTxt += `- [${e.title}](https://hemanth.github.io/functional-programming-jargon/#${e.id}): ${summaryClean}\n`;
    });
    llmsTxt += `\n`;
  }
});

llmsTxt += `## Agent & LLM Usage

AI agents can directly query or ingest this dataset via:
- LLMS Full Text: \`https://hemanth.github.io/functional-programming-jargon/llms-full.txt\`
- Raw JSON Graph API: \`https://hemanth.github.io/functional-programming-jargon/data/jargons.json\`
`;

const llmsTxtPath = path.join(__dirname, '../public/llms.txt');
fs.writeFileSync(llmsTxtPath, llmsTxt, 'utf8');

console.log(`Successfully parsed ${entries.length} terms and ${links.length} graph connections into ${outputPath}, public/data/jargons.json, llms.txt, and llms-full.txt`);


