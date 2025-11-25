// owner: edi
// track which pin/program is selected
// used to open/close side panel and show program details

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

// feature flag exported so any component can read it without re-running the hook
export const IS_RAPTOR_MINI_ENABLED = true;

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

  const clearSelection = () => setSelectedProgramId(null);

  return {
    selectedProgramId,
    setSelectedProgramId,
    isOpen,
    open,
    close,
    clearSelection,
    isRaptorMiniEnabled: IS_RAPTOR_MINI_ENABLED,
  };
}
