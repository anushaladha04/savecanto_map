// owner: haydn
// renders pins for selected region
// uses filtered programs + region zoom state

// PinsLayer.tsx receives:
// - selectedRegion (which region is selected)
// - programs (array of programs in that region)
// - onPinClick (callback when pin is clicked)

'use client';

import { Marker } from 'react-map-gl/maplibre';
import PinMarker from './PinMarker';

// ===== IMPORTS =====
import type { BoundingBox } from '@/app/map/utils/geoUtils';

// ===== TYPE DEFINITIONS =====

// Represents a single program from the CSV
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

// Checks if a program's coordinates fall within a region's boundaries
function isInRegion(program: Program, region: Region): boolean {
  return (
    program.longitude >= region.minLng &&  // check west boundary
    program.longitude <= region.maxLng &&  // check east boundary
    program.latitude >= region.minLat &&   // check south boundary
    program.latitude <= region.maxLat      // check north boundary
  );
}

// ===== MAIN COMPONENT =====

export default function PinsLayer({
  programs,
  selectedRegion,
  onPinClick,
}: PinsLayerProps) {
  // Filter programs: only keep ones that are in the selected region
  // If no region is selected, show no pins (empty array)
  const regionPrograms = selectedRegion
    ? programs.filter((p) => isInRegion(p, selectedRegion))
    : [];

  return (
    <>
      {/* Loop through filtered programs and render a pin for each */}
      {regionPrograms.map((program) => (
        // Marker component positions the pin on the map at coordinates
        <Marker
          key={program.id}
          longitude={program.longitude}  // X position on map
          latitude={program.latitude}    // Y position on map
          anchor="bottom"                // pin tip points to the location
        >
          {/* PinMarker is the visual icon (colored circle + point) */}
          <PinMarker
            type={program.type}                    // determines color
            onClick={() => onPinClick?.(program)} // handle pin click
          />
        </Marker>
      ))}
    </>
  );
}