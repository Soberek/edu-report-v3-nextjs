import type { IzrzState, IzrzAction } from "../types";
import { defaultFormValues, type IzrzFormData } from "../schemas/izrzSchemas";

// Create a proper initial form data with required fields
const initialFormData: IzrzFormData = {
  templateFile: new File([], ""), // Create an empty file as placeholder
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: "",
  viewerCount: 0,
  viewerCountDescription: "",
  taskDescription: "",
  additionalInfo: "",
  attendanceList: false,
  rozdzielnik: false,
};

const initialState: IzrzState = {
  formData: initialFormData,
  schools: [],
  loading: false,
  error: null,
  isSubmitting: false,
  submitMessage: null,
};

export const izrzReducer = (state: IzrzState, action: IzrzAction): IzrzState => {
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

    case "SET_SCHOOLS":
      return {
        ...state,
        schools: action.payload,
        loading: false,
        error: null,
      };

    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };

    case "RESET_FORM":
      return {
        ...state,
        formData: initialFormData,
        error: null,
      };

    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "SET_SUBMIT_MESSAGE":
      return {
        ...state,
        submitMessage: action.payload,
      };

    default:
      return state;
  }
};

export { initialState };
