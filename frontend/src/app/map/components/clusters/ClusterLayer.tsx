// owner: viyan
// loops over regions from clusterUtils
// places ClusterMarker components on the map

'use client';

import { useMemo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { getRegionClusters, RegionCluster } from '../../utils/clusterUtils';
import ClusterMarker from './ClusterMarker';

interface ClusterLayerProps {
  onRegionSelect: (cluster: RegionCluster) => void;
  visible?: boolean;
}

export default function ClusterLayer({
  onRegionSelect,
  visible = true,
}: ClusterLayerProps) {
  const clusters = useMemo(() => getRegionClusters(), []);

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
