import { useState, useMemo } from 'react';
import { CsvRow } from '../types/types';

export const useFilters = (data: CsvRow[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audience, setAudience] = useState('all');
  const [province, setProvince] = useState('all');
  const [city, setCity] = useState('all');
  const [country, setCountry] = useState('all');

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
      const matchesAudience = audience === 'all' || row.Audience === audience;
      const matchesProvince = province === 'all' || row['State/Province'] === province;
      const matchesCity = city === 'all' || row.City === city;
      const matchesCountry = country === 'all' || row.Country === country;
      return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;
    }),
    [data, searchTerm, audience, province, city, country]
  );

  return {
    searchTerm,
    setSearchTerm,
    audience,
    setAudience,
    province,
    setProvince,
    city,
    setCity,
    country,
    setCountry,
    uniqueProvinces,
    uniqueCities,
    filteredData,
  };
};