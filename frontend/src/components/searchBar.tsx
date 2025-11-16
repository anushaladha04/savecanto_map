'use client';
import { Input, Space } from 'antd';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Input
      placeholder="Search"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      allowClear
      style={{ width: '300px' }}
    />
  );
};

export default SearchBar;
