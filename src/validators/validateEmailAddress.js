/**
 * @preserve
 * @typedef {Object} EmailAddressField
 * @property {string}             id
 * @property {'emailAddress'}       type
 * @property {boolean}              required
 * @property {string}               value
 * @property {string}              [successMessage]
 * @property {string}              [errorMessage]
 */

export const RE_EMAIL_ADDRESS_LATIN =
  /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;

const MESSAGES = {
  valid: {
    fi: "Sähköpostiosoite on kelvollinen.",
    sv: "E-postadressen är giltig.",
    en: "The email address is valid.",
  },
  invalid: {
    fi: "Sähköpostiosoitteen on oltava muodossa 'user@example.com'.",
    sv: "E-postadressen måste vara i formen 'user@example.com'.",
    en: "The email address must be in the form 'user@example.com'.",
  },
};

/**
 * Validates an email address according to predefined regex.
 *
 * @param {EmailAddressField}        field - A config Object
 * @param {'fi'|'sv'|'en'}           lang  - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
export function validateEmailAddress(field, lang = "en") {
  const { id, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Email address must be a string");
  }

  const s = value.trim();
  const isValid = RE_EMAIL_ADDRESS_LATIN.test(s);

  return {
    id: id,
    status: isValid,
    message: isValid
      ? successMessage || MESSAGES.valid[lang]
      : errorMessage || MESSAGES.invalid[lang],
  };
}
