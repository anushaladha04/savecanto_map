// owner: edi
// sliding panel UI
// loads selected program details
// panel closes on X (ask design which zoom status to revert to on X)

"use client";

import { useEffect, useState } from "react";
import { loadPrograms } from "../../utils/loadPrograms";
import { AdvancedDetails } from "./AdvancedDetails";
import { SelectedPrograms } from "./SelectedPrograms";
import type { ProgramDetails } from "./types";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string | null;
}
export function SidePanel({ isOpen, onClose, programId }: SidePanelProps) {
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // demo placeholders — multiple programs for the list view
  const placeholderPrograms: ProgramDetails[] = [
    {
      id: "ccba-chicago",
      name: "CCBA Chicago Chinese School",
      city: "Chicago, IL",
      email: "ccbachicago@comcast.net",
      phoneNumber: "(312) 555-0100",
      category: "Children & Teens",
      level: "Advanced",
      website: "https://ccba.example.org",
      address:
        "123 Very Much Fake And Not Real Rd, Apt #1, Chicago, IL 60007, USA",
    },
    {
      id: "bowls-for-all",
      name: "Bowls for All",
      city: "Evanston, IL",
      email: "info@bowlsforall.org",
      phoneNumber: "(847) 555-0123",
      category: "Community",
      level: "Advanced",
      website: "https://bowls.example.org",
      address: "234 Fake Rd, Apt #1, Evanston, IL 60007, USA",
    },
    {
      id: "literacy-lift",
      name: "Literacy Lift",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      level: "Beginner",
      website: "https://literacy.example.org",
    },
    {
      id: "literacy-united",
      name: "Literacy United",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      website: "https://literacy.example.org",
      address: "234 Fake Rd, Apt #1, Evanston, IL 60007, USA",
    },
    {
      id: "literacy-general",
      name: "Literacy General",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      website: "https://literacy.example.org",
      address: "234 Fake Rd, Apt #1, Evanston, IL 60007, USA",
    },
    {
      id: "literacy",
      name: "Literacy",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      website: "https://literacy.example.org",
    },
    {
      id: "literacy-world",
      name: "Literacy World",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      website: "https://literacy.example.org",
    },
    {
      id: "literacy-universe",
      name: "Literacy Universe",
      city: "Oak Park, IL",
      email: "contact@literacylift.org",
      phoneNumber: "(708) 555-0456",
      category: "Education",
      website: "https://literacy.example.org",
    },
  ];

  // UI state: if a program is selected the panel shows AdvancedDetails; otherwise show the list
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(
    null
  );

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

    // prefer local placeholder match first
    const local = placeholderPrograms.find((p) => p.id === programId);
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
  }, [isOpen, programId]);

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
      {/* top-right close */}
      <div className="flex justify-end p-2">
        <button
          aria-label="Close panel"
          onClick={() => {
            setSelectedProgram(null);
            onClose();
          }}
          className="text-2xl leading-none px-1 py-0.5 rounded-md hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      {/* show either the list or the advanced detail */}
      {isLoading ? (
        <div className="px-6 py-8">Loading…</div>
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
          programs={placeholderPrograms}
          onSelect={handleSelectProgram}
        />
      )}
    </aside>
  );
}
