import { useReducer, useCallback } from "react";
import { useOpenAIChat } from "@/hooks/useOpenAi";
import { holidaysReducer, initialHolidaysState } from "../reducers/holidaysReducer";
import { createHealthHolidaysPrompt, createPostsPrompt, parseHolidaysResponse, parsePostsResponse } from "../utils/aiUtils";
// import type { Holiday, EducationalHolidayWithQuery, Post } from "../types";

export const useHolidays = () => {
  const [state, dispatch] = useReducer(holidaysReducer, initialHolidaysState);
  const { loading: aiLoading, promptOpenAi } = useOpenAIChat();

  // Fetch holidays from API
  const fetchHolidays = useCallback(async (url: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const res = await fetch("/api/scrape-holidays", {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: "SET_HOLIDAYS", payload: data.holidays });
      } else {
        dispatch({ type: "SET_ERROR", payload: data.error || "Unknown error" });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Network error occurred" });
    }
  }, []);

  // Extract health-related holidays using OpenAI
  const extractHealthHolidays = useCallback(async () => {
    if (state.holidays.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "No holidays available to process" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const prompt = createHealthHolidaysPrompt(state.holidays);
      const result = await promptOpenAi(prompt, { response_format: { type: "json_object" } });

      console.log("OpenAI Raw Result:", result);

      const parsedHolidays = parseHolidaysResponse(result || "[]");
      console.log("Parsed Holidays from OpenAI:", parsedHolidays);

      dispatch({ type: "SET_SEPARATED_HOLIDAYS", payload: parsedHolidays });
    } catch (error) {
      console.error("Error extracting health holidays:", error);
      dispatch({ type: "SET_ERROR", payload: "Error extracting health holidays" });
    }
  }, [state.holidays, promptOpenAi]);

  // Generate social media posts using OpenAI
  const generatePosts = useCallback(async () => {
    if (state.separatedHolidaysFromOpenAi.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "No health holidays available to generate posts" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const prompt = createPostsPrompt(state.separatedHolidaysFromOpenAi);
      console.log("Sending prompt to OpenAI:", prompt);

      const result = await promptOpenAi(prompt, { response_format: { type: "json_object" } });
      console.log("Generated Posts from OpenAI:", result);

      const parsedPosts = parsePostsResponse(result || "[]");
      console.log("Validated Parsed Posts:", parsedPosts);

      dispatch({ type: "SET_POSTS", payload: parsedPosts });
    } catch (error) {
      console.error("Error generating posts:", error);
      dispatch({ type: "SET_ERROR", payload: "Error generating posts" });
    }
  }, [state.separatedHolidaysFromOpenAi, promptOpenAi]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: "" });
  }, []);

  return {
    state,
    aiLoading,
    fetchHolidays,
    extractHealthHolidays,
    generatePosts,
    resetState,
    clearError,
  };
};
