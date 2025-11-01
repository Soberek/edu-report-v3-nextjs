/**
 * Core utility functions for the Szkoły w Programie feature.
 * Pure functions with no side effects - suitable for testing and memoization.
 */

import type {
  School,
  Program,
  SchoolProgramParticipation,
  SchoolYear,
  Contact,
} from '@/types';
import type {
  SchoolParticipationInfo,
  ProgramStats,
  ProgramStatsItem,
  MappedParticipation,
} from '../types/szkoly-w-programie.types';
import type { SchoolProgramParticipationDTO } from '@/models/SchoolProgramParticipation';
import { getCurrentSchoolYear } from './date.utils';

/** Creates a map of school ID → program IDs for efficient lookups */
export const createSchoolParticipationsMap = (
  participations: readonly SchoolProgramParticipation[]
): Readonly<Record<string, readonly string[]>> => {
  const map: Record<string, string[]> = {};
  participations.forEach(({ schoolId, programId }) => {
    if (schoolId && programId) {
      if (!map[schoolId]) map[schoolId] = [];
      map[schoolId].push(programId);
    }
  });
  return map;
};

/**
 * Creates lookup maps for schools, contacts, and programs.
 * Used to efficiently retrieve entities by ID in filtering and display operations.
 */
export const createLookupMaps = (
  schools: readonly School[],
  contacts: readonly Contact[],
  programs: readonly Program[]
): Readonly<{
  schoolsMap: Record<string, School>;
  contactsMap: Record<string, Contact>;
  programsMap: Record<string, Program>;
}> => ({
  schoolsMap: Object.fromEntries(schools.map(s => [s.id, s])),
  contactsMap: Object.fromEntries(contacts.map(c => [c.id, c])),
  programsMap: Object.fromEntries(programs.map(p => [p.id, p])),
});

/** Filters programs applicable to a specific school by school type */
export const getApplicablePrograms = (
  school: School,
  programs: readonly Program[]
): readonly Program[] =>
  programs.filter(program =>
    program.schoolTypes?.some(type => school.type.includes(type))
  );

/** Calculates participation info (participating vs non-participating programs) for all schools */
export const calculateSchoolParticipationInfo = (
  schools: readonly School[],
  programs: readonly Program[],
  schoolParticipationsMap: Readonly<Record<string, readonly string[]>>
): readonly SchoolParticipationInfo[] =>
  schools.map(school => {
    const applicable = getApplicablePrograms(school, programs);
    const participatingIds = schoolParticipationsMap[school.id] ?? [];
    return {
      schoolName: school.name,
      participating: applicable.filter(p => participatingIds.includes(p.id)),
      notParticipating: applicable.filter(p => !participatingIds.includes(p.id)),
    };
  });

/** Calculates participation statistics for each program */
export const calculateProgramStats = (
  schools: readonly School[],
  programs: readonly Program[],
  schoolParticipationsMap: Readonly<Record<string, readonly string[]>>
): ProgramStats => {
  const stats: Record<string, ProgramStatsItem> = {};

  programs.forEach(program => {
    if (!program.schoolTypes) return;

    let eligible = 0;
    let participating = 0;

    schools.forEach(school => {
      const isEligible = program.schoolTypes?.some(type =>
        school.type.includes(type)
      );

      if (isEligible) {
        eligible++;
        const isParticipating = (
          schoolParticipationsMap[school.id] ?? []
        ).includes(program.id);
        if (isParticipating) participating++;
      }
    });

    if (eligible > 0) {
      stats[program.name] = {
        participating,
        eligible,
        notParticipating: eligible - participating,
      };
    }
  });

  return stats;
};

/** Calculates overall statistics for the entire program */
export const calculateGeneralStats = (
  schools: readonly School[],
  schoolsInfo: readonly SchoolParticipationInfo[],
  programStats: ProgramStats,
  allParticipations: readonly SchoolProgramParticipation[]
) => {
  const totalMissingParticipations = Object.values(programStats).reduce(
    (sum, stats) => sum + stats.notParticipating,
    0
  );

  const nonParticipatingCount = schoolsInfo.filter(
    info =>
      info.participating.length === 0 && info.notParticipating.length > 0
  ).length;

  return {
    totalSchools: schools.length,
    nonParticipatingCount,
    totalParticipations: allParticipations.length,
    totalMissingParticipations,
  };
};

/** Adds participation count to each program */
export const addParticipationCountToPrograms = (
  programs: readonly Program[],
  participations: readonly SchoolProgramParticipation[]
) => {
  const programCounts = participations.reduce(
    (acc: Record<string, Set<string>>, { programId, schoolId }) => {
      if (programId && schoolId) {
        if (!acc[programId]) acc[programId] = new Set();
        acc[programId].add(schoolId);
      }
      return acc;
    },
    {}
  );

  return programs.map(program => ({
    ...program,
    participationCount: programCounts[program.id]?.size ?? 0,
  }));
};

/** Filters participations by school year */
export const filterBySchoolYear = (
  participations: readonly SchoolProgramParticipation[],
  schoolYear: string | 'all'
): readonly SchoolProgramParticipation[] =>
  schoolYear === 'all'
    ? participations
    : participations.filter(p => p.schoolYear === schoolYear);

