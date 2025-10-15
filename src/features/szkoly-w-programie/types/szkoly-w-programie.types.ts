import type { Program } from "@/types";

/**
 * School participation information
 */
export interface SchoolParticipationInfo {
  readonly schoolName: string;
  readonly participating: readonly Program[];
  readonly notParticipating: readonly Program[];
}

/**
 * Statistics for a specific program
 */
export interface ProgramStatsItem {
  readonly participating: number;
  readonly eligible: number;
  readonly notParticipating: number;
}

/**
 * Map of program names to their statistics
 */
export type ProgramStats = Readonly<Record<string, ProgramStatsItem>>;

/**
 * General statistics across all schools and programs
 */
export interface GeneralStats {
  readonly totalSchools: number;
  readonly nonParticipatingCount: number;
  readonly totalParticipations: number;
  readonly totalMissingParticipations: number;
}

/**
 * Program with participation count
 */
export interface ProgramWithCount extends Program {
  readonly participationCount: number;
}

/**
 * Filter state for participation view
 */
export interface ParticipationFilters {
  readonly selectedSchoolYear: string;
  readonly selectedProgram: string;
}

/**
 * Filter state for non-participation view
 */
export interface NonParticipationFilters {
  readonly schoolFilter: string | null;
  readonly programFilter: string | null;
  readonly statusFilter: "all" | "participating" | "notParticipating";
}
