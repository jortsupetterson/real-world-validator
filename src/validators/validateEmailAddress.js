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

export const RE_EMAIL_ADDRESS_LATIN =
  /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;

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

export function validateEmailAddress(value) {
  if (typeof value !== "string")
    throw new TypeError("Email address must be a string");
  const s = value.trim();
  return RE_EMAIL_ADDRESS_LATIN.test(s);
}
