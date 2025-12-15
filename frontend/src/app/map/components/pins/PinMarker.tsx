// owner: haydn and sunny
// haydn: individual pin icon UI (adults, kids, etc.)
// sunny: logic
// onClick --> zoom to pin level + open panel

'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { IconRenderer } from './IconSet';

// --------------------------PINS MARKER COMPONENT!! (haydn) ------------------------------
// Build color pin icons (adults/kids/college/other)
// Renders colored pin with matching icon for each program type

export type ProgramType = 'adults' | 'kids' | 'college' | 'other';

// map each program to color
export const colorMap: Record<ProgramType, string> = {
  adults: '#1FC6E3',           // blue
  kids: '#FFC300',             // yellow
  college: '#E60001',          // red
  other: '#7DD48B',            // green
};

// Program interface
interface Program {
  id: string;
  name: string;
  type: ProgramType;
  latitude: number;
  longitude: number;
}

// Props interface - supports both old and new interfaces
interface PinMarkerProps {
  // New interface (from sunny_micro_zoom) - for Marker wrapper
  latitude?: number;
  longitude?: number;
  program?: Program;
  onClick?: (program: Program, latitude: number, longitude: number) => void;
  
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
      {/* Teardrop pin shape from Figma - scaled and centered */}
      <g transform="translate(8, 2) scale(1.8)">
        <path d="M6.50241 18.3182C6.50241 18.3182 -1.48769 9.37587 0.246298 4.06638C1.98029 -1.24311 11.0447 -1.46667 12.7585 4.06638C14.4723 9.59943 6.50241 18.3182 6.50241 18.3182Z" 
              fill={color} />
        {/* White border */}
        <path d="M6.50241 18.3182C6.50241 18.3182 -1.48769 9.37587 0.246298 4.06638C1.98029 -1.24311 11.0447 -1.46667 12.7585 4.06638C14.4723 9.59943 6.50241 18.3182 6.50241 18.3182Z" 
              fill="none" stroke="white" strokeWidth="0.6" />
      </g>
      
      {/* Icon renderer from IconSet - centered in the pin circle */}
      <g transform="translate(20, 15) scale(2)">
        <IconRenderer type={type} />
      </g>
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
