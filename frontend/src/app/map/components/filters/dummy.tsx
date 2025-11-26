'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import CantoFilters from './CantoFilters';
import { CsvRow } from '../../types/types';
import { useFilters } from '../../hooks/useFilters';

const Dummy = () => {
  const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLxKh_BgtzfkkUmcixsAzj4MWgh3K--aigbSVzBIq7qw7FVhZVVz9xx4IwspHzVFl92QnlDYftxPBu/pub?gid=0&single=true&output=csv';

  const [data, setData] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch CSV data
  useEffect(() => {
    fetch(sheetURL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch CSV');
        return res.text();
      })
      .then(csvText => {
        const parsed = Papa.parse<CsvRow>(csvText, { header: true, skipEmptyLines: true });
        const rows = parsed.data.filter(row => typeof row === 'object' && row !== null);
        setData(rows);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Use the filtering hook
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
  } = useFilters(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex gap-8 pb-3">
      {/* Filters */}
      <CantoFilters
        data={data}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudience}
        provinceFilter={provinceFilter}
        setProvinceFilter={setProvince}
        cityFilter={cityFilter}
        setCityFilter={setCity}
        countryFilter={countryFilter}
        setCountryFilter={setCountry}
      />
    </div>
  );
};

export default Dummy;