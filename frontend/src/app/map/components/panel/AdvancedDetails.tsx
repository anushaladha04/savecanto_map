"use client";

import React from "react";
import type { ProgramDetails } from "./types";
import { MapPin, Globe, Mail, ExternalLink } from "lucide-react";

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
      } absolute left-0 top-0 bottom-0 h-full z-50 rounded-none bg-white overflow-y-auto overflow-x-hidden`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      {/* top-right close */}
      <div className="flex justify-end p-4 relative z-10">
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
            <div className="text-black text-xl font-semibold leading-tight break-words">
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
                  <div className="text-sm break-words">{visibleProgram.address}</div>
                </div>
              )}
              {visibleProgram?.website && (
                <div className="flex items-center gap-2">
                  <Globe
                    className="w-4 h-4 flex-shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <a
                    href={visibleProgram.website.startsWith('http') ? visibleProgram.website : `https://${visibleProgram.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {visibleProgram.website}
                  </a>
                </div>
              )}
              {visibleProgram?.email && (
                <div className="flex items-center gap-2">
                  <Mail
                    className="w-4 h-4 flex-shrink-0 text-gray-500"
                    aria-hidden
                  />
                  <div className="text-sm break-all">{visibleProgram.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* website + preview */}
          <div className="mt-8">
            <div className="text-base text-gray-800 mb-3">Website:</div>

            {visibleProgram?.website ? (
              <a
                href={visibleProgram.website.startsWith('http') ? visibleProgram.website : `https://${visibleProgram.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 h-48 hover:border-blue-400 hover:shadow-md transition-all group relative"
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <p className="text-sm text-gray-600 font-medium mb-1">Click to visit website</p>
                    <p className="text-xs text-gray-400 break-words px-2 max-w-full">{visibleProgram.website}</p>
                    <ExternalLink className="w-4 h-4 mx-auto mt-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                {/* Overlay to indicate it's clickable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </a>
            ) : (
              <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Globe className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">No website available</p>
                </div>
              </div>
            )}

            {visibleProgram?.website ? (
              <a
                href={visibleProgram.website.startsWith('http') ? visibleProgram.website : `https://${visibleProgram.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs text-blue-600 hover:text-blue-800 hover:underline break-all block"
              >
                {visibleProgram.website}
              </a>
            ) : (
              <div className="mt-3 text-xs text-gray-400">—</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
