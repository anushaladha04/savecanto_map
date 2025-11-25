// owner: anusha
// provides structure for other devs

'use client';

import { useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import BaseMap from './BaseMap';
import ClusterLayer from './clusters/ClusterLayer';
import { useZoom } from '../hooks/useZoom';
import { RegionCluster } from '../utils/clusterUtils';

export default function MapContainer() {
  const mapRef = useRef<MapRef>(null);
  
  // Get map dimensions (can be made dynamic based on container size)
  const mapWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800;
  const mapHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

  const { zoomToRegion } = useZoom({
    mapRef,
    mapWidth,
    mapHeight,
    animationDuration: 1000,
  });

  const handleRegionSelect = (cluster: RegionCluster) => {
    zoomToRegion(cluster);
  };

  return (
    <BaseMap mapRef={mapRef}>
      <ClusterLayer onRegionSelect={handleRegionSelect} />
    </BaseMap>
  );
}
