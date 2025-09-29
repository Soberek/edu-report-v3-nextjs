import { WYKAZ_AKT } from "@/constants/acts";
import { getTodayForInput } from "@/utils/shared/dayjsUtils";
import type { CaseRecord, ActOption } from "../types";

// Default form values
export const DEFAULT_FORM_VALUES: Omit<CaseRecord, "id" | "createdAt" | "userId"> = {
  code: "",
  referenceNumber: "OZiPZ.966",
  date: getTodayForInput(),
  title: "",
  startDate: getTodayForInput(),
  endDate: getTodayForInput(),
  comments: "OZ",
  sender: "-",
  notes: "",
};

// Initial selected code
export const INITIAL_SELECTED_CODE = {
  code: "0442",
  title: "Sprawozdawczość statystyczna",
};

// Initial state
export const INITIAL_STATE = {
  selectedCode: INITIAL_SELECTED_CODE,
  editingCaseRecord: null,
  editDialogOpen: false,
  dialogLoading: false,
  snackbar: {
    open: false,
    type: "success" as const,
    message: "",
  },
};

// UI constants
export const UI_CONFIG = {
  SNACKBAR_AUTO_HIDE_DURATION: 6000,
  EDIT_DIALOG_MAX_WIDTH: "lg" as const,
  DEFAULT_PAGE_SIZE: 25,
};

// Polish messages
export const MESSAGES = {
  ADD_SUCCESS: "Akt sprawy został dodany pomyślnie.",
  ADD_ERROR: "Wystąpił błąd podczas zapisywania danych.",
  DELETE_SUCCESS: "Akt sprawy został usunięty pomyślnie.",
  DELETE_ERROR: "Wystąpił błąd podczas usuwania danych.",
  UPDATE_SUCCESS: "Akt sprawy został zaktualizowany pomyślnie.",
  UPDATE_ERROR: "Wystąpił błąd podczas aktualizacji danych.",
  LOADING_MESSAGE: "Ładowanie danych...",
};

// Constants functions
export const createActsOptions = (): ActOption[] => {
  return Object.values(WYKAZ_AKT).reduce<ActOption[]>((acc, akt) => {
    acc.push({ code: akt.code, name: akt.name });

    if (akt.subCategories) {
      acc.push(
        ...Object.values(akt.subCategories).map((sub) => ({
          code: sub.code,
          name: sub.name,
        }))
      );
    }

    return acc;
  }, []);
};
