"use client";

import React from "react";
import type { ProgramDetails } from "./types";
import { MapPin, Globe, Mail } from "lucide-react";

interface AdvancedDetailsProps {
  program?: ProgramDetails | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const colorKey: { [key: string]: string } = {
  Adults: "#1FC6E3",
  "Children & Teens": "#FFC300",
  "College & University": "#E60001",
  Other: "#7DD48B",
};

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
    level: "",
  };

  return (
    <aside
      className={`side-panel ${
        isOpen ? "open" : ""
      } absolute left-0 top-0 bottom-0 h-full z-50 rounded-none bg-white overflow-y-auto`}
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
          <div className="side-panel-body">
            <div className="text-black text-xl font-semibold leading-tight">
              {visibleProgram?.name ?? "Program details"}
            </div>
            <div className="flex gap-2 items-start">
              {visibleProgram?.category && (
                <div
                  className="mt-3 inline-block text-white px-3 py-0.5 rounded-xl text-sm"
                  style={{
                    backgroundColor:
                      colorKey[visibleProgram?.category] ?? "#000000",
                    border: "2px solid transparent",
                  }}
                >
                  {visibleProgram.category}
                </div>
              )}
              {visibleProgram.level && visibleProgram.category && (
                <div
                  className="mt-3 inline-block text-white px-3 py-0.5 rounded-xl text-sm"
                  style={{
                    color: colorKey[visibleProgram.category] ?? "#000000",
                    border: `2px solid ${
                      colorKey[visibleProgram.category] ?? "#000000"
                    }`,
                  }}
                >
                  {visibleProgram.level}
                </div>
              )}
            </div>
            <div className="text-gray-700 mt-3 space-y-2">
              {visibleProgram?.address && (
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-4 h-4 flex-shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <div className="text-sm">{visibleProgram.address}</div>
                </div>
              )}
              {visibleProgram?.website && (
                <div className="flex items-center gap-2">
                  <Globe
                    className="w-4 h-4 flex-shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <div className="text-sm">{visibleProgram.website}</div>
                </div>
              )}
              {visibleProgram?.email && (
                <div className="flex items-center gap-2">
                  <Mail
                    className="w-4 h-4 flex-shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <div className="text-sm">{visibleProgram.email}</div>
                </div>
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
