import { useState, useMemo } from 'react';
import { CsvRow } from '../types/types';

export const useFilters = (data: CsvRow[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudience] = useState('all');
  const [provinceFilter, setProvince] = useState('all');
  const [cityFilter, setCity] = useState('all');
  const [countryFilter, setCountry] = useState('all');

  const uniqueProvinces = useMemo(() => 
    Array.from(new Set(data.map(row => row['State/Province']).filter(Boolean))).sort(),
    [data]
  );

  const uniqueCities = useMemo(() =>
    Array.from(new Set(data.map(row => row.City).filter(Boolean))).sort(),
    [data]
  );

  const filteredData = useMemo(() => 
    data.filter(row => {
      const matchesSearch = row.Name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAudience = !audienceFilter || audienceFilter === 'all' || row.Audience === audienceFilter;
      const matchesProvince = !provinceFilter || provinceFilter === 'all' || row['State/Province'] === provinceFilter;
      const matchesCity = !cityFilter || cityFilter === 'all' || row.City === cityFilter;
      const matchesCountry = !countryFilter || countryFilter === 'all' || row.Country === countryFilter;
      return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;

    }),
    [data, searchTerm, audienceFilter, provinceFilter, cityFilter, countryFilter]
  );

  return {
    searchTerm,
    setSearchTerm,
    audienceFilter,
    setAudience,
    provinceFilter,
    setProvince,
    cityFilter,
    setCity,
    countryFilter,
    setCountry,
    uniqueProvinces,
    uniqueCities,
    filteredData,
  };
};