// src/validators/validateProperName.js

/*! @preserve
 * ProperName — strict Latin single-token proper name.
 *
 * Policy
 * - One token (no spaces).
 * - Uppercase first letter.
 * - After each allowed separator (`-`, `U+2010`, `U+2011`, `'`, `’`) the next letter is uppercase.
 * - Inside a segment, letters may be upper or lower case.
 * - Latin letters only (precomposed diacritics). Digits not allowed.
 * - Length 1–64 after NFC normalization.
 *
 * Examples ✓  "Kalle‑Veikko"  "O'Connor"  "Suomi"  "Åland"
 * Examples ✗  "kalle"  "o'connor"  "-Jori"  "Jori-"  "O''Connor"  "Matti Meikäläinen"
 */

export const RE_PROPER_NAME_LATIN =
  /^(?=.{1,64}$)(?:[A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)(?:[-\u2010\u2011'’][A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)$/;

export function validateProperName(value) {
  if (typeof value !== "string") throw new TypeError("Name must be a string");
  const s = value.normalize("NFC").trim();
  return RE_PROPER_NAME_LATIN.test(s);
}
