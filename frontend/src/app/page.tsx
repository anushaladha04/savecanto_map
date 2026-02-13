"use client";
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import MapContainer from './map/components/MapContainer';
import { SidePanel } from './map/components/panel/SidePanel';
import { useFilters } from './map/hooks/useFilters';
import { useCsvData } from './map/hooks/useCsvData';
import CantoFilters from './map/components/filters/CantoFilters';
import CantoTable from "./table/components/table";
import { calculateDistance } from './map/utils/geoUtils';

export default function Home() {
  const pinClickHandlerRef = useRef<((program: any) => void) | null>(null);
  const [panelCloseSignal, setPanelCloseSignal] = useState(0);
  const [programToZoom, setProgramToZoom] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // On every reload: show SaveCanto location prompt (no memory of block)
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator) || !window.isSecureContext) return;
    if (userLocation) return; // already have location this session
    const id = setTimeout(() => setShowLocationPrompt(true), 500);
    return () => clearTimeout(id);
  }, [userLocation]);

  const handleLocationAllow = useCallback(() => {
    setShowLocationPrompt(false);
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  const handleLocationBlock = useCallback(() => {
    setShowLocationPrompt(false);
  }, []);

  // Stable wrapper function that always calls the latest handler
  const handlePinClick = useCallback((program: any) => {
    if (pinClickHandlerRef.current) {
      pinClickHandlerRef.current(program);
    } else {
      console.log('Pin click handler not ready yet');
    }
  }, []);
  
  const setPinClickHandler = useCallback((handler: ((program: any) => void) | null) => {
    pinClickHandlerRef.current = handler;
    console.log('Pin click handler set:', handler ? 'available' : 'null');
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
    filteredData: baseFilteredData,
  } = useFilters(csvData);

  // Apply distance filter if user location is available
  const filteredData = useMemo(() => {
    if (!distanceFilter || !userLocation) {
      return baseFilteredData;
    }

    // Convert distance to kilometers
    const maxDistanceKm = distanceUnit === 'miles' 
      ? distanceFilter * 1.60934 
      : distanceFilter;

    return baseFilteredData.filter(row => {
      // Extract coordinates from CSV row
      const latValue = row.Latitude;
      const lngValue = row.Longitude;
      const lat = typeof latValue === 'string' ? parseFloat(latValue) : (typeof latValue === 'number' ? latValue : NaN);
      const lng = typeof lngValue === 'string' ? parseFloat(lngValue) : (typeof lngValue === 'number' ? lngValue : NaN);
      
      if (isNaN(lat) || isNaN(lng)) {
        return false; // Skip rows without valid coordinates
      }

      const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
      return distance <= maxDistanceKm;
    });
  }, [baseFilteredData, distanceFilter, distanceUnit, userLocation]);

  // Check if any filters are active
  const hasActiveFilters = audienceFilter !== '' ||
    provinceFilter !== '' ||
    cityFilter !== '' ||
    countryFilter !== '' ||
    (distanceFilter !== null && userLocation !== null);

  return (
    <main className="min-h-screen grid place-items-center p-10 gap-10">
      {/* SaveCanto location permission prompt */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" aria-modal="true" role="dialog">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-[380px] border border-gray-200">
            <button
              type="button"
              onClick={handleLocationBlock}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-semibold" style={{ color: '#F98A1B' }}>Save Cantonese</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">SaveCanto Map would like to</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-700" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              <span className="text-gray-900 font-medium">use your location</span>
            </div>
            <p className="text-gray-500 text-xs mb-5">to show programs near you and filter by distance</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleLocationBlock}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Block
              </button>
              <button
                type="button"
                onClick={handleLocationAllow}
                className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90"
                style={{ backgroundColor: '#F98A1B' }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

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
            programs={filteredData} 
            onPinClick={handlePinClick}
            panelCloseSignal={panelCloseSignal}
            programToZoom={programToZoom}
            onUserLocationChange={setUserLocation}
            userLocation={userLocation}
          />
          
          {/* SidePanel manages its own state - fixed inside map container */}
          <SidePanel 
            csvData={csvData}
            filteredData={filteredData}
            csvLoading={csvLoading}
            csvError={csvError}
            hasActiveFilters={hasActiveFilters}
            onPinClickHandlerReady={setPinClickHandler}
            onPanelClose={() => {
              setPanelCloseSignal((prev) => prev + 1);
              setProgramToZoom(null); // Clear zoom target when panel closes
            }}
            onProgramZoom={(lat, lng) => setProgramToZoom({ lat, lng })}
            activeFilters={{
              audience: audienceFilter,
              province: provinceFilter,
              city: cityFilter,
              country: countryFilter,
            }}
          />
        </div>
      </div>
      
      <div className="w-[90vw]">
        <CantoTable 
          userLocation={userLocation}
          distanceFilter={distanceFilter}
          distanceUnit={distanceUnit}
          onDistanceFilterChange={setDistanceFilter}
          onDistanceUnitChange={setDistanceUnit}
        />
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