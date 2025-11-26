import { useEffect } from 'react';
import CantoFilters from './CantoFilters';
import { useFilters } from '../../hooks/useFilters';
import type { CsvRow } from './types';

interface Props {
  csvData: CsvRow[];
  onChangeFiltered?: (data: CsvRow[]) => void;
}

export default function CantoFiltersWrapper({ csvData, onChangeFiltered }: Props) {
  const {
    audienceFilter,
    setAudience,
    provinceFilter,
    setProvince,
    cityFilter,
    setCity,
    countryFilter,
    setCountry,
    filteredData,
  } = useFilters(csvData);

  // Notify parent when filtered data changes
  useEffect(() => {
    if (onChangeFiltered) onChangeFiltered(filteredData);
  }, [filteredData, onChangeFiltered]);

  return (
    <CantoFilters
      data={csvData}
      audienceFilter={audienceFilter}
      setAudienceFilter={setAudience}
      provinceFilter={provinceFilter}
      setProvinceFilter={setProvince}
      cityFilter={cityFilter}
      setCityFilter={setCity}
      countryFilter={countryFilter}
      setCountryFilter={setCountry}
    />
  );
}