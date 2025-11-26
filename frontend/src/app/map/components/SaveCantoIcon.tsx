// owner: sunny
// SaveCanto icon on bottom left

'use client';

import Image from 'next/image';

export default function SaveCantoIcon() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
      }}
    >
      <Image
        src="/SaveCanto.jpeg"
        alt="SaveCanto"
        width={50}
        height={50}
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

