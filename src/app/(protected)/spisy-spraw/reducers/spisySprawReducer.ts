import type { SpisySprawState, SpisySprawAction } from "../types";
import type { CaseRecord } from "@/types";
import { INITIAL_STATE } from "../constants";

export function spisySprawReducer(state: SpisySprawState, action: SpisySprawAction): SpisySprawState {
  switch (action.type) {
    case "SET_SELECTED_CODE":
      return {
        ...state,
        selectedCode: action.payload,
      };

    case "START_EDIT":
      return {
        ...state,
        editingCaseRecord: action.payload,
        editDialogOpen: true,
      };

    case "CLOSE_EDIT_DIALOG":
      return {
        ...state,
        editDialogOpen: false,
        editingCaseRecord: null,
        dialogLoading: false,
      };

    case "SET_DIALOG_LOADING":
      return {
        ...state,
        dialogLoading: action.payload,
      };

    case "SHOW_SNACKBAR":
      return {
        ...state,
        snackbar: {
          open: true,
          type: action.payload.type,
          message: action.payload.message,
        },
      };

    case "CLOSE_SNACKBAR":
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
        },
      };

    case "RESET_FORM":
      return {
        ...state,
        editingCaseRecord: null,
        editDialogOpen: false,
        dialogLoading: false,
      };

    default:
      return state;
  }
}

// Action creators for better developer experience
export const actions = {
  setSelectedCode: (payload: { code: string; title: string }) => ({
    type: "SET_SELECTED_CODE" as const,
    payload,
  }),

  startEdit: (payload: CaseRecord) => ({
    type: "START_EDIT" as const,
    payload,
  }),

  closeEditDialog: () => ({
    type: "CLOSE_EDIT_DIALOG" as const,
  }),

  setDialogLoading: (payload: boolean) => ({
    type: "SET_DIALOG_LOADING" as const,
    payload,
  }),

  showSnackbar: (payload: { type: "success" | "error" | "info" | "warning"; message: string }) => ({
    type: "SHOW_SNACKBAR" as const,
    payload,
  }),

  closeSnackbar: () => ({
    type: "CLOSE_SNACKBAR" as const,
  }),

  resetForm: () => ({
    type: "RESET_FORM" as const,
  }),
};

export { INITIAL_STATE };
