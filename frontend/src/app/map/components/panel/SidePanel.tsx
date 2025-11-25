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
      className={`side-panel ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      <header className="side-panel__header">
        <h2>{program?.name ?? "Program details"}</h2>
        <button aria-label="Close panel" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="side-panel__content">
        {isLoading && <p>Loading…</p>}
        {error && <p className="side-panel__error">Error: {error.message}</p>}
        {program && (
          <div className="program-details">
            <p>
              <strong>City:</strong> {program.city}
            </p>
            <p>
              <strong>Email:</strong> {program.email}
            </p>
            <p>
              <strong>Phone:</strong> {program.phoneNumber}
            </p>
            <p>
              <strong>Category:</strong> {program.category}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {program.website ? (
                <a href={program.website} target="_blank" rel="noreferrer">
                  {program.website}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
