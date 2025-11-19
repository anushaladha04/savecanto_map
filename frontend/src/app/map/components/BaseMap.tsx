// owner: anusha
// render gray world map
// no cluster or pins here

'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useState } from 'react';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface BaseMapProps {
  children?: React.ReactNode;
}

export default function BaseMap({ children }: BaseMapProps) {
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({ 
    coordinates: [0, 0], 
    zoom: 1 
  });

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <ComposableMap
      projectionConfig={{
        scale: 147,
        center: [0, 20]
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <ZoomableGroup
        zoom={position.zoom}
        center={position.coordinates}
        onMoveEnd={handleMoveEnd}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e5e7eb"
                stroke="#d1d5db"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: '#e5e7eb' },
                  pressed: { outline: 'none', fill: '#e5e7eb' }
                }}
              />
            ))
          }
        </Geographies>
        {children}
      </ZoomableGroup>
    </ComposableMap>
  );
}
