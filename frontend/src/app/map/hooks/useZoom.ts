// owners: shane + sunny
// shane: region bounding box zoom, zoom & pan logic for large movements
// sunny: zoom for pin-level focus, sync with panel openings

import { useCallback, useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

export function useZoomToPin(mapRef: React.RefObject<MapRef | null>) {
  // Store previous view state before zooming in
  const previousViewState = useRef<{ center: [number, number]; zoom: number } | null>(null);

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
        duration: 1000, 
        essential: true,
      });
    },
    [mapRef]
  );

  const zoomOut = useCallback(() => {
    if (!mapRef.current || !previousViewState.current) return;

    // Zoom back to previous view
    mapRef.current.flyTo({
      center: previousViewState.current.center,
      zoom: previousViewState.current.zoom,
      duration: 1000,
      essential: true,
    });

    // Clear the saved state
    previousViewState.current = null;
  }, [mapRef]);

  // Zoom all the way out to world view
  const zoomToWorld = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [0, 20],
      zoom: 1.5,
      duration: 1000,
      essential: true,
    });
  }, [mapRef]);

  // Zoom in/out controls
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

  return { zoomToPin, zoomOut, zoomToWorld, zoomIn, zoomOutControl };
}