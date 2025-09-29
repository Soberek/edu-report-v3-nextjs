import type { EducationalTask } from "@/types";

export interface EducationalTasksPageState {
  openForm: boolean;
  editTask: EducationalTask | null;
  expandedTasks: Set<string>;
  filters: {
    year: string;
    month: string;
    program: string;
    activityType: string;
  };
}

export type EducationalTasksPageAction =
  | { type: "SET_FORM_OPEN"; payload: boolean }
  | { type: "SET_FORM_CLOSED" }
  | { type: "SET_EDIT_TASK"; payload: EducationalTask | null }
  | { type: "TOGGLE_TASK_EXPANSION"; payload: string }
  | { type: "SET_FILTER"; payload: { key: keyof EducationalTasksPageState["filters"]; value: string } }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_STATE" };

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
