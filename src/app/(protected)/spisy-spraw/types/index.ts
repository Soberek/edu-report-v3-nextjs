import type { CaseRecord } from "@/types";

// State management types
export interface SpisySprawState {
  selectedCode: { code: string; title: string };
  searchQuery: string;
  editingCaseRecord: CaseRecord | null;
  editDialogOpen: boolean;
  createDialogOpen: boolean;
  deleteDialogOpen: boolean;
  dialogLoading: boolean;
  createLoading: boolean;
  recordToDelete: string | null;
  snackbar: {
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  };
}

export type SpisySprawAction =
  | { type: "SET_SELECTED_CODE"; payload: { code: string; title: string } }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "START_EDIT"; payload: CaseRecord }
  | { type: "OPEN_CREATE_DIALOG" }
  | { type: "CLOSE_EDIT_DIALOG" }
  | { type: "CLOSE_CREATE_DIALOG" }
  | { type: "OPEN_DELETE_DIALOG"; payload: string }
  | { type: "CLOSE_DELETE_DIALOG" }
  | { type: "SET_DIALOG_LOADING"; payload: boolean }
  | { type: "SET_CREATE_LOADING"; payload: boolean }
  | { type: "SHOW_SNACKBAR"; payload: { type: "success" | "error" | "info" | "warning"; message: string } }
  | { type: "CLOSE_SNACKBAR" }
  | { type: "RESET_FORM" };

// Business logic types
export interface ActOption {
  code: string;
  name: string;
}

export type SnackbarType = "success" | "error" | "info" | "warning";

export interface FormSubmitData {
  data: CaseRecord;
  formRef: React.RefObject<{ submit: () => void }>;
}

// Extended case record with UI-specific properties
export interface SpisySprawCaseRecord extends CaseRecord {
  formattedDate?: string;
  formattedStartDate?: string;
  formattedEndDate?: string;
}
