// owners: shane + sunny
// shane: region bounding box zoom, zoom & pan logic for large movements
// sunny: zoom for pin-level focus, sync with panel openings

'use client';

import { useCallback, useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { calculateRegionViewState } from '../utils/geoUtils';
import { RegionCluster } from '../utils/clusterUtils';

interface UseZoomOptions {
  mapRef: React.RefObject<MapRef>;
  mapWidth?: number;
  mapHeight?: number;
  animationDuration?: number; // in milliseconds
}

export function useZoom({ mapRef, mapWidth = 800, mapHeight = 600, animationDuration = 1000 }: UseZoomOptions) {
  const isAnimatingRef = useRef(false);

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

  return {
    zoomToRegion,
    zoomToCoordinates,
    panToCoordinates,
    resetView,
    isAnimating: () => isAnimatingRef.current,
  };
}
