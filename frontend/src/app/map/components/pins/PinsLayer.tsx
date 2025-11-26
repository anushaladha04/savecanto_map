// owner: haydn
// renders pins for selected region
// uses filtered programs + region zoom state

'use client';

import { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import PinMarker from './PinMarker';

// ===== IMPORTS =====
import type { BoundingBox } from '@/app/map/utils/geoUtils';

// ===== TYPE DEFINITIONS =====

// Represents a single program from the CSV
export interface Program {
  id: string;
  name: string;        // Column 0 - program name
  type: 'adults' | 'kids' | 'college' | 'other';  // program category
  latitude: number;    // Column 7 - Y coordinate on map
  longitude: number;   // Column 8 - X coordinate on map 
}

// Represents a geographic region with boundaries (uses Shane's BoundingBox format)
interface Region {
  id: string;
  name: string;
  boundingBox: BoundingBox;  // { north, south, east, west } from geoUtils
}

// Props that PinsLayer component receives - supports both interfaces
interface PinsLayerProps {
  // Region-based interface (from HEAD)
  programs?: Program[] | any[];           // array of ALL programs from CSV
  selectedRegion?: Region | null; // currently selected region (null if none selected)
  onPinClick?: (program: Program | any, latitude?: number, longitude?: number) => void;  // callback when user clicks a pin
}

// ===== HELPER FUNCTIONS =====

// Helper to extract lat/lng from program object (handles various field names)
function getCoordinates(program: any): { lat: number | null; lng: number | null } {
  const lat = program.latitude || program.Latitude || program.lat || program.Lat;
  const lng = program.longitude || program.Longitude || program.lng || program.Lng || program.lon || program.Lon;
  return { lat, lng };
}

// Helper to extract program type from program object (handles both converted and raw CSV data)
function getProgramType(program: any): 'adults' | 'kids' | 'college' | 'other' {
  // If already converted, use the type field
  if (program.type) {
    return program.type;
  }
  
  // Otherwise, convert from Audience field
  const audience = program.Audience || program.audience || '';
  const normalized = audience.trim();
  
  if (normalized === 'Adults') {
    return 'adults';
  } else if (normalized === 'Children & Teens') {
    return 'kids';
  } else if (normalized === 'College / University') {
    return 'college';
  } else {
    return 'other';
  }
}

// ------------------------------ Place pins based on coordinates -----------------------------------------------
// Checks if a program's coordinates fall within a region's boundaries
// Uses Shane's BoundingBox format: { north, south, east, west }
function isInRegion(program: any, region: Region): boolean {
  const { boundingBox } = region;
  const coords = getCoordinates(program);
  
  // If coordinates are missing, exclude this program
  if (!coords.lat || !coords.lng) {
    return false;
  }
  
  return (
    coords.lng >= boundingBox.west &&   // check west boundary
    coords.lng <= boundingBox.east &&   // check east boundary
    coords.lat >= boundingBox.south &&   // check south boundary
    coords.lat <= boundingBox.north      // check north boundary
  );
}

// Map program type to tooltip color
const tooltipColorMap: Record<string, string> = {
  adults: '#1FC6E3',      // blue
  kids: '#FFC300',        // yellow
  college: '#E60001',     // red
  other: '#7DD48B',       // green
};




// ===== MAIN COMPONENT =====          (pins are loaded when fnc PinsLayer is called and the selectedRegion is passed in)

export default function PinsLayer({
  programs = [],
  selectedRegion,
  onPinClick,
}: PinsLayerProps) {
  // ------------------------------ Hover state for pin (program info preview) ------------------------------------------
  // Track which pin is currently hovered
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Determine if we're in region mode (for UI styling) or simple mode
  // If selectedRegion is provided and not null, we're in region mode (show all pins with tooltips)
  // If selectedRegion is null or undefined, we're in simple mode (show all pins)
  const isRegionMode = selectedRegion !== null && selectedRegion !== undefined;
  
  // Always show ALL programs when a region is selected (no filtering by bounding box)
  // This allows users to pan around and see pins everywhere
  const displayPrograms = programs;

  return (
    <>
      {displayPrograms.map((program, index) => {
        // Get coordinates - handle both Program interface and any object
        const coords = getCoordinates(program);
        const lat = coords.lat;
        const lng = coords.lng;
        const programId = program.id || `pin-${index}`;

        if (!lat || !lng) {
          return null;
        }

        // In region mode, use the full UI with tooltips
        if (isRegionMode && selectedRegion) {
          const programType = getProgramType(program);
          const programName = program.name || program.Name || 'Unnamed Program';
          
          return (
            <Marker
              key={programId}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
            >
              {/* Pin wrapper with hover handlers */}
              <div
                onMouseEnter={() => setHoveredPinId(programId)}
                onMouseLeave={() => setHoveredPinId(null)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                {/* PinMarker is the visual icon (colored circle + point) */}
                <PinMarker
                  type={programType}
                  onLegacyClick={() => {
                    // Support both old and new onClick signatures
                    if (onPinClick) {
                      onPinClick(program, lat, lng);
                    }
                  }}
                  isHovered={hoveredPinId === programId}
                  size={32}
                />

                {/* Tooltip showing program name on hover */}
                {hoveredPinId === programId && (
                  <div
                    style={{
                      position: 'absolute',
                      pointerEvents: 'none',
                      top: '-25px',
                      right: '5px',
                      marginTop: '-10px',
                      zIndex: 1000,
                    }}
                  >
                    {/* Tooltip box with chat bubble arrow on bottom-right */}
                    <div
                      style={{
                        backgroundColor: tooltipColorMap[programType] || tooltipColorMap.other,
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        position: 'relative',
                      }}
                    >
                      {programName}
                      
                      {/* Arrow/pointer for chat bubble - bottom right */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '8px',
                          width: 0,
                          height: 0,
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `5px solid ${tooltipColorMap[programType] || tooltipColorMap.other}`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Marker>
          );
        }

        // Simple mode: use PinMarker with new interface (wraps Marker internally)
        // Ensure program type is set correctly
        const programType = getProgramType(program);
        return (
          <PinMarker
            key={programId}
            latitude={lat}
            longitude={lng}
            program={{ ...program, type: programType }}
            onClick={onPinClick}
          />
        );
      })}
    </>
  );
}
