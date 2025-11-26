"use client";

import React from "react";
import type { ProgramDetails } from "./types";

interface AdvancedDetailsProps {
  program?: ProgramDetails | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdvancedDetails({
  program = null,
  isOpen = true,
  onClose,
}: AdvancedDetailsProps) {
  // don't render if closed
  if (!isOpen) return null;

  const visibleProgram = program ?? {
    name: "Program details",
    city: "",
    email: "",
    phoneNumber: "",
    category: "",
    website: "",
  };

  return (
    <aside
      className={`side-panel ${
        isOpen ? "open" : ""
      } absolute left-0 top-0 bottom-0 h-full z-50 w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-y-auto`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      {/* top-right close */}
      <div className="flex justify-end p-4">
        <button
          aria-label="Close panel"
          onClick={onClose}
          className="text-2xl leading-none px-3 py-1 rounded-md hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      <div className="side-panel">
        <div className="px-6 pb-8">
          {/* category badge */}
          {visibleProgram?.category && (
            <div
              className="inline-block text-white px-2 py-1 rounded-sm"
              style={
                {
                  backgroundColor: "#E57520",
                  fontWeight: 400,
                  fontSize: "19.11px",
                  // keep non-standard rule as in original
                  ["leading-trim"]: "none",
                } as any
              }
            >
              {visibleProgram.category}
            </div>
          )}

          <div className="side-panel-body">
            {/* brief contact lines */}
            <div className="mt-4 text-black text-2xl font-semibold leading-tight">
              {visibleProgram?.name ?? "Program details"}
            </div>
            <div className="text-gray-700 mt-2">
              {visibleProgram?.city && (
                <div className="text-lg">{visibleProgram.city}</div>
              )}
              {visibleProgram?.email && (
                <div className="text-base">{visibleProgram.email}</div>
              )}
              {visibleProgram?.phoneNumber && (
                <div className="text-base">{visibleProgram.phoneNumber}</div>
              )}
            </div>
          </div>

          {/* website + image preview */}
          <div className="mt-8">
            <div className="text-base text-gray-800 mb-3">Website:</div>

            <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 h-44">
              <img
                className="w-full h-full object-cover"
                src={`https://picsum.photos/seed/${encodeURIComponent(
                  visibleProgram?.name ?? "demo"
                )}/800/300`}
                alt={visibleProgram?.name ?? "program image"}
              />
            </div>

            {visibleProgram?.website ? (
              <div className="mt-3 text-xs text-gray-400 break-all">
                {visibleProgram.website}
              </div>
            ) : (
              <div className="mt-3 text-xs text-gray-400">—</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
