import type { ScheduleState, ScheduleAction } from "../types";
import { filterSchema } from "../schemas/taskSchemas";

const initialState: ScheduleState = {
  tasks: [],
  programs: [],
  loading: false,
  error: null,
  filters: filterSchema.parse({}),
  editDialog: {
    open: false,
    task: null,
  },
  createDialog: {
    open: false,
  },
};

export const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };

    case "SET_PROGRAMS":
      return {
        ...state,
        programs: action.payload,
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? { ...task, ...action.payload.updates } : task)),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: filterSchema.parse({}),
      };

    case "OPEN_EDIT_DIALOG":
      return {
        ...state,
        editDialog: {
          open: true,
          task: action.payload,
        },
      };

    case "CLOSE_EDIT_DIALOG":
      return {
        ...state,
        editDialog: {
          open: false,
          task: null,
        },
      };

    case "OPEN_CREATE_DIALOG":
      return {
        ...state,
        createDialog: {
          open: true,
        },
      };

    case "CLOSE_CREATE_DIALOG":
      return {
        ...state,
        createDialog: {
          open: false,
        },
      };

    default:
      return state;
  }
};

export { initialState };
