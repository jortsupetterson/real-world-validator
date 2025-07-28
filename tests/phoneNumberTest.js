const RE_PHONE_PLUS_3_9 = /^\+[1-9]\d{2}\d{9}$/;
const RE_PHONE_FI = /^\+358\d{9}$/;

const cases = (ok = [], bad = []) => ({ ok, bad });
function run(name, re, { ok, bad }) {
  console.log(`\n[${name}]  ${re}`);
  for (const s of ok) console.log("  ✔", JSON.stringify(s), re.test(s));
  for (const s of bad) console.log("  ✖", JSON.stringify(s), re.test(s));
}

run(
  "3+9 generic",
  RE_PHONE_PLUS_3_9,
  cases(
    [
      "+358401234567", // FI
      "+123000000000", // geneerinen
      "+999123456789", // geneerinen
    ],
    [
      "+358", // liian lyhyt
      "+35840123456", // 8 paikallista
      "+3584012345670", // 10 paikallista
      "358401234567", // ei '+'
      "++358401234567", // tupla +
      "+0 5801234567", // cc alkaa nollalla (hylätään tällä säännöllä)
      "+358 401234567", // välilyöntejä
      "+358-401234567", // viivoja
      "+35840123A567", // kirjain
      "+",
    ]
  )
);

run(
  "FI only (+358 + 9)",
  RE_PHONE_FI,
  cases(["+358401234567"], ["+35840123456", "+357401234567", "+358 401234567"])
);
