# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-22

### Added

- **Array utilities:** `unique`, `chunk`, `flatten`, `shuffle`, `groupBy`, `difference`, `intersection`.
- **String utilities:** `capitalize`, `reverse`, `slugify`, `truncate`, `countWords`, `isPalindrome` (Unicode-aware).
- **Object utilities:** `deepClone` (with circular reference, `Date`, `RegExp`, `Map`, `Set` and typed array support), `pick`, `omit`, `isEmpty`.
- **Number utilities:** `clamp`, `randomInt`, `isPrime` (number and BigInt), `factorial` and `fibonacci` (exact `BigInt` results).
- Subpath exports: `devkit-js-utils/array`, `/string`, `/object`, `/number`.
- Input validation with descriptive `TypeError` / `RangeError` messages.
- Test suite using the built-in `node:test` runner.
- ESLint configuration, GitHub Actions CI workflow, README and runnable examples.

[1.0.0]: https://github.com/sanjog24/devkit-js/releases/tag/v1.0.0
