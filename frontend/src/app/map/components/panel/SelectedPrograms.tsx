"use client";

import React from "react";
import type { ProgramDetails } from "./types";
import { MapPin } from "lucide-react";

interface SelectedProgramsProps {
  programs?: ProgramDetails[];
  onSelect?: (program: ProgramDetails) => void;
}

/*
  Render a compact, accessible list of selected programs.
  Each card is a button that calls onSelect(program) when clicked.
*/
export function SelectedPrograms({
  programs = [],
  onSelect,
}: SelectedProgramsProps) {
  return (
    <div className="px-4 pb-6">
      <div className="text-sm font-medium text-gray-900 mb-2">Results for</div>

      {programs.length === 0 ? (
        <div className="text-xs text-gray-500">No programs selected.</div>
      ) : (
        <div className="space-y-2">
          {programs.map((p) => (
            <div
              key={p.id ?? p.name}
              className="w-full bg-[#F6F7FA] text-left p-2 focus-within:ring-2 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-black truncate">
                  {p.name}
                </div>
                <div className="text-gray-300 text-xs select-none">›</div>
              </div>

              <div className="text-xs text-gray-600 flex items-start gap-1.5">
                <MapPin
                  className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5"
                  aria-hidden
                />
                <div className="flex-1 max-w-[60%]">
                  {p.address ?? "No Address available"}
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelect?.(p)}
                  className="bg-black text-white text-xs font-medium px-2.5 py-1.5 rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  View More →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
