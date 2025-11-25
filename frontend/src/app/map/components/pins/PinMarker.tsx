// owner: haydn and sunny
// haydn: individual pin icon UI (adults, kids, etc.)
// sunny: logic
    // onClick --> zoom to pin level + open panel

'use client';

import React from 'react';

// --------------------------PINS MARKER COMPONENT!! (haydn) ------------------------------

// Define the possible program types
type ProgramType = 'adults' | 'kids' | 'college' | 'other';

// Define the shape and props that PinMarker component accepts
interface PinMarkerProps {
  type: ProgramType;           // which program type (determines color)
  size?: number;               // optional pin size in pixels (default: 32)
  onClick?: () => void;        // optional click handler function
  isHovered?: boolean;         // optional flag for hover styling
}

// Map each program type to its corresponding color hex value
const colorMap: Record<ProgramType, string> = {
  adults: '#E60001',           // red
  kids: '#FFC300',             // yellow
  college: '#FF8B04',          // orange
  other: '#777D89',            // gray
};

// Main component: renders a colored pin icon for a program
export default function PinMarker({
  type,
  size = 32,
  onClick,
  isHovered,
}: PinMarkerProps) {
  // Get the color based on program type
  const color = colorMap[type];

  return (
    <svg
      width={size}
      height={size + 16}
      viewBox="0 0 32 48"
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.4))' : 'none',  // ← ADD SHADOW
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',                    // ← ADD SCALE
        transition: 'all 0.2s ease-in-out',                                  // ← ADD ANIMATION
      }}
    >
    {/* Main circle of the pin */}
    <circle cx="16" cy="14" r="12" fill={color} />
    
    {/* Curved teardrop point at bottom - pointing DOWN */}
    <path d="M 10 26 Q 16 38 16 42 Q 16 38 22 26 Z" fill={color} />
    
    {/* White border around the circle */}
    <circle cx="16" cy="14" r="12" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  );
}