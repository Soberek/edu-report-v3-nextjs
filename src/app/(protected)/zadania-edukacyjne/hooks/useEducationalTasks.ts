import React, { useReducer, useCallback } from "react";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import { EducationalTask, CreateEducationalTaskFormData } from "@/types";

// State interface
interface EducationalTasksState {
  loading: boolean;
  error: string | null;
  tasks: EducationalTask[];
}

// Action types
type EducationalTasksAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: EducationalTask[] }
  | { type: "ADD_TASK"; payload: EducationalTask }
  | { type: "UPDATE_TASK"; payload: EducationalTask }
  | { type: "DELETE_TASK"; payload: string };

// Initial state
const initialState: EducationalTasksState = {
  loading: false,
  error: null,
  tasks: [],
};

// Reducer
const educationalTasksReducer = (state: EducationalTasksState, action: EducationalTasksAction): EducationalTasksState => {
  console.log("Educational tasks reducer action:", action);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
        loading: false,
        error: null,
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const useEducationalTasks = () => {
  const { user } = useUser();
  const [state, dispatch] = useReducer(educationalTasksReducer, initialState);

  const {
    data: firebaseTasks,
    loading: dataLoading,
    refetch,
    createItem,
    updateItem,
    deleteItem,
  } = useFirebaseData<EducationalTask>("educationalTasks", user?.uid);

  // Update local state when Firebase data changes
  React.useEffect(() => {
    if (firebaseTasks) {
      dispatch({ type: "SET_TASKS", payload: firebaseTasks });
    }
  }, [firebaseTasks]);

  const createTask = useCallback(
    async (taskData: CreateEducationalTaskFormData) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch({ type: "SET_ERROR", payload: error });
        throw new Error(error);
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const newTask: EducationalTask = {
          ...taskData,
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          createdBy: user.uid,
          createdAt: new Date().toISOString(),
        };

        // Save to Firebase
        const savedTask = await createItem(newTask);

        // Add task to local state
        if (savedTask) {
          dispatch({ type: "ADD_TASK", payload: savedTask });
        }

        return savedTask;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Błąd podczas tworzenia zadania";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw err;
      }
    },
    [user?.uid, createItem]
  );

  const updateTask = useCallback(
    async (id: string, taskData: CreateEducationalTaskFormData) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch({ type: "SET_ERROR", payload: error });
        throw new Error(error);
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const updatedTask: EducationalTask = {
          ...taskData,
          id,
          createdBy: user.uid,
          updatedAt: new Date().toISOString(),
          createdAt: "",
        };

        // Update in Firebase
        const success = await updateItem(id, updatedTask);

        // Update task in local state
        if (success) {
          dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        }

        return updatedTask;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Błąd podczas aktualizacji zadania";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw err;
      }
    },
    [user?.uid, updateItem]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch({ type: "SET_ERROR", payload: error });
        throw new Error(error);
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Delete from Firebase
        await deleteItem(id);

        // Remove task from local state
        dispatch({ type: "DELETE_TASK", payload: id });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Błąd podczas usuwania zadania";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw err;
      }
    },
    [user?.uid, deleteItem]
  );

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  return {
    tasks: state.tasks,
    loading: state.loading || dataLoading,
    error: state.error,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    refetch,
  };
};
