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

  const filteredData = data.filter(row =>
    row.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-end mb-2">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State / Province</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(row => (
            <TableRow key={row.key}>
              <TableCell>{row.Name || DEFAULT_VALUE}</TableCell>
              <TableCell>{row.Audience || DEFAULT_VALUE}</TableCell>
              <TableCell>{row.City || DEFAULT_VALUE}</TableCell>
              <TableCell>{row['State/Province'] || DEFAULT_VALUE}</TableCell>
              <TableCell>{row.Country || DEFAULT_VALUE}</TableCell>
              <TableCell>{row.Address || DEFAULT_VALUE}</TableCell>
              <TableCell>
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
