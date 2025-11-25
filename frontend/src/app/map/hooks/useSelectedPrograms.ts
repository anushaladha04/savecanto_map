// owner: edi
// track which pin/program is selected
// used to open/close side panel and show program details

"use client";
import { useState } from "react";

interface Program {
  id?: string;
  name?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  category?: string;
  website?: string;
}

// Hook now only manages selection + open/close UI state.
export default function useSelectedPrograms(initialProgramId?: string | null) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    initialProgramId ?? null
  );
  const [isOpen, setIsOpen] = useState<boolean>(!!initialProgramId);

  const open = (id?: string | null) => {
    setSelectedProgramId(id ?? null);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    selectedProgramId,
    setSelectedProgramId,
    isOpen,
    open,
    close,
  };
}
