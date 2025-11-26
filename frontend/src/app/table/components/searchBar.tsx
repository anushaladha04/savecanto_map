'use client';
import { Input } from './ui/input';
import { SearchIcon } from './ui/icons/lucide-search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-[400px]">
      <Input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-[#F5F7FA] border-none focus:ring-0 focus:outline-none pl-8"
      />
      <SearchIcon
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
        style={{ width: '1em', height: '1em' }}
 />
    </div>
  );
};

export default SearchBar;
