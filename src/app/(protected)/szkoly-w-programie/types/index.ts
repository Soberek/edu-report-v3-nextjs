import type { Contact, Program, School as SchoolType } from "@/types";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import type { SelectOption } from "./shared";

// Message types
export interface SnackbarMessage {
  readonly open: boolean;
  readonly type: "success" | "error" | "info" | "warning";
  readonly message: string;
}

// Form types
export interface ParticipationFormState {
  readonly isDirty: boolean;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
  readonly errors: Record<string, unknown>;
}

// Dialog types
export interface EditDialogState {
  readonly isOpen: boolean;
  readonly isLoading: boolean;
  readonly participation: SchoolProgramParticipation | null;
}

// Table types
export interface MappedParticipation extends SchoolProgramParticipation {
  readonly schoolName: string;
  readonly programName: string;
  readonly coordinatorName: string;
}

// Component props types
export interface ParticipationFormProps {
  readonly schools: readonly SchoolType[];
  readonly contacts: readonly Contact[];
  readonly programs: readonly Program[];
  readonly loading: boolean;
  readonly onSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  readonly formMethods: unknown; // Will be properly typed with react-hook-form
}

export interface TableProps {
  readonly participations: readonly SchoolProgramParticipation[];
  readonly schoolsMap: Readonly<Record<string, SchoolType>>;
  readonly contactsMap: Readonly<Record<string, Contact>>;
  readonly programsMap: Readonly<Record<string, Program>>;
  readonly errorMessage: string | null;
  readonly loading: boolean;
  readonly schools: readonly SchoolType[];
  readonly contacts: readonly Contact[];
  readonly programs: readonly Program[];
  readonly onUpdate: (id: string, data: Partial<SchoolProgramParticipation>) => Promise<void>;
  readonly onDelete: (id: string) => Promise<void>;
}

export interface EditParticipationFormProps {
  readonly participation: SchoolProgramParticipation | null;
  readonly schools: readonly SchoolType[];
  readonly contacts: readonly Contact[];
  readonly programs: readonly Program[];
  readonly onSubmit: (data: SchoolProgramParticipationDTO) => void;
}

export interface EditParticipationFormRef {
  readonly submit: () => void;
  readonly isDirty: boolean;
}

// Hook types
export interface UseParticipationPageProps {
  readonly onSubmit?: (data: SchoolProgramParticipationDTO) => Promise<void>;
  readonly onUpdate?: (id: string, data: Partial<SchoolProgramParticipation>) => Promise<void>;
  readonly onDelete?: (id: string) => Promise<void>;
}

export interface UseParticipationFormProps {
  readonly onSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  readonly initialData?: Partial<SchoolProgramParticipationDTO>;
}

// Form field types
export type FormFieldType = "text" | "number" | "date" | "textarea" | "select" | "checkbox";

export interface FormFieldProps {
  readonly name: string;
  readonly control: unknown;
  readonly label: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly helperText?: string;
  readonly type?: FormFieldType;
  readonly options?: readonly SelectOption[];
  readonly startAdornment?: React.ReactNode;
  readonly getOptionLabel?: (option: SelectOption) => string;
}

// Constants types
export type SchoolYear = "2024/2025" | "2025/2026" | "2026/2027" | "2027/2028";

export type SnackbarType = "success" | "error" | "info" | "warning";
