// owner: haydn
// renders pins for selected region
// uses filtered programs + region zoom state

// I used this for testing pin markers

'use client';

import PinMarker from './PinMarker';

interface PinsLayerProps {
  programs: any[]; // array of program objects
  onPinClick: (program: any, latitude: number, longitude: number) => void;
}

export default function PinsLayer({ programs, onPinClick }: PinsLayerProps) {
  return (
    <>
      {programs.map((program, index) => {
        // Adjust these field names based on your actual data structure
        // Try different possible field names (case-insensitive)
        const lat = program.latitude || program.Latitude || program.lat || program.Lat;
        const lng = program.longitude || program.Longitude || program.lng || program.Lng || program.lon || program.Lon;

        if (!lat || !lng) {
          return null;
        }

        return (
          <PinMarker
            key={program.id || index}
            latitude={lat}
            longitude={lng}
            program={program}
            onClick={onPinClick}
          />
        );
      })}
    </>
  );
}