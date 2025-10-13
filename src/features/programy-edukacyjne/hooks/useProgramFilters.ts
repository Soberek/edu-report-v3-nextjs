import { useMemo } from "react";
import { Program } from "../types";
import { searchPrograms, sortPrograms } from "../utils/programUtils";

export interface ProgramFilter {
  search: string;
  programType: "all" | "programowy" | "nieprogramowy";
  sortBy: keyof Program;
  sortOrder: "asc" | "desc";
}

export const useProgramFilters = ({ programs, filter }: { programs: Program[]; filter: ProgramFilter }) => {
  const filteredPrograms = useMemo(() => {
    let result = programs;

    // Search filter
    if (filter.search) {
      result = searchPrograms(result, filter.search);
    }

    // Program type filter
    if (filter.programType !== "all") {
      result = result.filter((program) => program.programType === filter.programType);
    }

    // Sort
    result = sortPrograms(result, filter.sortBy, filter.sortOrder);

    return result;
  }, [programs, filter]);

  const uniqueProgramTypes = useMemo(() => {
    const types = programs.map((program) => program.programType);
    return Array.from(new Set(types));
  }, [programs]);

  return {
    filteredPrograms,
    uniqueProgramTypes,
  };
};
