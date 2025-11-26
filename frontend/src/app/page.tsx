"use client";
import { useState } from "react";
import BaseMap from "./map/components/BaseMap";
import { SidePanel } from "./map/components/panel/SidePanel";
import CantoFilters from './map/components/filters/CantoFilters';
import { useFilters } from "./map/hooks/useFilters";
import { useCsvData } from "./map/hooks/useCsvData";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  
  // Fetch CSV data with hook
  const { csvData, csvLoading, csvError } = useCsvData();

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

  return (
    <main className="min-h-screen p-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">World Map of Cantonese Programs</h1>
      
      {/* Filters at the top level */}
      <div className="flex justify-between">
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
      </div>

      <div className="relative w-full h-[80vh]">
        <BaseMap />
        
        {/* Pass filtered data to SidePanel */}
        <SidePanel 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          csvData={csvData}
          filteredData={filteredData}
          csvLoading={csvLoading}
          csvError={csvError}
        />
      </div>
      
      <h2 className="text-2xl font-bold text-center">Table Placeholder</h2>
    </main>
  );
}