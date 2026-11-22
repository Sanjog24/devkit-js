import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  deepClone, pick, omit, isEmpty,
} from '../src/object/index.js';

describe('deepClone', () => {
  it('returns primitives as-is', () => {
    for (const v of [1, 'a', true, null, undefined, 10n]) assert.equal(deepClone(v), v);
  });
  it('deeply clones nested objects and arrays', () => {
    const src = { a: 1, b: { c: [1, { d: 2 }] } };
    const copy = deepClone(src);
    assert.deepEqual(copy, src);
    assert.notEqual(copy.b, src.b);
    assert.notEqual(copy.b.c, src.b.c);
    copy.b.c[1].d = 99;
    assert.equal(src.b.c[1].d, 2);
  });
  it('clones arrays (including sparse arrays)', () => {
    const arr = [1, [2, 3]];
    const copy = deepClone(arr);
    assert.ok(Array.isArray(copy));
    assert.deepEqual(copy, arr);
    assert.notEqual(copy[1], arr[1]);
    // eslint-disable-next-line no-sparse-arrays
    const sparse = [1, , 3];
    assert.equal(1 in deepClone(sparse), false);
  });
  it('clones Date, RegExp, Map, Set and typed arrays', () => {
    const date = new Date('2024-01-01');
    const src = {
      date, re: /ab+c/gi, map: new Map([['k', { v: 1 }]]), set: new Set([1, 2]), bytes: new Uint8Array([1, 2]),
    };
    const copy = deepClone(src);
    assert.notEqual(copy.date, date);
    assert.equal(copy.date.getTime(), date.getTime());
    assert.equal(copy.re.source, 'ab+c');
    assert.equal(copy.re.flags, 'gi');
    assert.notEqual(copy.map.get('k'), src.map.get('k'));
    assert.deepEqual(copy.map.get('k'), { v: 1 });
    assert.deepEqual([...copy.set], [1, 2]);
    assert.notEqual(copy.bytes, src.bytes);
    assert.deepEqual([...copy.bytes], [1, 2]);
  });
  it('handles circular references', () => {
    const src = { name: 'loop' };
    src.self = src;
    const copy = deepClone(src);
    assert.equal(copy.self, copy);
    assert.notEqual(copy, src);
  });
  it('copies symbol keys and keeps the prototype', () => {
    const sym = Symbol('s');
    class Point { constructor(x) { this.x = x; } }
    const copy = deepClone({ [sym]: 1, p: new Point(2) });
    assert.equal(copy[sym], 1);
    assert.ok(copy.p instanceof Point);
    assert.equal(copy.p.x, 2);
  });
  it('works with null-prototype objects and own __proto__ keys', () => {
    const src = Object.create(null);
    src.a = 1;
    const copy = deepClone(src);
    assert.equal(Object.getPrototypeOf(copy), null);
    const tricky = JSON.parse('{"__proto__": {"polluted": true}}');
    const trickyCopy = deepClone(tricky);
    assert.equal({}.polluted, undefined);
    assert.equal(Object.getPrototypeOf(trickyCopy), Object.prototype);
  });
  it('keeps functions by reference (documented limitation)', () => {
    const fn = () => 1;
    assert.equal(deepClone({ fn }).fn, fn);
  });
});

describe('pick', () => {
  const user = { id: 1, name: 'Asha', email: 'a@x.dev', nested: { a: 1 } };
  it('picks the listed keys', () => {
    assert.deepEqual(pick(user, ['id', 'name']), { id: 1, name: 'Asha' });
  });
  it('ignores missing and inherited keys', () => {
    assert.deepEqual(pick(user, ['nope', 'toString']), {});
  });
  it('supports numeric and symbol keys', () => {
    const sym = Symbol('x');
    assert.deepEqual(pick({ 1: 'one', [sym]: 2 }, [1, sym]), { 1: 'one', [sym]: 2 });
  });
  it('works with arrays and keeps nested references', () => {
    assert.deepEqual(pick(['a', 'b'], [0]), { 0: 'a' });
    assert.equal(pick(user, ['nested']).nested, user.nested);
  });
  it('does not mutate the input', () => {
    const copy = { ...user };
    pick(user, ['id']);
    assert.deepEqual(user, copy);
  });
  it('handles empty keys/objects', () => {
    assert.deepEqual(pick({}, ['a']), {});
    assert.deepEqual(pick(user, []), {});
  });
  it('validates inputs', () => {
    assert.throws(() => pick(null, ['a']), TypeError);
    assert.throws(() => pick('str', ['a']), TypeError);
    assert.throws(() => pick({}, 'a'), TypeError);
    assert.throws(() => pick({}, [{}]), TypeError);
  });
});

describe('omit', () => {
  const user = { id: 1, name: 'Asha', password: 'secret' };
  it('omits the listed keys', () => {
    assert.deepEqual(omit(user, ['password']), { id: 1, name: 'Asha' });
  });
  it('ignores keys that do not exist', () => {
    assert.deepEqual(omit(user, ['missing']), user);
  });
  it('supports symbol and numeric keys', () => {
    const sym = Symbol('s');
    const result = omit({ 1: 'a', 2: 'b', [sym]: 1 }, [1, sym]);
    assert.deepEqual(result, { 2: 'b' });
  });
  it('returns a new object without mutating', () => {
    const result = omit(user, []);
    assert.notEqual(result, user);
    assert.deepEqual(user, { id: 1, name: 'Asha', password: 'secret' });
  });
  it('skips inherited and non-enumerable properties', () => {
    const obj = Object.create({ inherited: 1 });
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
    obj.visible = 3;
    assert.deepEqual(omit(obj, []), { visible: 3 });
  });
  it('validates inputs', () => {
    assert.throws(() => omit(undefined, []), TypeError);
    assert.throws(() => omit({}, null), TypeError);
  });
});

describe('isEmpty', () => {
  it('returns true for empty values', () => {
    const values = [null, undefined, '', [], {}, new Map(), new Set(), Object.create(null), new Uint8Array(0)];
    values.forEach((v, i) => assert.equal(isEmpty(v), true, `expected value at index ${i} to be empty`));
  });
  it('returns false for non-empty values', () => {
    for (const v of ['a', [0], { a: undefined }, new Map([[1, 1]]), new Set([0]), { [Symbol('x')]: 1 }]) {
      assert.equal(isEmpty(v), false);
    }
  });
  it('returns false for numbers, booleans and functions', () => {
    for (const v of [0, 1, NaN, true, false, () => {}]) assert.equal(isEmpty(v), false);
  });
  it('ignores inherited properties', () => {
    assert.equal(isEmpty(Object.create({ a: 1 })), true);
  });
});
