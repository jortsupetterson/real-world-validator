// src/validators/validateProperName.js
function validateProperName(field, lang = "en") {
  const { type: type2, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Name must be a string");
  }
  const s = value.normalize("NFC").trim();
  const isValid = RE_PROPER_NAME_LATIN.test(s);
  return {
    type: type2,
    ok: isValid,
    message: isValid ? successMessage || MESSAGES.valid[lang] : errorMessage || MESSAGES.invalid[lang]
  };
}
var RE_PROPER_NAME_LATIN = /^(?=.{1,64}$)(?:[A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)(?:[-\u2010\u2011'’][A-Z\u00C0-\u00D6\u00D8-\u00DE\u1E00-\u1EFF][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)?$/;
var MESSAGES = {
  valid: {
    fi: "Nimi on kelvollinen.",
    sv: "Namnet \xE4r giltigt.",
    en: "The name is valid."
  },
  invalid: {
    fi: "Nimen tulee alkaa isolla kirjaimella ja olla muodossa 'Esimerkki' tai 'Esimerkki-Esimerkki'.",
    sv: "Namnet m\xE5ste b\xF6rja med en stor bokstav och vara i formen 'Exempel' eller 'Exempel-Exempel'.",
    en: "The name must start with a capital letter and be in the form 'Example' or 'Example-Example'."
  }
};

// src/validators/validateEmailAddress.js
var RE_EMAIL_ADDRESS_LATIN = /^(?=.{1,254}$)(?=^[^@]{1,64}@)(?:[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+(?:\.[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF_%+'-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/;
var MESSAGES2 = {
  valid: {
    fi: "S\xE4hk\xF6postiosoite on kelvollinen.",
    sv: "E-postadressen \xE4r giltig.",
    en: "The email address is valid."
  },
  invalid: {
    fi: "S\xE4hk\xF6postiosoitteen on oltava muodossa 'user@example.com'.",
    sv: "E-postadressen m\xE5ste vara i formen 'user@example.com'.",
    en: "The email address must be in the form 'user@example.com'."
  }
};
function validateEmailAddress(field, lang = "en") {
  const { type: type2, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Email address must be a string");
  }
  const s = value.trim();
  const isValid = RE_EMAIL_ADDRESS_LATIN.test(s);
  return {
    type: type2,
    ok: isValid,
    message: isValid ? successMessage || MESSAGES2.valid[lang] : errorMessage || MESSAGES2.invalid[lang]
  };
}

// src/validators/validatePhoneNumber.js
var RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;
var MESSAGES3 = {
  valid: {
    fi: "Puhelinnumero on kelvollinen.",
    sv: "Telefonnumret \xE4r giltigt.",
    en: "The phone number is valid."
  },
  invalid: {
    fi: "Puhelinnumeron on oltava muodossa '+123123456789' (kolme numeroa maatunnus ja yhdeks\xE4n numeroa).",
    sv: "Telefonnumret m\xE5ste vara i formen '+123123456789' (tre siffror landskod och nio siffror).",
    en: "The phone number must be in the format '+123123456789' (three-digit country code and nine digits)."
  }
};
function validatePhoneNumber(field, lang = "en") {
  const { type: type2, value, successMessage, errorMessage } = field;
  if (typeof value !== "string") {
    throw new TypeError("Phone number must be a string");
  }
  if (value.length !== 13 || value.charCodeAt(0) !== 43) {
    return {
      type: type2,
      ok: false,
      message: errorMessage || MESSAGES3.invalid[lang]
    };
  }
  const isValid = RE_PHONE_PLUS_3_9.test(value);
  return {
    type: type2,
    ok: isValid,
    message: isValid ? successMessage || MESSAGES3.valid[lang] : errorMessage || MESSAGES3.invalid[lang]
  };
}

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
function escapeHTML(input) {
  return String(input ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// src/index.js
var handlers = {
  properName: validateProperName,
  emailAddress: validateEmailAddress,
  phoneNumber: validatePhoneNumber,
  checkboxInput: validateCheckboxInput,
  string: sanitizeString,
  html: escapeHTML
};
async function validate(fields, lang = "en") {
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be an array of rule objects");
  }
  const outcome = [];
  for (const field of fields) {
    const fn = handlers[type];
    let ok = false;
    try {
      ok = typeof fn === "function" ? !!fn(field, lang) : false;
    } catch {
      ok = false;
    }
    out.push({
      type,
      ok,
      message: ok ? f?.successMessage : f?.errorMessage,
      code: fn ? ok : "unknownType"
    });
  }
  return outcome;
}
export {
  validate as default,
  escapeHTML,
  sanitizeString,
  validateEmailAddress,
  validatePhoneNumber,
  validateProperName
};
