// owner: anusha
// provides structure for other devs
// NOTE: Added code for testing - Contains wiring for zoom components (ZoomControls, SaveCantoIcon, handlePinClick)

'use client';

import { useRef, useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import BaseMap from './BaseMap';
import { useZoomToPin } from '../hooks/useZoom';
import { useSelectedPrograms } from '../hooks/useSelectedPrograms';
import PinsLayer from './pins/PinsLayer';
import ZoomControls from './ZoomControls';
import SaveCantoIcon from './SaveCantoIcon';
// Import other components as needed (clusters, filters, etc.)

interface MapContainerProps {
  programs?: any[]; // programs to display as pins
  // Add other props as needed
}

export default function MapContainer({ programs = [] }: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const { zoomToPin, zoomOut, zoomIn, zoomOutControl } = useZoomToPin(mapRef);
  const { selectProgram, selectedProgram } = useSelectedPrograms();
  const prevSelectedProgram = useRef<any>(null);

  // Zoom out when panel closes (when selectedProgram becomes null)
  useEffect(() => {
    if (prevSelectedProgram.current && !selectedProgram) {
      // Panel was just closed, zoom out
      zoomOut();
    }
    prevSelectedProgram.current = selectedProgram;
  }, [selectedProgram, zoomOut]);

  const handlePinClick = (program: any, latitude: number, longitude: number) => {
    // Zoom to pin
    zoomToPin(latitude, longitude, 14);
    
    // Select program (this will trigger side panel to open via Edi's code)
    selectProgram(program);
  };

  return (
    <BaseMap mapRef={mapRef as React.RefObject<MapRef>}>
      {/* Add other layers here (clusters, etc.) */}
      {programs.length > 0 && (
        <PinsLayer programs={programs} onPinClick={handlePinClick} />
      )}
      {/* Zoom controls - bottom right */}
      <ZoomControls mapRef={mapRef} zoomIn={zoomIn} zoomOut={zoomOutControl} />
      {/* SaveCanto icon - bottom left */}
      <SaveCantoIcon />
    </BaseMap>
  );
}