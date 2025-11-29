// owner: viyan
// donut UI (segments + center count) for clusters on the map
// click --> onRegionSelect (no zoom logic here)

'use client';

import { RegionCluster } from '../../utils/clusterUtils';

interface ClusterMarkerProps {
  cluster: RegionCluster;
  onRegionSelect: (cluster: RegionCluster) => void;
  size?: number; // Size of the marker in pixels
}

export default function ClusterMarker({
  cluster,
  onRegionSelect,
  size = 40,
}: ClusterMarkerProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegionSelect(cluster);
  };

  // Calculate marker size based on point count
  // Scale from minSize to maxSize based on point count
  const minSize = 28;
  const maxSize = 35; // Reduced to prevent overlap
  const minPoints = 1;
  const maxPoints = 48; // Based on current data range
  
  // Use logarithmic scaling for more conservative size increase
  // This prevents large clusters from becoming too big and overlapping
  const normalizedCount = (cluster.pointCount - minPoints) / (maxPoints - minPoints);
  // Logarithmic scale: log(1 + normalizedCount * (e-1)) / log(e)
  // This gives a more gradual curve that prevents large jumps
  const logScale = Math.log(1 + normalizedCount * (Math.E - 1)) / Math.log(Math.E);
  const scaledSize = minSize + (maxSize - minSize) * logScale;
  const markerSize = Math.max(minSize, Math.min(maxSize, scaledSize));
  
  const radius = markerSize / 2;
  const strokeWidth = Math.max(2, markerSize * 0.06); // Scale stroke with marker size
  const innerRadius = radius * 0.4; // Donut hole size

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%)`,
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      <svg
        width={markerSize}
        height={markerSize}
        viewBox={`0 0 ${markerSize} ${markerSize}`}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        {/* Outer circle (background) */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="#ffffff"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
        />
        
        {/* Inner circle (donut hole) */}
        <circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="#ffffff"
        />
        
        {/* Center count text */}
        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.max(11, Math.min(18, markerSize * 0.28))}
          fontWeight="bold"
          fill="#1e40af"
        >
          {cluster.pointCount}
        </text>
      </svg>
    </div>
  );
}
