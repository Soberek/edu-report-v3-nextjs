import { useMemo } from "react";
import { Program } from "../types";

export const useProgramStats = ({ programs }: { programs: Program[] }) => {
  const stats = useMemo(() => {
    const totalPrograms = programs.length;
    const programowyCount = programs.filter((p) => p.programType === "programowy").length;
    const nieprogramowyCount = programs.filter((p) => p.programType === "nieprogramowy").length;

    return {
      totalPrograms,
      programowyCount,
      nieprogramowyCount,
    };
  }, [programs]);

  return stats;
};
