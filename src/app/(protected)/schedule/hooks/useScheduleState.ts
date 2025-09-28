import { useReducer, useCallback } from "react";
import { scheduleReducer, initialState } from "../reducers/scheduleReducer";
import type { ScheduleState, ScheduleAction } from "../types";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";

export const useScheduleState = () => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Task actions
  const setTasks = useCallback((tasks: ScheduledTaskType[]) => {
    dispatch({ type: "SET_TASKS", payload: tasks });
  }, []);

  const setPrograms = useCallback((programs: Program[]) => {
    dispatch({ type: "SET_PROGRAMS", payload: programs });
  }, []);

  const addTask = useCallback((task: ScheduledTaskType) => {
    dispatch({ type: "ADD_TASK", payload: task });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<ScheduledTaskType>) => {
    dispatch({ type: "UPDATE_TASK", payload: { id, updates } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  }, []);

  // Loading and error actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  // Filter actions
  const setFilters = useCallback((filters: Partial<typeof state.filters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  // Dialog actions
  const openEditDialog = useCallback((task: ScheduledTaskType) => {
    dispatch({ type: "OPEN_EDIT_DIALOG", payload: task });
  }, []);

  const closeEditDialog = useCallback(() => {
    dispatch({ type: "CLOSE_EDIT_DIALOG" });
  }, []);

  const openCreateDialog = useCallback(() => {
    dispatch({ type: "OPEN_CREATE_DIALOG" });
  }, []);

  const closeCreateDialog = useCallback(() => {
    dispatch({ type: "CLOSE_CREATE_DIALOG" });
  }, []);

  return {
    state,
    actions: {
      setTasks,
      setPrograms,
      addTask,
      updateTask,
      deleteTask,
      setLoading,
      setError,
      setFilters,
      resetFilters,
      openEditDialog,
      closeEditDialog,
      openCreateDialog,
      closeCreateDialog,
    },
  };
};
