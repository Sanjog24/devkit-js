import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  capitalize, reverse, slugify, truncate, countWords, isPalindrome,
} from '../src/string/index.js';

const NON_STRINGS = [null, undefined, 42, {}, [], true];

describe('capitalize', () => {
  it('uppercases the first letter only', () => {
    assert.equal(capitalize('hello world'), 'Hello world');
    assert.equal(capitalize('hELLO'), 'HELLO');
  });
  it('handles empty and single-character strings', () => {
    assert.equal(capitalize(''), '');
    assert.equal(capitalize('a'), 'A');
  });
  it('leaves leading whitespace/non-letters untouched', () => {
    assert.equal(capitalize('  hi'), '  hi');
    assert.equal(capitalize('1st'), '1st');
  });
  it('handles Unicode', () => {
    assert.equal(capitalize('élan'), 'Élan');
    assert.equal(capitalize('😀 smile'), '😀 smile');
  });
  it('throws TypeError for non-strings', () => {
    for (const bad of NON_STRINGS) assert.throws(() => capitalize(bad), TypeError);
  });
});

describe('reverse', () => {
  it('reverses ASCII strings', () => {
    assert.equal(reverse('hello'), 'olleh');
  });
  it('handles empty strings and whitespace', () => {
    assert.equal(reverse(''), '');
    assert.equal(reverse(' a b '), ' b a ');
  });
  it('keeps emoji and combining marks intact', () => {
    assert.equal(reverse('ab😀'), '😀ba');
    assert.equal(reverse('cafe\u0301'), 'e\u0301fac');
    assert.equal(reverse('👨‍👩‍👧x'), 'x👨‍👩‍👧');
  });
  it('throws TypeError for non-strings', () => {
    for (const bad of NON_STRINGS) assert.throws(() => reverse(bad), TypeError);
  });
});

describe('slugify', () => {
  it('creates URL-friendly slugs', () => {
    assert.equal(slugify('Hello World'), 'hello-world');
    assert.equal(slugify('  Hello,   World!  '), 'hello-world');
  });
  it('removes accents and punctuation', () => {
    assert.equal(slugify('Café Crème Brûlée'), 'cafe-creme-brulee');
    assert.equal(slugify("It's 100% fun & games"), 'its-100-fun-games');
  });
  it('collapses underscores and repeated hyphens', () => {
    assert.equal(slugify('foo__bar--baz'), 'foo-bar-baz');
    assert.equal(slugify('--trim-me--'), 'trim-me');
  });
  it('keeps non-Latin letters', () => {
    assert.equal(slugify('नमस्ते दुनिया').length > 0, true);
    assert.equal(slugify('Привет мир'), 'привет-мир');
  });
  it('returns empty string for empty or symbol-only input', () => {
    assert.equal(slugify(''), '');
    assert.equal(slugify('!!!'), '');
  });
  it('throws TypeError for non-strings', () => {
    for (const bad of NON_STRINGS) assert.throws(() => slugify(bad), TypeError);
  });
});

describe('truncate', () => {
  it('returns the string unchanged when short enough', () => {
    assert.equal(truncate('hello', 5), 'hello');
    assert.equal(truncate('hello', 10), 'hello');
  });
  it('truncates with a default "..." suffix counted in length', () => {
    assert.equal(truncate('hello world', 8), 'hello...');
    assert.equal(truncate('hello world', 8).length, 8);
  });
  it('supports a custom suffix', () => {
    assert.equal(truncate('hello world', 6, '…'), 'hello…');
    assert.equal(truncate('hello world', 5, ''), 'hello');
  });
  it('handles lengths smaller than the suffix', () => {
    assert.equal(truncate('hello world', 2), '..');
    assert.equal(truncate('hello', 0), '');
  });
  it('handles empty strings', () => {
    assert.equal(truncate('', 3), '');
  });
  it('does not split emoji', () => {
    assert.equal(truncate('😀😀😀😀', 3, '.'), '😀😀.');
  });
  it('validates arguments', () => {
    assert.throws(() => truncate(123, 2), TypeError);
    assert.throws(() => truncate('abc', -1), RangeError);
    assert.throws(() => truncate('abc', 1.5), RangeError);
    assert.throws(() => truncate('abc'), RangeError);
    assert.throws(() => truncate('abc', 2, 5), TypeError);
  });
});

describe('countWords', () => {
  it('counts words separated by whitespace', () => {
    assert.equal(countWords('The quick brown fox'), 4);
  });
  it('ignores extra whitespace and punctuation', () => {
    assert.equal(countWords('  Hello,   world!  How are you?  '), 5);
    assert.equal(countWords('--- ... !!!'), 0);
  });
  it('treats contractions and hyphenated words as one word', () => {
    assert.equal(countWords("don't stop well-known"), 3);
  });
  it('counts Unicode words and numbers', () => {
    assert.equal(countWords('Привет мир 2024'), 3);
  });
  it('returns 0 for empty/whitespace strings', () => {
    assert.equal(countWords(''), 0);
    assert.equal(countWords('   \n\t '), 0);
  });
  it('throws TypeError for non-strings', () => {
    for (const bad of NON_STRINGS) assert.throws(() => countWords(bad), TypeError);
  });
});

describe('isPalindrome', () => {
  it('detects simple palindromes', () => {
    assert.equal(isPalindrome('racecar'), true);
    assert.equal(isPalindrome('hello'), false);
  });
  it('ignores case, spaces, punctuation', () => {
    assert.equal(isPalindrome('A man, a plan, a canal: Panama!'), true);
    assert.equal(isPalindrome('Was it a car or a cat I saw?'), true);
  });
  it('ignores accents and handles Unicode', () => {
    assert.equal(isPalindrome('Ésope reste ici et se repose'), true);
    assert.equal(isPalindrome('😀a😀'), true);
  });
  it('handles empty and single-character strings', () => {
    assert.equal(isPalindrome(''), true);
    assert.equal(isPalindrome('x'), true);
    assert.equal(isPalindrome('12321'), true);
    assert.equal(isPalindrome('123'), false);
  });
  it('throws TypeError for non-strings', () => {
    for (const bad of NON_STRINGS) assert.throws(() => isPalindrome(bad), TypeError);
  });
});
