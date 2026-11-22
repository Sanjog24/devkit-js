# DevKit JS

[![npm version](https://img.shields.io/npm/v/devkit-js-utils.svg)](https://www.npmjs.com/package/devkit-js-utils)
[![Tests](https://github.com/sanjog24/devkit-js/actions/workflows/tests.yml/badge.svg)](https://github.com/sanjog24/devkit-js/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

**DevKit JS** (`devkit-js-utils` on npm) is a small JavaScript utility library with no runtime dependencies and full test coverage. It provides commonly used helpers for **arrays, strings, objects and numbers**, written in modern ES Modules.

- ✅ **Zero runtime dependencies**
- ✅ **Pure functions**: inputs are never mutated
- ✅ **Strict input validation** with clear `TypeError` / `RangeError` messages
- ✅ **Unicode-aware** string helpers (emoji, accents, non-Latin scripts)
- ✅ **Exact big-number math**: `factorial` and `fibonacci` return `BigInt`
- ✅ **Tree-shakeable subpath imports** (`devkit-js-utils/string`, …)
- ✅ Tested with the built-in `node:test` runner

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Array Utilities](#array-utilities)
- [String Utilities](#string-utilities)
- [Object Utilities](#object-utilities)
- [Number Utilities](#number-utilities)
- [Error Handling](#error-handling)
- [Requirements](#requirements)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install devkit-js-utils
```

## Quick Start

```js
// Import everything from the main entry point
import { unique, chunk, capitalize, pick, clamp } from 'devkit-js-utils';

unique([1, 2, 2, 3]);              // [1, 2, 3]
chunk([1, 2, 3, 4, 5], 2);         // [[1, 2], [3, 4], [5]]
capitalize('hello');               // 'Hello'
pick({ a: 1, b: 2 }, ['a']);       // { a: 1 }
clamp(150, 0, 100);                // 100
```

Or import only the module you need:

```js
import { unique, chunk } from 'devkit-js-utils/array';
import { capitalize, slugify } from 'devkit-js-utils/string';
import { pick, omit } from 'devkit-js-utils/object';
import { clamp, isPrime } from 'devkit-js-utils/number';
```

> DevKit JS is an **ES Module** package. Use `import` (or `await import()` from CommonJS).

A complete runnable example is available in [`examples/basic-usage.js`](./examples/basic-usage.js).

---

## Array Utilities

`import { ... } from 'devkit-js-utils/array'`

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `unique(array)` | `array: Array` | `Array` | Removes duplicates (SameValueZero, so `NaN` is handled), keeps first-occurrence order. |
| `chunk(array, size)` | `array: Array`, `size: positive integer` | `Array<Array>` | Splits into groups of `size`; the last group may be smaller. |
| `flatten(array)` | `array: Array` | `Array` | Deeply flattens any level of nested arrays. |
| `shuffle(array)` | `array: Array` | `Array` | Returns a **new** randomly ordered array (Fisher–Yates). Original untouched. |
| `groupBy(array, key)` | `array: Array`, `key: string \| number \| symbol \| (item, index) => any` | `Object<string, Array>` | Groups items by a property or by a callback result. Returns a null-prototype object (safe for keys like `__proto__`). |
| `difference(array1, array2)` | `array1: Array`, `array2: Array` | `Array` | Items in `array1` that are not in `array2`. |
| `intersection(array1, array2)` | `array1: Array`, `array2: Array` | `Array` | Unique items present in both arrays, ordered as in `array1`. |

```js
import { unique, chunk, flatten, shuffle, groupBy, difference, intersection } from 'devkit-js-utils/array';

unique([3, 1, 3, NaN, NaN]);              // [3, 1, NaN]
chunk(['a', 'b', 'c'], 2);                // [['a', 'b'], ['c']]
flatten([1, [2, [3, [4]]]]);              // [1, 2, 3, 4]
shuffle([1, 2, 3, 4]);                    // e.g. [3, 1, 4, 2]
groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't');
// { a: [{ t: 'a' }, { t: 'a' }], b: [{ t: 'b' }] }
groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even'));
// { odd: [1, 3], even: [2, 4] }
difference([1, 2, 3, 4], [2, 4]);         // [1, 3]
intersection([1, 2, 2, 3], [2, 3, 4]);    // [2, 3]
```

Objects are compared **by reference** in `unique`, `difference` and `intersection`.

---

## String Utilities

`import { ... } from 'devkit-js-utils/string'`

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `capitalize(string)` | `string: string` | `string` | Uppercases the first character; the rest is unchanged. |
| `reverse(string)` | `string: string` | `string` | Reverses by grapheme cluster, so emoji and accented letters stay intact. |
| `slugify(string)` | `string: string` | `string` | URL-friendly slug: lowercase, accents removed, punctuation dropped, spaces/underscores to `-`. |
| `truncate(string, length, suffix = '...')` | `string: string`, `length: non-negative integer`, `suffix?: string` | `string` | Shortens to at most `length` characters. The suffix **counts toward** `length`. |
| `countWords(string)` | `string: string` | `number` | Counts words; punctuation is ignored, `don't` / `well-known` count as one word. |
| `isPalindrome(string)` | `string: string` | `boolean` | Palindrome check ignoring case, spaces, punctuation and accents. |

```js
import { capitalize, reverse, slugify, truncate, countWords, isPalindrome } from 'devkit-js-utils/string';

capitalize('élan');                            // 'Élan'
reverse('abc😀');                              // '😀cba'
slugify('  Café Crème: Hello, World!  ');      // 'cafe-creme-hello-world'
truncate('The quick brown fox', 10);           // 'The qui...'
truncate('The quick brown fox', 10, '…');      // 'The quick…'
countWords("Hello, world! Don't panic.");     // 4
isPalindrome('A man, a plan, a canal: Panama'); // true
```

Notes: an empty string (or one with only punctuation) is treated as a palindrome. `slugify` keeps non-Latin letters (e.g. `'Привет мир'` → `'привет-мир'`).

---

## Object Utilities

`import { ... } from 'devkit-js-utils/object'`

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `deepClone(value)` | `value: any` | same type | Deep copy of objects, arrays, `Date`, `RegExp`, `Map`, `Set`, typed arrays, with support for circular references. |
| `pick(object, keys)` | `object: object`, `keys: Array<string \| number \| symbol>` | `object` | New object with only the listed **own** keys. Missing keys are ignored. |
| `omit(object, keys)` | `object: object`, `keys: Array<string \| number \| symbol>` | `object` | New object with every own enumerable key except the listed ones. |
| `isEmpty(value)` | `value: any` | `boolean` | `true` for `null`, `undefined`, `''`, `[]`, `{}`, empty `Map`/`Set`. |

```js
import { deepClone, pick, omit, isEmpty } from 'devkit-js-utils/object';

const original = { user: { name: 'Asha', tags: ['js'] }, created: new Date() };
const copy = deepClone(original);
copy.user.tags.push('node');
original.user.tags;                             // ['js'] (unchanged)

pick({ id: 1, name: 'Asha', password: 'x' }, ['id', 'name']); // { id: 1, name: 'Asha' }
omit({ id: 1, name: 'Asha', password: 'x' }, ['password']);   // { id: 1, name: 'Asha' }

isEmpty({});        // true
isEmpty([]);        // true
isEmpty(new Map()); // true
isEmpty({ a: 1 });  // false
isEmpty(0);         // false (numbers/booleans are never "empty")
```

### `deepClone` limitations

- **Functions** are copied by reference, not cloned.
- **Class instances** keep their prototype (`instanceof` still works), but constructors are **not** re-run and **private `#fields`** are not copied.
- `WeakMap`, `WeakSet`, `Promise` (and DOM nodes) are copied **by reference**.
- Getters/setters and non-writable properties become plain data properties; only **own enumerable** string and symbol keys are copied.

`pick`, `omit` and `deepClone` never use plain assignment for keys, so a key named `"__proto__"` cannot pollute prototypes.

---

## Number Utilities

`import { ... } from 'devkit-js-utils/number'`

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `clamp(number, min, max)` | `number`, `min`, `max: number` | `number` | Restricts `number` to `[min, max]`. Throws if `min > max`. |
| `randomInt(min, max)` | `min`, `max: finite number` | `number` | Random integer in the **inclusive** range. Decimal bounds are rounded inward. |
| `isPrime(number)` | `number: number \| bigint` | `boolean` | Primality test. `0`, `1`, negatives and decimals return `false`. |
| `factorial(number)` | `number: non-negative integer \| bigint` | **`bigint`** | Exact `n!`. |
| `fibonacci(number)` | `number: non-negative integer \| bigint` | **`bigint`** | Exact nth Fibonacci number, with `F(0) = 0`, `F(1) = 1`. |

```js
import { clamp, randomInt, isPrime, factorial, fibonacci } from 'devkit-js-utils/number';

clamp(-5, 0, 10);         // 0
randomInt(1, 6);          // 1..6 (dice roll)
isPrime(97);              // true
isPrime(2305843009213693951n); // true (BigInt input)
factorial(5);             // 120n
factorial(25);            // 15511210043330985984000000n (exact)
fibonacci(10);            // 55n
fibonacci(100);           // 354224848179261915075n (exact)

// Convert BigInt results when you need a Number or a string:
Number(factorial(10));    // 3628800
factorial(30).toString(); // '265252859812191058636308480000000'
```

### Return types and limitations

- `factorial` and `fibonacci` **always return a `BigInt`** (note the `n` suffix), so results stay exact beyond `Number.MAX_SAFE_INTEGER`. Very large inputs (e.g. `factorial(100000)`) are slow because the results are huge.
- Number inputs above `Number.MAX_SAFE_INTEGER` throw a `RangeError` in `isPrime`, `factorial` and `fibonacci`. Pass a `BigInt` instead.
- `isPrime` uses trial division (6k ± 1). It is fast for normal integers but slow for very large BigInt primes.
- `randomInt` uses `Math.random()` and is **not cryptographically secure**.

---

## Error Handling

Every function validates its arguments and throws a descriptive error instead of returning wrong results:

| Error | When |
| --- | --- |
| `TypeError` | Wrong argument type (e.g. a string where an array is expected, `NaN` for numbers). |
| `RangeError` | Value of the right type, but out of range (e.g. `chunk(arr, 0)`, `clamp(1, 10, 0)`, `factorial(-1)`). |

```js
import { chunk, factorial } from 'devkit-js-utils';

try {
  chunk([1, 2, 3], 0);
} catch (error) {
  console.error(error.name);    // 'RangeError'
  console.error(error.message); // 'chunk: expected "size" to be a positive integer, received 0'
}

try {
  factorial('5');
} catch (error) {
  console.error(error instanceof TypeError); // true
}
```

---

## Requirements

- **Node.js 18 or newer** (uses `Array.prototype.flat`, `Intl.Segmenter`, Unicode property escapes and `BigInt`).
- An environment that supports **ES Modules**. Modern bundlers (Vite, webpack, esbuild) and evergreen browsers work too.

## Development

```bash
git clone https://github.com/sanjog24/devkit-js.git
cd devkit-js
npm install

npm test               # run the test suite once
npm run test:watch     # re-run tests on file changes
npm run test:coverage  # test coverage report (experimental Node flag)
npm run lint           # ESLint
npm run example        # run examples/basic-usage.js
npm run pack:check     # preview the files that will be published
```

Project structure:

```
src/
  array/index.js    string/index.js    object/index.js    number/index.js
  index.js          # main entry: re-exports all modules
tests/              # node:test suites, one per module + export tests
examples/           # runnable usage examples
scripts/            # verify-install.mjs: smoke test for an installed copy
```

## Contributing

Contributions are welcome!

1. Fork the repository and create a feature branch: `git checkout -b feat/my-feature`.
2. Add or update tests in `tests/` for any change in behaviour.
3. Make sure `npm run lint` and `npm test` both pass.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:` …).
5. Open a pull request describing the change.

Please report bugs and request features via [GitHub Issues](https://github.com/sanjog24/devkit-js/issues).

## License

[MIT](./LICENSE) © 2026 Sanjog Singh
