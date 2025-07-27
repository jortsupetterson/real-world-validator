import { validateName } from "./validators/validateName.js";
import { validateEmail } from "./validators/validateEmail.js";
import { sanitizeString, escapeHTML } from "./sanitizers/common.js";
import { validatePhone } from "./validators/validatePhone.js";

/**
 * Rekisteröidyt validaattorit.
 * Lisää tänne uusia: phone, upn, onms, password, url, etc.
 */
const handlers = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  string: sanitizeString,
  html: escapeHTML,
};

/**
 * @typedef {Object} Rule
 * @property {string} type          // "name" | "email" | ...
 * @property {string} value         // arvo validointiin
 * @property {string} [errorMessage]
 * @property {string} [successMessage]
 *
 * @typedef {Object} Outcome
 * @property {string} type
 * @property {boolean} ok
 * @property {string} [message]
 * @property {string} [code]        // esim. "invalid_email" tai "unknown_type"
 */

/**
 * Validoi joukon kenttiä ja palauttaa UI-ystävällisen pinnan.
 * Synkroniset validaattorit – jos myöhemmin lisäät asynkronisia, voit
 * tukea niitä tunnistamalla Promise:n ja odottamalla sen.
 *
 * @param {Rule[]} fields
 * @returns {Promise<Outcome[]>}
 */
export default async function validate(fields) {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }

  const out = [];

  for (const f of fields) {
    const type = String(f?.type ?? "").toLowerCase();
    const value = String(f?.value ?? "");
    const fn = handlers[type];
    let ok = false;

    try {
      ok = typeof fn === "function" ? fn(value) : false;
    } catch {
      ok = false;
    }

    out.push({
      type,
      ok,
      message: ok ? f?.successMessage : f?.errorMessage,
      code: fn ? (ok ? undefined : `invalid_${type}`) : "unknown_type",
    });
  }

  return out;
}

// Re-exports
export { validateName, validateEmail, sanitizeString, escapeHTML };
