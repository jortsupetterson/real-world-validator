import { validateProperName } from "./validators/validateProperName.js";
import { validateEmailAddress } from "./validators/validateEmailAddress.js";
import { validatePhoneNumber } from "./validators/validatePhoneNumber.js";
import { validateCheckboxInput } from "./validators/validateCheckboxInput.js";
import { sanitizeString, escapeHTML } from "./sanitizers/common.js";

const handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phoneNumber: validatePhoneNumber,
  checkboxInput: validateCheckboxInput,
  string: sanitizeString,
  html: escapeHTML,
};

/**
 * @preserve
 * @param {Rule[]}  fields - Array of validation rules
 * @param {string}  lang   - Two letter language code
 * @returns {Promise<Outcome[]>}
 */
export default async function validate(fields, lang = "en") {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }

  const outcome = [];

  for (const field of fields) {
    const fn = handlers[field.type];

    const response = fn(field, lang);

    outcome.push({
      type: response.type,
      ok: response.ok,
      message: response.message,
    });
  }

  return outcome;
}

export {
  validateProperName,
  validateEmailAddress,
  validatePhoneNumber,
  validateCheckboxInput,
  sanitizeString,
  escapeHTML,
};
