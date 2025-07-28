// src/validators/validateProperName.js
/**
 * @preserve
 * @typedef {Object} ProperNameField
 * @property {string}             id
 * @property {'properName'}        type
 * @property {boolean}             required
 * @property {string}              value
 * @property {string}             [successMessage]
 * @property {string}             [errorMessage]
 *
 * Validates a proper name according to predefined regex.
 *
 * @param {ProperNameField}          field - A config Object
 * @param {'fi'|'sv'|'en'}           lang - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
function validateProperName(field, lang = "en") {
  const { id, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Name must be a string");
  }
  const s = value.normalize("NFC").trim();
  const isValid = RE_PROPER_NAME_LATIN.test(s);
  return {
    id,
    status: isValid,
    message: isValid ? successMessage || MESSAGES.valid[lang] : errorMessage || MESSAGES.invalid[lang]
  };
}
var RE_PROPER_NAME_LATIN = /^(?=.{1,64}$)(?:[A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)(?:[-\u2010\u2011'’][A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)?$/;
var MESSAGES = {
  valid: {
    fi: "Nimi on kelvollinen.",
    sv: "Namnet \xE4r giltigt.",
    en: "The name is valid."
  },
  invalid: {
    fi: "Nimen tulee alkaa isolla kirjaimella ja olla muodossa 'Esimerkki' tai 'Esimerkki-Esimerkki'.",
    sv: "Namnet m\xE5ste b\xF6rja med en stor bokstav och vara i formen 'Exempel' eller 'Exempel-Exempel'.",
    en: "The name must start with a capital letter and be in the form 'Example' or 'Example-Example'."
  }
};

// src/validators/validateEmailAddress.js
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
var RE_EMAIL_ADDRESS_LATIN = /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;
var MESSAGES2 = {
  valid: {
    fi: "S\xE4hk\xF6postiosoite on kelvollinen.",
    sv: "E-postadressen \xE4r giltig.",
    en: "The email address is valid."
  },
  invalid: {
    fi: "S\xE4hk\xF6postiosoitteen on oltava muodossa 'user@example.com'.",
    sv: "E-postadressen m\xE5ste vara i formen 'user@example.com'.",
    en: "The email address must be in the form 'user@example.com'."
  }
};
function validateEmailAddress(field, lang = "en") {
  const { id, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Email address must be a string");
  }
  const s = value.trim();
  const isValid = RE_EMAIL_ADDRESS_LATIN.test(s);
  return {
    id,
    status: isValid,
    message: isValid ? successMessage || MESSAGES2.valid[lang] : errorMessage || MESSAGES2.invalid[lang]
  };
}

// src/validators/validatePhoneNumber.js
/**
 * @preserve
 * @typedef {Object} PhoneNumberField
 * @property {string}             id
 * @property {'phoneNumber'}      type            - Field type
 * @property {boolean}            required        - Whether the field is required
 * @property {string}             value           - Raw input value
 * @property {string}            [successMessage] - Override for success message
 * @property {string}            [errorMessage]   - Override for error message
 */
var RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;
var MESSAGES3 = {
  valid: {
    fi: "Puhelinnumero on kelvollinen.",
    sv: "Telefonnumret \xE4r giltigt.",
    en: "The phone number is valid."
  },
  invalid: {
    fi: "Puhelinnumeron on oltava muodossa '+123123456789' (kolme numeroa maatunnus ja yhdeks\xE4n numeroa).",
    sv: "Telefonnumret m\xE5ste vara i formen '+123123456789' (tre siffror landskod och nio siffror).",
    en: "The phone number must be in the format '+123123456789' (three-digit country code and nine digits)."
  }
};
/**
 * Validates an international phone number in the format +CCCNNNNNNNNN.
 * @preserve
 * @param {PhoneNumberField}        field - A config Object
 * @param {'fi'|'sv'|'en'}          lang  - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
function validatePhoneNumber(field, lang = "en") {
  const { id, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Phone number must be a string");
  }
  if (value.length !== 13 || value.charCodeAt(0) !== 43) {
    return {
      id,
      status: false,
      message: errorMessage || MESSAGES3.invalid[lang]
    };
  }
  const isValid = RE_PHONE_PLUS_3_9.test(value);
  return {
    id,
    status: isValid,
    message: isValid ? successMessage || MESSAGES3.valid[lang] : errorMessage || MESSAGES3.invalid[lang]
  };
}

// src/validators/validateCheckboxInput.js
/**
 * @preserve
 * @typedef {Object} CheckboxInputField
 * @property {string}             id
 * @property {'checkboxInput'}     type            - Field type
 * @property {boolean}             required        - Whether the field is required
 * @property {boolean}             value           - Raw input value
 * @property {string}             [successMessage] - Override for success message
 * @property {string}             [errorMessage]   - Override for error message
 */