/** Filters participations by program */
export const filterByProgram = (
  participations: readonly SchoolProgramParticipation[],
  programId: string | 'all'
): readonly SchoolProgramParticipation[] =>
  programId === 'all'
    ? participations
    : participations.filter(p => p.programId === programId);

/** Filters schools by participation status */
export const filterSchoolsByStatus = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  status: 'all' | 'participating' | 'notParticipating'
): readonly SchoolParticipationInfo[] => {
  switch (status) {
    case 'participating':
      return schoolsInfo.filter(s => s.participating.length > 0);
    case 'notParticipating':
      return schoolsInfo.filter(s => s.notParticipating.length > 0);
    default:
      return schoolsInfo;
  }
};

/** Filters schools by name */
export const filterSchoolsByName = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  name: string | null
): readonly SchoolParticipationInfo[] =>
  !name
    ? schoolsInfo
    : schoolsInfo.filter(s => s.schoolName === name);

/** Filters schools by program participation */
export const filterSchoolsByProgram = (
  schoolsInfo: readonly SchoolParticipationInfo[],
  programId: string | null
): readonly SchoolParticipationInfo[] =>
  !programId
    ? schoolsInfo
    : schoolsInfo.filter(
        s =>
          s.participating.some(p => p.id === programId) ||
          s.notParticipating.some(p => p.id === programId)
      );

/** Extracts unique school years from participations, sorted */
export const getAvailableSchoolYears = (
  participations: readonly SchoolProgramParticipation[]
): readonly SchoolYear[] =>
  [...new Set(participations.map(p => p.schoolYear))].sort() as SchoolYear[];

/**
 * Searches participations across all relevant fields.
 * Case-insensitive full-text search on:
 * - School name, email, address, city
 * - Program name, description
 * - Coordinator name, email, phone
 * - School year, student count, notes, report status
 */
export const searchParticipations = (
  participations: readonly SchoolProgramParticipation[],
  schoolsMap: Readonly<Record<string, School>>,
  contactsMap: Readonly<
    Record<string, { firstName?: string; lastName?: string; email?: string; phone?: string }>
  >,
  programsMap: Readonly<Record<string, Program>>,
  searchQuery: string
): readonly SchoolProgramParticipation[] => {
  if (!searchQuery.trim()) return participations;

  const query = searchQuery.toLowerCase().trim();

  return participations.filter(participation => {
    const school = schoolsMap[participation.schoolId];
    const program = programsMap[participation.programId];
    const coordinator = participation.coordinatorId
      ? contactsMap[participation.coordinatorId]
      : null;

    const searchableTexts = [
      school?.name?.toLowerCase() ?? '',
      school?.email?.toLowerCase() ?? '',
      school?.address?.toLowerCase() ?? '',
      school?.city?.toLowerCase() ?? '',
      program?.name?.toLowerCase() ?? '',
      program?.description?.toLowerCase() ?? '',
      coordinator?.firstName?.toLowerCase() ?? '',
      coordinator?.lastName?.toLowerCase() ?? '',
      coordinator?.email?.toLowerCase() ?? '',
      coordinator?.phone?.toLowerCase() ?? '',
      participation.schoolYear?.toLowerCase() ?? '',
      participation.studentCount?.toString() ?? '',
      participation.notes?.toLowerCase() ?? '',
      participation.reportSubmitted ? 'tak' : 'nie',
    ];

    return searchableTexts.some(text => text.includes(query));
  });
};

/**
 * Creates default form values for a new participation record.
 * Used when initializing add/edit forms.
 */
export const createDefaultFormValues = (): SchoolProgramParticipationDTO & { 
  id: string; 
  createdAt: string; 
  userId: string; 
} => ({
  id: '',
  schoolId: '',
  programId: '',
  coordinatorId: '',
  previousCoordinatorId: '',
  schoolYear: getCurrentSchoolYear() as SchoolYear,
  studentCount: 0,
  notes: '',
  reportSubmitted: false,
  createdAt: '',
  userId: '',
});

/**
 * Maps participation records to display-ready format.
 * Enriches participations with school, program, and coordinator information.
 * @param participations - Array of participation records
 * @param schoolsMap - Map of school ID → school data
 * @param contactsMap - Map of contact ID → contact data
 * @param programsMap - Map of program ID → program data
 * @returns Array of participation records with display properties
 */
export const mapParticipationsForDisplay = (
  participations: readonly SchoolProgramParticipation[],
  schoolsMap: Readonly<Record<string, School>>,
  contactsMap: Readonly<Record<string, Contact>>,
  programsMap: Readonly<Record<string, Program>>
): readonly MappedParticipation[] =>
  participations.map(participation => {
    const school = schoolsMap[participation.schoolId];
    const program = programsMap[participation.programId];
    const coordinator = participation.coordinatorId
      ? contactsMap[participation.coordinatorId]
      : null;

    return {
      ...participation,
      schoolName: school?.name ?? 'N/A',
      schoolEmail: school?.email,
      programName: program?.name ?? 'N/A',
      coordinatorName:
        coordinator && (coordinator.firstName || coordinator.lastName)
          ? `${coordinator.firstName || ''} ${coordinator.lastName || ''}`.trim()
          : 'N/A',
      coordinatorEmail: coordinator?.email,
      coordinatorPhone: coordinator?.phone,
    };
  });