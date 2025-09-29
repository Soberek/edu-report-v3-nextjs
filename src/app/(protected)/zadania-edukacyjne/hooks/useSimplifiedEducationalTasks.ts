import React, { useReducer, useCallback } from "react";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";

// Simplified task interface
export interface SimplifiedEducationalTask {
  id: string;
  title: string;
  programName: string;
  date: string;
  schoolId: string;
  taskNumber: string;
  referenceNumber: string;
  activityType: string;
  activityTitle: string;
  activityDescription: string;
  audienceCount: number;
  materials?: string;
  mediaLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// Simplified form data interface
export interface SimplifiedTaskFormData {
  title: string;
  programName: string;
  date: string;
  schoolId: string;
  taskNumber: string;
  referenceNumber: string;
  activityType: string;
  activityTitle: string;
  activityDescription: string;
  audienceCount: number;
  materials?: string;
  mediaLink?: string;
}

// State interface
interface SimplifiedEducationalTasksState {
  loading: boolean;
  error: string | null;
  tasks: SimplifiedEducationalTask[];
}

// Action types
type SimplifiedEducationalTasksAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: SimplifiedEducationalTask[] }
  | { type: "ADD_TASK"; payload: SimplifiedEducationalTask }
  | { type: "UPDATE_TASK"; payload: SimplifiedEducationalTask }
  | { type: "DELETE_TASK"; payload: string };

// Initial state
const initialState: SimplifiedEducationalTasksState = {
  loading: false,
  error: null,
  tasks: [],
};

// Reducer
export const simplifiedEducationalTasksReducer = (
  state: SimplifiedEducationalTasksState,
  action: SimplifiedEducationalTasksAction
): SimplifiedEducationalTasksState => {
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

// Action creators
export const simplifiedActions = {
  setLoading: (loading: boolean): SimplifiedEducationalTasksAction => ({ type: "SET_LOADING", payload: loading }),
  setError: (error: string | null): SimplifiedEducationalTasksAction => ({ type: "SET_ERROR", payload: error }),
  setTasks: (tasks: SimplifiedEducationalTask[]): SimplifiedEducationalTasksAction => ({ type: "SET_TASKS", payload: tasks }),
  addTask: (task: SimplifiedEducationalTask): SimplifiedEducationalTasksAction => ({ type: "ADD_TASK", payload: task }),
  updateTask: (task: SimplifiedEducationalTask): SimplifiedEducationalTasksAction => ({ type: "UPDATE_TASK", payload: task }),
  deleteTask: (id: string): SimplifiedEducationalTasksAction => ({ type: "DELETE_TASK", payload: id }),
};

// Utility functions
export const simplifiedTaskUtils = {
  generateTaskId: (): string => `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,

  createTaskFromData: (taskData: SimplifiedTaskFormData, userId: string): SimplifiedEducationalTask => {
    // Clean undefined values
    const cleanTaskData = Object.fromEntries(Object.entries(taskData).filter(([, value]) => value !== undefined));

    return {
      ...cleanTaskData,
      id: simplifiedTaskUtils.generateTaskId(),
      createdBy: userId,
      createdAt: new Date().toISOString(),
    } as SimplifiedEducationalTask;
  },

  updateTaskFromData: (id: string, taskData: SimplifiedTaskFormData, userId: string): SimplifiedEducationalTask => {
    // Clean undefined values
    const cleanTaskData = Object.fromEntries(Object.entries(taskData).filter(([, value]) => value !== undefined));

    return {
      ...cleanTaskData,
      id,
      createdBy: userId,
      updatedAt: new Date().toISOString(),
      createdAt: "",
    } as SimplifiedEducationalTask;
  },

  getErrorMessage: (error: unknown, defaultMessage: string): string => {
    return error instanceof Error ? error.message : defaultMessage;
  },
};

// Custom hook for task operations
const useSimplifiedTaskOperations = (
  dispatch: React.Dispatch<SimplifiedEducationalTasksAction>,
  user: { uid: string } | null,
  createItem: (item: SimplifiedEducationalTask) => Promise<SimplifiedEducationalTask | null>,
  updateItem: (id: string, item: Partial<SimplifiedEducationalTask>) => Promise<boolean>,
  deleteItem: (id: string) => Promise<boolean>
) => {
  const createTask = useCallback(
    async (taskData: SimplifiedTaskFormData) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch(simplifiedActions.setError(error));
        throw new Error(error);
      }

      dispatch(simplifiedActions.setLoading(true));
      dispatch(simplifiedActions.setError(null));

      try {
        const newTask = simplifiedTaskUtils.createTaskFromData(taskData, user.uid);
        const savedTask = await createItem(newTask);

        if (savedTask) {
          dispatch(simplifiedActions.addTask(savedTask));
        }

        return savedTask;
      } catch (err) {
        const errorMessage = simplifiedTaskUtils.getErrorMessage(err, "Błąd podczas tworzenia zadania");
        dispatch(simplifiedActions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, createItem, dispatch]
  );

  const updateTask = useCallback(
    async (id: string, taskData: SimplifiedTaskFormData) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch(simplifiedActions.setError(error));
        throw new Error(error);
      }

      dispatch(simplifiedActions.setLoading(true));
      dispatch(simplifiedActions.setError(null));

      try {
        const updatedTask = simplifiedTaskUtils.updateTaskFromData(id, taskData, user.uid);
        const success = await updateItem(id, updatedTask);

        if (success) {
          dispatch(simplifiedActions.updateTask(updatedTask));
        }

        return updatedTask;
      } catch (err) {
        const errorMessage = simplifiedTaskUtils.getErrorMessage(err, "Błąd podczas aktualizacji zadania");
        dispatch(simplifiedActions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, updateItem, dispatch]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user?.uid) {
        const error = "Użytkownik nie jest zalogowany";
        dispatch(simplifiedActions.setError(error));
        throw new Error(error);
      }

      dispatch(simplifiedActions.setLoading(true));
      dispatch(simplifiedActions.setError(null));

      try {
        const success = await deleteItem(id);
        if (success) {
          dispatch(simplifiedActions.deleteTask(id));
        }
      } catch (err) {
        const errorMessage = simplifiedTaskUtils.getErrorMessage(err, "Błąd podczas usuwania zadania");
        dispatch(simplifiedActions.setError(errorMessage));
        throw err;
      }
    },
    [user?.uid, deleteItem, dispatch]
  );

  return { createTask, updateTask, deleteTask };
};

// Main hook
export const useSimplifiedEducationalTasks = () => {
  const { user } = useUser();
  const [state, dispatch] = useReducer(simplifiedEducationalTasksReducer, initialState);

  const {
    data: firebaseTasks,
    loading: dataLoading,
    refetch,
    createItem,
    updateItem,
    deleteItem,
  } = useFirebaseData<SimplifiedEducationalTask>("simplifiedEducationalTasks", user?.uid);

  // Update local state when Firebase data changes
  React.useEffect(() => {
    if (firebaseTasks) {
      dispatch(simplifiedActions.setTasks(firebaseTasks));
    }
  }, [firebaseTasks]);

  const { createTask, updateTask, deleteTask } = useSimplifiedTaskOperations(dispatch, user, createItem, updateItem, deleteItem);

  const clearError = useCallback(() => {
    dispatch(simplifiedActions.setError(null));
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
