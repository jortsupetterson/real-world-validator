// validators/validatePhone.js

/**
 * "+" + 3 numeroa (maa/CC, 1. numero 1–9) + 9 numeroa.
 * Pituus tarkalleen 13 merkkiä.
 */
export const RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;

/**
 * @param {string} value
 * @returns {boolean} true kun arvo on tarkasti muodossa +CCCNNNNNNNNN
 */
export function validatePhone(value) {
  if (typeof value !== "string") return false;

  // Nopea hylkäys ennen regexiä.
  if (value.length !== 13) return false;
  if (value.charCodeAt(0) !== 0x2b /* '+' */) return false;

  return RE_PHONE_PLUS_3_9.test(value);
}

export default validatePhone;
