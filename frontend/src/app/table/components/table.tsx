'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import SearchBar from './searchBar';
import TableFilters from './filterbar';
import TablePagination from './pagination';
import { ArrowUpDown, SortAscIcon, SortDescIcon } from 'lucide-react';
import DistanceFilter from '../../map/components/filters/DistanceFilter';
import { calculateDistance } from '../../map/utils/geoUtils';

interface CsvRow {
  Name: string;
  Audience: string;
  City: string;
  'State/Province': string;
  Country: string;
  Address: string;
  Website: string;
  Latitude?: string | number;
  Longitude?: string | number;
}

type SortKey = 'Name' | 'Audience' | 'City' | 'State/Province' | 'Country' | 'Address' | 'Website';
type SortOrder = 'default' | 'asc' | 'desc';

interface CantoTableProps {
  userLocation?: { lat: number; lng: number } | null;
  distanceFilter?: number | null;
  distanceUnit?: 'miles' | 'km';
  onDistanceFilterChange?: (distance: number | null) => void;
  onDistanceUnitChange?: (unit: 'miles' | 'km') => void;
}

const CantoTable = ({
  userLocation = null,
  distanceFilter = null,
  distanceUnit = 'miles',
  onDistanceFilterChange,
  onDistanceUnitChange,
}: CantoTableProps) => {
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
  const filteredData = useMemo(() => {
    let result = data.filter(row => {
      // Search across all columns
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        Object.values(row).some(value => 
          value?.toString().toLowerCase().includes(searchLower)
        );
      const matchesAudience = audienceFilter === 'all' || row.Audience === audienceFilter;
      const matchesProvince = provinceFilter === 'all' || row['State/Province'] === provinceFilter;
      const matchesCity = cityFilter === 'all' || row.City === cityFilter;
      const matchesCountry = countryFilter === 'all' || row.Country === countryFilter;

      return matchesSearch && matchesAudience && matchesProvince && matchesCity && matchesCountry;
    });

    // Apply distance filter if user location is available
    if (distanceFilter && userLocation) {
      const maxDistanceKm = distanceUnit === 'miles' 
        ? distanceFilter * 1.60934 
        : distanceFilter;

      result = result.filter(row => {
        const lat = parseFloat(String(row.Latitude || ''));
        const lng = parseFloat(String(row.Longitude || ''));
        
        if (isNaN(lat) || isNaN(lng)) {
          return false; // Skip rows without valid coordinates
        }

        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        return distance <= maxDistanceKm;
      });
    }

    return result;
  }, [data, searchTerm, audienceFilter, provinceFilter, cityFilter, countryFilter, distanceFilter, distanceUnit, userLocation]);

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
      {onDistanceFilterChange && onDistanceUnitChange && (
        <div className="flex items-center">
          <DistanceFilter
            distance={distanceFilter}
            setDistance={onDistanceFilterChange}
            unit={distanceUnit}
            setUnit={onDistanceUnitChange}
            userLocation={userLocation}
          />
        </div>
      )}
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
                  <div className="flex items-center justify-between">
                    <span>{header}</span>
                    <span className='mr-6'>
                      {isActive ? (
                        sortOrder === 'asc' ? <SortAscIcon size={16} /> : sortOrder === 'desc' ? <SortDescIcon size={16} /> : <ArrowUpDown size={16} />
                      ) : (
                        <ArrowUpDown size={16} />
                      )}
                    </span>

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
