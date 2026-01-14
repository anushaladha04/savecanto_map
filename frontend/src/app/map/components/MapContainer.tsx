// owner: anusha
// provides structure for other devs
// Merged: cluster/region functionality + zoom-to-pin functionality

'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { MapRef, Marker } from 'react-map-gl/maplibre';
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
  programToZoom?: { lat: number; lng: number } | null;
}

export default function MapContainer({ programs: externalPrograms, onPinClick, panelCloseSignal, programToZoom }: MapContainerProps = {}) {
  const mapRef = useRef<MapRef | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(1.5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const lastOpenedProgramRef = useRef<string | null>(null);

  // SaveCanto brand orange (picked from SaveCanto icon)
  const SAVECANTO_ORANGE = "#F98A1B";
  
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
  // Update whenever externalPrograms changes (e.g., when filters change)
  useEffect(() => {
    if (externalPrograms && externalPrograms.length >= 0) {
      // Convert external programs to Program format if needed
      if (externalPrograms.length === 0) {
        // Empty filtered results - clear programs
        setPrograms([]);
        setLoading(false);
        return;
      }
      
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
    } else if (!externalPrograms || externalPrograms.length === 0) {
      // Load from CSV only if no external programs provided
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

  // When programToZoom is set, zoom to that program and create a region to show pins
  useEffect(() => {
    if (!programToZoom || !programToZoom.lat || !programToZoom.lng) {
      return;
    }

    const { lat, lng } = programToZoom;
    
    // Zoom to the program location
    zoomToCoordinates(lng, lat, 14);
    
    // Create a bounding box around the program location so pins show
    const boundingBox = calculateRegionBoundingBox(lat, lng, 1, 0.5); // 250 mile radius
    
    // Set selected region to show pins
    setSelectedRegion({
      id: `program-zoom-${lat}-${lng}`,
      name: 'Program Location',
      boundingBox,
    });
  }, [programToZoom, zoomToCoordinates]);

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

  // Track zoom level and show pins when zoomed in
  const handleMoveEnd = useCallback((center: [number, number], zoom: number) => {
    setCurrentZoom(zoom);
    
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

  // Handler to locate the user's current position and zoom to it
  const handleLocateMe = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      console.warn('Geolocation is not available in this environment.');
      return;
    }

    if (isLocating) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Zoom to a reasonable city-level zoom
        zoomToCoordinates(longitude, latitude, 9);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting current location:', error);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [zoomToCoordinates, isLocating]);

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
      
      {/* Show pins when a region is selected OR when zoomed in enough */}
      {!loading && (selectedRegion || currentZoom >= 14) && displayPrograms.length > 0 && (
        <PinsLayer
          programs={displayPrograms}
          selectedRegion={selectedRegion || {
            id: 'zoom-view',
            name: 'Zoomed View',
            boundingBox: {
              north: 90,
              south: -90,
              east: 180,
              west: -180,
            },
          }}
          onPinClick={handlePinClick}
        />
      )}

      {/* Current location marker */}
      {userLocation && (
        <Marker
          latitude={userLocation.lat}
          longitude={userLocation.lng}
          anchor="center"
        >
          <div className="relative">
            {/* Outer pulse ring */}
            <div
              className="w-6 h-6 rounded-full animate-ping"
              style={{
                backgroundColor: `${SAVECANTO_ORANGE}33`,
                border: `1px solid ${SAVECANTO_ORANGE}`,
              }}
            />
            {/* Inner dot */}
            <div
              className="absolute inset-1 w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: SAVECANTO_ORANGE }}
            />
          </div>
        </Marker>
      )}

      {/* Zoom controls and SaveCanto icon */}
      <ZoomControls 
        mapRef={mapRef}
        zoomIn={zoomIn}
        zoomOut={zoomOutControl}
      />

      {/* Locate me button (bottom-left, above map edge) */}
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-4 left-4 z-20 bg-white/95 hover:bg-white text-gray-900 text-xs font-medium rounded-full shadow-lg border border-gray-300 px-4 py-2 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SAVECANTO_ORANGE }} />
        <span>{isLocating ? 'Locating…' : 'Your location'}</span>
      </button>

      <SaveCantoIcon />
    </BaseMap>
  );
}
