'use client';

import { useState } from 'react';
import PinMarker from '@/app/map/components/pins/PinMarker';

export default function TestPins() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const pins = [
    { id: '1', type: 'adults' as const, label: 'Adults' },
    { id: '2', type: 'kids' as const, label: 'Kids' },
    { id: '3', type: 'college' as const, label: 'College' },
    { id: '4', type: 'other' as const, label: 'Other' },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
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
  );
}