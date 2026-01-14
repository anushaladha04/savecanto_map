"use client";

import React from "react";
import type { ProgramDetails } from "./types";
import { MapPin, Globe, Mail, ExternalLink } from "lucide-react";
import { normalizeCategoryLabel } from "../../utils/programUtils";

interface AdvancedDetailsProps {
  program?: ProgramDetails | null;
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

const categoryColorMap = {
  adults: "#1FC6E3",
  kids: "#E6B000",
  college: "#E60001",
  other: "#7DD48B",
} as const;

function getCategoryColor(category?: string): string {
  if (!category) {
    return "#000000";
  }
  const normalized = category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z]/g, "");
  const original = category.trim();
  const normalizedFull = category.toLowerCase();

  // Handle K-12 After School and K-12 Public School (including Chinese variants)
  // Check normalizedFull for "k-12" or "k12" and original for "K-12" or Chinese characters
  if (normalizedFull.includes("k-12") || normalizedFull.includes("k12") || 
      original.includes("K-12") || original.includes("課後課程") || original.includes("公立學校")) {
    return categoryColorMap.kids;
  }

  if (normalized.includes("adult")) {
    return categoryColorMap.adults;
  }
  if (normalized.includes("child") || normalized.includes("teen")) {
    return categoryColorMap.kids;
  }
  if (normalized.includes("college") && normalized.includes("university")) {
    return categoryColorMap.college;
  }
  if (normalized.includes("other")) {
    return categoryColorMap.other;
  }

  return "#000000";
}

export function AdvancedDetails({
  program = null,
  isOpen = true,
  onClose,
  onBack,
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
    <div className="side-panel">
        <div className="px-6 pb-8">
          <div className="side-panel-body">
            <div className="text-black text-xl font-semibold leading-tight break-words mb-2">
              {visibleProgram?.name ?? "Program details"}
            </div>
            <div className="flex gap-2 items-start">
              {visibleProgram?.category && (
                <div
                  className="mt-3 inline-block text-white px-3 py-0.5 rounded-xl text-sm"
                  style={{
                    backgroundColor: getCategoryColor(
                      visibleProgram?.category
                    ),
                    border: "2px solid transparent",
                  }}
                >
                  {normalizeCategoryLabel(visibleProgram.category)}
                </div>
              )}
              {visibleProgram.level && visibleProgram.category && (
                <div
                  className="mt-3 inline-block text-white px-3 py-0.5 rounded-xl text-sm"
                  style={{
                    color: getCategoryColor(visibleProgram.category),
                    border: `2px solid ${getCategoryColor(
                      visibleProgram.category
                    )}`,
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
        </div>
    </div>
  );
}
