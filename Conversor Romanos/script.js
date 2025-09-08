const arabicInput = document.getElementById("arabicInput");
const romanInput = document.getElementById("romanInput");
const romanOutput = document.getElementById("romanOutput");
const arabicOutput = document.getElementById("arabicOutput");

const romanValues = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
];
function convertToRoman() {
  const num = parseInt(arabicInput.value);
  if (isNaN(num) || num < 1 || num > 3999) {
    romanOutput.textContent = "Erro: Digite um número entre 1 e 3999";
    return;
  }
  let result = "";
  let remaining = num;
  for (let i = 0; i < romanValues.length; i++) {
    while (remaining >= romanValues[i].value) {
      result += romanValues[i].symbol;
      remaining -= romanValues[i].value;
    }
  }
  romanOutput.textContent = result;
}
function convertToArabic() {
  const roman = romanInput.value.toUpperCase().trim();
  if (!isValidRoman(roman)) {
    arabicOutput.textContent = "Erro: Número romano inválido";
    return;
  }

  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const twoChar = roman[i] + (roman[i + 1] || "");
    const current = romanValues.find((r) => r.symbol === twoChar);
    if (current) {
      result += current.value;
      i++; // pular o próximo
    } else {
      const single = romanValues.find((r) => r.symbol === roman[i]);
      result += single.value;
    }
  }
  arabicOutput.textContent = result;
}

function isValidRoman(roman) {
  const validChars = ["I", "V", "X", "L", "C", "D", "M"];
  if (!roman || !roman.match(/^[IVXLCDM]+$/)) return false;
  const repeated = /(I{4,}|V{2,}|X{4,}|L{2,}|C{4,}|D{2,}|M{4,})/;
  if (repeated.test(roman)) return false;
  const subtractRules = /I[VX]|X[LC]|C[DM]/;
  if (subtractRules.test(roman)) return false;
  return true;
}
arabicInput.addEventListener("input", convertToRoman);
romanInput.addEventListener("input", convertToArabic);
