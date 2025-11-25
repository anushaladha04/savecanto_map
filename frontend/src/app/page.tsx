// NOTE: code for testing

'use client';

import { useEffect, useState } from 'react';
import CantoTable from '../components/table';
import MapContainer from './map/components/MapContainer';
import { loadPrograms } from './map/utils/loadPrograms';

export default function Home() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    loadPrograms().then(setPrograms);
  }, []);

  return (
    <main className="min-h-screen p-4">
      <div className="w-full max-w-full mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">SaveCanto Map ✅</h1>
        <div className="w-full h-[80vh]">
          <MapContainer programs={programs} />
        </div>
        <CantoTable />
        <p className="mt-2 text-sm text-gray-500 text-center">
          Next.js + Tailwind is live
        </p>
      </div>
    </main>
  );
}
