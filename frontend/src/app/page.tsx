"use client";
import MapContainer from './map/components/MapContainer';
import { loadPrograms } from './map/utils/loadPrograms';
import CantoTable from "./table/components/table";
import { useState, useEffect } from 'react';

export default function Home() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    loadPrograms().then(setPrograms);
  }, []);

  return (
    <main className="min-h-screen grid place-items-center p-10 gap-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      <div className="relative w-[90vw] h-[80vh]">
        <MapContainer programs={programs}/>
      </div>
      <div className="w-[90vw]">
        <CantoTable />
      </div>
    </main>
  );
}
