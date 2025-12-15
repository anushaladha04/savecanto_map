// owner: anusha
// provides structure for other devs
// Merged: cluster/region functionality + zoom-to-pin functionality

'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import BaseMap from './BaseMap';
import ClusterLayer from './clusters/ClusterLayer';
import PinsLayer from './pins/PinsLayer';
import ZoomControls from './ZoomControls';
import SaveCantoIcon from './SaveCantoIcon';
import { useZoom } from '../hooks/useZoom';
import { RegionCluster } from '../utils/clusterUtils';
import { loadPrograms } from '../utils/loadPrograms';
import { convertCsvToPrograms } from '../utils/programUtils';
import { calculateRegionBoundingBox } from '../utils/geoUtils';
import type { BoundingBox } from '../utils/geoUtils';
import type { Program } from './pins/PinsLayer';
import Key from './pins/Key';

// Region interface for PinsLayer
interface Region {
  id: string;
  name: string;
  boundingBox: BoundingBox;
}

interface MapContainerProps {
  programs?: any[]; // Optional programs prop (for testing/backward compatibility)
  onPinClick?: (program: Program | any) => void; // Callback when a pin is clicked
  panelCloseSignal?: number;
}

export default function MapContainer({ programs: externalPrograms, onPinClick, panelCloseSignal }: MapContainerProps = {}) {
  const mapRef = useRef<MapRef | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const lastOpenedProgramRef = useRef<string | null>(null);
  
  // Get map dimensions (can be made dynamic based on container size)
  const mapWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800;
  const mapHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

  // Use zoom hook for region zoom
  const { 
    zoomToRegion, 
    resetView,
    zoomToCoordinates,
    zoomIn,
    zoomOutControl,
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

  // If the side panel is closed, reset the map to the cluster view
  useEffect(() => {
    if (panelCloseSignal === undefined) {
      return;
    }
    handleResetView();
  }, [panelCloseSignal]);

  // Handle pin click - zoom to pin and notify parent
  const handlePinClick = (program: Program | any, latitude?: number, longitude?: number) => {
    // Guard against null/undefined program
    if (!program) {
      console.warn('handlePinClick called with null/undefined program');
      return;
    }
    
    // If coordinates are provided (new interface), use them
    if (latitude !== undefined && longitude !== undefined) {
      // Zoom to pin
      zoomToCoordinates(longitude, latitude, 14);
    } else {
      // Old interface - program should have coordinates
      const lat = program.latitude || program.Latitude || program.lat || program.Lat;
      const lng = program.longitude || program.Longitude || program.lng || program.Lng || program.lon || program.Lon;
      
      if (lat && lng) {
        zoomToCoordinates(lng, lat, 14);
      } else {
        console.warn('Pin clicked but no coordinates found:', program);
      }
    }
    
    // Notify parent component to open side panel
    if (onPinClick) {
      const programId = program.id || program.name || program.Name;
      lastOpenedProgramRef.current = programId;
      console.log('MapContainer: Calling onPinClick with program:', {
        id: program.id,
        csvIndex: program.csvIndex,
        name: program.name || program.Name
      });
      onPinClick(program);
    } else {
      console.log('MapContainer: onPinClick handler is not available');
    }
  };

  // Determine which programs to display
  // Always use the converted programs from state, not raw externalPrograms
  const displayPrograms = useMemo(() => {
    return programs;
  }, [programs]);

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Handle map move/zoom end - detect micro zoom to a program
  const handleMoveEnd = useCallback((center: [number, number], zoom: number) => {
    // Only trigger for micro zoom (zoom >= 14)
    if (zoom < 14) {
      return;
    }
    
    if (!onPinClick) {
      return;
    }
    
    // Use programs from state (which should always be available)
    const programsToCheck = programs.length > 0 ? programs : displayPrograms;
    
    if (programsToCheck.length === 0) {
      return;
    }

    const [centerLng, centerLat] = center;
    const thresholdKm = 1.0; // 1 km threshold for matching

    // Find the nearest program to the map center
    let nearestProgram: any = null;
    let minDistance = Infinity;

    programsToCheck.forEach((program: any) => {
      const programLat = program.latitude || program.Latitude || program.lat || program.Lat;
      const programLng = program.longitude || program.Longitude || program.lng || program.Lng || program.lon || program.Lon;

      if (programLat && programLng && !isNaN(programLat) && !isNaN(programLng)) {
        const distance = calculateDistance(centerLat, centerLng, programLat, programLng);
        if (distance < minDistance && distance < thresholdKm) {
          minDistance = distance;
          nearestProgram = program;
        }
      }
    });

    // If we found a nearby program, open the side panel
    if (nearestProgram && onPinClick) {
      const programId = nearestProgram.id || nearestProgram.name || nearestProgram.Name;
      // Only open if it's a different program than the last one we opened
      if (programId !== lastOpenedProgramRef.current) {
        lastOpenedProgramRef.current = programId;
        console.log('Micro zoom: Opening side panel for program:', nearestProgram.name || nearestProgram.Name);
        onPinClick(nearestProgram);
      }
    } else {
      // Reset if we're not near any program
      lastOpenedProgramRef.current = null;
    }
  }, [onPinClick, programs, displayPrograms]);

  return (
    <BaseMap mapRef={mapRef} onMoveEnd={handleMoveEnd}>
      <div className="absolute top-4 right-4 z-20">
        <Key />
      </div>
      {/* Hide clusters when a region is selected */}
      <ClusterLayer 
        onRegionSelect={handleRegionSelect} 
        visible={!selectedRegion}
        programs={programs}
      />
      
      {/* Show pins ONLY when a region is selected (after clicking a cluster) */}
      {!loading && selectedRegion && displayPrograms.length > 0 && (
        <PinsLayer
          programs={displayPrograms}
          selectedRegion={selectedRegion}
          onPinClick={handlePinClick}
        />
      )}
      
      {/* Zoom controls and SaveCanto icon */}
      <ZoomControls 
        mapRef={mapRef}
        zoomIn={zoomIn}
        zoomOut={zoomOutControl}
      />
      <SaveCantoIcon />
    </BaseMap>
  );
}
