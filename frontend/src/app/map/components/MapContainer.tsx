// owner: anusha
// provides structure for other devs
// Merged: cluster/region functionality + zoom-to-pin functionality

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

interface MapContainerProps {
  programs?: any[]; // Optional programs prop (for testing/backward compatibility)
}

export default function MapContainer({ programs: externalPrograms }: MapContainerProps = {}) {
  const mapRef = useRef<MapRef | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get map dimensions (can be made dynamic based on container size)
  const mapWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800;
  const mapHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

  // Use zoom hook for region zoom
  const { 
    zoomToRegion, 
    resetView,
    zoomToCoordinates,
  } = useZoom({
    mapRef,
    mapWidth,
    mapHeight,
    animationDuration: 1000,
  });

  // Load programs from CSV on mount (if not provided via props)
  useEffect(() => {
    if (externalPrograms && externalPrograms.length > 0) {
      // Convert external programs to Program format if needed
      const firstProgram = externalPrograms[0];
      if (firstProgram && 'id' in firstProgram && 'latitude' in firstProgram && 'longitude' in firstProgram) {
        // Already in Program format
        setPrograms(externalPrograms as Program[]);
      } else {
        // Need to convert from CSV format
        const convertedPrograms = convertCsvToPrograms(externalPrograms);
        setPrograms(convertedPrograms);
      }
      setLoading(false);
    } else {
      // Load from CSV
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
    }
  }, [externalPrograms]);


  // Handle cluster click - zoom to region and show pins
  const handleRegionSelect = (cluster: RegionCluster) => {
    // Zoom to the region
    zoomToRegion(cluster);
    
    // Calculate bounding box for the region
    const boundingBox = calculateRegionBoundingBox(
      cluster.centroidLat,
      cluster.centroidLng,
      cluster.pointCount
    );
    
    // Set selected region to show pins (this will hide clusters)
    setSelectedRegion({
      id: `region-${cluster.id}`,
      name: `Region ${cluster.id}`,
      boundingBox,
    });
  };

  // Handle reset - go back to cluster view
  const handleResetView = () => {
    resetView();
    setSelectedRegion(null); // Clear selected region to show clusters again
  };

  // Handle pin click - zoom to pin and open panel
  const handlePinClick = (program: Program | any, latitude?: number, longitude?: number) => {
    // If coordinates are provided (new interface), use them
    if (latitude !== undefined && longitude !== undefined) {
      // Zoom to pin
      zoomToCoordinates(longitude, latitude, 14);
      console.log('Pin clicked:', program);
    } else {
      // Old interface - program should have coordinates
      const lat = program.latitude || program.Latitude || program.lat || program.Lat;
      const lng = program.longitude || program.Longitude || program.lng || program.Lng || program.lon || program.Lon;
      
      if (lat && lng) {
        zoomToCoordinates(lng, lat, 14);
        console.log('Pin clicked:', program);
      } else {
        console.warn('Pin clicked but no coordinates found:', program);
      }
    }
  };

  // Determine which programs to display
  const displayPrograms = (externalPrograms && externalPrograms.length > 0) 
    ? externalPrograms 
    : programs;

  return (
    <BaseMap mapRef={mapRef}>
      {/* Hide clusters when a region is selected */}
      <ClusterLayer 
        onRegionSelect={handleRegionSelect} 
        visible={!selectedRegion}
      />
      
      {/* Show pins ONLY when a region is selected (after clicking a cluster) */}
      {!loading && selectedRegion && displayPrograms.length > 0 && (
        <PinsLayer
          programs={displayPrograms}
          selectedRegion={selectedRegion}
          onPinClick={handlePinClick}
        />
      )}
      
      {/* Zoom controls and SaveCanto icon - will be added when hooks are merged */}
    </BaseMap>
  );
}
