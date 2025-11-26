"use client";
import { useState, useRef, useCallback } from 'react';
import MapContainer from './map/components/MapContainer';
import { SidePanel } from './map/components/panel/SidePanel';
import { useFilters } from './map/hooks/useFilters';
import { useCsvData } from './map/hooks/useCsvData';
import CantoFilters from './map/components/filters/CantoFilters';
import CantoTable from "./table/components/table";

export default function Home() {
  const pinClickHandlerRef = useRef<((program: any) => void) | null>(null);
  
  // Stable wrapper function that always calls the latest handler
  const handlePinClick = useCallback((program: any) => {
    if (pinClickHandlerRef.current) {
      pinClickHandlerRef.current(program);
    } else {
      console.log('⚠️ Pin click handler not ready yet');
    }
  }, []);
  
  const setPinClickHandler = useCallback((handler: ((program: any) => void) | null) => {
    pinClickHandlerRef.current = handler;
    console.log('✅ Pin click handler set:', handler ? 'available' : 'null');
  }, []);
  
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

  // Check if any filters are active
  const hasActiveFilters = audienceFilter !== '' ||
    provinceFilter !== '' ||
    cityFilter !== '' ||
    countryFilter !== '';

  return (
    <main className="min-h-screen grid place-items-center p-10 gap-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      
      {/* Filters at the top level */}
      <div className="w-[90vw]">
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

      <div className="relative w-[90vw] h-[80vh]">
        <MapContainer 
          programs={csvData} 
          onPinClick={handlePinClick}
        />
        
        {/* SidePanel manages its own state */}
        <SidePanel 
          csvData={csvData}
          filteredData={filteredData}
          csvLoading={csvLoading}
          csvError={csvError}
          hasActiveFilters={hasActiveFilters}
          onPinClickHandlerReady={setPinClickHandler}
        />
      </div>
      
      <div className="w-[90vw]">
        <CantoTable />
      </div>
    </main>
  );
}