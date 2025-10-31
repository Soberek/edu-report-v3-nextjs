import type { Program, School, Contact, SchoolYear } from "@/types";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import type { NotificationState } from "@/hooks/useNotification";
import type { FilterState, StatusFilterValue } from "../constants/filterDefaults";

/**
 * A collection of lookup maps for efficient data access.
 */
export interface LookupMaps {
  readonly schoolsMap: Readonly<Record<string, School>>;
  readonly contactsMap: Readonly<Record<string, Contact>>;
  readonly programsMap: Readonly<Record<string, Program>>;
}

/**
 * Represents a participation record enriched with display-ready properties.
 */
export interface MappedParticipation extends SchoolProgramParticipation {
  readonly schoolName: string;
  readonly schoolEmail?: string;
  readonly programName: string;
  readonly coordinatorName: string;
  readonly coordinatorEmail?: string;
  readonly coordinatorPhone?: string;
}

/**
 * School participation information.
 */
export interface SchoolParticipationInfo {
  readonly schoolName: string;
  readonly participating: readonly Program[];
  readonly notParticipating: readonly Program[];
}

/**
 * Statistics for a specific program.
 */
export interface ProgramStatsItem {
  readonly participating: number;
  readonly eligible: number;
  readonly notParticipating: number;
}

/**
 * Map of program names to their statistics.
 */
export type ProgramStats = Readonly<Record<string, ProgramStatsItem>>;

/**
 * General statistics across all schools and programs.
 */
export interface GeneralStats {
  readonly totalSchools: number;
  readonly nonParticipatingCount: number;
  readonly totalParticipations: number;
  readonly totalMissingParticipations: number;
}

/**
 * A program enriched with its participation count.
 */
export interface ProgramWithCount extends Program {
  readonly participationCount: number;
}

/**
 * The complete, strictly-typed shape of the SchoolParticipationContext.
 */
export interface SchoolParticipationContextType {
  // Status
  readonly isLoading: boolean;
  readonly error: Error | null;
  
  // Raw Data
  readonly schools: readonly School[];
  readonly contacts: readonly Contact[];
  readonly programs: readonly Program[];
  
  // Participations (at different filter levels)
  readonly allParticipations: readonly SchoolProgramParticipation[]; // All data
  readonly participationsByYear: readonly SchoolProgramParticipation[]; // Filtered by year only
  readonly participations: readonly SchoolProgramParticipation[]; // Fully filtered by year, program, and search
  
  // Mapped & Prepared Data
  readonly mappedParticipations: readonly MappedParticipation[];
  readonly schoolsInfo: readonly SchoolParticipationInfo[];
  readonly generalStats: GeneralStats;
  readonly programStats: ProgramStats;
  readonly availableSchoolYears: readonly SchoolYear[];
  readonly availablePrograms: readonly ProgramWithCount[];
  readonly lookupMaps: LookupMaps;
  
  // UI-Ready Data for Selectors/Filters
  readonly schoolOptions: readonly { readonly label: string; readonly value: string }[];
  readonly programOptions: readonly { readonly label: string; readonly value: string }[];
  
  // Filter State & Actions (managed by useFilterState hook)
  readonly filters: FilterState;
  readonly setSchoolYear: (year: string) => void;
  readonly setProgram: (program: string) => void;
  readonly setSchoolName: (name: string) => void;
  readonly setStatus: (status: StatusFilterValue) => void;
  readonly setSearch: (search: string) => void;
  readonly resetFilters: () => void;
  
  // Actions & Notifications
  readonly notification: NotificationState;
  readonly closeNotification: () => void;
  readonly handleSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  readonly handleUpdateParticipation: (id: string, data: Partial<SchoolProgramParticipationDTO>) => Promise<void>;
  readonly handleDeleteParticipation: (id: string) => Promise<void>;
}
