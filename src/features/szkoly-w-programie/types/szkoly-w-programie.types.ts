import type { Program, School, Contact, SchoolYear } from "@/types";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import type { NotificationState } from "@/hooks/useNotification";

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
  // Derived Data
  readonly participations: readonly SchoolProgramParticipation[];
  readonly mappedParticipations: readonly MappedParticipation[];
  readonly schoolsInfo: readonly SchoolParticipationInfo[];
  readonly generalStats: GeneralStats;
  readonly programStats: ProgramStats;
  readonly availableSchoolYears: readonly SchoolYear[];
  readonly availablePrograms: readonly ProgramWithCount[];
  readonly lookupMaps: LookupMaps;
  // Filter State & Setters
  readonly selectedSchoolYear: SchoolYear | "all";
  readonly setSelectedSchoolYear: React.Dispatch<React.SetStateAction<SchoolYear | "all">>;
  readonly selectedProgram: string | "all";
  readonly setSelectedProgram: React.Dispatch<React.SetStateAction<string | "all">>;
  readonly schoolFilter: string | null;
  readonly setSchoolFilter: React.Dispatch<React.SetStateAction<string | null>>;
  readonly programFilter: string | null;
  readonly setProgramFilter: React.Dispatch<React.SetStateAction<string | null>>;
  readonly statusFilter: "all" | "participating" | "notParticipating";
  readonly setStatusFilter: React.Dispatch<React.SetStateAction<"all" | "participating" | "notParticipating">>;
  readonly tableSearch: string;
  readonly setTableSearch: React.Dispatch<React.SetStateAction<string>>;
  // Actions & Notifications
  readonly notification: NotificationState;
  readonly closeNotification: () => void;
  readonly handleSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  readonly handleUpdateParticipation: (id: string, data: Partial<SchoolProgramParticipationDTO>) => Promise<void>;
  readonly handleDeleteParticipation: (id: string) => Promise<void>;
}
