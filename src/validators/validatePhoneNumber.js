/**
 * @preserve
 * @typedef {Object} PhoneNumberField
 * @property {'phoneNumber'}      type            - Field type
 * @property {boolean}            required        - Whether the field is required
 * @property {string}             value           - Raw input value
 * @property {string}            [successMessage] - Override for success message
 * @property {string}            [errorMessage]   - Override for error message
 */

export const RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;

const MESSAGES = {
  valid: {
    fi: "Puhelinnumero on kelvollinen.",
    sv: "Telefonnumret är giltigt.",
    en: "The phone number is valid.",
  },
  invalid: {
    fi: "Puhelinnumeron on oltava muodossa '+123123456789' (kolme numeroa maatunnus ja yhdeksän numeroa).",
    sv: "Telefonnumret måste vara i formen '+123123456789' (tre siffror landskod och nio siffror).",
    en: "The phone number must be in the format '+123123456789' (three-digit country code and nine digits).",
  },
};

/**
 * Validates an international phone number in the format +CCCNNNNNNNNN.
 * @preserve
 * @param {PhoneNumberField}        field - A config Object
 * @param {'fi'|'sv'|'en'}          lang  - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
export function validatePhoneNumber(field, lang = "en") {
  const { type, value, successMessage, errorMessage } = field;

  if (typeof value !== "string") {
    throw new TypeError("Phone number must be a string");
  }
  if (value.length !== 13 || value.charCodeAt(0) !== 0x2b /* '+' */) {
    return {
      type,
      ok: false,
      message: errorMessage || MESSAGES.invalid[lang],
    };
  }

  const isValid = RE_PHONE_PLUS_3_9.test(value);

  return {
    type,
    ok: isValid,
    message: isValid
      ? successMessage || MESSAGES.valid[lang]
      : errorMessage || MESSAGES.invalid[lang],
  };
}
