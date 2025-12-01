// owner: viyan
// group programs by region
// compute donut clusters: total count + segment percentages

import type { Program } from '../components/pins/PinsLayer';
import { calculateRegionBoundingBox } from './geoUtils';
import type { BoundingBox } from './geoUtils';

export interface ProgramTypeBreakdown {
  adults: number;
  kids: number;
  college: number;
  other: number;
}

export interface RegionCluster {
  id: number;
  centroidLat: number;
  centroidLng: number;
  pointCount: number;
  programTypeBreakdown?: ProgramTypeBreakdown;
}

// Region clusters data based on program locations
export const REGION_CLUSTERS: RegionCluster[] = [
  { id: 1, centroidLat: 52.3878979, centroidLng: -0.625262913, pointCount: 48 },
  { id: 2, centroidLat: 37.22522286, centroidLng: -121.743278, pointCount: 47 },
  { id: 3, centroidLat: 42.40025528, centroidLng: -76.15724257, pointCount: 42 },
  { id: 4, centroidLat: 49.67574638, centroidLng: -120.6529232, pointCount: 27 },
  { id: 5, centroidLat: 22.91114086, centroidLng: 114.173281, pointCount: 22 },
  { id: 6, centroidLat: -33.69616119, centroidLng: 150.1003986, pointCount: 12 },
  { id: 7, centroidLat: 1.915059412, centroidLng: 103.1116134, pointCount: 6 },
  { id: 8, centroidLat: 10.76546747, centroidLng: 106.643667, pointCount: 5 },
  { id: 9, centroidLat: 46.61556065, centroidLng: -93.81346078, pointCount: 4 },
  { id: 10, centroidLat: 21.30735085, centroidLng: -157.8375184, pointCount: 2 },
  { id: 11, centroidLat: 31.41088335, centroidLng: -96.11132163, pointCount: 2 },
  { id: 12, centroidLat: 39.86763, centroidLng: -86.265237, pointCount: 1 },
  { id: 13, centroidLat: 32.2332841, centroidLng: -110.9488008, pointCount: 1 },
  { id: 14, centroidLat: 16.77712335, centroidLng: 96.14797028, pointCount: 1 },
  { id: 15, centroidLat: 49.5949296, centroidLng: 17.2595908, pointCount: 1 },
  { id: 16, centroidLat: 40.2524308, centroidLng: -111.6502622, pointCount: 1 },
  { id: 17, centroidLat: -34.9632129, centroidLng: 117.9435604, pointCount: 1 },
];

/**
 * Check if a program is within a bounding box
 */
function isProgramInBoundingBox(program: Program, bbox: BoundingBox): boolean {
  const { latitude, longitude } = program;
  
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return false;
  }
  
  return (
    longitude >= bbox.west &&
    longitude <= bbox.east &&
    latitude >= bbox.south &&
    latitude <= bbox.north
  );
}

/**
 * Calculate program type breakdown for a cluster
 * Uses bounding box matching
 */
function calculateProgramTypeBreakdown(
  cluster: RegionCluster,
  programs: Program[]
): ProgramTypeBreakdown {
  const bbox = calculateRegionBoundingBox(
    cluster.centroidLat,
    cluster.centroidLng,
    cluster.pointCount
  );
  
  const breakdown: ProgramTypeBreakdown = {
    adults: 0,
    kids: 0,
    college: 0,
    other: 0,
  };
  
  programs.forEach((program) => {
    if (isProgramInBoundingBox(program, bbox)) {
      const type = program.type || 'other';
      if (type in breakdown) {
        breakdown[type as keyof ProgramTypeBreakdown]++;
      }
    }
  });
  
  return breakdown;
}

/**
 * Get all region clusters with program type breakdowns
 * Always calculates breakdown for all clusters, even if programs array is empty
 */
export function getRegionClusters(programs?: Program[]): RegionCluster[] {
  // Always calculate breakdown for all clusters
  // If no programs provided, breakdown will be all zeros
  const programsToUse = programs || [];
  
  return REGION_CLUSTERS.map((cluster) => ({
    ...cluster,
    programTypeBreakdown: calculateProgramTypeBreakdown(cluster, programsToUse),
  }));
}

/**
 * Get a region cluster by ID
 */
export function getRegionClusterById(id: number): RegionCluster | undefined {
  return REGION_CLUSTERS.find((cluster) => cluster.id === id);
}
