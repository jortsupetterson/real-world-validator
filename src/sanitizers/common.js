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
export function sanitizeString(input, opts = {}) {
  const {
    trim = true,
    collapseWhitespace = true,
    stripControls = true,
    maxLen = 4096,
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
export function escapeHTML(input) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
