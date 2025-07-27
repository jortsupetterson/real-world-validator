var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/validators/validateProperName.js
//! @preserve
//! ProperName — strict Latin single-token proper name.
//!
//! Policy
//! - One token (no spaces).
//! - Uppercase first letter.
//! - After each allowed separator (`-`, `U+2010`, `U+2011`, `'`, `’`) the next letter is uppercase.
//! - Inside a segment, letters may be upper or lower case.
//! - Latin letters only (precomposed diacritics). Digits not allowed.
//! - Length 1–64 after NFC normalization.
//!
//! Examples ✓  "Kalle‑Veikko"  "O'Connor"  "Suomi"  "Åland"
//! Examples ✗  "kalle"  "o'connor"  "-Jori"  "Jori-"  "O''Connor"  "Matti Meikäläinen"
var RE_PROPER_NAME_LATIN =
  /^(?=.{1,64}$)(?:[A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)(?:[-\u2010\u2011'’][A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)$/;

function validateProperName(value) {
  if (typeof value !== "string") throw new TypeError("Name must be a string");
  const s = value.normalize("NFC").trim();
  return RE_PROPER_NAME_LATIN.test(s);
}
__name(validateProperName, "validateProperName");

// src/validators/validateEmailAddress.js
//! @preserve
//! Pragmatic **email address** validator: Latin local‑part; ASCII or Punycode
//! domain with at least one dot; strict length guards.
//!
//! Length constraints (SMTP/DNS):
//! - Local part ≤ 64 octets.  (RFC 5321 §4.5.3.1.1)
//! - Each DNS label ≤ 63 octets; whole domain ≤ 255 octets. (RFC 1035 §2.3.4, RFC 5321 §4.5.3.1.2)
//! - Address (mailbox) ≤ 254 characters due to the PATH 256‑octet limit. (RFC 3696 errata 1690)
//! - Punycode labels start with "xn--"; payload length ≤ 59 to respect the 63‑octet label cap. (RFC 5890 / RFC 3492)
//!
//! Scope & trade‑offs:
//! - Local part: Latin letters (incl. combining diacritics via explicit ranges),
//!   digits and `% _ + ' -`; dot‑separated atoms; no leading/trailing/consecutive dots.
//! - Domain: LDH labels; TLD is `[A-Za-z]{2,63}` or ACE `xn--` + 2–59 LDH chars.
//! - Case: local part is case‑sensitive by spec → do **not** lowercase it. Domains voidaan normalisoida myöhemmin.
//!
//! Accepted:
//!   user@example.com
//!   åsa.lind@example.fi
//!   user+tag@sub.example.com
//!   o'connor@example.ie
//!   user@xn--bcher-kva.example   // ACE for bücher.example
//!
//! Rejected (by design):
//!   "quoted\"local"@example.com   // quoted locals not supported
//!   user@[192.0.2.1]              // domain literals not supported
//!   user@localhost                // requires a dot
//!   user@-bad-.example            // invalid LDH placement
//!   verylonglocal...              // exceeds 64 / 254 limits
var RE_EMAIL_ADDRESS_LATIN =
  /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;

//! @preserve
//! Validate an **email address** with strict, production‑safe rules.
//!
//! - Trims surrounding whitespace.
//! - Does **not** lowercase the local part.
//! - Returns `true` only if RE_EMAIL_ADDRESS_LATIN matches.
//!
//! @param {string} value Raw email address.
//! @returns {boolean} `true` if valid; otherwise `false`.
//! @throws {TypeError} When `value` is not a string.
function validateEmailAddress(value) {
  if (typeof value !== "string") throw new TypeError("Email address must be a string");
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
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
__name(escapeHTML, "escapeHTML");

// src/validators/validatePhoneNumber.js
//! @preserve
//! Strict E.164-like validator: one **global** number in the form
//!   "+" CC NNNNNNNNN
//! where CC is a 3‑digit country code (first digit 1–9) and the subscriber
//! part is 9 digits. Total length is exactly **13 characters** including '+'.
//!
//! This is a deliberate, fast subset of E.164:
//! - E.164 max 15 digits, CC 1–3 digits. We freeze to 3+9 for simplicity.
//! - Leading '+' (U+002B) required.
//! - No spaces, dashes, parentheses, extensions, or short codes.
var RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;

function validatePhoneNumber(value) {
  if (typeof value !== "string") return false;
  if (value.length !== 13) return false;
  if (value.charCodeAt(0) !== 43) return false;
  return RE_PHONE_PLUS_3_9.test(value);
}
__name(validatePhoneNumber, "validatePhoneNumber");

// src/index.js
//! @preserve
//! @packageDocumentation
//! @module @jortsupetterson/real-world-validator
//!
//! Minimal, fast, dependency‑free validators and sanitizers for common web inputs.
//!
//! Design goals:
//!  - Predictable & strict. Unicode‑aware. No surprises.
//!  - UI‑friendly outcomes when needed; boolean fast path when not.
//!
//! Build (esbuild): use `legalComments: "inline"` to keep these `//!` blocks.

/** @typedef {"properName" | "emailAddress" | "phone" | "string" | "html"} FieldType */
/** @typedef {{type: FieldType, value: unknown, errorMessage?: string, successMessage?: string}} Rule */
/** @typedef {{type: FieldType | string, ok: boolean, message?: string, code?: "invalidProperName" | "invalidEmailAddress" | "invalidPhone" | "unknownType"}} Outcome */

/** @type {Record<string, Function>} */
var handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phone: validatePhoneNumber,
  string: sanitizeString,
  html: escapeHTML
};

var ERROR_CODE = {
  properName: "invalidProperName",
  emailAddress: "invalidEmailAddress",
  phone: "invalidPhone"
};

//! @preserve
//! Batch validator returning detailed outcomes.
/**
 * @param {Rule[]} fields
 * @returns {Promise<Outcome[]>}
 */
async function validate(fields) {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }
  const out = [];
  for (const f of fields) {
    const type = String(f?.type ?? "");
    const value = String(f?.value ?? "");
    const fn = handlers[type];
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
      code: fn ? (ok ? void 0 : /** @type {Outcome["code"]} */ (ERROR_CODE[type] || "unknownType")) : "unknownType"
    });
  }
  return out;
}
__name(validate, "validate");

//! @preserve Re‑exports
export {
  validate as default,
  escapeHTML,
  sanitizeString,
  validateEmailAddress,
  validatePhoneNumber,
  validateProperName
};
