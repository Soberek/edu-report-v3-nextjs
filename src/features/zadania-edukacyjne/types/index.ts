import type { EducationalTask, CreateEducationalTaskFormData } from "@/types";

// Page state types
export interface EducationalTasksFilters {
  readonly year: string;
  readonly month: string;
  readonly program: string;
  readonly activityType: string;
}

export interface EducationalTasksPageState {
  readonly openForm: boolean;
  readonly editTask: EducationalTask | null;
  readonly expandedTasks: ReadonlySet<string>;
  readonly filters: EducationalTasksFilters;
}

// Action types
export type EducationalTasksPageAction =
  | { readonly type: "SET_FORM_OPEN"; readonly payload: boolean }
  | { readonly type: "SET_FORM_CLOSED" }
  | { readonly type: "SET_EDIT_TASK"; readonly payload: EducationalTask | null }
  | { readonly type: "TOGGLE_TASK_EXPANSION"; readonly payload: string }
  | { readonly type: "SET_FILTER"; readonly payload: { readonly key: keyof EducationalTasksFilters; readonly value: string } }
  | { readonly type: "RESET_FILTERS" }
  | { readonly type: "RESET_STATE" };

// Hook types
export interface UseEducationalTasksPageProps {
  readonly onCreate?: (data: CreateEducationalTaskFormData) => Promise<void>;
  readonly onUpdate?: (id: string, data: CreateEducationalTaskFormData) => Promise<void>;
  readonly onDelete?: (id: string) => Promise<void>;
}

// Component prop types
export interface EducationalTasksPageProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface FilterSectionProps {
  readonly filters: EducationalTasksFilters;
  readonly filterOptions: FilterOptions;
  readonly monthNames: readonly string[];
  readonly onFilterChange: (key: keyof EducationalTasksFilters, value: string) => void;
}

export interface TaskGroupProps {
  readonly group: TaskGroup;
  readonly expandedTasks: ReadonlySet<string>;
  readonly onToggleExpansion: (taskId: string) => void;
  readonly onEdit: (task: EducationalTask) => void;
  readonly onDelete: (id: string) => void;
}

export interface TaskCardProps {
  readonly task: EducationalTask;
  readonly isExpanded: boolean;
  readonly onToggleExpansion: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

// Data transformation types
export interface TaskGroup {
  readonly key: string;
  readonly year: number;
  readonly month: number;
  readonly tasks: readonly EducationalTask[];
}

export interface FilterOptions {
  readonly years: readonly number[];
  readonly programs: readonly string[];
  readonly activityTypes: readonly string[];
}

export interface FilteredTasksResult {
  readonly filteredTasks: readonly EducationalTask[];
  readonly groupedTasks: readonly TaskGroup[];
  readonly filterOptions: FilterOptions;
}

// Form types
export interface EducationalTaskFormProps {
  readonly mode: "create" | "edit";
  readonly task?: EducationalTask | null;
  readonly tasks?: EducationalTask[];
  readonly onClose: () => void;
  readonly onSave: (data: Record<string, unknown>) => Promise<void>;
  readonly loading?: boolean;
}

// Constants types
export type FilterKey = keyof EducationalTasksFilters;

// Month names
export const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];

// Initial state
export const INITIAL_PAGE_STATE: EducationalTasksPageState = {
  openForm: false,
  editTask: null,
  expandedTasks: new Set(),
  filters: {
    year: "",
    month: "",
    program: "",
    activityType: "",
  },
};
