/**
 * DevKit JS - Number utilities.
 * @module number
 */

function assertFiniteNumber(value, name, fn) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`${fn}: expected "${name}" to be a number, received ${value === null ? 'null' : typeof value}`);
  }
}

function toNonNegativeInteger(value, fn) {
  if (typeof value === 'bigint') {
    if (value < 0n) throw new RangeError(`${fn}: expected a non-negative integer, received ${value}`);
    return value;
  }
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new TypeError(`${fn}: expected a non-negative integer, received ${typeof value === 'number' ? value : typeof value}`);
  }
  if (value < 0) throw new RangeError(`${fn}: expected a non-negative integer, received ${value}`);
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${fn}: input ${value} exceeds Number.MAX_SAFE_INTEGER; pass a BigInt instead`);
  }
  return BigInt(value);
}

/**
 * Restricts `number` to the inclusive range [min, max].
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @throws {RangeError} if min > max
 */
export function clamp(number, min, max) {
  assertFiniteNumber(number, 'number', 'clamp');
  assertFiniteNumber(min, 'min', 'clamp');
  assertFiniteNumber(max, 'max', 'clamp');
  if (min > max) throw new RangeError(`clamp: "min" (${min}) must be less than or equal to "max" (${max})`);
  return Math.min(Math.max(number, min), max);
}

/**
 * Returns a random integer in the inclusive range [min, max].
 * Non-integer bounds are rounded inward (min up, max down).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  assertFiniteNumber(min, 'min', 'randomInt');
  assertFiniteNumber(max, 'max', 'randomInt');
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('randomInt: "min" and "max" must be finite numbers');
  }
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (lo > hi) throw new RangeError(`randomInt: no integer exists between ${min} and ${max}`);
  if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi) || !Number.isSafeInteger(hi - lo + 1)) {
    throw new RangeError('randomInt: range must be within safe integer limits');
  }
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Checks whether a value is a prime number. Accepts numbers or BigInts.
 * Negative numbers, 0, 1 and non-integers return false.
 * Numbers above Number.MAX_SAFE_INTEGER throw (pass a BigInt instead).
 * @param {number|bigint} number
 * @returns {boolean}
 */
export function isPrime(number) {
  if (typeof number === 'bigint') return isPrimeBig(number);
  if (typeof number !== 'number' || Number.isNaN(number)) {
    throw new TypeError(`isPrime: expected a number or bigint, received ${number === null ? 'null' : typeof number}`);
  }
  if (!Number.isInteger(number) || number < 2) return false;
  if (!Number.isSafeInteger(number)) {
    throw new RangeError(`isPrime: ${number} exceeds Number.MAX_SAFE_INTEGER; pass a BigInt instead`);
  }
  if (number < 4) return true;
  if (number % 2 === 0 || number % 3 === 0) return false;
  for (let i = 5; i * i <= number; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) return false;
  }
  return true;
}

function isPrimeBig(n) {
  if (n < 2n) return false;
  if (n < 4n) return true;
  if (n % 2n === 0n || n % 3n === 0n) return false;
  for (let i = 5n; i * i <= n; i += 6n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
  }
  return true;
}

/**
 * Computes n! exactly. Always returns a BigInt so large results are precise.
 * @param {number|bigint} number - non-negative integer
 * @returns {bigint}
 * @example factorial(5) // 120n
 */
export function factorial(number) {
  const n = toNonNegativeInteger(number, 'factorial');
  let result = 1n;
  for (let i = 2n; i <= n; i++) result *= i;
  return result;
}

/**
 * Returns the nth Fibonacci number (F(0) = 0, F(1) = 1) exactly.
 * Always returns a BigInt so large results are precise.
 * @param {number|bigint} number - non-negative integer index
 * @returns {bigint}
 * @example fibonacci(10) // 55n
 */
export function fibonacci(number) {
  const n = toNonNegativeInteger(number, 'fibonacci');
  let a = 0n;
  let b = 1n;
  for (let i = 0n; i < n; i++) [a, b] = [b, a + b];
  return a;
}
