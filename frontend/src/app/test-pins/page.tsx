'use client';

import { useState } from 'react';
import PinMarker from '@/app/map/components/pins/PinMarker';

// ===== STATE =====
export default function TestPins() {
  // Track which pin is currently being hovered (null if none)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // ===== TEST DATA =====
  // Mock pin data for testing all 4 program types
  const pins = [
    { id: '1', type: 'adults' as const, label: 'Adults' },
    { id: '2', type: 'kids' as const, label: 'Kids' },
    { id: '3', type: 'college' as const, label: 'College' },
    { id: '4', type: 'other' as const, label: 'Other' },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Pin Icon Test (Hover Effects)</h1>
      
      {/* ===== PINS CONTAINER ===== */}
      {/* Container that holds all test pins in a row */}
      <div className="flex gap-12 items-center">
        
        {/* ===== PIN LOOP ===== */}
        {/* Loop through each pin and render it */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="flex flex-col items-center gap-2"
            // ===== HOVER HANDLERS =====
            // When mouse enters this pin area, set it as the hovered pin
            onMouseEnter={() => setHoveredPin(pin.id)}
            // When mouse leaves this pin area, clear the hovered state
            onMouseLeave={() => setHoveredPin(null)}
          >
            {/* ===== PIN MARKER COMPONENT ===== */}
            {/* Render the visual pin icon */}
            <PinMarker
              type={pin.type}                      // determines pin color (adults/kids/college/other)
              size={48}                            // size in pixels
              isHovered={hoveredPin === pin.id}   // pass hover state - true if this pin is being hovered
            />
            
            {/* ===== LABEL ===== */}
            {/* Display text label under the pin */}
            <p>{pin.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}