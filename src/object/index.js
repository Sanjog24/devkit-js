/**
 * DevKit JS - Object utilities.
 * @module object
 */

function typeName(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function assertObject(value, fn) {
  if (value === null || typeof value !== 'object') {
    throw new TypeError(`${fn}: expected "object" to be a non-null object, received ${typeName(value)}`);
  }
}

function normalizeKeys(keys, fn) {
  if (!Array.isArray(keys)) {
    throw new TypeError(`${fn}: expected "keys" to be an array, received ${typeName(keys)}`);
  }
  for (const key of keys) {
    const t = typeof key;
    if (t !== 'string' && t !== 'number' && t !== 'symbol') {
      throw new TypeError(`${fn}: every key must be a string, number or symbol, received ${typeName(key)}`);
    }
  }
  return keys.map((k) => (typeof k === 'number' ? String(k) : k));
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Creates a deep copy of a value.
 *
 * Supported: primitives, plain objects, arrays, Date, RegExp, Map, Set,
 * typed arrays / ArrayBuffer, and circular references.
 *
 * Limitations:
 * - Functions are copied by reference (not cloned).
 * - Class instances are cloned as objects that keep the same prototype,
 *   but constructors are NOT re-run and private (#) fields are not copied.
 * - WeakMap, WeakSet, Promise and DOM nodes are copied by reference.
 * - Property descriptors (getters/setters, non-writable) become plain values;
 *   only own enumerable string and symbol keys are copied.
 *
 * @template T
 * @param {T} object
 * @returns {T}
 */
export function deepClone(object) {
  return cloneValue(object, new WeakMap());
}

function cloneValue(value, seen) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) {
    const re = new RegExp(value.source, value.flags);
    re.lastIndex = value.lastIndex;
    return re;
  }
  if (ArrayBuffer.isView(value)) {
    if (value instanceof DataView) {
      return new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength);
    }
    return value.slice();
  }
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (value instanceof WeakMap || value instanceof WeakSet || value instanceof Promise) return value;

  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);
    value.forEach((v, k) => result.set(cloneValue(k, seen), cloneValue(v, seen)));
    return result;
  }
  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);
    value.forEach((v) => result.add(cloneValue(v, seen)));
    return result;
  }
  if (Array.isArray(value)) {
    const result = new Array(value.length);
    seen.set(value, result);
    for (let i = 0; i < value.length; i++) {
      if (i in value) result[i] = cloneValue(value[i], seen);
    }
    return result;
  }

  const result = Object.create(Object.getPrototypeOf(value));
  seen.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (!desc || !desc.enumerable) continue;
    // defineProperty avoids triggering a "__proto__" setter.
    Object.defineProperty(result, key, {
      value: cloneValue(value[key], seen),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  return result;
}

/**
 * Creates a new plain object containing only the listed own keys.
 * Missing keys are ignored.
 * @param {Object} object
 * @param {Array<string|number|symbol>} keys
 * @returns {Object}
 */
export function pick(object, keys) {
  assertObject(object, 'pick');
  const list = normalizeKeys(keys, 'pick');
  const result = {};
  for (const key of list) {
    if (hasOwn(object, key)) {
      Object.defineProperty(result, key, {
        value: object[key], writable: true, enumerable: true, configurable: true,
      });
    }
  }
  return result;
}

/**
 * Creates a new plain object with all own enumerable keys except the listed ones.
 * @param {Object} object
 * @param {Array<string|number|symbol>} keys
 * @returns {Object}
 */
export function omit(object, keys) {
  assertObject(object, 'omit');
  const exclude = new Set(normalizeKeys(keys, 'omit'));
  const result = {};
  for (const key of Reflect.ownKeys(object)) {
    if (exclude.has(key)) continue;
    if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
    Object.defineProperty(result, key, {
      value: object[key], writable: true, enumerable: true, configurable: true,
    });
  }
  return result;
}

/**
 * Checks whether a value is "empty":
 * - null / undefined -> true
 * - string / array / typed array -> length === 0
 * - Map / Set -> size === 0
 * - object -> has no own enumerable string or symbol keys
 * - numbers, booleans, functions, etc. -> false
 * @param {*} object
 * @returns {boolean}
 */
export function isEmpty(object) {
  if (object === null || object === undefined) return true;
  if (typeof object === 'string' || Array.isArray(object)) return object.length === 0;
  if (ArrayBuffer.isView(object) && !(object instanceof DataView)) return object.length === 0;
  if (object instanceof Map || object instanceof Set) return object.size === 0;
  if (typeof object === 'object') {
    return Reflect.ownKeys(object).every(
      (key) => !Object.prototype.propertyIsEnumerable.call(object, key),
    );
  }
  return false;
}
