import { useReducer, useEffect, useCallback } from "react";
import { schoolReducer } from "../reducers/schoolReducer";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import { defaultFilterValues, type CreateSchoolFormData, type EditSchoolFormData } from "../schemas/schoolSchemas";
import type { School } from "@/types";
import type { SchoolState } from "../types";

const initialState: SchoolState = {
  loading: true,
  error: null,
  schools: [],
  filter: defaultFilterValues,
  openForm: false,
  editSchool: null,
  isSubmitting: false,
};

export const useSchoolState = () => {
  const [state, dispatch] = useReducer(schoolReducer, initialState);
  const userContext = useUser();

  const {
    data: fetchedSchools,
    loading: fetchedLoading,
    error: fetchedError,
    createItem: createSchool,
    updateItem: updateSchool,
    deleteItem: deleteSchool,
    refetch,
  } = useFirebaseData<School>("schools", userContext.user?.uid);

  // Sync with Firebase data
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: fetchedLoading });
  }, [fetchedLoading]);

  useEffect(() => {
    dispatch({ type: "SET_ERROR", payload: fetchedError });
  }, [fetchedError]);

  useEffect(() => {
    if (fetchedSchools) {
      dispatch({ type: "SET_SCHOOLS", payload: fetchedSchools });
    }
  }, [fetchedSchools]);

  // Action creators
  const setFilter = useCallback((newFilter: Partial<typeof defaultFilterValues>) => {
    dispatch({ type: "SET_FILTER", payload: newFilter });
  }, []);

  const toggleForm = useCallback((open: boolean) => {
    dispatch({ type: "TOGGLE_FORM", payload: open });
  }, []);

  const setEditSchool = useCallback((school: School | null) => {
    dispatch({ type: "SET_EDIT_SCHOOL", payload: school });
  }, []);

  const handleCreateSchool = useCallback(
    async (data: CreateSchoolFormData) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      try {
        await createSchool(data);
        await refetch();
        dispatch({ type: "TOGGLE_FORM", payload: false });
      } catch (error) {
        console.error("Error creating school:", error);
      } finally {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    },
    [createSchool, refetch]
  );

  const handleUpdateSchool = useCallback(
    async (id: string, updates: EditSchoolFormData) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      try {
        await updateSchool(id, updates);
        await refetch();
        dispatch({ type: "TOGGLE_FORM", payload: false });
        dispatch({ type: "SET_EDIT_SCHOOL", payload: null });
      } catch (error) {
        console.error("Error updating school:", error);
      } finally {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    },
    [updateSchool, refetch]
  );

  const handleDeleteSchool = useCallback(
    async (id: string) => {
      try {
        await deleteSchool(id);
        await refetch();
      } catch (error) {
        console.error("Error deleting school:", error);
      }
    },
    [deleteSchool, refetch]
  );

  return {
    state,
    dispatch,
    setFilter,
    toggleForm,
    setEditSchool,
    handleCreateSchool,
    handleUpdateSchool,
    handleDeleteSchool,
    refetch,
  };
};
