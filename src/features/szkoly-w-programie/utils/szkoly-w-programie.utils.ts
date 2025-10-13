import type { School, Program, SchoolProgramParticipation, SchoolYear } from "@/types";
import type { SchoolParticipationInfo, ProgramStats, ProgramStatsItem } from "../types/szkoly-w-programie.types";

export const createSchoolParticipationsMap = (
  participations: readonly SchoolProgramParticipation[]
): Readonly<Record<string, readonly string[]>> => {
  const map: Record<string, string[]> = {};
  participations.forEach((participation) => {
    if (!map[participation.schoolId]) map[participation.schoolId] = [];
    map[participation.schoolId].push(participation.programId);
  });
  return map;
};

export const getApplicablePrograms = (school: School, programs: readonly Program[]): readonly Program[] =>
  programs.filter((program) => program.schoolTypes?.some((t) => school.type.includes(t)));

export const calculateSchoolParticipationInfo = (
  schools: readonly School[],
  programs: readonly Program[],
  schoolParticipationsMap: Readonly<Record<string, readonly string[]>>
): readonly SchoolParticipationInfo[] => {
  return schools.map((school) => {
    const applicable = getApplicablePrograms(school, programs);
    const participatingProgramIds = schoolParticipationsMap[school.id] || [];
    const participating = applicable.filter((p) => participatingProgramIds.includes(p.id));
    const notParticipating = applicable.filter((p) => !participatingProgramIds.includes(p.id));
    return { schoolName: school.name, participating, notParticipating };
  });
};

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
      if (program.schoolTypes?.some((t) => school.type.includes(t))) {
        eligible++;
        if ((schoolParticipationsMap[school.id] || []).includes(program.id)) participatingCount++;
      }
    });
    if (eligible > 0)
      stats[program.name] = { participating: participatingCount, eligible, notParticipating: eligible - participatingCount };
  });
  return stats;
};

export const calculateGeneralStats = (
  schools: readonly School[],
  schoolsInfo: readonly SchoolParticipationInfo[],
  programStats: ProgramStats,
  allParticipations: readonly SchoolProgramParticipation[]
): { totalSchools: number; nonParticipatingCount: number; totalParticipations: number; totalMissingParticipations: number } => {
  let totalMissingParticipations = 0;
  Object.values(programStats).forEach((s) => {
    totalMissingParticipations += s.notParticipating;
  });
  const nonParticipatingCount = schoolsInfo.filter((i) => i.notParticipating.length > 0).length;
  return {
    totalSchools: schools.length,
    nonParticipatingCount,
    totalParticipations: allParticipations.length,
    totalMissingParticipations,
  };
};

export const addParticipationCountToPrograms = (programs: readonly Program[], participations: readonly SchoolProgramParticipation[]) => {
  const counts = participations.reduce((acc: Record<string, number>, p) => {
    acc[p.programId] = (acc[p.programId] || 0) + 1;
    return acc;
  }, {});
  return programs.map((program) => ({ ...program, participationCount: counts[program.id] || 0 }));
};

export const filterBySchoolYear = (participations: readonly SchoolProgramParticipation[], schoolYear: string | "all") =>
  schoolYear === "all" ? participations : participations.filter((p) => p.schoolYear === schoolYear);

export const filterByProgram = (participations: readonly SchoolProgramParticipation[], programId: string | "all") =>
  programId === "all" ? participations : participations.filter((p) => p.programId === programId);

export const filterSchoolsByStatus = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  status: "all" | "participating" | "notParticipating"
) => {
  switch (status) {
    case "participating":
      return schoolsInfo.filter((s) => s.participating.length > 0);
    case "notParticipating":
      return schoolsInfo.filter((s) => s.notParticipating.length > 0);
    default:
      return schoolsInfo;
  }
};

export const filterSchoolsByName = (schoolsInfo: readonly SchoolParticipationInfo[], name: string | null) =>
  !name ? schoolsInfo : schoolsInfo.filter((s) => s.schoolName === name);

export const filterSchoolsByProgram = (schoolsInfo: readonly SchoolParticipationInfo[], programId: string | null) =>
  !programId
    ? schoolsInfo
    : schoolsInfo.filter((s) => s.participating.some((p) => p.id === programId) || s.notParticipating.some((p) => p.id === programId));

export const getAvailableSchoolYears = (participations: readonly SchoolProgramParticipation[]): SchoolYear[] =>
  [...new Set(participations.map((p) => p.schoolYear))].sort() as SchoolYear[];
