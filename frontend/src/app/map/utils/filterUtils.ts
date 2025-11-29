// owner: alyssa (filtering logic)
import { CsvRow } from '../components/filters/types';
import countries from 'i18n-iso-countries';

// Get unique, sorted values for a given column
export const getUniqueValues = (data: CsvRow[], key: keyof CsvRow): string[] => {
  return Array.from(new Set(data.map(row => row[key]).filter(Boolean))).sort();
};

// Apply filters to dataset
export const applyFilters = (
  data: CsvRow[],
  filters: {
    searchTerm: string;
    audience: string;
    province: string;
    city: string;
    country: string;
  }
): CsvRow[] => {
  return data.filter(row => {
    const matchesSearch = row.Name?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesAudience = filters.audience === 'all' || row.Audience === filters.audience;
    const matchesProvince = filters.province === 'all' || row['State/Province'] === filters.province;
    const matchesCity = filters.city === 'all' || row.City === filters.city;
    const matchesCountry = filters.country === 'all' || row.Country === filters.country;

    return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;
  });
};


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