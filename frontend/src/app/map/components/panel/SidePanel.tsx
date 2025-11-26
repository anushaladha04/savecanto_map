// owner: edi
// sliding panel UI
// loads selected program details
// panel closes on X (ask design which zoom status to revert to on X)
"use client";
import { useEffect, useState, useMemo } from "react";
import { loadPrograms } from "../../utils/loadPrograms";
import { AdvancedDetails } from "./AdvancedDetails";
import { SelectedPrograms } from "./SelectedPrograms";
import type { ProgramDetails } from "./types";
import type { CsvRow } from "../filters/types";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string | null;
  csvData: CsvRow[];
  filteredData: CsvRow[];
  csvLoading: boolean;
  csvError: string | null;
}

export function SidePanel({ 
  isOpen, 
  onClose, 
  programId,
  csvData,
  filteredData,
  csvLoading,
  csvError 
}: SidePanelProps) {
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Convert CSV rows to ProgramDetails format
  const csvToProgramDetails = (csvRows: CsvRow[]): ProgramDetails[] => {
    return csvRows.map((row, index) => ({
      id: `csv-${index}`,
      name: row.Name || "",
      city: row.City || "",
      email: row.Email || "",
      phoneNumber: row["Phone Number"] || "",
      category: row.Audience || "",
      website: row.Website || "",
      address: row.Address || "",
    }));
  };

  // Use filtered data from parent - this will update when filters change
  const allPrograms = useMemo(() => {
    return csvToProgramDetails(filteredData);
  }, [filteredData]);

  // UI state: if a program is selected the panel shows AdvancedDetails; otherwise show the list
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(null);

  // when SidePanel opens with a programId, try to pick that program and show details
  useEffect(() => {
    if (!isOpen) {
      setSelectedProgram(null);
      setProgram(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!programId) return;

    // prefer local match first (including CSV programs)
    const local = allPrograms.find((p) => p.id === programId);
    if (local) {
      setSelectedProgram(local);
      return;
    }

    // otherwise try to fetch and resolve the programId
    let cancelled = false;
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
          const normalized: ProgramDetails = {
            id: found.id ?? found._id,
            name: found.name ?? found.title ?? "",
            city: found.city ?? found.location ?? "",
            email: found.email ?? "",
            phoneNumber:
              found.phoneNumber ?? found.phone ?? found.phone_number ?? "",
            category: found.category ?? "",
            website: found.website ?? found.url ?? "",
          };
          setProgram(normalized);
          setSelectedProgram(normalized);
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
  }, [isOpen, programId, allPrograms]);

  const handleSelectProgram = (p: ProgramDetails) => {
    setSelectedProgram(p);
  };

  const handleCloseDetails = () => {
    setSelectedProgram(null);
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`side-panel ${
        isOpen ? "open" : ""
      } absolute left-0 top-0 bottom-0 h-full z-50 w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-y-auto`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button
          aria-label="Close panel"
          onClick={() => {
            setSelectedProgram(null);
            onClose();
          }}
          className="text-2xl leading-none px-3 py-1 rounded-md hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      {/* Content */}
      {csvLoading || isLoading ? (
        <div className="px-6 py-8">Loading…</div>
      ) : csvError ? (
        <div className="px-6 py-8 text-red-500">CSV Error: {csvError}</div>
      ) : error ? (
        <div className="px-6 py-8 text-red-500">Error: {error.message}</div>
      ) : selectedProgram ? (
        <AdvancedDetails
          program={selectedProgram}
          isOpen={true}
          onClose={handleCloseDetails}
        />
      ) : (
        <SelectedPrograms
          programs={allPrograms}
          onSelect={handleSelectProgram}
        />
      )}
    </aside>
  );
}