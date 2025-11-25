// owner: edi
// sliding panel UI
// loads selected program details
// panel closes on X (ask design which zoom status to revert to on X)

"use client";

import { useEffect, useState } from "react";
import { loadPrograms } from "../../utils/loadPrograms";

interface ProgramDetails {
  name: string;
  city: string;
  email: string;
  phoneNumber: string;
  category: string;
  website: string;
}

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string | null;
}
export function SidePanel({ isOpen, onClose, programId }: SidePanelProps) {
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // demo placeholder so panel renders visually when we don't pass a programId
  const placeholderProgram: ProgramDetails = {
    name: "CCBA Chicago Chinese School",
    city: "Chicago, IL",
    email: "ccbachicago@comcast.net",
    phoneNumber: "(555) 555-5555",
    category: "Children & Teens",
    website: "https://example.com",
  };

  // show loaded program; if none requested, show the placeholder for visual testing
  const visibleProgram = program ?? (programId ? null : placeholderProgram);

  useEffect(() => {
    let cancelled = false;

    setProgram(null);
    setError(null);

    if (!isOpen || !programId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadPrograms()
      .then((programs: any) => {
        if (cancelled) return;

        let found: any = null;
        if (Array.isArray(programs)) {
          found = programs.find(
            (p: any) => p.id === programId || p._id === programId
          );
        } else if (programs && typeof programs === "object") {
          if (programs[programId]) found = programs[programId];
          else if (Array.isArray(programs.data)) {
            found = programs.data.find(
              (p: any) => p.id === programId || p._id === programId
            );
          } else if (Array.isArray(programs.programs)) {
            found = programs.programs.find(
              (p: any) => p.id === programId || p._id === programId
            );
          }
        }

        if (found) {
          setProgram({
            name: found.name ?? found.title ?? "",
            city: found.city ?? found.location ?? "",
            email: found.email ?? "",
            phoneNumber:
              found.phoneNumber ?? found.phone ?? found.phone_number ?? "",
            category: found.category ?? "",
            website: found.website ?? found.url ?? "",
          });
        } else {
          setError(new Error("Program not found"));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [programId, isOpen]);

  if (!isOpen) return null;

  return (
    <aside
      className={`side-panel ${
        isOpen ? "open" : ""
      } absolute left-0 top-0 bottom-0 h-full z-50 w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-y-auto`}
      role="dialog"
      aria-hidden={!isOpen}
      // fills the height of the positioned parent (e.g., your map container)
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
                  ["leading-trim"]: "none",
                } as any
              }
            >
              {visibleProgram.category}
            </div>
          )}

          <div className="side-panel-body">
            {/* brief contact lines */}
            <div className="mt-4 text-black text-2xl">
              {visibleProgram?.name ?? "Program details"}
            </div>
            <div className="text-gray-700">
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
