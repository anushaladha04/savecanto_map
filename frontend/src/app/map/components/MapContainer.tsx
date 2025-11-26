// owner: anusha
// provides structure for other devs

'use client';

import { useRef, useState, useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import BaseMap from './BaseMap';
import ClusterLayer from './clusters/ClusterLayer';
import PinsLayer from './pins/PinsLayer';
import { useZoom } from '../hooks/useZoom';
import { RegionCluster } from '../utils/clusterUtils';
import { loadPrograms } from '../utils/loadPrograms';
import { convertCsvToPrograms } from '../utils/programUtils';
import { calculateRegionBoundingBox } from '../utils/geoUtils';
import type { BoundingBox } from '../utils/geoUtils';
import type { Program } from './pins/PinsLayer';

// Region interface for PinsLayer
interface Region {
  id: string;
  name: string;
  boundingBox: BoundingBox;
}

export default function MapContainer() {
  const mapRef = useRef<MapRef | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get map dimensions (can be made dynamic based on container size)
  const mapWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800;
  const mapHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

  const { zoomToRegion } = useZoom({
    mapRef,
    mapWidth,
    mapHeight,
    animationDuration: 1000,
  });

  // Load programs from CSV on mount
  useEffect(() => {
    loadPrograms()
      .then((csvData) => {
        const convertedPrograms = convertCsvToPrograms(csvData);
        setPrograms(convertedPrograms);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load programs:', error);
        setLoading(false);
      });
  }, []);

  // Handle cluster click - zoom to region and show pins
  const handleRegionSelect = (cluster: RegionCluster) => {
    zoomToRegion(cluster);
    
    // Calculate bounding box for the region
    const boundingBox = calculateRegionBoundingBox(
      cluster.centroidLat,
      cluster.centroidLng,
      cluster.pointCount
    );
    
    // Set selected region to show pins
    setSelectedRegion({
      id: `region-${cluster.id}`,
      name: `Region ${cluster.id}`,
      boundingBox,
    });
  };

  // Handle pin click - could zoom to pin and open panel
  const handlePinClick = (program: Program) => {
    console.log('Pin clicked:', program);
    // TODO: Implement zoom to pin + open side panel
  };

  return (
    <BaseMap mapRef={mapRef}>
      <ClusterLayer onRegionSelect={handleRegionSelect} />
      {/* Show pins when a region is selected */}
      {selectedRegion && !loading && (
        <PinsLayer
          programs={programs}
          selectedRegion={selectedRegion}
          onPinClick={handlePinClick}
        />
      )}
    </BaseMap>
  );
}
