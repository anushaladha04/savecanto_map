'use client';

import BaseMap from '../map/components/BaseMap';
import PinsLayer from '../map/components/pins/PinsLayer';

// ===== TYPE DEFINITIONS =====
interface Program {
  id: string;
  name: string;
  type: 'adults' | 'kids' | 'college' | 'other';
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface Region {
  id: string;
  name: string;
  boundingBox: BoundingBox;
}

// ===== MOCK DATA =====
// Test programs at different locations in North America
const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'NYC Adult Cantonese',
    type: 'adults',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: '2',
    name: 'NYC Kids Program',
    type: 'kids',
    latitude: 40.7580,
    longitude: -73.9855,
  },
  {
    id: '3',
    name: 'Boston College',
    type: 'college',
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    id: '4',
    name: 'LA Other Program',
    type: 'other',
    latitude: 34.0522,
    longitude: -118.2437,
  },
];

// Mock region using BoundingBox format
// This region covers North America
const mockRegion: Region = {
  id: 'north-america',
  name: 'North America',
  boundingBox: {
    west: -130,    // westernmost boundary
    east: -60,     // easternmost boundary
    south: 25,     // southernmost boundary
    north: 50,     // northernmost boundary
  },
};

export default function TestPinsLayer() {
  // ===== HANDLERS =====
  // Handle pin click - log to console
  const handlePinClick = (program: Program) => {
    console.log('Pin clicked:', program);
    // TODO: Implement zoom to pin
  };

  return (
    <div className="relative w-full h-screen">
      {/* ===== TITLE OVERLAY ===== */}
      <h1 className="absolute top-4 left-4 z-10 text-2xl font-bold bg-white p-3 rounded shadow">
        PinsLayer Test (Map + Hover)
      </h1>

      {/* ===== INFO OVERLAY ===== */}
      <div className="absolute top-20 left-4 z-10 bg-white p-4 rounded shadow text-sm space-y-2">
        <p>
          <strong>Region:</strong> {mockRegion.name}
        </p>
        <p>
          <strong>Programs in region:</strong> {mockPrograms.length}
        </p>
        <p className="text-xs text-gray-600 pt-2">
          💡 Hover over pins to see them grow.<br />
          Click pins to log to console.
        </p>
      </div>

      {/* ===== MAP WITH PINS ===== */}
      <BaseMap>
        <PinsLayer
          programs={mockPrograms}
          selectedRegion={mockRegion}
          onPinClick={handlePinClick}
        />
      </BaseMap>
    </div>
  );
}
