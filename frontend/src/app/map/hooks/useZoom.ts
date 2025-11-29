// owners: shane + sunny
// shane: region bounding box zoom, zoom & pan logic for large movements
// sunny: zoom for pin-level focus, sync with panel openings

'use client';

import { useCallback, useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { calculateRegionViewState } from '../utils/geoUtils';
import { RegionCluster } from '../utils/clusterUtils';

interface UseZoomOptions {
  mapRef: React.RefObject<MapRef | null>;
  mapWidth?: number;
  mapHeight?: number;
  animationDuration?: number; // in milliseconds
}

export function useZoom({ mapRef, mapWidth = 800, mapHeight = 600, animationDuration = 1000 }: UseZoomOptions) {
  const isAnimatingRef = useRef(false);
  // Store previous view state before zooming to pin
  const previousViewState = useRef<{ center: [number, number]; zoom: number } | null>(null);

  /**
   * Zoom to a region cluster with smooth animation
   * Calculates optimal view state based on cluster centroid and point count
   */
  const zoomToRegion = useCallback(
    (cluster: RegionCluster) => {
      if (!mapRef.current || isAnimatingRef.current) return;

      const viewState = calculateRegionViewState(
        cluster.centroidLat,
        cluster.centroidLng,
        cluster.pointCount,
        mapWidth,
        mapHeight
      );

      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        duration: animationDuration,
      });

      // Reset animation flag after duration
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, animationDuration);
    },
    [mapRef, mapWidth, mapHeight, animationDuration]
  );

  /**
   * Zoom to specific coordinates with custom zoom level
   * Used for pin-level focus (sunny's responsibility)
   */
  const zoomToCoordinates = useCallback(
    (longitude: number, latitude: number, zoom: number) => {
      if (!mapRef.current || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom,
        duration: animationDuration,
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, animationDuration);
    },
    [mapRef, animationDuration]
  );

  /**
   * Zoom to pin - saves previous view state for zoom out
   */
  const zoomToPin = useCallback(
    (latitude: number, longitude: number, zoomLevel: number = 14) => {
      if (!mapRef.current) return;

      // Save current view state before zooming
      const map = mapRef.current.getMap();
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      
      previousViewState.current = {
        center: [currentCenter.lng, currentCenter.lat],
        zoom: currentZoom,
      };

      // Zoom to pin
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: zoomLevel,
        duration: animationDuration,
        essential: true,
      });
    },
    [mapRef, animationDuration]
  );

  /**
   * Zoom out to previous view state (used when panel closes)
   */
  const zoomOut = useCallback(() => {
    if (!mapRef.current || !previousViewState.current) return;

    // Zoom back to previous view
    mapRef.current.flyTo({
      center: previousViewState.current.center,
      zoom: previousViewState.current.zoom,
      duration: animationDuration,
      essential: true,
    });

    // Clear the saved state
    previousViewState.current = null;
  }, [mapRef, animationDuration]);

  /**
   * Pan to coordinates without changing zoom
   * Useful for large movements when zoom level is appropriate
   */
  const panToCoordinates = useCallback(
    (longitude: number, latitude: number) => {
      if (!mapRef.current || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [longitude, latitude],
        duration: animationDuration,
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, animationDuration);
    },
    [mapRef, animationDuration]
  );

  /**
   * Reset to default world view
   */
  const resetView = useCallback(() => {
    if (!mapRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    mapRef.current.flyTo({
      center: [0, 20],
      zoom: 1.5,
      duration: animationDuration,
    });

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, animationDuration);
  }, [mapRef, animationDuration]);

  // Zoom in/out controls for UI buttons
  const zoomIn = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.zoomIn({ duration: 300 });
  }, [mapRef]);

  const zoomOutControl = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.zoomOut({ duration: 300 });
  }, [mapRef]);

  return {
    zoomToRegion,
    zoomToCoordinates,
    zoomToPin,
    zoomOut,
    panToCoordinates,
    resetView,
    zoomIn,
    zoomOutControl,
    isAnimating: () => isAnimatingRef.current,
  };
}

// Export useZoomToPin as an alias for backward compatibility
export function useZoomToPin(mapRef: React.RefObject<MapRef | null>) {
  const { zoomToPin, zoomOut, zoomIn, zoomOutControl } = useZoom({
    mapRef,
    animationDuration: 1000,
  });

  const zoomToWorld = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [0, 20],
      zoom: 1.5,
      duration: 1000,
      essential: true,
    });
  }, [mapRef]);

  return { zoomToPin, zoomOut, zoomToWorld, zoomIn, zoomOutControl };
}
