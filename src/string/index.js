/**
 * DevKit JS - String utilities.
 * Functions operate on Unicode code points / grapheme clusters where practical.
 * @module string
 */

function assertString(value, fn, name = 'string') {
  if (typeof value !== 'string') {
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    throw new TypeError(`${fn}: expected "${name}" to be a string, received ${type}`);
  }
}

const segmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null;

/** Splits a string into user-perceived characters (grapheme clusters). */
function graphemes(str) {
  if (segmenter) return Array.from(segmenter.segment(str), (s) => s.segment);
  return Array.from(str);
}

/**
 * Uppercases the first character of the string. The rest is left unchanged.
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  assertString(string, 'capitalize');
  if (string.length === 0) return '';
  const [first, ...rest] = graphemes(string);
  return first.toUpperCase() + rest.join('');
}

/**
 * Reverses a string, keeping emoji and combining characters intact.
 * @param {string} string
 * @returns {string}
 */
export function reverse(string) {
  assertString(string, 'reverse');
  return graphemes(string).reverse().join('');
}

/**
 * Converts a string into a URL-friendly slug.
 * Accents are removed ("Café" -> "cafe"), punctuation is dropped and
 * whitespace/underscores become single hyphens.
 * @param {string} string
 * @returns {string}
 */
export function slugify(string) {
  assertString(string, 'slugify');
  return string
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates a string to at most `length` characters, appending `suffix`
 * (default "...") when truncation happens. The suffix counts toward `length`.
 * @param {string} string
 * @param {number} length - non-negative integer
 * @param {string} [suffix='...']
 * @returns {string}
 */
export function truncate(string, length, suffix = '...') {
  assertString(string, 'truncate');
  assertString(suffix, 'truncate', 'suffix');
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError(`truncate: expected "length" to be a non-negative integer, received ${String(length)}`);
  }
  const chars = graphemes(string);
  if (chars.length <= length) return string;
  const suffixChars = graphemes(suffix);
  if (length <= suffixChars.length) return suffixChars.slice(0, length).join('');
  return chars.slice(0, length - suffixChars.length).join('') + suffix;
}

/**
 * Counts words in a string. Words are runs of letters/numbers (apostrophes
 * and hyphens inside words are allowed). Punctuation is ignored.
 * @param {string} string
 * @returns {number}
 */
export function countWords(string) {
  assertString(string, 'countWords');
  const matches = string.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}

/**
 * Checks whether a string reads the same forwards and backwards, ignoring
 * case, whitespace, punctuation and accents.
 * An empty (or punctuation-only) string is considered a palindrome.
 * @param {string} string
 * @returns {boolean}
 */
export function isPalindrome(string) {
  assertString(string, 'isPalindrome');
  const cleaned = string
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
  const chars = Array.from(cleaned);
  for (let i = 0, j = chars.length - 1; i < j; i++, j--) {
    if (chars[i] !== chars[j]) return false;
  }
  return true;
}
