// Latin fallback, jos haluat käyttää ympäristössä ilman \p{…} tukea:
export const RE_SINGLE_NAME_LATIN =
  /^(?=.{1,64}$)[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+(?:[-\u2010\u2011'’][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]+)*$/;

export function validateName(value) {
  if (typeof value !== "string") throw new TypeError("Name must be a string");
  const s = value.normalize("NFC").trim();
  return RE_SINGLE_NAME_LATIN.test(s);
}
