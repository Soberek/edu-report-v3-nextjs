import { useEffect, useReducer } from "react";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "../types/index";
import {
  getParticipationsBySchool,
  getAllUserParticipations,
  addParticipation,
  deleteParticipation,
  updateParticipation,
} from "../services/schoolProgramParticipationService";
import { useUser } from "./useUser";

interface State {
  participations: SchoolProgramParticipation[];
  loading: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PARTICIPATIONS"; payload: SchoolProgramParticipation[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "DELETE_PARTICIPATION"; payload: string }
  | {
      type: "UPDATE_PARTICIPATION";
      payload: { id: string; data: Partial<SchoolProgramParticipation> };
    }
  | { type: "ADD_PARTICIPATION"; payload: SchoolProgramParticipation };

const initialState: State = {
  participations: [],
  loading: true,
  errorMessage: null,
  isSubmitting: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PARTICIPATIONS":
      return { ...state, participations: action.payload };
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "DELETE_PARTICIPATION":
      return {
        ...state,
        participations: state.participations.filter((p) => p.id !== action.payload),
      };
    case "UPDATE_PARTICIPATION":
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
    case "ADD_PARTICIPATION":
      return {
        ...state,
        participations: [action.payload, ...state.participations],
      };
    default:
      return state;
  }
};

export const useSchoolProgramParticipation = (schoolId?: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userContext = useUser();
  const userId = userContext.user?.uid;

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        let data: SchoolProgramParticipation[] = [];
        if (schoolId) {
          data = await getParticipationsBySchool(schoolId);
        } else if (userId) {
          data = await getAllUserParticipations(userId);
        }
        dispatch({ type: "SET_PARTICIPATIONS", payload: data });
        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to fetch participations.",
        });
        console.error("Failed to fetch participations:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchParticipations();
  }, [schoolId, userId]);

  const handleParticipationDelete = async (participationId: string) => {
    try {
      await deleteParticipation(participationId);
      dispatch({ type: "DELETE_PARTICIPATION", payload: participationId });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to delete participation.",
      });
      console.error("Failed to delete participation:", error);
    }
  };

  const handleParticipationUpdate = async (
    participationId: string,
    updatedData: Partial<SchoolProgramParticipation>
  ) => {
    try {
      await updateParticipation(participationId, updatedData);
      dispatch({
        type: "UPDATE_PARTICIPATION",
        payload: { id: participationId, data: updatedData },
      });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update participation.",
      });
      console.error("Failed to update participation:", error);
    }
  };

  const handleParticipationSubmit = async (participation: SchoolProgramParticipationDTO) => {
    try {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      if (userId) {
        const createdAt = new Date().toISOString();
        const newParticipationId = await addParticipation({
          ...participation,
          userId,
          createdAt,
        });
        if (newParticipationId) {
          dispatch({
            type: "ADD_PARTICIPATION",
            payload: {
              ...participation,
              id: newParticipationId,
              userId,
              createdAt,
            },
          });
        }
        dispatch({ type: "SET_ERROR", payload: null });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add participation." });
      console.error("Failed to add participation:", error);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return {
    participations: state.participations,
    loading: state.loading,
    errorMessage: state.errorMessage,
    isSubmitting: state.isSubmitting,
    handleParticipationDelete,
    handleParticipationUpdate,
    handleParticipationSubmit,
  };
};
