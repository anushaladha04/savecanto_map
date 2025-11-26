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
  adults: '#1FC6E3',           // blue
  kids: '#FFC300',             // yellow
  college: '#E60001',          // red
  other: '#7DD48B',            // green
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
        filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.4))' : 'none',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {/* Unified pin shape - circle connected to rounded teardrop point */}
      <path d="M 4 14 C 4 6 10 2 16 2 C 22 2 28 6 28 14 C 28 20 16 42 16 42 C 16 42 4 20 4 14 Z" fill={color} />
      
      {/* White border around the pin */}
      <path d="M 4 14 C 4 6 10 2 16 2 C 22 2 28 6 28 14 C 28 20 16 42 16 42 C 16 42 4 20 4 14 Z" fill="none" stroke="white" strokeWidth="1" />
      
      {/* ADULTS - Star icon (blue) */}
      {type === 'adults' && (
        <g>
          {/* Star shape */}
          <polygon points="16,5 20,13 28,13 22,19 25,27 16,21 7,27 10,19 4,13 12,13" fill="white" />
        </g>
      )}
      
      {/* KIDS - Smiley face icon (yellow) */}
      {type === 'kids' && (
        <g>
          {/* Face outline */}
          <circle cx="16" cy="14" r="7" fill="none" stroke="white" strokeWidth="1" />
          {/* Left eye */}
          <circle cx="13" cy="11" r="1.5" fill="white" />
          {/* Right eye */}
          <circle cx="19" cy="11" r="1.5" fill="white" />
          {/* Smile - curved line */}
          <path d="M 13 14 Q 16 16 19 14" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}
      
      {/* COLLEGE - Apple icon (red) */}
      {type === 'college' && (
        <g>
          {/* Apple body */}
          <circle cx="16" cy="13" r="5" fill="white" />
          {/* Apple stem */}
          <rect x="15" y="6" width="2" height="4" fill="white" />
          {/* Leaf */}
          <ellipse cx="19" cy="8" rx="2.5" ry="1.5" fill="white" transform="rotate(-45 19 8)" />
        </g>
      )}
      
      {/* OTHER - Gear/Settings icon (green) */}
      {type === 'other' && (
        <g>
          {/* Gear circle center */}
          <circle cx="16" cy="14" r="3" fill="white" />
          {/* Gear teeth */}
          <rect x="15" y="7" width="2" height="2" fill="white" />
          <rect x="15" y="19" width="2" height="2" fill="white" />
          <rect x="9" y="13" width="2" height="2" fill="white" />
          <rect x="21" y="13" width="2" height="2" fill="white" />
          {/* Diagonal teeth */}
          <rect x="10" y="7.5" width="1.5" height="1.5" fill="white" transform="rotate(45 10 9)" />
          <rect x="18.5" y="18" width="1.5" height="1.5" fill="white" transform="rotate(45 21 20)" />
          <rect x="20" y="8" width="1.5" height="1.5" fill="white" transform="rotate(-45 21 9)" />
          <rect x="11.5" y="19" width="1.5" height="1.5" fill="white" transform="rotate(-45 10 20)" />
        </g>
      )}
    </svg>
  );
}