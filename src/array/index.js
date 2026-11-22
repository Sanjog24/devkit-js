/**
 * DevKit JS - Array utilities.
 * All functions are pure: they never mutate the input arrays.
 * @module array
 */

function assertArray(value, name = 'array', fn = 'function') {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fn}: expected "${name}" to be an array, received ${describe(value)}`);
  }
}

function describe(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Returns a new array with duplicate values removed (SameValueZero equality).
 * Order of first occurrence is preserved.
 * @param {Array} array
 * @returns {Array}
 */
export function unique(array) {
  assertArray(array, 'array', 'unique');
  return [...new Set(array)];
}

/**
 * Splits an array into groups of `size`. The last chunk may be smaller.
 * @param {Array} array
 * @param {number} size - positive integer
 * @returns {Array<Array>}
 */
export function chunk(array, size) {
  assertArray(array, 'array', 'chunk');
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`chunk: expected "size" to be a positive integer, received ${String(size)}`);
  }
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Deeply flattens nested arrays into a single-level array.
 * @param {Array} array
 * @returns {Array}
 */
export function flatten(array) {
  assertArray(array, 'array', 'flatten');
  return array.flat(Infinity);
}

/**
 * Returns a new array with the elements randomly shuffled (Fisher-Yates).
 * The original array is NOT modified.
 * @param {Array} array
 * @returns {Array}
 */
export function shuffle(array) {
  assertArray(array, 'array', 'shuffle');
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Groups array items by a property name or by the result of a function.
 * Returns a null-prototype object so keys like "__proto__" are safe.
 * @param {Array} array
 * @param {string|number|symbol|Function} key - property name or (item, index) => groupKey
 * @returns {Object<string, Array>}
 */
export function groupBy(array, key) {
  assertArray(array, 'array', 'groupBy');
  const keyType = typeof key;
  if (keyType !== 'function' && keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
    throw new TypeError(`groupBy: expected "key" to be a string, number, symbol or function, received ${describe(key)}`);
  }
  const getKey = keyType === 'function'
    ? key
    : (item) => (item === null || item === undefined ? undefined : item[key]);
  const groups = Object.create(null);
  array.forEach((item, index) => {
    const groupKey = getKey(item, index);
    (groups[groupKey] ||= []).push(item);
  });
  return groups;
}

/**
 * Returns values from `array1` that are not present in `array2`.
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array}
 */
export function difference(array1, array2) {
  assertArray(array1, 'array1', 'difference');
  assertArray(array2, 'array2', 'difference');
  const exclude = new Set(array2);
  return array1.filter((item) => !exclude.has(item));
}

/**
 * Returns unique values present in both arrays, in the order of `array1`.
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array}
 */
export function intersection(array1, array2) {
  assertArray(array1, 'array1', 'intersection');
  assertArray(array2, 'array2', 'intersection');
  const include = new Set(array2);
  return unique(array1.filter((item) => include.has(item)));
}
