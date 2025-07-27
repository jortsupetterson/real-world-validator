var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/validators/validateProperName.js
/*! @preserve
 * Single-token Latin **proper name** validator (personal or place names).
 *
 * Accepts one cohesive proper name token like:
 *   - Given names with internal punctuation: "Kalle‑Veikko", "O'Connor"
 *   - Place or organization tokens: "Suomi", "Åland"
 *
 * Not accepted:
 *   - Multiple tokens with spaces: "Matti Meikäläinen", "New York"
 *   - Leading/trailing punctuation: "-Jori", "Jori-"
 *   - Doubled punctuation: "O''Connor"
 *
 * Pattern summary:
 * - `(?=.{1,64}$)`       1–64 code units to cap work up front.
 * - Leading letters      from Latin blocks (Basic, Latin‑1, Ext‑A/B, Ext‑Additional).
 * - Inner segments       `([- U+2010 U+2011 ' U+2019] letters)+` — no spaces.
 * - Latin‑only scope. For other scripts, use a dedicated validator.
 */
var RE_PROPER_NAME_LATIN = /^(?=.{1,64}$)[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+(?:[-\u2010\u2011'’][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+)*$/;
/*! @preserve
 * Validate a single Latin-script proper name token.
 *
 * NFC normalization ensures composed/decomposed sequences compare equally and
 * the 64‑char cap remains meaningful.
 *
 * @param {string} value Raw input.
 * @returns {boolean} `true` when the token is a valid proper name.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * validateProperName("Kalle‑Veikko"); // true (U+2011)
 * validateProperName("Suomi");        // true
 * validateProperName("O'Connor");     // true
 * validateProperName("Matti Meikäläinen"); // false (space)
 */
function validateProperName(value) {
  if (typeof value !== "string") throw new TypeError("Name must be a string");
  const s = value.normalize("NFC").trim();
  return RE_PROPER_NAME_LATIN.test(s);
}
__name(validateProperName, "validateProperName");

// src/validators/validateEmailAddress.js
/*! @preserve
 * Pragmatic **email address** validator: Latin local‑part; ASCII or Punycode
 * domain with at least one dot; strict length guards.
 *
 * Length constraints (SMTP/DNS):
 * - Local part ≤ 64 octets.  (RFC 5321 §4.5.3.1.1)
 * - Each DNS label ≤ 63 octets; whole domain ≤ 255 octets. (RFC 1035 §2.3.4, RFC 5321 §4.5.3.1.2)
 * - Address (mailbox) ≤ 254 characters due to the PATH 256‑octet limit. (RFC 3696 errata 1690)
 * - Punycode labels start with "xn--"; payload length ≤ 59 to respect the 63‑octet label cap. (RFC 5890 / RFC 3492)
 *
 * Scope & trade‑offs:
 * - Local part: Latin letters (incl. combining diacritics via explicit ranges),
 *   digits and `% _ + ' -`; dot‑separated atoms; no leading/trailing/consecutive dots.
 * - Domain: LDH labels; TLD is `[A-Za-z]{2,63}` or ACE `xn--` + 2–59 LDH chars.
 * - Case: local part is case‑sensitive by spec → do **not** lowercase it. Domains voidaan normalisoida myöhemmin.
 *
 * Accepted:
 *   user@example.com
 *   åsa.lind@example.fi
 *   user+tag@sub.example.com
 *   o'connor@example.ie
 *   user@xn--bcher-kva.example   // ACE for bücher.example
 *
 * Rejected (by design):
 *   "quoted\"local"@example.com   // quoted locals not supported
 *   user@[192.0.2.1]              // domain literals not supported
 *   user@localhost                // requires a dot
 *   user@-bad-.example            // invalid LDH placement
 *   verylonglocal...              // exceeds 64 / 254 limits
 */
var RE_EMAIL_ADDRESS_LATIN = /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;
/*! @preserve
 * Validate an **email address** with strict, production‑safe rules.
 *
 * - Trims surrounding whitespace.
 * - Does **not** lowercase the local part.
 * - Returns `true` only if {@link RE_EMAIL_ADDRESS_LATIN} matches.
 *
 * @param {string} value Raw email address.
 * @returns {boolean} `true` if valid; otherwise `false`.
 * @throws {TypeError} When `value` is not a string.
 */
function validateEmailAddress(value) {
  if (typeof value !== "string")
    throw new TypeError("Email address must be a string");
  const s = value.trim();
  return RE_EMAIL_ADDRESS_LATIN.test(s);
}
__name(validateEmailAddress, "validateEmailAddress");

// src/sanitizers/common.js
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
__name(sanitizeString, "sanitizeString");
function escapeHTML(input) {
  return String(input ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHTML, "escapeHTML");

// src/validators/validatePhoneNumber.js
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
var RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;
function validatePhoneNumber(value) {
  if (typeof value !== "string") return false;
  if (value.length !== 13) return false;
  if (value.charCodeAt(0) !== 43) return false;
  return RE_PHONE_PLUS_3_9.test(value);
}
__name(validatePhoneNumber, "validatePhoneNumber");

// src/index.js
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
var handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phone: validatePhoneNumber,
  string: sanitizeString,
  html: escapeHTML
};
/** @preserve */
var ERROR_CODE = {
  properName: "invalidProperName",
  emailAddress: "invalidEmailAddress",
  phone: "invalidPhone"
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
async function validate(fields) {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }
  const out = [];
  for (const f of fields) {
    const type = String(f?.type ?? "");
    const value = String(f?.value ?? "");
    const fn = (
      /** @type {Function|undefined} */
      handlers[type]
    );
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
      code: fn ? ok ? void 0 : (
        /** @type {Outcome["code"]} */
        ERROR_CODE[type] || "unknownType"
      ) : "unknownType"
    });
  }
  return out;
}
__name(validate, "validate");
/** @preserve Re‑exports for direct, granular imports. */
export {
  validate as default,
  escapeHTML,
  sanitizeString,
  validateEmailAddress,
  validatePhoneNumber,
  validateProperName
};
