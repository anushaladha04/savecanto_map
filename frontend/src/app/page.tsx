"use client";
import MapContainer from './map/components/MapContainer';
import CantoTable from "./table/components/table";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-10 gap-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      <div className="relative w-[90vw] h-[80vh]">
        <MapContainer />
      </div>
      <div className="w-[90vw]">
        <CantoTable />
      </div>
    </main>
  );
}
