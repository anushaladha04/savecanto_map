'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import SearchBar from './searchBar';
import TableFilters from './filterbar';

interface CsvRow {
  Name: string;
  Audience: string;
  City: string;
  'State/Province': string;
  Country: string;
  'Level of Cantonese': string;
  Address: string;
  Latitude: string;
  Longitude: string;
  Website: string;
  'Website Verification': string;
  'Approval Status': string;
}

const CantoTable = () => {
  const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLxKh_BgtzfkkUmcixsAzj4MWgh3K--aigbSVzBIq7qw7FVhZVVz9xx4IwspHzVFl92QnlDYftxPBu/pub?gid=0&single=true&output=csv';
  const [data, setData] = useState<(CsvRow & { key: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const DEFAULT_VALUE = '-----';

  useEffect(() => {
    fetch(sheetURL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch CSV');
        return res.text();
      })
      .then(csvText => {
        const parsed = Papa.parse<CsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        const rowsWithKey: (CsvRow & { key: number })[] = parsed.data
          .filter(row => typeof row === 'object' && row !== null)
          .map((row, index) => ({ key: index, ...row }));
        setData(rowsWithKey);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Get unique values for each filter
  const uniqueAudiences = Array.from(new Set(data.map(row => row.Audience).filter(Boolean))).sort();
  const uniqueProvinces = Array.from(new Set(data.map(row => row['State/Province']).filter(Boolean))).sort();
  const uniqueCities = Array.from(new Set(data.map(row => row.City).filter(Boolean))).sort();
  const uniqueCountries = Array.from(new Set(data.map(row => row.Country).filter(Boolean))).sort();

  // Apply all filters
  const filteredData = data.filter(row => {
    const matchesSearch = row.Name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === 'all' || row.Audience === audienceFilter;
    const matchesProvince = provinceFilter === 'all' || row['State/Province'] === provinceFilter;
    const matchesCity = cityFilter === 'all' || row.City === cityFilter;
    const matchesCountry = countryFilter === 'all' || row.Country === countryFilter;

    return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <TableFilters
          audienceFilter={audienceFilter}
          setAudienceFilter={setAudienceFilter}
          provinceFilter={provinceFilter}
          setProvinceFilter={setProvinceFilter}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          countryFilter={countryFilter}
          setCountryFilter={setCountryFilter}
          uniqueAudiences={uniqueAudiences}
          uniqueProvinces={uniqueProvinces}
          uniqueCities={uniqueCities}
          uniqueCountries={uniqueCountries}
          totalCount={data.length}
          filteredCount={filteredData.length}
        />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {['Name', 'Audience', 'City', 'State / Province', 'Country', 'Address', 'Website'].map(
              header => (
                <TableHead className="w-40 whitespace-normal break-words" key={header}>{header}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(row => (
            <TableRow key={row.key}>
              <TableCell className="w-40 whitespace-normal break-words">{row.Name || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">{row.Audience || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">{row.City || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">{row['State/Province'] || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">{row.Country || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">{row.Address || DEFAULT_VALUE}</TableCell>
              <TableCell className="w-40 whitespace-normal break-words">
                {row.Website ? (
                  <a
                    href={row.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {row.Website}
                  </a>
                ) : (
                  DEFAULT_VALUE
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CantoTable;