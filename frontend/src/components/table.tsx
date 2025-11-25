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
import TablePagination from './pagination';
import { ArrowUpDown, SortAscIcon, SortDescIcon } from 'lucide-react';

interface CsvRow {
  Name: string;
  Audience: string;
  City: string;
  'State/Province': string;
  Country: string;
  Address: string;
  Website: string;
}

type SortKey = 'Name' | 'Audience' | 'City' | 'State/Province' | 'Country' | 'Address' | 'Website';
type SortOrder = 'default' | 'asc' | 'desc';

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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [sortKey, setSortKey] = useState<SortKey | null>(null); // null for default

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

  // Unique values for filters
  const uniqueProvinces = Array.from(new Set(data.map(row => row['State/Province']).filter(Boolean))).sort();
  const uniqueCities = Array.from(new Set(data.map(row => row.City).filter(Boolean))).sort();

  // Apply filters
  const filteredData = data.filter(row => {
    const matchesSearch = row.Name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === 'all' || row.Audience === audienceFilter;
    const matchesProvince = provinceFilter === 'all' || row['State/Province'] === provinceFilter;
    const matchesCity = cityFilter === 'all' || row.City === cityFilter;
    const matchesCountry = countryFilter === 'all' || row.Country === countryFilter;

    return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;
  });

  // Apply sorting
  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const valA = (a[sortKey] || '').toString().toLowerCase();
        const valB = (b[sortKey] || '').toString().toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData; // default: no sorting

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      // New column clicked → start with ascending
      setSortKey(key);
      setSortOrder('asc');
    } else {
      // Same column clicked → cycle asc → desc → default
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortOrder('default');
        setSortKey(null); // reset to default order
      } else setSortOrder('asc');
    }
  };


  const headers: SortKey[] = ['Name', 'Audience', 'City', 'State/Province', 'Country', 'Address', 'Website'];

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
          uniqueProvinces={uniqueProvinces}
          uniqueCities={uniqueCities}
        />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <Table className="table-fixed w-full">
        <TableHeader style={{ backgroundColor: '#F5F7FA' }}>
          <TableRow className='border-b border-[#E5E6E8]'>
            {headers.map(header => {
              const isActive = sortKey === header;
              return (
                <TableHead
                  key={header}
                  className="w-40 whitespace-nowrap break-words cursor-pointer"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {isActive ? (
                      sortOrder === 'asc' ? <SortAscIcon size={16} /> : sortOrder === 'desc' ? <SortDescIcon size={16} /> : <ArrowUpDown size={16} />
                    ) : (
                      <ArrowUpDown size={16} />
                    )}

                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map(row => (
            <TableRow key={row.key} className='border-[#E5E6E8] h-16 bg-[#FDFEFF]'>
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
      <div>
        <TablePagination
          currentPage={page}
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default CantoTable;
