import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";
import type { FilterFormData } from "../schemas/taskSchemas";

// State types
export interface ScheduleState {
  tasks: ScheduledTaskType[];
  programs: Program[];
  loading: boolean;
  error: string | null;
  filters: FilterFormData;
  editDialog: {
    open: boolean;
    task: ScheduledTaskType | null;
  };
  createDialog: {
    open: boolean;
  };
}

// Action types
export type ScheduleAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: ScheduledTaskType[] }
  | { type: "SET_PROGRAMS"; payload: Program[] }
  | { type: "ADD_TASK"; payload: ScheduledTaskType }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<ScheduledTaskType> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<FilterFormData> }
  | { type: "RESET_FILTERS" }
  | { type: "OPEN_EDIT_DIALOG"; payload: ScheduledTaskType }
  | { type: "CLOSE_EDIT_DIALOG" }
  | { type: "OPEN_CREATE_DIALOG" }
  | { type: "CLOSE_CREATE_DIALOG" };

// Component props types
export interface TaskFormProps {
  mode: "create" | "edit";
  task?: ScheduledTaskType | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ScheduledTaskType>) => void;
  userId?: string;
  loading?: boolean;
}

export interface StatisticsCardsProps {
  tasks: ScheduledTaskType[];
}

export interface FilterSectionProps {
  filters: FilterFormData;
  onFiltersChange: (filters: Partial<FilterFormData>) => void;
  programs: Program[];
}

export interface TaskListSectionProps {
  tasks: ScheduledTaskType[];
  programs: Program[];
  onEditTask: (task: ScheduledTaskType) => void;
  onUpdateTask: (id: string, updates: Partial<ScheduledTaskType>) => void;
  onDeleteTask: (id: string) => void;
}
