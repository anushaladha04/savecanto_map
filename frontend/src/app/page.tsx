"use client";
import { useState } from "react";
import BaseMap from "./map/components/BaseMap";
import { SidePanel } from "./map/components/panel/SidePanel";
import CantoTable from "./table/components/table";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="min-h-screen grid place-items-center p-10 gap-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      <div className="relative w-[90vw] h-[80vh]">
        <BaseMap />
        {/* show side panel UI for visual/debugging — ignoring program selection for now */}
        <SidePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
      <div className="w-[90vw]">
        <CantoTable />
      </div>
    </main>
  );
}
