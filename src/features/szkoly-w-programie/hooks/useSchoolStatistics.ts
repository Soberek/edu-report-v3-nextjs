
import { useMemo } from "react";
import {
  createSchoolParticipationsMap,
  calculateSchoolParticipationInfo,
  calculateProgramStats,
  calculateGeneralStats,
} from "../utils/szkoly-w-programie.utils";
import type { School, Program, SchoolProgramParticipation } from "@/types";

/**
 * A dedicated hook to perform complex statistical calculations based on raw data.
 */
export const useSchoolStatistics = (
  schools: School[],
  programs: Program[],
  allParticipations: SchoolProgramParticipation[],
  isLoading: boolean
) => {
  return useMemo(() => {
    if (isLoading || !schools.length || !programs.length || !allParticipations.length) {
      return {
        schoolsInfo: [],
        generalStats: { totalSchools: 0, nonParticipatingCount: 0, totalParticipations: 0, totalMissingParticipations: 0 },
        programStats: {},
      };
    }

    const schoolParticipationsMap = createSchoolParticipationsMap(allParticipations);
    const newSchoolsInfo = calculateSchoolParticipationInfo(schools, programs, schoolParticipationsMap);
    const newProgramStats = calculateProgramStats(schools, programs, schoolParticipationsMap);
    const newGeneralStats = calculateGeneralStats(schools, newSchoolsInfo, newProgramStats, allParticipations);

    return {
      schoolsInfo: newSchoolsInfo,
      generalStats: newGeneralStats,
      programStats: newProgramStats,
    };
  }, [isLoading, schools, programs, allParticipations]);
};
