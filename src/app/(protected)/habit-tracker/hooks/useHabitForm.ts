import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { z } from "zod";
import { useApp } from "../context/AppContext";
import { Habit, habitSchema } from "../types";
import { useErrorHandler } from "./useErrorHandler";

export const useHabitForm = () => {
  const { state, dispatch } = useApp();
  const { handleError } = useErrorHandler();

  const form = useForm<Omit<Habit, "id" | "date" | "userId">>({
    defaultValues: state.todayHabits || {
      water: 0,
      sleep: 0,
      steps: 0,
      exercise: 0,
      meditation: 0,
      healthyMeals: 0,
      mood: "neutral",
      notes: "",
    },
  });

  const onSubmit = useCallback((data: Omit<Habit, "id" | "date" | "userId">) => {
    try {
      const parsedData = habitSchema.parse(data);
      const today = new Date().toISOString().split("T")[0];
      
      const habitEntry: Habit = {
        ...parsedData,
        date: today,
        id: state.todayHabits?.id || Date.now().toString(),
        userId: state.user!.uid,
      };

      let updatedHabits: Habit[];
      if (state.todayHabits) {
        updatedHabits = state.habits.map((h) => (h.id === habitEntry.id ? habitEntry : h));
        dispatch({ type: "UPDATE_HABIT", payload: habitEntry });
      } else {
        updatedHabits = [...state.habits, habitEntry];
        dispatch({ type: "ADD_HABIT", payload: habitEntry });
      }

      localStorage.setItem(`habits_${state.user!.email}`, JSON.stringify(updatedHabits));
      dispatch({ type: "SET_TODAY_HABITS", payload: habitEntry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleError(error, "Form validation failed");
      } else {
        handleError(error as Error, "Failed to save habit data");
      }
    }
  }, [state.todayHabits, state.habits, state.user, dispatch, handleError]);

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
