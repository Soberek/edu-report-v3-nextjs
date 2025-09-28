import type { HolidaysState, HolidaysAction } from "../types";

// Initial state
export const initialHolidaysState: HolidaysState = {
  holidays: [],
  separatedHolidaysFromOpenAi: [],
  posts: [],
  loading: false,
  error: null,
};

// Reducer function
export function holidaysReducer(state: HolidaysState, action: HolidaysAction): HolidaysState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_HOLIDAYS":
      return {
        ...state,
        holidays: action.payload,
        loading: false,
        error: null,
      };

    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
      };

    case "SET_SEPARATED_HOLIDAYS":
      return {
        ...state,
        separatedHolidaysFromOpenAi: action.payload,
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "RESET_STATE":
      return initialHolidaysState;

    default:
      return state;
  }
}
