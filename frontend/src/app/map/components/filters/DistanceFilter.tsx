'use client';

import React from 'react';

interface DistanceFilterProps {
  distance: number | null; // null means disabled
  setDistance: (distance: number | null) => void;
  unit: 'miles' | 'km';
  setUnit: (unit: 'miles' | 'km') => void;
  userLocation: { lat: number; lng: number } | null;
}

const MIN_DISTANCE = 5;
const MAX_DISTANCE = 100;
const STEP = 5;

const DistanceFilter: React.FC<DistanceFilterProps> = ({
  distance,
  setDistance,
  unit,
  setUnit,
  userLocation,
}) => {
  // Disable filter if user location is not available
  const isDisabled = !userLocation;
  const currentDistance = distance || MIN_DISTANCE;

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 border border-slate-300 rounded-md bg-white min-w-[400px]">
      {/* Distance Label and Value */}
      <div className="flex flex-col min-w-[100px]">
        <span className="text-xs text-gray-500 mb-0.5">Distance</span>
        <span className={`text-base font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {currentDistance} {unit}
        </span>
      </div>

      {/* Slider */}
      <div className="flex-1 min-w-[180px] relative py-1">
        <input
          type="range"
          min={MIN_DISTANCE}
          max={MAX_DISTANCE}
          step={STEP}
          value={currentDistance}
          onChange={(e) => setDistance(Number(e.target.value))}
          disabled={isDisabled}
          className={`w-full h-2.5 bg-slate-200 rounded-lg appearance-none ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-slate-700 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-slate-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer`}
          style={{
            background: isDisabled 
              ? '#e2e8f0' 
              : `linear-gradient(to right, #cbd5e1 0%, #cbd5e1 ${((currentDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100}%, #e2e8f0 ${((currentDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100}%, #e2e8f0 100%)`
          }}
        />
        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{MIN_DISTANCE}</span>
          <span>{MAX_DISTANCE}</span>
        </div>
      </div>

      {/* Unit Toggle */}
      <div className="flex items-center gap-1.5 border border-slate-300 rounded-md p-1.5 bg-white">
        <button
          onClick={() => setUnit('miles')}
          disabled={isDisabled}
          className={`px-3 py-1.5 text-sm rounded transition-colors font-medium ${
            unit === 'miles'
              ? 'bg-slate-200 text-black'
              : 'text-gray-600 hover:bg-slate-50'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          mi
        </button>
        <button
          onClick={() => setUnit('km')}
          disabled={isDisabled}
          className={`px-3 py-1.5 text-sm rounded transition-colors font-medium ${
            unit === 'km'
              ? 'bg-slate-200 text-black'
              : 'text-gray-600 hover:bg-slate-50'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          km
        </button>
      </div>

      {/* Clear Button */}
      {distance && (
        <button
          onClick={() => setDistance(null)}
          disabled={isDisabled}
          className="text-slate-400 hover:text-slate-600 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded hover:bg-slate-50"
          title="Clear distance filter"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default DistanceFilter;

