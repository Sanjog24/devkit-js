// Smoke test used to verify an installed copy of devkit-js-utils.
// Run from a project that has the package installed:
//   node /path/to/verify-install.mjs
import * as main from 'devkit-js-utils';
import { unique, chunk } from 'devkit-js-utils/array';
import { capitalize, slugify } from 'devkit-js-utils/string';
import { pick, omit } from 'devkit-js-utils/object';
import { clamp, isPrime, factorial } from 'devkit-js-utils/number';
import assert from 'node:assert/strict';

assert.deepEqual(unique([1, 1, 2]), [1, 2]);
assert.deepEqual(chunk([1, 2, 3], 2), [[1, 2], [3]]);
assert.equal(capitalize('devkit'), 'Devkit');
assert.equal(slugify('Hello World!'), 'hello-world');
assert.deepEqual(pick({ a: 1, b: 2 }, ['a']), { a: 1 });
assert.deepEqual(omit({ a: 1, b: 2 }, ['a']), { b: 2 });
assert.equal(clamp(15, 0, 10), 10);
assert.equal(isPrime(13), true);
assert.equal(factorial(5), 120n);
assert.equal(Object.keys(main).length, 22);

console.log(`OK: devkit-js-utils installed correctly (${Object.keys(main).length} exports verified)`);
