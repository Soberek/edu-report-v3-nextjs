import type { IzrzState, IzrzAction } from "../types";
import { defaultFormValues } from "../schemas/izrzSchemas";

const initialState: IzrzState = {
  formData: defaultFormValues,
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
        formData: defaultFormValues,
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
