// Verifies the public "exports" map by importing the package through its own
// name (Node.js package self-referencing), exactly as consumers would.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const EXPECTED = {
  array: ['unique', 'chunk', 'flatten', 'shuffle', 'groupBy', 'difference', 'intersection'],
  string: ['capitalize', 'reverse', 'slugify', 'truncate', 'countWords', 'isPalindrome'],
  object: ['deepClone', 'pick', 'omit', 'isEmpty'],
  number: ['clamp', 'randomInt', 'isPrime', 'factorial', 'fibonacci'],
};

describe('package exports', () => {
  it('main entry exposes every utility as a function', async () => {
    const main = await import(pkg.name);
    const all = Object.values(EXPECTED).flat();
    for (const name of all) assert.equal(typeof main[name], 'function', `${name} missing`);
    assert.equal(Object.keys(main).length, all.length);
  });

  for (const [mod, names] of Object.entries(EXPECTED)) {
    it(`"${pkg.name}/${mod}" exposes exactly its utilities`, async () => {
      const sub = await import(`${pkg.name}/${mod}`);
      assert.deepEqual(Object.keys(sub).sort(), [...names].sort());
    });
  }

  it('subpath and main exports are the same functions', async () => {
    const main = await import(pkg.name);
    const { unique } = await import(`${pkg.name}/array`);
    const { clamp } = await import(`${pkg.name}/number`);
    assert.equal(main.unique, unique);
    assert.equal(main.clamp, clamp);
  });

  it('does not expose internal files', async () => {
    await assert.rejects(import(`${pkg.name}/src/array/index.js`), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  });
});
