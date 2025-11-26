// owner: shane
// region bounding box calculations
// long+lat screen calculations

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

/**
 * Calculate bounding box for a region cluster
 * Uses a fixed 500-mile radius to create a bounding box around the centroid
 * 
 * @param centroidLat - Latitude of cluster centroid
 * @param centroidLng - Longitude of cluster centroid
 * @param pointCount - Number of points in the cluster (not used, kept for API compatibility)
 * @param padding - Padding factor (default: 1.0, can be adjusted for extra padding)
 * @returns Bounding box coordinates
 */
export function calculateRegionBoundingBox(
  centroidLat: number,
  centroidLng: number,
  pointCount: number,
  padding: number = 1.0
): BoundingBox {
  // Fixed 500-mile radius for all clusters
  const radiusMiles = 500 * padding;
  
  // Convert miles to degrees
  // 1 degree of latitude ≈ 69 miles (constant)
  const latRadiusDegrees = radiusMiles / 69;
  
  // 1 degree of longitude ≈ 69 * cos(latitude) miles (varies by latitude)
  const latRad = (centroidLat * Math.PI) / 180;
  const lngRadiusDegrees = radiusMiles / (69 * Math.cos(latRad));

  return {
    north: centroidLat + latRadiusDegrees,
    south: centroidLat - latRadiusDegrees,
    east: centroidLng + lngRadiusDegrees,
    west: centroidLng - lngRadiusDegrees,
  };
}

/**
 * Calculate optimal view state (center and zoom) to fit a bounding box
 * 
 * @param bbox - Bounding box to fit
 * @param mapWidth - Width of the map container in pixels
 * @param mapHeight - Height of the map container in pixels
 * @param minZoom - Minimum zoom level (default: 1)
 * @param maxZoom - Maximum zoom level (default: 18)
 * @returns View state with longitude, latitude, and zoom
 */
export function boundingBoxToViewState(
  bbox: BoundingBox,
  mapWidth: number = 800,
  mapHeight: number = 600,
  minZoom: number = 5,
  maxZoom: number = 6
): ViewState {
  // Calculate center
  const centerLat = (bbox.north + bbox.south) / 2;
  let centerLng = (bbox.east + bbox.west) / 2;

  // Calculate lat/lng spans
  const latSpan = bbox.north - bbox.south;
  let lngSpan = bbox.east - bbox.west;

  // Handle longitude wrapping
  if (lngSpan > 180) {
    // Box wraps around the date line
    lngSpan = 360 - lngSpan;
    centerLng = centerLng > 0 ? centerLng - 180 : centerLng + 180;
  }

  // Calculate zoom level
  // Web Mercator projection: zoom level calculation
  // At zoom 0, 360 degrees = 256 pixels
  // Each zoom level doubles the resolution
  
  const latRad = (centerLat * Math.PI) / 180;
  const latMercator = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  
  // Calculate required zoom for latitude
  const latZoom = Math.log2((256 * 360) / (latSpan * mapHeight));
  
  // Calculate required zoom for longitude (accounting for Mercator projection)
  const lngZoom = Math.log2((256 * 360) / (lngSpan * mapWidth * Math.cos(latRad)));
  
  // Use the smaller zoom to ensure both dimensions fit
  let zoom = Math.min(latZoom, lngZoom);
  
  // Add padding by reducing zoom slightly
  zoom = zoom - 0.5;

  // Clamp zoom to valid range
  const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

  return {
    longitude: centerLng,
    latitude: centerLat,
    zoom: clampedZoom,
  };
}

/**
 * Calculate view state for a region cluster
 * Combines bounding box calculation and view state conversion
 * 
 * @param centroidLat - Latitude of cluster centroid
 * @param centroidLng - Longitude of cluster centroid
 * @param pointCount - Number of points in the cluster
 * @param mapWidth - Width of the map container in pixels
 * @param mapHeight - Height of the map container in pixels
 * @returns View state for the region
 */
export function calculateRegionViewState(
  centroidLat: number,
  centroidLng: number,
  pointCount: number,
  mapWidth: number = 800,
  mapHeight: number = 600
): ViewState {
  const bbox = calculateRegionBoundingBox(centroidLat, centroidLng, pointCount);
  return boundingBoxToViewState(bbox, mapWidth, mapHeight);
}

/**
 * Calculate distance between two lat/lng points (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
