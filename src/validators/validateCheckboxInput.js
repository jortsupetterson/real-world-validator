/**
 * @preserve
 * @typedef {Object} CheckboxInputField
 * @property {'checkboxInput'}     type            - Field type
 * @property {boolean}             required        - Whether the field is required
 * @property {boolean}             value           - Raw input value
 * @property {string}             [successMessage] - Override for success message
 * @property {string}             [errorMessage]   - Override for error message
 */

const MESSAGES = {
  valid: {
    fi: "Valintaruutu on valittu.",
    sv: "Kryssrutan är markerad.",
    en: "The checkbox is checked.",
  },
  invalid: {
    fi: "Tämä valintaruutu on pakollinen ja sen on oltava valittuna.",
    sv: "Den här kryssrutan är obligatorisk och måste vara markerad.",
    en: "This checkbox is required and must be checked.",
  },
};

/**
 * @preserve
 * Validates a checkbox input.
 *
 * @param {CheckboxInputField}        field - A config Object
 * @param {'fi'|'sv'|'en'}            lang  - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
export function validateCheckboxInput(field, lang = "en") {
  const { type, required, value, successMessage, errorMessage } = field;
  if (typeof value !== "boolean") {
    throw new TypeError("Checkbox value must be a boolean");
  }

  const isValid = required ? value === true : true;

  return {
    type,
    ok: isValid,
    message: isValid
      ? successMessage || MESSAGES.valid[lang]
      : errorMessage || MESSAGES.invalid[lang],
  };
}
