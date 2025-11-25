'use client';

import { useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import BaseMap from '../map/components/BaseMap';
import PinsLayer from '../map/components/pins/PinsLayer';
import PinMarker from '@/app/map/components/pins/PinMarker';

// Mock data
const mockPrograms = [
  {
    id: '1',
    name: 'NYC Adult',
    type: 'adults' as const,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: '2',
    name: 'NYC Kids',
    type: 'kids' as const,
    latitude: 40.7580,
    longitude: -73.9855,
  },
  {
    id: '3',
    name: 'Boston College',
    type: 'college' as const,
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    id: '4',
    name: 'LA Other',
    type: 'other' as const,
    latitude: 34.0522,
    longitude: -118.2437,
  },
];

const mockRegion = {
  id: 'north-america',
  name: 'North America',
  minLng: -130,
  maxLng: -60,
  minLat: 25,
  maxLat: 50,
};

export default function Home() {
  const mapRef = useRef<MapRef>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const pins = [
    { id: '1', type: 'adults' as const, label: 'Adults' },
    { id: '2', type: 'kids' as const, label: 'Kids' },
    { id: '3', type: 'college' as const, label: 'College' },
    { id: '4', type: 'other' as const, label: 'Other' },
  ];

  return (
    <main className="min-h-screen">
      <div className="w-full h-screen">
        <BaseMap mapRef={mapRef}>
          <PinsLayer
            programs={mockPrograms}
            selectedRegion={mockRegion}
            onPinClick={(program) => console.log('Clicked:', program)}
          />
        </BaseMap>
      </div>
      <div className="p-10 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Pin Icon Test</h1>
        
        <div className="flex gap-12 items-center">
          {pins.map((pin) => (
            <div
              key={pin.id}
              className="flex flex-col items-center gap-2"
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <PinMarker
                type={pin.type}
                size={48}
                isHovered={hoveredPin === pin.id}
              />
              <p>{pin.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}