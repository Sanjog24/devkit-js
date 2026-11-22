import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp, randomInt, isPrime, factorial, fibonacci,
} from '../src/number/index.js';

describe('clamp', () => {
  it('clamps values to the range', () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-5, 0, 10), 0);
    assert.equal(clamp(15, 0, 10), 10);
  });
  it('handles boundaries, negatives and decimals', () => {
    assert.equal(clamp(0, 0, 10), 0);
    assert.equal(clamp(10, 0, 10), 10);
    assert.equal(clamp(-7, -10, -5), -7);
    assert.equal(clamp(1.5, 0, 1), 1);
    assert.equal(clamp(3, 3, 3), 3);
  });
  it('supports Infinity bounds', () => {
    assert.equal(clamp(1e308, -Infinity, Infinity), 1e308);
    assert.equal(clamp(Infinity, 0, 1), 1);
  });
  it('throws when min > max', () => {
    assert.throws(() => clamp(1, 10, 0), RangeError);
  });
  it('throws for non-numbers and NaN', () => {
    assert.throws(() => clamp('5', 0, 10), TypeError);
    assert.throws(() => clamp(NaN, 0, 10), TypeError);
    assert.throws(() => clamp(5, null, 10), TypeError);
    assert.throws(() => clamp(5, 0), TypeError);
  });
});

describe('randomInt', () => {
  it('returns integers within the inclusive range', () => {
    const seen = new Set();
    for (let i = 0; i < 500; i++) {
      const n = randomInt(1, 3);
      assert.ok(Number.isInteger(n) && n >= 1 && n <= 3);
      seen.add(n);
    }
    assert.deepEqual([...seen].sort(), [1, 2, 3]);
  });
  it('handles equal bounds, negatives and zero', () => {
    assert.equal(randomInt(5, 5), 5);
    assert.equal(randomInt(0, 0), 0);
    const n = randomInt(-10, -5);
    assert.ok(n >= -10 && n <= -5);
  });
  it('rounds non-integer bounds inward', () => {
    for (let i = 0; i < 50; i++) {
      const n = randomInt(1.2, 2.8);
      assert.equal(n, 2);
    }
  });
  it('throws for invalid ranges', () => {
    assert.throws(() => randomInt(10, 1), RangeError);
    assert.throws(() => randomInt(1.1, 1.9), RangeError);
    assert.throws(() => randomInt(0, Infinity), RangeError);
    assert.throws(() => randomInt(0, Number.MAX_VALUE), RangeError);
  });
  it('throws for non-numbers', () => {
    assert.throws(() => randomInt('1', 2), TypeError);
    assert.throws(() => randomInt(1), TypeError);
  });
});

describe('isPrime', () => {
  it('identifies small primes', () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 97];
    for (const p of primes) assert.equal(isPrime(p), true, `${p} should be prime`);
  });
  it('rejects composites', () => {
    for (const c of [4, 6, 8, 9, 15, 21, 25, 49, 100, 561]) assert.equal(isPrime(c), false, `${c}`);
  });
  it('returns false for 0, 1, negatives and non-integers', () => {
    for (const v of [0, 1, -2, -7, 2.5, Infinity, -Infinity]) assert.equal(isPrime(v), false);
  });
  it('handles large safe integers correctly', () => {
    assert.equal(isPrime(2147483647), true);
    assert.equal(isPrime(1000000007), true);
    assert.equal(isPrime(1000000007 * 3), false);
  });
  it('supports BigInt input', () => {
    assert.equal(isPrime(7n), true);
    assert.equal(isPrime(1n), false);
    assert.equal(isPrime(-7n), false);
    assert.equal(isPrime(2305843009213693951n), true); // 2^61 - 1
  });
  it('throws for unsafe numbers and invalid types', () => {
    assert.throws(() => isPrime(2 ** 60), RangeError);
    assert.throws(() => isPrime('7'), TypeError);
    assert.throws(() => isPrime(NaN), TypeError);
    assert.throws(() => isPrime(null), TypeError);
  });
});

describe('factorial', () => {
  it('computes small factorials as BigInt', () => {
    assert.equal(factorial(0), 1n);
    assert.equal(factorial(1), 1n);
    assert.equal(factorial(5), 120n);
    assert.equal(factorial(10), 3628800n);
  });
  it('is exact for large inputs', () => {
    assert.equal(factorial(25), 15511210043330985984000000n);
    assert.equal(factorial(100).toString().length, 158);
  });
  it('accepts BigInt input', () => {
    assert.equal(factorial(6n), 720n);
  });
  it('rejects negatives, non-integers and unsafe values', () => {
    assert.throws(() => factorial(-1), RangeError);
    assert.throws(() => factorial(-1n), RangeError);
    assert.throws(() => factorial(2.5), TypeError);
    assert.throws(() => factorial('5'), TypeError);
    assert.throws(() => factorial(NaN), TypeError);
    assert.throws(() => factorial(2 ** 60), RangeError);
  });
});

describe('fibonacci', () => {
  it('returns the first Fibonacci numbers', () => {
    const expected = [0n, 1n, 1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n, 55n];
    expected.forEach((v, i) => assert.equal(fibonacci(i), v));
  });
  it('is exact beyond Number.MAX_SAFE_INTEGER', () => {
    assert.equal(fibonacci(78), 8944394323791464n);
    assert.equal(fibonacci(100), 354224848179261915075n);
  });
  it('accepts BigInt input', () => {
    assert.equal(fibonacci(12n), 144n);
  });
  it('rejects invalid input', () => {
    assert.throws(() => fibonacci(-1), RangeError);
    assert.throws(() => fibonacci(1.5), TypeError);
    assert.throws(() => fibonacci(undefined), TypeError);
    assert.throws(() => fibonacci([]), TypeError);
  });
});
