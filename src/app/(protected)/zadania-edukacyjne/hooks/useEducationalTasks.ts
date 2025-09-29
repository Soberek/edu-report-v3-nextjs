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
export const educationalTasksReducer = (state: EducationalTasksState, action: EducationalTasksAction): EducationalTasksState => {
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

// Action creators for better testability
export const actions = {
  setLoading: (loading: boolean): EducationalTasksAction => ({ type: "SET_LOADING", payload: loading }),
  setError: (error: string | null): EducationalTasksAction => ({ type: "SET_ERROR", payload: error }),
  setTasks: (tasks: EducationalTask[]): EducationalTasksAction => ({ type: "SET_TASKS", payload: tasks }),
  addTask: (task: EducationalTask): EducationalTasksAction => ({ type: "ADD_TASK", payload: task }),
  updateTask: (task: EducationalTask): EducationalTasksAction => ({ type: "UPDATE_TASK", payload: task }),
  deleteTask: (id: string): EducationalTasksAction => ({ type: "DELETE_TASK", payload: id }),
};

// Utility functions for better testability
export const taskUtils = {
  generateTaskId: (): string => `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  createTaskFromData: (taskData: CreateEducationalTaskFormData, userId: string): EducationalTask => {
    // Deep clean undefined values to prevent Firebase errors
    const deepClean = (obj: any): any => {
      if (obj === null || obj === undefined) return null;
      if (Array.isArray(obj)) {
        return obj.map(deepClean).filter((item) => item !== null && item !== undefined);
      }
      if (typeof obj === "object") {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            const cleanedValue = deepClean(value);
            if (cleanedValue !== null && cleanedValue !== undefined) {
              cleaned[key] = cleanedValue;
            }
          }
        }
        return cleaned;
      }
      return obj;
    };

    const cleanedTaskData = deepClean(taskData);

    return {
      ...cleanedTaskData,
      id: taskUtils.generateTaskId(),
      createdBy: userId,
      createdAt: new Date().toISOString(),
    } as EducationalTask;
  },
  updateTaskFromData: (id: string, taskData: CreateEducationalTaskFormData, userId: string): EducationalTask => {
    // Deep clean undefined values to prevent Firebase errors
    const deepClean = (obj: any): any => {
      if (obj === null || obj === undefined) return null;
      if (Array.isArray(obj)) {
        return obj.map(deepClean).filter((item) => item !== null && item !== undefined);
      }
      if (typeof obj === "object") {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            const cleanedValue = deepClean(value);
            if (cleanedValue !== null && cleanedValue !== undefined) {
              cleaned[key] = cleanedValue;
            }
          }
        }
        return cleaned;
      }
      return obj;
    };

    const cleanedTaskData = deepClean(taskData);

    return {
      ...cleanedTaskData,
      id,
      createdBy: userId,
      updatedAt: new Date().toISOString(),
      createdAt: "",
    } as EducationalTask;
  },
  getErrorMessage: (error: unknown, defaultMessage: string): string => {
    return error instanceof Error ? error.message : defaultMessage;
  },
};

// Custom hook for task operations
const useTaskOperations = (
  dispatch: React.Dispatch<EducationalTasksAction>,
  user: any,
  createItem: (item: EducationalTask) => Promise<EducationalTask | null>,
  updateItem: (id: string, item: Partial<EducationalTask>) => Promise<boolean>,
  deleteItem: (id: string) => Promise<boolean>
) => {
  const createTask = useCallback(
    async (taskData: CreateEducationalTaskFormData) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch(actions.setError(error));
        throw new Error(error);
      }

      dispatch(actions.setLoading(true));
      dispatch(actions.setError(null));

      try {
        const newTask = taskUtils.createTaskFromData(taskData, user.uid);
        const savedTask = await createItem(newTask);

        if (savedTask) {
          dispatch(actions.addTask(savedTask));
        }

        return savedTask;
      } catch (err) {
        const errorMessage = taskUtils.getErrorMessage(err, "Błąd podczas tworzenia zadania");
        dispatch(actions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, createItem, dispatch]
  );

  const updateTask = useCallback(
    async (id: string, taskData: CreateEducationalTaskFormData) => {
      console.log("🔄 updateTask called with:", { id, taskData });

      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        console.error("❌ User not logged in");
        dispatch(actions.setError(error));
        throw new Error(error);
      }

      dispatch(actions.setLoading(true));
      dispatch(actions.setError(null));

      try {
        const updatedTask = taskUtils.updateTaskFromData(id, taskData, user.uid);
        console.log("📝 Updated task data:", updatedTask);

        // Check for undefined values in activities
        if (updatedTask.activities) {
          updatedTask.activities.forEach((activity, index) => {
            console.log(`🎯 Activity ${index}:`, {
              type: activity.type,
              materials: "materials" in activity ? activity.materials : undefined,
              media: "media" in activity ? activity.media : undefined,
              hasUndefinedValues: Object.entries(activity).some(([key, value]) => value === undefined),
            });
          });
        }

        const success = await updateItem(id, updatedTask);
        console.log("✅ Update success:", success);

        if (success) {
          dispatch(actions.updateTask(updatedTask));
        }

        return updatedTask;
      } catch (err) {
        console.error("❌ Update error:", err);
        const errorMessage = taskUtils.getErrorMessage(err, "Błąd podczas aktualizacji zadania");
        dispatch(actions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, updateItem, dispatch]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch(actions.setError(error));
        throw new Error(error);
      }

      dispatch(actions.setLoading(true));
      dispatch(actions.setError(null));

      try {
        const success = await deleteItem(id);
        if (success) {
          dispatch(actions.deleteTask(id));
        }
      } catch (err) {
        const errorMessage = taskUtils.getErrorMessage(err, "Błąd podczas usuwania zadania");
        dispatch(actions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, deleteItem, dispatch]
  );

  return { createTask, updateTask, deleteTask };
};

// Main hook
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
      dispatch(actions.setTasks(firebaseTasks));
    }
  }, [firebaseTasks]);

  const { createTask, updateTask, deleteTask } = useTaskOperations(dispatch, user, createItem, updateItem, deleteItem);

  const clearError = useCallback(() => {
    dispatch(actions.setError(null));
  }, [dispatch]);

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
