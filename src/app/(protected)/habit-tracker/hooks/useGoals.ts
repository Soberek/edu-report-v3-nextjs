import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useApp } from "../context/AppContext";
import { Goals } from "../types";
import { useErrorHandler } from "./useErrorHandler";

export const useGoals = () => {
  const { state, dispatch } = useApp();
  const { handleError } = useErrorHandler();

  const form = useForm<Goals>({
    defaultValues: state.goals,
  });

  const onSubmit = useCallback(
    (data: Goals) => {
      try {
        dispatch({ type: "UPDATE_GOALS", payload: data });
        localStorage.setItem(`goals_${state.user!.email}`, JSON.stringify(data));
      } catch (error) {
        handleError(error as Error, "Failed to save goals");
      }
    },
    [state.user, dispatch, handleError]
  );

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
