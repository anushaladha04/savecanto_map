'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface cantoFilterProps {
  audienceFilter: string;
  setAudienceFilter: (value: string) => void;
  provinceFilter: string;
  setProvinceFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
  uniqueAudiences: string[];
  uniqueProvinces: string[];
  uniqueCities: string[];
  uniqueCountries: string[];
}

const cantoFilters = ({
  audienceFilter,
  setAudienceFilter,
  provinceFilter,
  setProvinceFilter,
  cityFilter,
  setCityFilter,
  countryFilter,
  setCountryFilter,
  uniqueAudiences,
  uniqueProvinces,
  uniqueCities,
  uniqueCountries,
}: cantoFilterProps) => {
    const filters = [
    { label: "Age Group", value: audienceFilter, setValue: setAudienceFilter, options: uniqueAudiences, placeholder: "Select an Age Group" },
    { label: "Country", value: countryFilter, setValue: setCountryFilter, options: uniqueCountries, placeholder: "Country" },
    { label: "State/Province", value: provinceFilter, setValue: setProvinceFilter, options: uniqueProvinces, placeholder: "State/Province" },
    { label: "City", value: cityFilter, setValue: setCityFilter, options: uniqueCities, placeholder: "City" },
    ];

    return (
        <div className="flex gap-4">
        {filters.map(({ label, value, setValue, options, placeholder }) => (
            <div key={label}>
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">{placeholder}</SelectItem>
                {options.map(option => (
                    <SelectItem key={option} value={option}>
                    {option}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        ))}
        </div>
    );
};

export default cantoFilters;