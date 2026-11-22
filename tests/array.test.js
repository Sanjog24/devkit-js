import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  unique, chunk, flatten, shuffle, groupBy, difference, intersection,
} from '../src/array/index.js';

describe('unique', () => {
  it('removes duplicates and keeps first-occurrence order', () => {
    assert.deepEqual(unique([3, 1, 3, 2, 1]), [3, 1, 2]);
  });
  it('handles mixed types and NaN', () => {
    assert.deepEqual(unique([1, '1', NaN, NaN, null, null, undefined]), [1, '1', NaN, null, undefined]);
  });
  it('returns an empty array for empty input', () => {
    assert.deepEqual(unique([]), []);
  });
  it('does not mutate the input', () => {
    const input = [1, 1, 2];
    unique(input);
    assert.deepEqual(input, [1, 1, 2]);
  });
  it('throws TypeError for non-arrays', () => {
    for (const bad of [null, undefined, 'abc', 42, {}, new Set([1])]) {
      assert.throws(() => unique(bad), TypeError);
    }
  });
});

describe('chunk', () => {
  it('splits into equal chunks', () => {
    assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
  });
  it('puts the remainder in the last chunk', () => {
    assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  });
  it('returns a single chunk when size >= length', () => {
    assert.deepEqual(chunk([1, 2], 10), [[1, 2]]);
  });
  it('returns [] for empty array', () => {
    assert.deepEqual(chunk([], 3), []);
  });
  it('throws RangeError for invalid size', () => {
    for (const bad of [0, -1, 1.5, NaN, Infinity, '2', undefined]) {
      assert.throws(() => chunk([1, 2], bad), RangeError);
    }
  });
  it('throws TypeError for non-array', () => {
    assert.throws(() => chunk('abc', 1), TypeError);
  });
});

describe('flatten', () => {
  it('deeply flattens nested arrays', () => {
    assert.deepEqual(flatten([1, [2, [3, [4, [5]]]]]), [1, 2, 3, 4, 5]);
  });
  it('leaves flat arrays unchanged and does not mutate', () => {
    const input = [1, [2]];
    assert.deepEqual(flatten(input), [1, 2]);
    assert.deepEqual(input, [1, [2]]);
  });
  it('handles empty and nested empty arrays', () => {
    assert.deepEqual(flatten([]), []);
    assert.deepEqual(flatten([[], [[]]]), []);
  });
  it('does not flatten objects or strings', () => {
    assert.deepEqual(flatten(['ab', { a: [1] }]), ['ab', { a: [1] }]);
  });
  it('throws for non-arrays', () => {
    assert.throws(() => flatten({ length: 0 }), TypeError);
  });
});

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input);
    assert.notEqual(out, input);
    assert.deepEqual([...out].sort((a, b) => a - b), input);
  });
  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input);
    assert.deepEqual(input, [1, 2, 3, 4, 5]);
  });
  it('eventually produces a different order', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const changed = Array.from({ length: 10 }, () => shuffle(input))
      .some((out) => out.some((v, i) => v !== input[i]));
    assert.ok(changed);
  });
  it('handles empty and single-element arrays', () => {
    assert.deepEqual(shuffle([]), []);
    assert.deepEqual(shuffle([1]), [1]);
  });
  it('throws for non-arrays', () => {
    assert.throws(() => shuffle(null), TypeError);
  });
});

describe('groupBy', () => {
  const people = [
    { name: 'Asha', role: 'dev' },
    { name: 'Ravi', role: 'qa' },
    { name: 'Meera', role: 'dev' },
  ];
  it('groups by property name', () => {
    const groups = groupBy(people, 'role');
    assert.deepEqual(Object.keys(groups), ['dev', 'qa']);
    assert.deepEqual(groups.dev.map((p) => p.name), ['Asha', 'Meera']);
  });
  it('groups by function', () => {
    const groups = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 ? 'odd' : 'even'));
    assert.deepEqual({ ...groups }, { odd: [1, 3, 5], even: [2, 4] });
  });
  it('puts items missing the key under "undefined"', () => {
    const groups = groupBy([{ a: 1 }, {}, null], 'a');
    assert.deepEqual(groups['1'], [{ a: 1 }]);
    assert.deepEqual(groups.undefined, [{}, null]);
  });
  it('safely handles "__proto__" as a group key', () => {
    const groups = groupBy([{ k: '__proto__' }], 'k');
    assert.equal(Object.getPrototypeOf(groups), null);
    assert.equal(groups.__proto__.length, 1);
    assert.equal({}.polluted, undefined);
  });
  it('returns empty object for empty array', () => {
    assert.deepEqual(Object.keys(groupBy([], 'x')), []);
  });
  it('throws for invalid arguments', () => {
    assert.throws(() => groupBy('nope', 'x'), TypeError);
    assert.throws(() => groupBy([], null), TypeError);
    assert.throws(() => groupBy([], {}), TypeError);
  });
});

describe('difference', () => {
  it('returns values in first array not in second', () => {
    assert.deepEqual(difference([1, 2, 3, 4], [2, 4]), [1, 3]);
  });
  it('keeps duplicates from the first array', () => {
    assert.deepEqual(difference([1, 1, 2], [2]), [1, 1]);
  });
  it('handles empty arrays', () => {
    assert.deepEqual(difference([], [1]), []);
    assert.deepEqual(difference([1, 2], []), [1, 2]);
  });
  it('compares objects by reference', () => {
    const a = { id: 1 };
    assert.deepEqual(difference([a, { id: 1 }], [a]), [{ id: 1 }]);
  });
  it('throws for non-arrays', () => {
    assert.throws(() => difference([1], 'x'), /array2/);
    assert.throws(() => difference(null, []), /array1/);
  });
});

describe('intersection', () => {
  it('returns common unique values', () => {
    assert.deepEqual(intersection([1, 2, 2, 3], [2, 3, 4]), [2, 3]);
  });
  it('handles no overlap and empty arrays', () => {
    assert.deepEqual(intersection([1, 2], [3]), []);
    assert.deepEqual(intersection([], [1]), []);
  });
  it('preserves order of the first array', () => {
    assert.deepEqual(intersection(['c', 'a', 'b'], ['a', 'b', 'c']), ['c', 'a', 'b']);
  });
  it('throws for non-arrays', () => {
    assert.throws(() => intersection([1], undefined), TypeError);
  });
});
