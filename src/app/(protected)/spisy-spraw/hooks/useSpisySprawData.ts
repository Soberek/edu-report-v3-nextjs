import { useMemo } from "react";
import { useAct } from "@/hooks/useAct";
import { createActsOptions } from "../constants";
import type { SpisySprawState } from "../types";

export const useSpisySprawData = (state: SpisySprawState) => {
  const { actRecords, actRecordsError, actRecordsLoading, refetchActRecords } = useAct();

  const actsOptions = useMemo(() => createActsOptions(), []);

  const actsOptionsCodes = useMemo(() => actsOptions.map((option) => option.code), [actsOptions]);

  const sortedCaseRecords = useMemo(() => {
    let filtered;
    if (state.selectedCode.code === "966") {
      filtered = actRecords.filter((record) => record.referenceNumber.startsWith("OZiPZ.966"));
    } else if (state.selectedCode.code) {
      filtered = actRecords.filter((record) => record.code === state.selectedCode.code);
    } else {
      filtered = actRecords;
    }
    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted;
  }, [actRecords, state.selectedCode.code]);

  const getErrorMessages = () => {
    if (!actRecordsError) return [];

    const errors = Array.isArray(actRecordsError) ? actRecordsError : [actRecordsError];
    return errors;
  };

  return {
    // Data
    actRecords,
    actsOptions,
    actsOptionsCodes,
    sortedCaseRecords,

    // Loading states
    actRecordsLoading,

    // Error handling
    actRecordsError,
    getErrorMessages,
  };
};
