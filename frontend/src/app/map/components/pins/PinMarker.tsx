// owner: haydn and sunny
// haydn: individual pin icon UI (adults, kids, etc.)
// sunny: logic
// onClick --> zoom to pin level + open panel

'use client';

import { Marker } from 'react-map-gl/maplibre';

interface PinMarkerProps {
  latitude: number;
  longitude: number;
  program: any; 
  onClick: (program: any, latitude: number, longitude: number) => void;
  // pin styling - I think haydn does this
}

export default function PinMarker({
  latitude,
  longitude,
  program,
  onClick,
}: PinMarkerProps) {
  const handleClick = () => {
    onClick(program, latitude, longitude);
  };

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="bottom"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pin icon/UI here - I dont think I do that below is a placeholder */}
      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white" />
    </Marker>
  );
}