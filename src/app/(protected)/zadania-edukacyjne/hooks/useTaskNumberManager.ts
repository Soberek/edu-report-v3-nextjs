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
}

interface TaskNumberManager {
  currentTaskNumber: string;
  isValid: boolean;
  errorMessage?: string;
  suggestions: string[];
  year: number;

  // Actions
  setTaskNumber: (taskNumber: string) => void;
  setYear: (year: number) => void;
  generateSuggestions: () => void;
  getNextSuggestion: () => string;
  validateCurrentNumber: () => void;
  clearError: () => void;
}

export const useTaskNumberManager = ({
  tasks,
  editTaskId,
  initialYear = getCurrentYear(),
}: UseTaskNumberManagerProps): TaskNumberManager => {
  const [year, setYear] = useState(initialYear);
  const [currentTaskNumber, setCurrentTaskNumber] = useState(() =>
    editTaskId ? tasks.find((t) => t.id === editTaskId)?.referenceNumber || "" : `${year}`
  );

  const [validationError, setValidationError] = useState<string>("");

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

  const isValid = validation.isValid && !validationError;
  const errorMessage = validationError || validation.errorMessage;

  const handleSetTaskNumber = useCallback(
    (taskNumber: string) => {
      setCurrentTaskNumber(taskNumber);
      setValidationError("");

      // If the task number has a different year, update the year
      const parsed = parseTaskNumber(taskNumber);
      if (parsed && parsed.year !== year) {
        setYear(parsed.year);
      }
    },
    [year]
  );

  const handleSetYear = useCallback(
    (newYear: number) => {
      setYear(newYear);
      setValidationError("");

      // Generate new task number with updated year
      if (year !== newYear && currentTaskNumber.includes("/")) {
        const [numberPart] = currentTaskNumber.split("/");
        const number = parseInt(numberPart, 10);
        if (!isNaN(number)) {
          setCurrentTaskNumber(`${number}/${newYear}`);
        }
      }
    },
    [currentTaskNumber, year]
  );

  const generateSuggestions = useCallback(() => {
    // This will trigger the useMemo to recalculate suggestions
  }, []);

  const getNextSuggestion = useCallback(() => {
    return suggestNextTaskNumber(tasks, year, editTaskId);
  }, [tasks, year, editTaskId]);

  const validateCurrentNumber = useCallback(() => {
    const result = validateTaskNumber(currentTaskNumber, tasks, editTaskId);
    setValidationError(result.errorMessage || "");
  }, [currentTaskNumber, tasks, editTaskId]);

  const clearError = useCallback(() => {
    setValidationError("");
  }, []);

  return {
    currentTaskNumber,
    isValid,
    errorMessage,
    suggestions,
    year,

    setTaskNumber: handleSetTaskNumber,
    setYear: handleSetYear,
    generateSuggestions,
    getNextSuggestion,
    validateCurrentNumber,
    clearError,
  };
};
