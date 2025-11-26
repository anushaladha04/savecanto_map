// owner: sunny
// +/- zoom controls on the side (bottom right)

'use client';

import { MapRef } from 'react-map-gl/maplibre';

interface ZoomControlsProps {
  mapRef: React.RefObject<MapRef | null>;
  zoomIn: () => void;
  zoomOut: () => void;
}

export default function ZoomControls({ mapRef, zoomIn, zoomOut }: ZoomControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <button
        onClick={zoomIn}
        className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow-lg border border-gray-300"
        style={{ width: '40px', height: '40px', fontSize: '20px' }}
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow-lg border border-gray-300"
        style={{ width: '40px', height: '40px', fontSize: '20px' }}
      >
        −
      </button>
    </div>
  );
}

