'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import countries from 'i18n-iso-countries';
import { getCountryName, getCountryFlag } from './utils/countries';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

interface CantoFilterProps {
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

const allCountryCodes = Object.keys(countries.getNames("en")); // all ISO alpha-2 codes

const CantoFilters = ({
  audienceFilter,
  setAudienceFilter,
  provinceFilter,
  setProvinceFilter,
  cityFilter,
  setCityFilter,
  countryFilter,
  setCountryFilter,
  uniqueProvinces,
  uniqueCities,
}: CantoFilterProps) => {
  const AudienceOptions = ["Adults", "Children & Teens", "College / University"];

  const filters = [
    { 
      label: "Age Group", 
      value: audienceFilter, 
      setValue: setAudienceFilter, 
      options: AudienceOptions, 
      placeholder: "Select an Audience",
      isCountry: false
    },
    { 
      label: "Country", 
      value: countryFilter, 
      setValue: setCountryFilter, 
      options: allCountryCodes, 
      placeholder: "Country",
      isCountry: true
    },
    { 
      label: "State/Province", 
      value: provinceFilter, 
      setValue: setProvinceFilter, 
      options: uniqueProvinces || [], 
      placeholder: "State/Province",
      isCountry: false
    },
    { 
      label: "City", 
      value: cityFilter, 
      setValue: setCityFilter, 
      options: uniqueCities || [], 
      placeholder: "City",
      isCountry: false
    },
  ];

  return (
    <div className="flex gap-4">
      {filters.map(({ label, value, setValue, options, placeholder, isCountry }) => (
        <div key={label}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[200px] border-[#E5E6E8]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-background max-h-[300px] overflow-y-auto border-slate-100">
              <SelectItem value="all">{placeholder}</SelectItem>
              {options.map(option => {
                if (isCountry) {
                  const countryName = getCountryName(option);
                  const flag = getCountryFlag(option);
                  return (
                    <SelectItem key={option} value={countryName}>
                      {countryName}
                      <span className="mr-2">{flag}</span>
                    </SelectItem>
                  );
                }
                return <SelectItem key={option} value={option}>{option}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default CantoFilters;