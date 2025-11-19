// owner: anusha
// render gray world map
// no cluster or pins here

'use client';

import { useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface BaseMapProps {
  mapRef?: React.RefObject<MapRef>;
  children?: React.ReactNode;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

const VOYAGER_STYLE_URL =
  'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

export default function BaseMap({
  mapRef,
  children,
  initialViewState = {
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  },
}: BaseMapProps) {
  const mapStyle = useMemo(() => VOYAGER_STYLE_URL, []);
  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      mapStyle={mapStyle}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%' }}
      cooperativeGestures
      dragRotate={false}
      touchZoomRotate={true}
      attributionControl={{ compact: true }}
    >
      {children}
    </Map>
  );
}
