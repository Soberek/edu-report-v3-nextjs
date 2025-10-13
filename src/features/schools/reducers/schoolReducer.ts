import type { SchoolState, SchoolAction } from "../types";

export const schoolReducer = (state: SchoolState, action: SchoolAction): SchoolState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_ERROR":
      return { ...state, error: action.payload };
    
    case "SET_SCHOOLS":
      return { ...state, schools: action.payload };
    
    case "SET_FILTER":
      return { ...state, filter: { ...state.filter, ...action.payload } };
    
    case "TOGGLE_FORM":
      return { ...state, openForm: action.payload };
    
    case "SET_EDIT_SCHOOL":
      return { ...state, editSchool: action.payload };
    
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    
    case "ADD_SCHOOL":
      return { ...state, schools: [...state.schools, action.payload] };
    
    case "UPDATE_SCHOOL":
      return {
        ...state,
        schools: state.schools.map((school) =>
          school.id === action.payload.id 
            ? { ...school, ...action.payload.updates } 
            : school
        ),
      };
    
    case "DELETE_SCHOOL":
      return {
        ...state,
        schools: state.schools.filter((school) => school.id !== action.payload),
      };
    
    default:
      return state;
  }
};
