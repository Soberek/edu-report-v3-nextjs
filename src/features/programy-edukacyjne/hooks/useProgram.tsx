import { useReducer } from "react";
import type { Program } from "../types";

import { programs as PROGRAMS } from "@/constants/programs";

type State = {
  programs: Program[];
  loading: boolean;
  errorMessage: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_PROGRAM"; payload: Program }
  | { type: "DELETE_PROGRAM"; payload: string };

const initialState: State = {
  programs: PROGRAMS,
  loading: false,
  errorMessage: null,
};

const programsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload };
    case "ADD_PROGRAM":
      return {
        ...state,
        programs: [...state.programs, action.payload],
        errorMessage: null,
      };
    case "DELETE_PROGRAM":
      return {
        ...state,
        programs: state.programs.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
};

export const usePrograms = () => {
  const [state, dispatch] = useReducer(programsReducer, initialState);

  const handleProgramSubmit = async (data: Omit<Program, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const newProgram = { ...data, id: Math.random().toString(36).slice(2) };
      dispatch({ type: "ADD_PROGRAM", payload: newProgram });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: "Błąd dodawania programu" });
      console.warn(e instanceof Error ? e.message : e);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleProgramDelete = (id: string) => {
    dispatch({ type: "DELETE_PROGRAM", payload: id });
  };

  return {
    programs: state.programs,
    loading: state.loading,
    errorMessage: state.errorMessage,
    handleProgramSubmit,
    handleProgramDelete,
  };
};
