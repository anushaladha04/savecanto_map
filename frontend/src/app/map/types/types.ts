// Represents a row in the CSV / table
export interface CsvRow {
  Name: string;
  Audience: string;
  City: string;
  "State/Province": string;
  Country: string;
  Address: string;
  Website: string;
}

// Filter values for the dataset
export interface Filters {
  searchTerm: string;
  audience: string;
  province: string;
  city: string;
  country: string;
}

// Props for the CantoFilters component
export interface CantoFilterProps {
  audienceFilter: string;
  setAudienceFilter: (value: string) => void;
  provinceFilter: string;
  setProvinceFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
  uniqueProvinces: string[];
  uniqueCities: string[];
}

// Sorting keys for the table
export type SortKey = keyof CsvRow; // "Name" | "Audience" | "City" | "State/Province" | "Country" | "Address" | "Website"

// Sorting order
export type SortOrder = "default" | "asc" | "desc";