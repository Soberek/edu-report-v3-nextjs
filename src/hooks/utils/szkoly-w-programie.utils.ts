import type { School, Program, SchoolProgramParticipation } from "@/types";
import type {
  SchoolParticipationInfo,
  ProgramStats,
  ProgramStatsItem,
  GeneralStats,
  ProgramWithCount,
} from "../types/szkoly-w-programie.types";

/**
 * Creates a map of school participations by school ID
 */
export const createSchoolParticipationsMap = (
  participations: readonly SchoolProgramParticipation[]
): Readonly<Record<string, readonly string[]>> => {
  const map: Record<string, string[]> = {};
  
  participations.forEach((participation) => {
    if (!map[participation.schoolId]) {
      map[participation.schoolId] = [];
    }
    map[participation.schoolId].push(participation.programId);
  });

  return map;
};

/**
 * Gets applicable programs for a school based on school types
 */
export const getApplicablePrograms = (
  school: School,
  programs: readonly Program[]
): readonly Program[] => {
  return programs.filter((program) =>
    program.schoolTypes?.some((programType) => school.type.includes(programType))
  );
};

/**
 * Calculates school participation information
 */
export const calculateSchoolParticipationInfo = (
  schools: readonly School[],
  programs: readonly Program[],
  schoolParticipationsMap: Readonly<Record<string, readonly string[]>>
): readonly SchoolParticipationInfo[] => {
  return schools.map((school) => {
    const applicablePrograms = getApplicablePrograms(school, programs);
    const participatingProgramIds = schoolParticipationsMap[school.id] || [];
    
    const participating = applicablePrograms.filter((program) =>
      participatingProgramIds.includes(program.id)
    );
    
    const notParticipating = applicablePrograms.filter((program) =>
      !participatingProgramIds.includes(program.id)
    );

    return {
      schoolName: school.name,
      participating,
      notParticipating,
    };
  });
};

/**
 * Calculates program statistics
 */
export const calculateProgramStats = (
  schools: readonly School[],
  programs: readonly Program[],
  schoolParticipationsMap: Readonly<Record<string, readonly string[]>>
): ProgramStats => {
  const stats: Record<string, ProgramStatsItem> = {};

  programs.forEach((program) => {
    if (!program.schoolTypes) return;

    let eligible = 0;
    let participatingCount = 0;

    schools.forEach((school) => {
      if (program.schoolTypes?.some((type) => school.type.includes(type))) {
        eligible++;
        if ((schoolParticipationsMap[school.id] || []).includes(program.id)) {
          participatingCount++;
        }
      }
    });

    if (eligible > 0) {
      stats[program.name] = {
        participating: participatingCount,
        eligible,
        notParticipating: eligible - participatingCount,
      };
    }
  });

  return stats;
};

/**
 * Calculates general statistics
 */
export const calculateGeneralStats = (
  schools: readonly School[],
  schoolsInfo: readonly SchoolParticipationInfo[],
  programStats: ProgramStats
): GeneralStats => {
  let totalParticipations = 0;
  let totalMissingParticipations = 0;

  Object.values(programStats).forEach((stats) => {
    totalParticipations += stats.participating;
    totalMissingParticipations += stats.notParticipating;
  });

  const nonParticipatingCount = schoolsInfo.filter(
    (info) => info.notParticipating.length > 0
  ).length;

  return {
    totalSchools: schools.length,
    nonParticipatingCount,
    totalParticipations,
    totalMissingParticipations,
  };
};

/**
 * Adds participation count to programs
 */
export const addParticipationCountToPrograms = (
  programs: readonly Program[],
  participations: readonly SchoolProgramParticipation[]
): readonly ProgramWithCount[] => {
  const counts = participations.reduce((acc, participation) => {
    acc[participation.programId] = (acc[participation.programId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return programs.map((program) => ({
    ...program,
    participationCount: counts[program.id] || 0,
  }));
};

/**
 * Filters participations by school year
 */
export const filterBySchoolYear = (
  participations: readonly SchoolProgramParticipation[],
  schoolYear: string | "all"
): readonly SchoolProgramParticipation[] => {
  if (schoolYear === "all") return participations;
  return participations.filter((p) => p.schoolYear === schoolYear);
};

/**
 * Filters participations by program
 */
export const filterByProgram = (
  participations: readonly SchoolProgramParticipation[],
  programId: string | "all"
): readonly SchoolProgramParticipation[] => {
  if (programId === "all") return participations;
  return participations.filter((p) => p.programId === programId);
};

/**
 * Filters schools by participation status
 */
export const filterSchoolsByStatus = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  status: "all" | "participating" | "notParticipating"
): readonly SchoolParticipationInfo[] => {
  switch (status) {
    case "participating":
      return schoolsInfo.filter(
        (s) => s.participating.length > 0
      );
    case "notParticipating":
      return schoolsInfo.filter((s) => s.notParticipating.length > 0);
    case "all":
    default:
      return schoolsInfo;
  }
};

/**
 * Filters schools by school name
 */
export const filterSchoolsByName = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  schoolName: string | null
): readonly SchoolParticipationInfo[] => {
  if (!schoolName) return schoolsInfo;
  return schoolsInfo.filter((s) => s.schoolName === schoolName);
};

/**
 * Filters schools by program
 */
export const filterSchoolsByProgram = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  programId: string | null
): readonly SchoolParticipationInfo[] => {
  if (!programId) return schoolsInfo;
  return schoolsInfo.filter(
    (s) =>
      s.participating.some((p) => p.id === programId) ||
      s.notParticipating.some((p) => p.id === programId)
  );
};

/**
 * Gets available school years from participations
 */
export const getAvailableSchoolYears = (
  participations: readonly SchoolProgramParticipation[]
): readonly string[] => {
  return [...new Set(participations.map((p) => p.schoolYear))].sort();
};
