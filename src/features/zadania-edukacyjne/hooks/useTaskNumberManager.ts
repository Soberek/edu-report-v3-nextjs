import { useState, useCallback, useMemo } from "react";
import type { EducationalTask } from "@/types";
import {
  validateTaskNumber,
  suggestNextTaskNumber,
  generateTaskNumberSuggestions,
  getCurrentYear,
  isValidTaskNumberFormat,
  parseTaskNumber,
} from "../utils/taskNumberUtils";

interface UseTaskNumberManagerProps {
  tasks: EducationalTask[];
  editTaskId?: string; // For editing existing tasks
  initialYear?: number;
  currentTaskNumber: string; // Current value from form
}

interface TaskNumberManager {
  isValid: boolean;
  errorMessage?: string;
  suggestions: string[];
  year: number;

  // Actions (no setState methods)
  getNextSuggestion: () => string;
  validateNumber: (taskNumber: string) => { isValid: boolean; errorMessage?: string };
}

export const useTaskNumberManager = ({
  tasks,
  editTaskId,
  initialYear = getCurrentYear(),
  currentTaskNumber,
}: UseTaskNumberManagerProps): TaskNumberManager => {
  const [year] = useState(() => {
    // Extract year from currentTaskNumber or use initialYear
    const parsed = parseTaskNumber(currentTaskNumber);
    return parsed?.year || initialYear;
  });

  // Generate suggestions based on current year and tasks
  const suggestions = useMemo(() => {
    return generateTaskNumberSuggestions(tasks, year, editTaskId, 5);
  }, [tasks, year, editTaskId]);

  // Validate current task number
  const validation = useMemo(() => {
    if (!currentTaskNumber.trim()) {
      return { isValid: false, errorMessage: "Numer zadania jest wymagany" };
    }

    if (!isValidTaskNumberFormat(currentTaskNumber)) {
      return { isValid: false, errorMessage: "Numer zadania musi mieć format: liczba/rok (np. 45/2025)" };
    }

    return validateTaskNumber(currentTaskNumber, tasks, editTaskId);
  }, [currentTaskNumber, tasks, editTaskId]);

  const isValid = validation.isValid;
  const errorMessage = validation.errorMessage;

  // Static validation function that takes taskNumber as parameter
  const validateNumber = useCallback(
    (taskNumber: string) => {
      if (!taskNumber.trim()) {
        return { isValid: false, errorMessage: "Numer zadania jest wymagany" };
      }

      if (!isValidTaskNumberFormat(taskNumber)) {
        return { isValid: false, errorMessage: "Numer zadania musi mieć format: liczba/rok (np. 45/2025)" };
      }

      return validateTaskNumber(taskNumber, tasks, editTaskId);
    },
    [tasks, editTaskId]
  );

  const getNextSuggestion = useCallback(() => {
    return suggestNextTaskNumber(tasks, year, editTaskId);
  }, [tasks, year, editTaskId]);

  return {
    isValid,
    errorMessage,
    suggestions,
    year,

    getNextSuggestion,
    validateNumber,
  };
};
