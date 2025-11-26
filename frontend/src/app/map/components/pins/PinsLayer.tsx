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

// Represents a single program from the CSV -> a little confused on how to get input for this
interface Program {
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

// Props that PinsLayer component receives
interface PinsLayerProps {
  programs: Program[];           // array of ALL programs from CSV
  selectedRegion: Region | null; // currently selected region (null if none selected)
  onPinClick?: (program: Program) => void;  // callback when user clicks a pin
}

// ===== HELPER FUNCTIONS =====

// ------------------------------ Place pins based on coordinates -----------------------------------------------
// Checks if a program's coordinates fall within a region's boundaries
// Uses Shane's BoundingBox format: { north, south, east, west }
function isInRegion(program: Program, region: Region): boolean {
  const { boundingBox } = region;
  return (
    program.longitude >= boundingBox.west &&   // check west boundary
    program.longitude <= boundingBox.east &&   // check east boundary
    program.latitude >= boundingBox.south &&   // check south boundary
    program.latitude <= boundingBox.north      // check north boundary
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
  programs,
  selectedRegion,
  onPinClick,
}: PinsLayerProps) {
  // ------------------------------ Hover state for pin (program info preview) ------------------------------------------
  // Track which pin is currently hovered
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Filter programs: only keep ones that are in the selected region
  // If no region is selected, show no pins (empty array)
  const regionPrograms = selectedRegion
    ? programs.filter((p) => isInRegion(p, selectedRegion))
    : [];

  return (
    <>
      {/* Loop through filtered programs and render a pin for each */}
      {regionPrograms.map((program) => (
        <Marker
          key={program.id}
          longitude={program.longitude}  // X position on map
          latitude={program.latitude}    // Y position on map
          anchor="bottom"                // pin tip points to the location
        >
          {/* Pin wrapper with hover handlers */}
          <div
            onMouseEnter={() => setHoveredPinId(program.id)}
            onMouseLeave={() => setHoveredPinId(null)}
            style={{ position: 'relative' }}
          >
            {/* PinMarker is the visual icon (colored circle + point) */}
            <PinMarker
              type={program.type}                    // determines color
              // -----------------------------------------Click behavior --------------------------------------------------
              // When pin is clicked, call onPinClick callback with program data
              // This triggers: zoom to pin level + open panel (handled elsewhere)
              onClick={() => {
                onPinClick?.(program); // Pass program data up
                console.log('Pin clicked:', program);  // Log to console for testing
              }}
            />

            {/* Tooltip showing program name on hover */}
            {hoveredPinId === program.id && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  top: '-25px',
                  right: '5px',
                  marginTop: '-10px',
                }}
              >
                {/* Tooltip box with chat bubble arrow on bottom-right */}
                <div
                  style={{
                    backgroundColor: tooltipColorMap[program.type],
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  {program.name}
                  
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
                      borderTop: `5px solid ${tooltipColorMap[program.type]}`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Marker>
      ))}
    </>
  );
}