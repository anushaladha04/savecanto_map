'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import countries from 'i18n-iso-countries';

// Register English locale
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
  const AudienceOptions = ["all", "Adults", "Children & Teens", "College / University"];

  const filters = [
    { label: "Age Group", value: audienceFilter, setValue: setAudienceFilter, options: AudienceOptions, placeholder: "Select an Audience" },
    { label: "City", value: cityFilter, setValue: setCityFilter, options: uniqueCities, placeholder: "City" },
    { label: "Country", value: countryFilter, setValue: setCountryFilter, options: allCountryCodes, placeholder: "Country" },
    { label: "State/Province", value: provinceFilter, setValue: setProvinceFilter, options: uniqueProvinces, placeholder: "State/Province" },
  ];

  return (
    <div className="flex gap-4">
      {filters.map(({ label, value, setValue, options, placeholder }) => (
        <div key={label}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="all">{placeholder}</SelectItem>
              {options.map(option => {
                if (label === "Country") {
                  const countryName = countries.getName(option, "en", { select: "official" }) || option;
                  return (
                    <SelectItem key={option} value={option}>
                      {countryName}
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
