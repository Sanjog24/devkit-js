// Runnable example: `npm run example` (or `node examples/basic-usage.js`).
// Inside this repo we import from the source; in your own project use:
//   import { unique, ... } from 'devkit-js-utils';
import {
  unique, chunk, flatten, shuffle, groupBy, difference, intersection,
  capitalize, reverse, slugify, truncate, countWords, isPalindrome,
  deepClone, pick, omit, isEmpty,
  clamp, randomInt, isPrime, factorial, fibonacci,
} from '../src/index.js';

console.log('--- Array utilities ---');
console.log('unique:', unique([1, 2, 2, 3, 3, 3]));
console.log('chunk:', chunk([1, 2, 3, 4, 5], 2));
console.log('flatten:', flatten([1, [2, [3, [4]]]]));
console.log('shuffle:', shuffle([1, 2, 3, 4, 5]));
console.log('groupBy:', groupBy(
  [{ name: 'Asha', team: 'web' }, { name: 'Ravi', team: 'ml' }, { name: 'Meera', team: 'web' }],
  'team',
));
console.log('difference:', difference([1, 2, 3, 4], [2, 4]));
console.log('intersection:', intersection([1, 2, 3], [2, 3, 4]));

console.log('\n--- String utilities ---');
console.log('capitalize:', capitalize('hello world'));
console.log('reverse:', reverse('DevKit 😀'));
console.log('slugify:', slugify('Café Crème: Hello World!'));
console.log('truncate:', truncate('The quick brown fox jumps', 12));
console.log('countWords:', countWords("Don't stop, it's well-known!"));
console.log('isPalindrome:', isPalindrome('A man, a plan, a canal: Panama'));

console.log('\n--- Object utilities ---');
const original = { user: { name: 'Asha', skills: ['js', 'node'] }, createdAt: new Date(0) };
const copy = deepClone(original);
copy.user.skills.push('react');
console.log('deepClone (original untouched):', original.user.skills, '| copy:', copy.user.skills);
console.log('pick:', pick({ id: 1, name: 'Asha', password: 'x' }, ['id', 'name']));
console.log('omit:', omit({ id: 1, name: 'Asha', password: 'x' }, ['password']));
console.log('isEmpty({}):', isEmpty({}), '| isEmpty([1]):', isEmpty([1]));

console.log('\n--- Number utilities ---');
console.log('clamp(150, 0, 100):', clamp(150, 0, 100));
console.log('randomInt(1, 6):', randomInt(1, 6));
console.log('isPrime(97):', isPrime(97));
console.log('factorial(20):', factorial(20).toString());
console.log('fibonacci(90):', fibonacci(90).toString());

console.log('\n--- Error handling ---');
try {
  chunk([1, 2, 3], 0);
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}
