'use client';

import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CsvRow } from './types';
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

  const AudienceOptions = ["Adults", "Children & Teens", "College / University"];

  const filters = [
    { 
      label: "Age Group", 
      value: audienceFilter, 
      setValue: setAudienceFilter, 
      options: AudienceOptions, 
      placeholder: "Select an Audience",
      allLabel: "All",
      isCountry: false
    },
    { 
      label: "Country", 
      value: countryFilter, 
      setValue: setCountryFilter, 
      options: allCountryCodes, 
      placeholder: "Select a Country",
      allLabel: "All",
      isCountry: true
    },
    { 
      label: "State/Province", 
      value: provinceFilter, 
      setValue: setProvinceFilter, 
      options: uniqueProvinces || [], 
      placeholder: "Select a State/Province",
      allLabel: "All",
      isCountry: false
    },
    { 
      label: "City", 
      value: cityFilter, 
      setValue: setCityFilter, 
      options: uniqueCities || [], 
      placeholder: "Select a City",
      allLabel: "All",
      isCountry: false
    },
  ];

  return (
    <div className="flex gap-2">
      {filters.map(({ label, value, setValue, options, placeholder, allLabel, isCountry }) => {
        // Generate a unique name/id based on the label
        const fieldName = label.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
        const fieldId = `filter-${fieldName}`;
        
        // Map field types to appropriate autocomplete values
        const autocompleteMap: Record<string, string> = {
          'age-group': 'off',
          'country': 'country-name',
          'state-province': 'address-level1',
          'city': 'address-level2',
        };
        const autocompleteValue = autocompleteMap[fieldName] || 'off';
        
        return (
        <div key={label} className="relative">
          <Select 
            value={value} 
            onValueChange={setValue} 
            name={fieldName}
          >
            <SelectTrigger 
              id={fieldId}
              className={`w-[200px] border-slate-300 [&>span]:text-black ${value && value !== "all" ? "[&>svg]:hidden" : ""}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-background max-h-[300px] overflow-y-auto border-slate-100">
              <SelectItem value="all">{allLabel}</SelectItem>
              {options.map(option => {
                if (isCountry) {
                  const countryName = getCountryName(option);
                  const flag = getCountryFlag(option);
                  return (
                    <SelectItem key={option} value={countryName} className="[&[data-state=checked]]:bg-slate-100 flex items-center justify-between px-2 py-1 rounded">
                      {countryName}
                      <span className="mr-2">{flag}</span>
                    </SelectItem>
                  );
                }
                return <SelectItem 
                    key={option} 
                    value={option}
                    className="[&[data-state=checked]]:bg-slate-100 flex items-center justify-between px-2 py-1 rounded"
                    >
                      {option}
                    </SelectItem>;
              })}
            </SelectContent>
          </Select>
          {value && value !== "all" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setValue('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 z-10 p-1"
            >
              ✕
            </button>
          )}
        </div>
        );
      })}
    </div>
  );
};

export default CantoFilters;