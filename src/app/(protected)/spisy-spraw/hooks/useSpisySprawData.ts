import { useMemo } from "react";
import { useAct } from "@/hooks/useAct";
import { createActsOptions } from "../constants";
import type { SpisySprawState } from "../types";

export const useSpisySprawData = (state: SpisySprawState) => {
  const { actRecords, actRecordsError, actRecordsLoading } = useAct();

  const actsOptions = useMemo(() => createActsOptions(), []);

  const actsOptionsCodes = useMemo(() => actsOptions.map((option) => option.code), [actsOptions]);

  const sortedCaseRecords = useMemo(() => {
    return actRecords
      .filter((record) => record.code === state.selectedCode.code)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
