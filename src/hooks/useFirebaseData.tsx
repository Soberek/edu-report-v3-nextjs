import { useReducer, useEffect, useCallback, useMemo } from "react";
import { FirebaseService } from "@/services/firebaseService";

interface State<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

type Action<T> =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATA"; payload: T[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: T }
  | { type: "UPDATE_ITEM"; payload: { id: string; updates: Partial<T> } }
  | { type: "DELETE_ITEM"; payload: string };

function reducer<T extends { id: string }>(state: State<T>, action: Action<T>): State<T> {
  console.log("Reducer action:", action);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_ITEM":
      return { ...state, data: [action.payload, ...state.data] };
    case "UPDATE_ITEM":
      return {
        ...state,
        data: state.data.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload.updates } : item)),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        data: state.data.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export function useFirebaseData<T extends { id: string }>(collectionName: string, userId?: string) {
  const [state, dispatch] = useReducer(reducer<T>, {
    data: [],
    loading: true,
    error: null,
  });

  const service = useMemo(() => new FirebaseService<T>(collectionName), [collectionName]);

  const fetchData = useCallback(async () => {
    if (!userId) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_DATA", payload: [] });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const result = await service.getDocumentsByUserId(userId);
      dispatch({ type: "SET_DATA", payload: result });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Failed to fetch data",
      });
    }
  }, [userId, service]);

  const createItem = useCallback(
    async (itemData: Omit<T, "id" | "createdAt" | "updatedAt" | "userId">) => {
      if (!userId) return null;

      try {
        const newId = await service.createDocument(userId, itemData);
        const newItem = {
          ...itemData,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
        } as unknown as T;

        // Refetch żeby mieć świeże dane z bazy
        await fetchData();

        return newItem;
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: err instanceof Error ? err.message : "Failed to create item",
        });
        return null;
      }
    },
    [userId, service, fetchData]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<T>) => {
      try {
        await service.updateDocument(id, updates);
        // Refetch żeby mieć świeże dane z bazy
        await fetchData();
        return true;
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: err instanceof Error ? err.message : "Failed to update item",
        });
        return false;
      }
    },
    [service, fetchData]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await service.deleteDocument(id);
        // Refetch żeby mieć świeże dane z bazy
        await fetchData();
        return true;
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: err instanceof Error ? err.message : "Failed to delete item",
        });
        return false;
      }
    },
    [service, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
}
