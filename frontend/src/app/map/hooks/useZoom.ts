// owners: shane + sunny
// shane: region bounding box zoom, zoom & pan logic for large movements
// sunny: zoom for pin-level focus, sync with panel openings

import { useCallback } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

export function useZoomToPin(mapRef: React.RefObject<MapRef>) {
  const zoomToPin = useCallback(
    (latitude: number, longitude: number, zoomLevel: number = 14) => {
      if (!mapRef.current) return;

      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: zoomLevel,
        duration: 1000, 
        essential: true,
      });
    },
    [mapRef]
  );

  return { zoomToPin };
}