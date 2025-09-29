import type { EducationalTasksPageState, EducationalTasksPageAction } from "../types";
import type { EducationalTask } from "@/types";

export function educationalTasksPageReducer(
  state: EducationalTasksPageState,
  action: EducationalTasksPageAction
): EducationalTasksPageState {
  switch (action.type) {
    case "SET_FORM_OPEN":
      return {
        ...state,
        openForm: action.payload,
      };

    case "SET_FORM_CLOSED":
      return {
        ...state,
        openForm: false,
        editTask: null,
      };

    case "SET_EDIT_TASK":
      return {
        ...state,
        editTask: action.payload,
        openForm: action.payload ? true : state.openForm,
      };

    case "TOGGLE_TASK_EXPANSION":
      return {
        ...state,
        expandedTasks: new Set(
          Array.from(state.expandedTasks).includes(action.payload)
            ? Array.from(state.expandedTasks).filter((id) => id !== action.payload)
            : [...Array.from(state.expandedTasks), action.payload]
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: {
          year: "",
          month: "",
          program: "",
          activityType: "",
        },
      };

    case "RESET_STATE":
      return {
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

    default:
      return state;
  }
}

// Action creators for convenience
export const actions = {
  setFormOpen: (open: boolean) => ({
    type: "SET_FORM_OPEN" as const,
    payload: open,
  }),

  setFormClosed: () => ({
    type: "SET_FORM_CLOSED" as const,
  }),

  setEditTask: (task: EducationalTask | null) => ({
    type: "SET_EDIT_TASK" as const,
    payload: task,
  }),

  toggleTaskExpansion: (taskId: string) => ({
    type: "TOGGLE_TASK_EXPANSION" as const,
    payload: taskId,
  }),

  setFilter: (key: keyof EducationalTasksPageState["filters"], value: string) => ({
    type: "SET_FILTER" as const,
    payload: { key, value },
  }),

  resetFilters: () => ({
    type: "RESET_FILTERS" as const,
  }),

  resetState: () => ({
    type: "RESET_STATE" as const,
  }),
};
