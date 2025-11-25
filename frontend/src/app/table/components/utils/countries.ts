import countries from 'i18n-iso-countries';
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// Map for overriding country names
export const countryOverrides: Record<string, string> = {
  "United States of America": "United States",
  "Moldova, Republic of": "Moldova",
  "Micronesia, Federated States of": "Micronesia",
  "Lao People's Democratic Republic": "Laos",
  "Holy See (Vatican City State)": "Vatican City"
};

// Get normalized country name
export const getCountryName = (code: string) => {
  let name = countries.getName(code, "en") || code;
  if (countryOverrides[name]) {
    name = countryOverrides[name];
  }
  return name;
};

// Convert ISO alpha-2 code to flag emoji
export const getCountryFlag = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Get all ISO alpha-2 codes
export const allCountryCodes = Object.keys(countries.getNames("en"));