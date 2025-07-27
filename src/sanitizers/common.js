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

export function escapeHTML(input) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
