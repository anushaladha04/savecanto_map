'use client';

// key for map pins!!
// owned by: haydn 

import React from 'react';

type ProgramType = 'adults' | 'kids' | 'college' | 'other';

interface KeyItem {
  type: ProgramType;
  label: string;
  color: string;
}

const keyData: KeyItem[] = [
  { type: 'adults', label: 'Adults', color: '#1FC6E3' },
  { type: 'kids', label: 'Children/Teens', color: '#FFC300' },
  { type: 'college', label: 'College/University', color: '#E60001' },
  { type: 'other', label: 'Other', color: '#7DD48B' },
];

// Simple circle pin indicator with symbols
function PinCircle({ type, color }: { type: ProgramType; color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      {/* Circle */}
      <circle cx="12" cy="12" r="10" fill={color} />
      {/* White border */}
      <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.5" />
      
      {/* ADULTS - Star icon (blue) */}
      {type === 'adults' && (
        <polygon points="12,6 14,11 19,11 15,14 17,19 12,16 7,19 9,14 5,11 10,11" fill="white" />
      )}
      
      {/* KIDS - Baby face icon (yellow) */}
      {type === 'kids' && (
        <g>
          <circle cx="8" cy="11" r="1" fill="white" opacity="0.8" />
          <circle cx="16" cy="11" r="1" fill="white" opacity="0.8" />
          <circle cx="10" cy="10" r="0.8" fill="white" />
          <circle cx="14" cy="10" r="0.8" fill="white" />
          <path d="M 10 12 Q 12 13.5 14 12" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      )}
      
      {/* COLLEGE - Apple icon (red) */}
      {type === 'college' && (
        <g>
          <path d="M 12 7 Q 9 7 8 9 Q 7.5 10 8 11 Q 9 12.5 12 13 Q 15 12.5 16 11 Q 16.5 10 16 9 Q 15 7 12 7" 
                fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="6.5" x2="12" y2="5" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
        </g>
      )}
      
      {/* OTHER - Gear/Settings icon (green) */}
      {type === 'other' && (
        <g>
          <circle cx="12" cy="12" r="2" fill="white" />
          <rect x="11.3" y="7" width="1.4" height="1.2" fill="white" />
          <rect x="11.3" y="15.8" width="1.4" height="1.2" fill="white" />
          <rect x="6.8" y="11.3" width="1.2" height="1.4" fill="white" />
          <rect x="15" y="11.3" width="1.2" height="1.4" fill="white" />
        </g>
      )}
    </svg>
  );
}

export default function Key() {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 w-fit"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <h3 className="text-base font-semibold mb-2" style={{ color: '#333' }}>Program Types</h3>
      
      <div className="space-y-2">
        {keyData.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            {/* Circle indicator with symbol */}
            <div className="flex items-center justify-center flex-shrink-0">
              <PinCircle type={item.type} color={item.color} />
            </div>
            
            {/* Label - same color as circle */}
            <span className="text-xs font-medium" style={{ color: item.color }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
