// owner: viyan
// loops over regions from clusterUtils
// places ClusterMarker components on the map

'use client';

import { useMemo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { getRegionClusters, RegionCluster } from '../../utils/clusterUtils';
import ClusterMarker from './ClusterMarker';
import type { Program } from '../pins/PinsLayer';

interface ClusterLayerProps {
  onRegionSelect: (cluster: RegionCluster) => void;
  visible?: boolean;
  programs?: Program[];
}

export default function ClusterLayer({
  onRegionSelect,
  visible = true,
  programs,
}: ClusterLayerProps) {
  const clusters = useMemo(() => {
    const allClusters = getRegionClusters(programs);
    
    // Filter out grey clusters (clusters with no matching programs)
    // A grey cluster is one where the breakdown is all zeros
    return allClusters.filter((cluster) => {
      const breakdown = cluster.programTypeBreakdown;
      if (!breakdown) {
        // If no breakdown calculated yet, hide it (waiting for programs to load)
        return false;
      }
      
      // Calculate total count from breakdown
      const totalCount = breakdown.adults + breakdown.kids + breakdown.college + breakdown.other;
      
      // Only show clusters that have at least one matching program
      return totalCount > 0;
    });
  }, [programs]);

  if (!visible) {
    return null;
  }

  return (
    <>
      {clusters.map((cluster) => (
        <Marker
          key={cluster.id}
          longitude={cluster.centroidLng}
          latitude={cluster.centroidLat}
          anchor="center"
        >
          <ClusterMarker cluster={cluster} onRegionSelect={onRegionSelect} />
        </Marker>
      ))}
    </>
  );
}
