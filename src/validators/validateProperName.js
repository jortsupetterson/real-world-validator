// src/validators/validateProperName.js

/*! @preserve
 * Single-token Latin **proper name** validator (personal or place names).
 *
 * Accepts one cohesive proper name token like:
 *   - Given names with internal punctuation: "Kalle‑Veikko", "O'Connor"
 *   - Place or organization tokens: "Suomi", "Åland"
 *
 * Not accepted:
 *   - Multiple tokens with spaces: "Matti Meikäläinen", "New York"
 *   - Leading/trailing punctuation: "-Jori", "Jori-"
 *   - Doubled punctuation: "O''Connor"
 *
 * Pattern summary:
 * - `(?=.{1,64}$)`       1–64 code units to cap work up front.
 * - Leading letters      from Latin blocks (Basic, Latin‑1, Ext‑A/B, Ext‑Additional).
 * - Inner segments       `([- U+2010 U+2011 ' U+2019] letters)+` — no spaces.
 * - Latin‑only scope. For other scripts, use a dedicated validator.
 */
export const RE_PROPER_NAME_LATIN =
  /^(?=.{1,64}$)[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+(?:[-\u2010\u2011'’][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+)*$/;

/*! @preserve
 * Validate a single Latin-script proper name token.
 *
 * NFC normalization ensures composed/decomposed sequences compare equally and
 * the 64‑char cap remains meaningful.
 *
 * @param {string} value Raw input.
 * @returns {boolean} `true` when the token is a valid proper name.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * validateProperName("Kalle‑Veikko"); // true (U+2011)
 * validateProperName("Suomi");        // true
 * validateProperName("O'Connor");     // true
 * validateProperName("Matti Meikäläinen"); // false (space)
 */
export function validateProperName(value) {
  if (typeof value !== "string") throw new TypeError("Name must be a string");
  const s = value.normalize("NFC").trim();
  return RE_PROPER_NAME_LATIN.test(s);
}
