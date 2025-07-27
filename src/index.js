/*! @preserve
 * @packageDocumentation
 * @module @jortsupetterson/real-world-validator
 *
 * Minimal, fast, dependency‑free validators and sanitizers for common web inputs.
 *
 * Design goals:
 *  - **Predictable & strict.** Deterministic length guards and narrow syntax.
 *  - **Unicode‑aware.** Proper names are NFC‑normalized; combining marks allowed.
 *  - **No surprises.** Unknown field types never throw — they return `{ ok:false, code: "unknownType" }`.
 *  - **UI‑friendly output.** Each rule yields a compact `Outcome` you can render directly.
 *
 * Security:
 *  - Always re‑validate on the server.
 *  - Store raw input if auditability matters; avoid logging full emails/phones in plaintext.
 *
 * Build (esbuild): comments marked with `@preserve` or starting with `/*!` are kept when
 * `legalComments: "inline"`. This header is intended to remain in the distributed bundle.
 */

import { validateProperName } from "./validators/validateProperName.js";
import { validateEmailAddress } from "./validators/validateEmailAddress.js";
import { sanitizeString, escapeHTML } from "./sanitizers/common.js";
import { validatePhoneNumber } from "./validators/validatePhoneNumber.js";

/** @preserve
 * Discriminated field kinds supported by the batch API.
 * Extend by adding a handler into {@link handlers} and widening this union.
 * @typedef {"properName" | "emailAddress" | "phone" | "string" | "html"} FieldType
 */

/** @preserve
 * Validation rule consumed by {@link validate}.
 *
 * - `type` selects the handler.
 * - `value` is the raw input value (current handlers coerce to string).
 * - `successMessage` / `errorMessage` let the caller attach ready‑to‑render UI text.
 *
 * @typedef {Object} Rule
 * @property {FieldType} type               Field kind (e.g. `"emailAddress"`).
 * @property {unknown}   value              Raw value to validate/sanitize.
 * @property {string}   [errorMessage]      Returned when `ok === false`.
 * @property {string}   [successMessage]    Returned when `ok === true`.
 */

/** @preserve
 * Machine‑readable result returned for each {@link Rule}.
 *
 * - `ok` is the boolean outcome.
 * - `message` is either `successMessage` or `errorMessage`, when provided.
 * - `code` is present on failures or unknown types for programmatic handling.
 *
 * @typedef {Object} Outcome
 * @property {FieldType | string} type
 * @property {boolean} ok
 * @property {string} [message]
 * @property {"invalidProperName" | "invalidEmailAddress" | "invalidPhone" | "unknownType"} [code]
 */

/** @preserve
 * Registered validators/sanitizers (keys are **camelCase** and case‑sensitive).
 * Add new handlers here (e.g. `"url"`, `"password"`) and widen the JSDoc unions.
 * @type {Record<string, Function>}
 */
const handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phone: validatePhoneNumber,
  string: sanitizeString,
  html: escapeHTML,
};

/** @preserve */
const ERROR_CODE = {
  properName: "invalidProperName",
  emailAddress: "invalidEmailAddress",
  phone: "invalidPhone",
};

/** @preserve
 * Validate a heterogeneous list of fields into UI‑friendly outcomes.
 *
 * ### Algorithm
 * 1. Ensure `fields` is an array; otherwise throw `TypeError`.
 * 2. For each rule:
 *    - Use `type` **as given in camelCase** (no lowercasing).
 *    - Coerce `value` to string.
 *    - Lookup a handler in {@link handlers}.
 *    - Execute inside `try/catch`; any error results in `ok:false`.
 *    - Emit an {@link Outcome} with optional `code`:
 *        - Unknown type  → `code: "unknownType"`.
 *        - Known type, failed → camelCase failure code, e.g. `"invalidEmailAddress"`.
 *
 * @example
 * const results = await validate([
 *   { type: "properName",   value: "Jean‑Luc", successMessage: "OK", errorMessage: "Name" },
 *   { type: "emailAddress", value: "bad@",     errorMessage: "Email" },
 *   { type: "phone",        value: "+358401234567" },
 * ]);
 * // [
 * //   { type: "properName",   ok: true,  message: "OK" },
 * //   { type: "emailAddress", ok: false, message: "Email", code: "invalidEmailAddress" },
 * //   { type: "phone",        ok: true }
 * // ]
 *
 * @param {Rule[]} fields Array of rule objects.
 * @returns {Promise<Outcome[]>} Outcomes in the same order as input rules.
 * @throws {TypeError} When `fields` is not an array.
 */
export default async function validate(fields) {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }

  /** @type {Outcome[]} */
  const out = [];

  for (const f of fields) {
    const type = String(f?.type ?? ""); // keep camelCase as provided
    const value = String(f?.value ?? "");
    const fn = /** @type {Function|undefined} */ (handlers[type]);
    let ok = false;

    try {
      ok = typeof fn === "function" ? !!fn(value) : false;
    } catch {
      ok = false;
    }

    out.push({
      type,
      ok,
      message: ok ? f?.successMessage : f?.errorMessage,
      code: fn
        ? ok
          ? undefined
          : /** @type {Outcome["code"]} */ (ERROR_CODE[type] || "unknownType")
        : "unknownType",
    });
  }

  return out;
}

/** @preserve Re‑exports for direct, granular imports. */
export {
  validateProperName,
  validateEmailAddress,
  validatePhoneNumber,
  sanitizeString,
  escapeHTML,
};
