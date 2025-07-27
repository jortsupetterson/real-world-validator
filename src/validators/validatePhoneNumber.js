// validators/validatePhoneNumber.js

/*! @preserve
 * Strict E.164-like validator: one **global** number in the form
 *   "+" CC NNNNNNNNN
 * where CC is a 3‑digit country code (first digit 1–9) and the subscriber
 * part is 9 digits. Total length is exactly **13 characters** including '+'.
 *
 * This is a deliberate, fast subset of E.164:
 * - E.164 limits numbers to digits with a **maximum of 15 digits** and a
 *   country code of **1–3 digits**. We freeze it to 3+9 for simplicity,
 *   routing stability and UI constraints.
 * - Presentation with a leading **'+' (U+002B)** denotes a globalized number.
 * - No spaces, dashes, parentheses, extensions, or short codes.
 */

export const RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;

/**
 * Validate a phone number in the fixed global format: `+CCCNNNNNNNNN`.
 *
 * Fast reject path avoids running the regex on obvious junk:
 *  - require string type
 *  - exact length check (13)
 *  - first character must be '+' (U+002B)
 *
 * @param {string} value Phone number string, e.g. "+358401234567".
 * @returns {boolean} `true` when the value matches the strict pattern.
 */

export function validatePhoneNumber(value) {
  if (typeof value !== "string") return false;

  // Cheap guards before touching the regexp engine.
  if (value.length !== 13) return false;
  if (value.charCodeAt(0) !== 0x2b /* '+' */) return false;

  return RE_PHONE_PLUS_3_9.test(value);
}

export default validatePhoneNumber;
