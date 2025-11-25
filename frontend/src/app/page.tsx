"use client";
import BaseMap from "./map/components/BaseMap";
import { SidePanel } from "./map/components/panel/SidePanel";
import useSelectedPrograms from "./map/hooks/useSelectedPrograms";

export default function Home() {
  const { selectedProgramId, open, close, isOpen } = useSelectedPrograms();

  return (
    <main className="min-h-screen grid place-items-center p-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      <div className="w-[90vw] h-[80vh]">
        <BaseMap />

        <SidePanel
          isOpen={isOpen}
          onClose={close}
          programId={selectedProgramId}
        />
      </div>
      <h2 className="text-2xl font-bold">Table Placeholder</h2>
    </main>
  );
}
