import { ProgramsState, ProgramsAction } from "../types";

export const initialProgramsState: ProgramsState = {
  programs: [],
  loading: false,
  error: null,
  openForm: false,
  editProgram: null,
  isSubmitting: false,
};

export function programsReducer(state: ProgramsState, action: ProgramsAction): ProgramsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        isSubmitting: false,
      };
    case "SET_PROGRAMS":
      return {
        ...state,
        programs: action.payload,
        loading: false,
        error: null,
      };
    case "ADD_PROGRAM":
      return {
        ...state,
        programs: [...state.programs, action.payload],
        loading: false,
        error: null,
        openForm: false,
        editProgram: null,
        isSubmitting: false,
      };
    case "UPDATE_PROGRAM":
      return {
        ...state,
        programs: state.programs.map((program) => (program.id === action.payload.id ? action.payload : program)),
        loading: false,
        error: null,
        openForm: false,
        editProgram: null,
        isSubmitting: false,
      };
    case "DELETE_PROGRAM":
      return {
        ...state,
        programs: state.programs.filter((program) => program.id !== action.payload),
        error: null,
      };
    case "TOGGLE_FORM":
      return {
        ...state,
        openForm: action.payload,
        editProgram: action.payload ? state.editProgram : null,
        error: null,
      };
    case "SET_EDIT_PROGRAM":
      return {
        ...state,
        editProgram: action.payload,
        openForm: action.payload !== null,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
