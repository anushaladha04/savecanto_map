import { useState, useMemo } from 'react';
import { CsvRow } from '../components/filters/types';

export const useFilters = (data: CsvRow[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudience] = useState('');
  const [provinceFilter, setProvince] = useState('');
  const [cityFilter, setCity] = useState('');
  const [countryFilter, setCountry] = useState('');

  const uniqueProvinces = useMemo(() => 
    Array.from(new Set(data.map(row => row['State/Province']).filter(Boolean))).sort(),
    [data]
  );

  const uniqueCities = useMemo(() =>
    Array.from(new Set(data.map(row => row.City).filter(Boolean))).sort(),
    [data]
  );

  // Helper function to normalize audience strings for comparison
  const normalizeAudience = (audience: string): string => {
    if (!audience) return '';
    return audience.trim().toLowerCase();
  };

  // Map filter values to possible CSV variations
  const getAudienceVariations = (filterValue: string): string[] => {
    const normalized = normalizeAudience(filterValue);
    if (normalized === 'college / university' || normalized === 'college/university') {
      return ['College / University', 'College/University', 'College & University', 'College&University'];
    }
    if (normalized === 'children & teens' || normalized === 'children and teens') {
      return ['Children & Teens', 'Children and Teens', 'Children&Teens'];
    }
    if (normalized === 'adults') {
      return ['Adults'];
    }
    return [filterValue]; // Return original if no mapping found
  };

  const filteredData = useMemo(() => 
    data.filter(row => {
      const matchesSearch = row.Name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Normalize audience matching to handle variations
      let matchesAudience = true;
      if (audienceFilter && audienceFilter !== 'all') {
        const audienceVariations = getAudienceVariations(audienceFilter);
        const rowAudience = normalizeAudience(row.Audience || '');
        matchesAudience = audienceVariations.some(variation => 
          normalizeAudience(variation) === rowAudience
        );
      }
      
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