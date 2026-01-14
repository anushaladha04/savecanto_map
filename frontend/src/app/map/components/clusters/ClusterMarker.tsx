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

// Program type colors matching the pin colors
const PROGRAM_TYPE_COLORS: Record<string, string> = {
  adults: '#1FC6E3',    // blue
  kids: '#FFC300',      // yellow
  college: '#E60001',   // red
  other: '#7DD48B',     // green
};

// Order of program types for consistent rendering
const PROGRAM_TYPE_ORDER: Array<keyof typeof PROGRAM_TYPE_COLORS> = ['adults', 'kids', 'college', 'other'];

export default function ClusterMarker({
  cluster,
  onRegionSelect,
  size = 40,
}: ClusterMarkerProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegionSelect(cluster);
  };

  // Calculate marker size based on program count
  // Use actual program count from breakdown if available, otherwise use pointCount
  const breakdown = cluster.programTypeBreakdown || {
    adults: 0,
    kids: 0,
    college: 0,
    other: 0,
  };
  const programCount = breakdown.adults + breakdown.kids + breakdown.college + breakdown.other || cluster.pointCount;
  
  // Scale from minSize to maxSize based on program count
  const minSize = 32;
  const maxSize = 60; // Larger range for more visible differences
  const minPrograms = 1;
  const maxPrograms = 50; // Based on current data range
  
  // Use square root scaling for proportional but visible size differences
  // This gives a nice balance: smaller clusters are noticeably different,
  // but large clusters don't become too huge
  const normalizedCount = Math.max(0, Math.min(1, (programCount - minPrograms) / (maxPrograms - minPrograms)));
  const sqrtScale = Math.sqrt(normalizedCount); // Square root for smoother scaling
  const scaledSize = minSize + (maxSize - minSize) * sqrtScale;
  const markerSize = Math.max(minSize, Math.min(maxSize, scaledSize));
  
  const radius = markerSize / 2;
  const innerRadius = radius * 0.4; // Donut hole size
  const outerRadius = radius * 0.95; // Outer edge of donut (slightly smaller than radius for padding)

  // Calculate total count from breakdown
  const totalCount = breakdown.adults + breakdown.kids + breakdown.college + breakdown.other;
  const displayCount = totalCount > 0 ? totalCount : cluster.pointCount;

  // Calculate pie segments - ALWAYS create segments for the donut chart
  const segments: Array<{
    type: string;
    color: string;
    startAngle: number;
    endAngle: number;
    count: number;
  }> = [];

  let currentAngle = -90; // Start at top (-90 degrees in SVG coordinates)
  
  if (totalCount > 0) {
    // Use actual breakdown data - create segments for each program type with count > 0
    PROGRAM_TYPE_ORDER.forEach((type) => {
      const count = breakdown[type as keyof typeof breakdown] || 0;
      if (count > 0) {
        const percentage = count / totalCount;
        const angleSpan = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angleSpan;
        
        segments.push({
          type,
          color: PROGRAM_TYPE_COLORS[type],
          startAngle,
          endAngle,
          count,
        });
        
        currentAngle = endAngle;
      }
    });
  }
  
  // CRITICAL: If no segments were created (no breakdown data or all zeros), 
  // show a single gray segment to ensure we ALWAYS render a donut chart
  // This ensures ALL clusters show the donut UI, not just ones with matching programs
  if (segments.length === 0) {
    segments.push({
      type: 'unknown',
      color: '#E5E7EB', // Light gray
      startAngle: -90,
      endAngle: 270, // Full circle (360 degrees from -90 to 270)
      count: cluster.pointCount,
    });
  }

  // Helper function to convert angle to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Helper function to get point on circle
  const getPointOnCircle = (angle: number, r: number) => {
    const rad = toRadians(angle);
    return {
      x: radius + r * Math.cos(rad),
      y: radius + r * Math.sin(rad),
    };
  };

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
        {/* White background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="#ffffff"
        />
        
        {/* Pie chart segments */}
        {segments.map((segment, index) => {
          const angleSpan = segment.endAngle - segment.startAngle;
          const isFullCircle = Math.abs(angleSpan) >= 360 || (segment.startAngle === -90 && segment.endAngle === 270);
          
          // Handle full circle case (gray fallback segment)
          if (isFullCircle) {
            // Render as a full donut ring using two circles
            return (
              <g key={`${segment.type}-${index}`}>
                {/* Outer circle */}
                <circle
                  cx={radius}
                  cy={radius}
                  r={outerRadius}
                  fill={segment.color}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                {/* Inner circle (creates the donut hole) */}
                <circle
                  cx={radius}
                  cy={radius}
                  r={innerRadius}
                  fill="#ffffff"
                />
              </g>
            );
          }
          
          // Regular segment rendering
          const startOuter = getPointOnCircle(segment.startAngle, outerRadius);
          const endOuter = getPointOnCircle(segment.endAngle, outerRadius);
          const startInner = getPointOnCircle(segment.startAngle, innerRadius);
          const endInner = getPointOnCircle(segment.endAngle, innerRadius);
          
          const largeArcFlag = angleSpan > 180 ? 1 : 0;
          
          const pathData = [
            `M ${startInner.x} ${startInner.y}`, // Move to inner start point
            `L ${startOuter.x} ${startOuter.y}`, // Line to outer start point
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`, // Arc along outer edge
            `L ${endInner.x} ${endInner.y}`, // Line to inner end point
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`, // Arc along inner edge
            'Z', // Close path
          ].join(' ');
          
          return (
            <path
              key={`${segment.type}-${index}`}
              d={pathData}
              fill={segment.color}
              stroke="#ffffff"
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Inner circle (white center) */}
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
          fill="#0E8FA6"
        >
          {displayCount}
        </text>
      </svg>
    </div>
  );
}