var MESSAGES4 = {
  valid: {
    fi: "Valintaruutu on valittu.",
    sv: "Kryssrutan \xE4r markerad.",
    en: "The checkbox is checked."
  },
  invalid: {
    fi: "T\xE4m\xE4 valintaruutu on pakollinen ja sen on oltava valittuna.",
    sv: "Den h\xE4r kryssrutan \xE4r obligatorisk och m\xE5ste vara markerad.",
    en: "This checkbox is required and must be checked."
  }
};
/**
 * @preserve
 * Validates a checkbox input.
 *
 * @param {CheckboxInputField}        field - A config Object
 * @param {'fi'|'sv'|'en'}            lang  - Two letter language code
 * @returns {{type: string, ok: boolean, message: string}}
 */
function validateCheckboxInput(field, lang = "en") {
  const { id, required, value, successMessage, errorMessage } = field;
  if (typeof value !== "boolean") {
    throw new TypeError("Checkbox value must be a boolean");
  }
  let isValid = true;
  if (required === true && value === false) {
    isValid = false;
  }
  return {
    id,
    status: isValid,
    message: isValid ? successMessage || MESSAGES4.valid[lang] : errorMessage || MESSAGES4.invalid[lang]
  };
}

// src/sanitizers/common.js
/**
 * @preserve
 * @typedef {Object} SanitizeStringOptions
 * @property {boolean} [trim]               - Remove leading/trailing whitespace
 * @property {boolean} [collapseWhitespace] - Collapse consecutive whitespace into a single space
 * @property {boolean} [stripControls]      - Strip control characters (U+0000–U+001F, U+007F)
 * @property {number}  [maxLen]             - Maximum length of output string
 *
 * Sanitizes a string input based on provided options.
 *
 * @param {unknown}                   input - Raw input value
 * @param {SanitizeStringOptions}    [opts] - Sanitization options
 * @returns {string}
 */
function sanitizeString(input, opts = {}) {
  const {
    trim = true,
    collapseWhitespace = true,
    stripControls = true,
    maxLen = 4096
  } = opts;
  let s = String(input ?? "");
  if (trim) s = s.trim();
  if (stripControls) s = s.replace(/[\u0000-\u001F\u007F]/g, "");
  if (collapseWhitespace) s = s.replace(/\s+/g, " ");
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}
/**
 * @preserve
 * Escapes HTML special characters in a string.
 *
 * @param {unknown} input - Raw input value
 * @returns {string}
 */
function escapeHTML(input) {
  return String(input ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// src/index.js
var handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phoneNumber: validatePhoneNumber,
  checkboxInput: validateCheckboxInput,
  string: sanitizeString,
  html: escapeHTML
};
/**
 * @preserve
 * @param {Rule[]}  fields - Array of validation rules
 * @param {string}  lang   - Two letter language code
 * @returns {Promise<Outcome[]>}
 */
async function validate(fields, lang = "en") {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }
  const outcome = [];
  for (const field of fields) {
    const fn = handlers[field.type];
    const response = fn(field, lang);
    outcome.push({
      id: response.id,
      status: response.status,
      message: response.message
    });
  }
  return outcome;
}
export {
  validate as default,
  escapeHTML,
  sanitizeString,
  validateCheckboxInput,
  validateEmailAddress,
  validatePhoneNumber,
  validateProperName
};
