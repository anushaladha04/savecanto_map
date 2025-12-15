'use client';

// key for map pins!!
// owned by: haydn 

import React from 'react';
import { colorMap, type ProgramType } from './PinMarker';
import { IconRenderer } from './IconSet';

interface KeyItem {
  type: ProgramType;
  label: string;
}

const keyData: KeyItem[] = [
  { type: 'adults', label: 'Adults' },
  { type: 'kids', label: 'Children/Teens' },
  { type: 'college', label: 'College/University' },
  { type: 'other', label: 'Other' },
];

function IconCircle({ type }: { type: ProgramType }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Circle background with color */}
      <circle cx="20" cy="20" r="18" fill={colorMap[type]} />
      {/* White border for contrast */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="1.5" />
      
      {/* Icon centered and scaled inside circle */}
      <g transform="translate(20, 20) scale(2)">
        <IconRenderer type={type} />
      </g>
    </svg>
  );
}

export default function Key() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-fit">
      <h3 className="text-base font-semibold mb-2" style={{ color: '#333' }}>Program Types</h3>
      
      <div className="space-y-2">
        
        {keyData.map((item) => (
          <div key={item.type} className="flex items-center gap-3">
            {/* Icon circle with dynamically pulled icon */}
            <div className="flex items-center justify-center flex-shrink-0">
              <IconCircle type={item.type} />
            </div>
            
            {/* Label - same color as icon */}
            <span className="text-sm font-medium" style={{ color: colorMap[item.type] }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
