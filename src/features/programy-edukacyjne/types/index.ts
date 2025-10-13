export interface Program {
  id: string;
  code: string;
  name: string;
  programType: "programowy" | "nieprogramowy";
  description: string;
}

export interface CreateProgramFormData {
  code: string;
  name: string;
  programType: "programowy" | "nieprogramowy";
  description: string;
}

export interface EditProgramFormData extends CreateProgramFormData {
  id: string;
}

export interface ProgramsState {
  programs: Program[];
  loading: boolean;
  error: string | null;
  openForm: boolean;
  editProgram: Program | null;
  isSubmitting: boolean;
}

export type ProgramsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PROGRAMS"; payload: Program[] }
  | { type: "ADD_PROGRAM"; payload: Program }
  | { type: "UPDATE_PROGRAM"; payload: Program }
  | { type: "DELETE_PROGRAM"; payload: string }
  | { type: "TOGGLE_FORM"; payload: boolean }
  | { type: "SET_EDIT_PROGRAM"; payload: Program | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "CLEAR_ERROR" };
