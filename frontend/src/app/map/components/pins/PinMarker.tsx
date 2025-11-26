// owner: haydn and sunny
// haydn: individual pin icon UI (adults, kids, etc.)
// sunny: logic
// onClick --> zoom to pin level + open panel

'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';

// --------------------------PINS MARKER COMPONENT!! (haydn) ------------------------------
// Build color pin icons (adults/kids/college/other)
// Renders colored pin with matching icon for each program type

type ProgramType = 'adults' | 'kids' | 'college' | 'other';

// Map each program to color
const colorMap: Record<ProgramType, string> = {
  adults: '#1FC6E3',           // blue
  kids: '#FFC300',             // yellow
  college: '#E60001',          // red
  other: '#7DD48B',            // green
};

// Props interface - supports both old and new interfaces
interface PinMarkerProps {
  // New interface (from sunny_micro_zoom) - for Marker wrapper
  latitude?: number;
  longitude?: number;
  program?: any;
  onClick?: (program: any, latitude: number, longitude: number) => void;
  
  // Old interface (from HEAD) - for use inside existing Marker
  type?: ProgramType;
  size?: number;
  isHovered?: boolean;
  // Legacy onClick for old interface
  onLegacyClick?: () => void;
}

// Internal component: renders the SVG pin icon
function PinIcon({ type, size = 32, isHovered }: { type: ProgramType; size?: number; isHovered?: boolean }) {
  const color = colorMap[type];

  return (
    <svg
      width={size}
      height={size + 16}
      viewBox="0 0 32 48"
      style={{ 
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
      
      {/* KIDS - Baby face icon (yellow) */}
      {type === 'kids' && (
        <g>
          {/* Face circle - rounder, chubby baby face */}
          <circle cx="16" cy="13" r="7.5" fill="none" stroke="white" strokeWidth="1.2" />
          
          {/* Left cheek - cute blush */}
          <circle cx="9" cy="14" r="1.5" fill="white" opacity="0.8" />
          {/* Right cheek - cute blush */}
          <circle cx="23" cy="14" r="1.5" fill="white" opacity="0.8" />
          
          {/* Left eye - bigger, round */}
          <circle cx="12" cy="10" r="1.8" fill="white" />
          {/* Right eye - bigger, round */}
          <circle cx="20" cy="10" r="1.8" fill="white" />
          
          {/* Big happy smile - curved arc */}
          <path d="M 12 14 Q 16 17 20 14" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}
      
      {/* COLLEGE - Apple icon (red) */}
      {type === 'college' && (
        <g>
          {/* Apple outline - hollow shape, rounder and taller */}
          <path d="M 16 7 Q 11 7 9 10.5 Q 8 12.5 9 14.5 Q 11 17 16 17 Q 21 17 23 14.5 Q 24 12.5 23 10.5 Q 21 7 16 7" 
                fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Apple stem - small line */}
          <line x1="16" y1="6.5" x2="16" y2="4.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
          {/* Leaf - curved shape */}
          <path d="M 18 5.5 Q 20.5 4.5 21.5 6" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
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

// Main component: renders a Marker with Haydn's pin icon or just the SVG
export default function PinMarker({
  latitude,
  longitude,
  program,
  onClick,
  type,
  size = 32,
  isHovered,
  onLegacyClick,
}: PinMarkerProps) {
  // Determine program type from prop or program object
  const programType: ProgramType = type || (program?.type as ProgramType) || 'other';

  // Handle click - support both new and old interfaces
  const handleClick = () => {
    if (onClick && latitude !== undefined && longitude !== undefined && program) {
      onClick(program, latitude, longitude);
    } else if (onLegacyClick) {
      onLegacyClick();
    }
  };

  // If latitude/longitude are provided, use Marker wrapper (new interface)
  if (latitude !== undefined && longitude !== undefined) {
    return (
      <Marker
        latitude={latitude}
        longitude={longitude}
        anchor="bottom"
        onClick={handleClick}
        style={{ cursor: onClick || onLegacyClick ? 'pointer' : 'default' }}
      >
        <PinIcon type={programType} size={size} isHovered={isHovered} />
      </Marker>
    );
  }

  // Otherwise, return just the SVG (old interface for use in PinsLayer with region filtering)
  return (
    <div onClick={handleClick} style={{ cursor: onLegacyClick ? 'pointer' : 'default' }}>
      <PinIcon type={programType} size={size} isHovered={isHovered} />
    </div>
  );
}
