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

      <p className="w-[85vw]">Many Cantonese learners still struggle to learn the language, in part because educational institutions that offer Cantonese classes are difficult to find.
        This map and database are a response to this critical need. Find a Cantonese program near you, and enroll today! To find a program, consult the map and
        data table below it. You can filter by audience and zoom in to find a program near you. Contact the school directly for times and availability.</p>
      
        <p className="w-[85vw]">世界各地嘅粵語學習者經常都喺尋找呢種語言學習途徑上遇到困難。 尋找一個合適自己地區嘅課程係一件好困難嘅事。 所以，我哋為您呈現「粵語課程世界地圖」！尋找在你附近嘅粵語學校，儘快報名參加。粵語課程世界地圖若想要搜尋最適合你的粵語課程，歡迎瀏覽「粵語課程世界地圖」及其相關的數據表。 你還可以按照課程的等級，搜尋距離你最近的粵語課程，課程包括：K-12（幼稚園、小學和中學）、專上及高等教育、成人進修課程等等。假如你對其中任一粵語課程感興趣，請直接聯絡該校了解上課時間及相關細節。</p>

      <h1 className="text-4xl font-semibold mt-7">World Map of Cantonese Programs</h1>
      
      {/* Filters at the top level */}
      <div className="w-[90vw] mt-7">
        <div className="mb-2">
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
          
          {/* SidePanel manages its own state - fixed inside map container */}
          <SidePanel 
            csvData={csvData}
            filteredData={filteredData}
            csvLoading={csvLoading}
            csvError={csvError}
            hasActiveFilters={hasActiveFilters}
            onPinClickHandlerReady={setPinClickHandler}
          />
        </div>
      </div>
      
      <div className="w-[90vw]">
        <CantoTable />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-10">Spot a missing program? We're all ears!️</h2>
        <p className="w-[60vw] mb-15">
          Want to display your program? Are there errors we should know about? Tell us about it{' '}
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSe8ux3_RBDXN9ThKjNMsNQ4mCYppMU3iMXnQYActGvDohoFvg/viewform?usp=dialog" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            here
          </a>. 
          If you or someone you know is interested in volunteering to expand the World Map of Cantonese Program, please 
          email us at{' '}
          <a href="mailto:team@savecantonese.org" className="text-blue-600 hover:text-blue-800 underline">
            team@savecantonese.org
          </a>
        </p>
      </div>
    </main>
  );
}