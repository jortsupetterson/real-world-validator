// Latin local, ASCII/Punycode domain, vaatii vähintään yhden pisteen.
export const RE_LATIN_EMAIL =
  /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;

export function validateEmail(value) {
  if (typeof value !== "string") throw new TypeError("Email must be a string");
  const s = value.trim(); // älä lowercaseta local-osaa; domainin voi myöhemmin
  return RE_LATIN_EMAIL.test(s);
}
