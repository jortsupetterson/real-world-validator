/**
 * @typedef {Object} ProperNameField
 * @property {'properName'}        type
 * @property {boolean}             required
 * @property {string}              value
 * @property {string}             [successMessage]
 * @property {string}             [errorMessage]
 */

/**
 * Validates a proper name according to predefined regex.
 *
 * @param {ProperNameField}          field - A config Object
 * @param {'fi'|'sv'|'en'}           lang - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */

export function validateProperName(field, lang = "en") {
  const { type, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Name must be a string");
  }

  const s = value.normalize("NFC").trim();
  const isValid = RE_PROPER_NAME_LATIN.test(s);

  return {
    type,
    ok: isValid,
    message: isValid
      ? successMessage || MESSAGES.valid[lang]
      : errorMessage || MESSAGES.invalid[lang],
  };
}

export const RE_PROPER_NAME_LATIN =
  /^(?=.{1,64}$)(?:[A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)(?:[-\u2010\u2011'’][A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)?$/;

const MESSAGES = {
  valid: {
    fi: "Nimi on kelvollinen.",
    sv: "Namnet är giltigt.",
    en: "The name is valid.",
  },
  invalid: {
    fi: "Nimen tulee alkaa isolla kirjaimella ja olla muodossa 'Esimerkki' tai 'Esimerkki-Esimerkki'.",
    sv: "Namnet måste börja med en stor bokstav och vara i formen 'Exempel' eller 'Exempel-Exempel'.",
    en: "The name must start with a capital letter and be in the form 'Example' or 'Example-Example'.",
  },
};
