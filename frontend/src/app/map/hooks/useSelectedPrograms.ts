// owner: edi
// track which pin/program is selected
// used to open/close side panel and show program details

// NOTE: Basic test implementation - needed for zoom functionality

import { useState, useCallback } from 'react';

export function useSelectedPrograms() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const selectProgram = useCallback((program: any) => {
    setSelectedProgram(program);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProgram(null);
  }, []);

  return {
    selectedProgram,
    selectProgram,
    clearSelection,
  };
}
