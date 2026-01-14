// owner: edi
// sliding panel UI
// loads selected program details
// panel closes on X (ask design which zoom status to revert to on X)
"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { loadPrograms } from "../../utils/loadPrograms";
import { AdvancedDetails } from "./AdvancedDetails";
import { SelectedPrograms } from "./SelectedPrograms";
import type { ProgramDetails } from "./types";
import type { CsvRow } from "../filters/types";
import { Globe, ExternalLink } from "lucide-react";
import { applyFilters } from "../../utils/filterUtils";

interface SidePanelProps {
  csvData: CsvRow[];
  filteredData: CsvRow[];
  csvLoading: boolean;
  csvError: string | null;
  // Filter state to determine if panel should auto-open
  hasActiveFilters?: boolean;
  // Callback to expose the handlePinClick function to parent
  onPinClickHandlerReady?: (handler: (program: any) => void) => void;
  // Notify parent when panel is explicitly closed
  onPanelClose?: () => void;
  // Request map zoom to a specific program location
  onProgramZoom?: (lat: number, lng: number) => void;
  // Active filter values to display
  activeFilters?: {
    audience?: string;
    province?: string;
    city?: string;
    country?: string;
  };
}

export function SidePanel({ 
  csvData,
  filteredData,
  csvLoading,
  csvError,
  hasActiveFilters = false,
  onPinClickHandlerReady,
  onPanelClose,
  onProgramZoom,
  activeFilters = {},
}: SidePanelProps) {
  // Internal state management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Convert CSV rows to ProgramDetails format
  // Use original CSV index for IDs to match with handlePinClick
  const csvToProgramDetails = (csvRows: CsvRow[], originalCsvData: CsvRow[]): ProgramDetails[] => {
    return csvRows.map((row: any) => {
      // Prefer a stable index when the row object is a direct reference from csvData
      // (applyFilters returns rows from the original array, so indexOf should work and is unique).
      let originalIndex = originalCsvData.indexOf(row as any);

      // Fallback: compute a best-effort match by (name OR lat/lng)
      if (originalIndex === -1) {
        originalIndex = originalCsvData.findIndex((originalRow: any) => {
          const rowLat = typeof row.Latitude === 'string' ? parseFloat(row.Latitude) : row.Latitude;
          const rowLng = typeof row.Longitude === 'string' ? parseFloat(row.Longitude) : row.Longitude;
          const originalLat = typeof originalRow.Latitude === 'string' ? parseFloat(originalRow.Latitude) : originalRow.Latitude;
          const originalLng = typeof originalRow.Longitude === 'string' ? parseFloat(originalRow.Longitude) : originalRow.Longitude;
          const nameMatch = row.Name === originalRow.Name;
          const latMatch = !isNaN(rowLat) && !isNaN(originalLat) && Math.abs(rowLat - originalLat) < 0.0001;
          const lngMatch = !isNaN(rowLng) && !isNaN(originalLng) && Math.abs(rowLng - originalLng) < 0.0001;
          return nameMatch || (latMatch && lngMatch);
        });
      }
      
      return {
        id: originalIndex !== -1 ? `csv-${originalIndex}` : `csv-${csvRows.indexOf(row)}`,
        csvIndex: originalIndex !== -1 ? originalIndex : undefined,
        name: row.Name || "",
        city: row.City || "",
        email: row.Email || "",
        phoneNumber: row["Phone Number"] || "",
        category: row.Audience || "",
        website: row.Website || "",
        address: row.Address || "",
        latitude: typeof row.Latitude === 'string' ? parseFloat(row.Latitude) : row.Latitude,
        longitude: typeof row.Longitude === 'string' ? parseFloat(row.Longitude) : row.Longitude,
      };
    });
  };

  // Use the same filtering logic as the table (applyFilters) so behavior matches exactly.
  // This ignores the filteredData prop and recomputes filtering from csvData + activeFilters.
  const panelFilteredCsv = useMemo(() => {
    return applyFilters(csvData, {
      searchTerm: "",
      audience: activeFilters.audience || "all",
      province: activeFilters.province || "all",
      city: activeFilters.city || "all",
      country: activeFilters.country || "all",
    });
  }, [csvData, activeFilters]);

  const allPrograms = useMemo(() => {
    return csvToProgramDetails(panelFilteredCsv, csvData);
  }, [panelFilteredCsv, csvData]);

  // UI state: if a program is selected the panel shows AdvancedDetails; otherwise show the list
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(null);

  // Match clicked program to CSV data using row number (csvIndex)
  const handlePinClick = useCallback((program: any) => {
    // Guard against null/undefined program
    if (!program) {
      console.log('handlePinClick: program is null/undefined');
      return;
    }
    
    console.log('handlePinClick called with program:', {
      id: program.id,
      csvIndex: program.csvIndex,
      name: program.name || program.Name,
      csvDataLength: csvData.length
    });
    
    // Use the CSV row number (index) stored in the program
    // csvIndex is the 0-based index from the CSV array
    let matchingIndex = -1;
    
    if (program.csvIndex !== undefined && program.csvIndex !== null) {
      // Direct match using the stored row number
      matchingIndex = program.csvIndex;
      console.log('Using csvIndex:', matchingIndex);
    } else if (program.id) {
      // Fallback: extract index from id format "csv-{index}"
      const idMatch = program.id.match(/^csv-(\d+)$/);
      if (idMatch) {
        matchingIndex = parseInt(idMatch[1], 10);
        console.log('Extracted index from id:', matchingIndex);
      }
    }
    
    // Final fallback: match by name (for backward compatibility)
    if (matchingIndex === -1 || matchingIndex >= csvData.length) {
      console.log('Falling back to name matching');
      const programName = program.name || program.Name || '';
      matchingIndex = csvData.findIndex((row: any) => {
        const rowName = row.Name || '';
        return rowName === programName;
      });
      console.log('Name match result:', matchingIndex);
    }
    
    console.log('Final matchingIndex:', matchingIndex, 'csvData.length:', csvData.length);
    
    if (matchingIndex !== -1 && matchingIndex < csvData.length) {
      console.log('Opening side panel for index:', matchingIndex);
      setSelectedProgramId(`csv-${matchingIndex}`);
      setIsOpen(true);
    } else {
      console.log('Failed to find matching index or index out of bounds');
    }
  }, [csvData]);

  // Expose handlePinClick to parent via callback
  useEffect(() => {
    if (onPinClickHandlerReady) {
      console.log('SidePanel: Exposing handlePinClick handler to parent');
      onPinClickHandlerReady(handlePinClick);
    } else {
      console.log('SidePanel: onPinClickHandlerReady callback not provided');
    }
  }, [onPinClickHandlerReady, handlePinClick]);

  // Auto-open when filters are applied (but only if there are results and panel isn't already open from a pin click)
  useEffect(() => {
    if (!selectedProgramId && filteredData.length > 0 && hasActiveFilters) {
      setIsOpen(true);
    }
  }, [filteredData, hasActiveFilters, selectedProgramId]);

  // when SidePanel opens with a programId, try to pick that program and show details
  useEffect(() => {
    if (!isOpen) {
      setSelectedProgram(null);
      setProgram(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!selectedProgramId) return;

    // If this is a CSV-backed program (id like "csv-10"), resolve it directly
    // from the local csvData instead of going through loadPrograms.
    if (selectedProgramId.startsWith("csv-")) {
      const indexStr = selectedProgramId.replace("csv-", "");
      const index = parseInt(indexStr, 10);

      if (!Number.isNaN(index) && index >= 0 && index < csvData.length) {
        const row = csvData[index] as any;
        const localProgram: ProgramDetails = {
          id: `csv-${index}`,
          name: row.Name || "",
          city: row.City || "",
          email: row.Email || "",
          phoneNumber: row["Phone Number"] || "",
          category: row.Audience || "",
          website: row.Website || "",
          address: row.Address || "",
        };
        setSelectedProgram(localProgram);
        setError(null);
        setIsLoading(false);
        return;
      } else {
        setError(new Error("Program not found"));
        setIsLoading(false);
        return;
      }
    }

    // For non-CSV IDs, prefer local match first (e.g., API-backed programs)
    const local = allPrograms.find((p) => p.id === selectedProgramId);
    if (local) {
      setSelectedProgram(local);
      return;
    }

    // Otherwise try to fetch and resolve the programId from remote
    let cancelled = false;
    setIsLoading(true);

    loadPrograms()
      .then((programs: any) => {
        if (cancelled) return;

        let found: any = null;
        if (Array.isArray(programs)) {
          found = programs.find(
            (p: any) => p.id === selectedProgramId || p._id === selectedProgramId
          );
        } else if (programs && typeof programs === "object") {
          if (programs[selectedProgramId]) found = programs[selectedProgramId];
          else if (Array.isArray(programs.data)) {
            found = programs.data.find(
              (p: any) => p.id === selectedProgramId || p._id === selectedProgramId
            );
          } else if (Array.isArray(programs.programs)) {
            found = programs.programs.find(
              (p: any) => p.id === selectedProgramId || p._id === selectedProgramId
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
  }, [isOpen, selectedProgramId, allPrograms]);

  const handleSelectProgram = (p: ProgramDetails) => {
    setSelectedProgram(p);
    if (p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)) {
      onProgramZoom?.(p.latitude, p.longitude);
    }
  };

  const handleCloseDetails = () => {
    setSelectedProgram(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedProgramId(null);
    setSelectedProgram(null);
    onPanelClose?.();
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`side-panel ${
        isOpen ? "open" : ""
      } absolute left-0 top-0 bottom-0 h-full z-50 w-full max-w-[25vw] bg-white rounded-r-xl overflow-hidden border-r-2 border-gray-300/60 flex flex-col`}
      role="dialog"
      aria-hidden={!isOpen}
      style={{
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15), 2px 0 8px rgba(0, 0, 0, 0.1), inset -1px 0 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Sticky header with back arrow and close button */}
      <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-4">
        {selectedProgram ? (
          <button
            aria-label="Back to program list"
            onClick={handleCloseDetails}
            className="text-xl text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            ←
          </button>
        ) : (
          <div className="w-10" />
        )}
        <button
          aria-label="Close panel"
          onClick={handleClose}
          className="text-2xl leading-none text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
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
            onBack={handleCloseDetails}
          />
        ) : (
          <SelectedPrograms
            programs={allPrograms}
            onSelect={handleSelectProgram}
            activeFilters={activeFilters}
          />
        )}
      </div>

      {/* Sticky footer with website section */}
      {selectedProgram && selectedProgram.website && (
        <div className="sticky bottom-0 bg-white px-6 py-4">
          <div className="text-base text-gray-800 mb-3">Website:</div>
          <a
            href={selectedProgram.website.startsWith('http') ? selectedProgram.website : `https://${selectedProgram.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 h-48 hover:border-blue-400 hover:shadow-md transition-all group relative"
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm text-gray-600 font-medium mb-1">Click to visit website</p>
                <p className="text-xs text-gray-400 break-words px-2 max-w-full">{selectedProgram.website}</p>
                <ExternalLink className="w-4 h-4 mx-auto mt-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
            {/* Overlay to indicate it's clickable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </a>
          <a
            href={selectedProgram.website.startsWith('http') ? selectedProgram.website : `https://${selectedProgram.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs text-blue-600 hover:text-blue-800 hover:underline break-all block"
          >
            {selectedProgram.website}
          </a>
        </div>
      )}
    </aside>
  );
}