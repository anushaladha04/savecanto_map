'use client';
import { Table, Spin, Alert, Space, Flex } from 'antd';
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

  const columns = [
    { title: 'Name', dataIndex: 'Name', key: 'Name', render: (val: string) => val || DEFAULT_VALUE },
    { title: 'Audience', dataIndex: 'Audience', key: 'Audience', render: (val: string) => val || DEFAULT_VALUE },
    { title: 'City', dataIndex: 'City', key: 'City', render: (val: string) => val || DEFAULT_VALUE },
    { title: 'State / Province', dataIndex: 'State/Province', key: 'State/Province', render: (val: string) => val || DEFAULT_VALUE },
    { title: 'Country', dataIndex: 'Country', key: 'Country', render: (val: string) => val || DEFAULT_VALUE },
    { title: 'Address', dataIndex: 'Address', key: 'Address', render: (val: string) => val || DEFAULT_VALUE },
    {
        title: 'Website',
        dataIndex: 'Website',
        key: 'Website',
        render: (url: string) =>
        url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
            </a>
        ) : (
            DEFAULT_VALUE
        ),
    }
  ];

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

        // Ensure all rows are objects and add unique key
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

  if (loading) return <Spin tip="Loading…" />;
  if (error) return <Alert message="Error loading CSV" description={error} type="error" />;

  return (
    <Space
      direction='vertical'
    >
      <Flex
        justify='flex-end'
        style={{ marginBottom: 8 }}
      >
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Flex>
      <Table 
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Space>
  );
};

export default CantoTable;
