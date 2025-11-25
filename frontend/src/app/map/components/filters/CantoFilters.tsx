'use client';

import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CsvRow } from '../../types/types';
import { getCountryName, getCountryFlag, allCountryCodes } from '../../utils/filterUtils';

interface Props {
  data: CsvRow[];
  audienceFilter: string;
  setAudienceFilter: (value: string) => void;
  provinceFilter: string;
  setProvinceFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
}

const CantoFilters: React.FC<Props> = ({
  data,
  audienceFilter,
  setAudienceFilter,
  provinceFilter,
  setProvinceFilter,
  cityFilter,
  setCityFilter,
  countryFilter,
  setCountryFilter,
}) => {
  // Compute unique options dynamically
  const uniqueProvinces = useMemo(() =>
    Array.from(new Set(data.map(row => row['State/Province']).filter(Boolean))).sort(),
    [data]
  );

  const uniqueCities = useMemo(() =>
    Array.from(new Set(data.map(row => row.City).filter(Boolean))).sort(),
    [data]
  );

  const uniqueCountries = useMemo(() =>
    Array.from(new Set(data.map(row => row.Country).filter(Boolean)))
      .map(code => getCountryName(code))
      .sort(),
    [data]
  );

  const AudienceOptions = ["Adults", "Children & Teens", "College / University"];

  const filters = [
    { label: "Age Group", value: audienceFilter, setValue: setAudienceFilter, options: AudienceOptions, placeholder: "Select an Audience", isCountry: false },
    { label: "Country", value: countryFilter, setValue: setCountryFilter, options: allCountryCodes, placeholder: "Country", isCountry: true },
    { label: "State/Province", value: provinceFilter, setValue: setProvinceFilter, options: uniqueProvinces, placeholder: "State/Province", isCountry: false },
    { label: "City", value: cityFilter, setValue: setCityFilter, options: uniqueCities, placeholder: "City", isCountry: false },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(({ label, value, setValue, options, placeholder, isCountry }) => (
        <div key={label}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[200px] border-slate-300">
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