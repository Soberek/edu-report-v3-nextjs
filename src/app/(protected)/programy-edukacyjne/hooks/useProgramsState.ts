import { useReducer, useCallback, useEffect } from "react";
import { programsReducer, initialProgramsState } from "../reducers/programsReducer";
import { loadInitialPrograms, generateProgramId, validateProgramCode } from "../utils/programUtils";
import { Program, CreateProgramFormData } from "../types";

export const useProgramsState = () => {
  const [state, dispatch] = useReducer(programsReducer, initialProgramsState);

  // Load initial programs
  useEffect(() => {
    const initialPrograms = loadInitialPrograms();
    dispatch({ type: "SET_PROGRAMS", payload: initialPrograms });
  }, []);

  const handleCreateProgram = useCallback(
    async (data: CreateProgramFormData) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        // Validate unique code
        if (!validateProgramCode(data.code, state.programs)) {
          throw new Error("Program o podanym kodzie już istnieje");
        }

        const newProgram: Program = {
          ...data,
          id: generateProgramId(),
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({ type: "ADD_PROGRAM", payload: newProgram });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Błąd podczas dodawania programu";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    },
    [state.programs]
  );

  const handleUpdateProgram = useCallback(
    async (id: string, data: CreateProgramFormData) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        // Validate unique code (excluding current program)
        if (!validateProgramCode(data.code, state.programs, id)) {
          throw new Error("Program o podanym kodzie już istnieje");
        }

        const updatedProgram: Program = {
          ...data,
          id,
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({ type: "UPDATE_PROGRAM", payload: updatedProgram });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Błąd podczas aktualizacji programu";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    },
    [state.programs]
  );

  const handleDeleteProgram = useCallback(async (id: string) => {
    dispatch({ type: "CLEAR_ERROR" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      dispatch({ type: "DELETE_PROGRAM", payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas usuwania programu";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const toggleForm = useCallback((open: boolean) => {
    dispatch({ type: "TOGGLE_FORM", payload: open });
  }, []);

  const setEditProgram = useCallback((program: Program | null) => {
    dispatch({ type: "SET_EDIT_PROGRAM", payload: program });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return {
    state,
    handleCreateProgram,
    handleUpdateProgram,
    handleDeleteProgram,
    toggleForm,
    setEditProgram,
    clearError,
  };
};
