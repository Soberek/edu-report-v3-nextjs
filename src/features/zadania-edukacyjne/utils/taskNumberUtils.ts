import type { EducationalTask } from "@/types";

/**
 * Validates if a task number follows the correct format (number/year)
 * @param taskNumber - The task number to validate (e.g., "45/2025")
 * @returns boolean indicating if the format is valid
 */
export const isValidTaskNumberFormat = (taskNumber: string): boolean => {
  const pattern = /^\d+\/\d{4}$/;
  return pattern.test(taskNumber);
};

/**
 * Parses a task number into its components
 * @param taskNumber - The task number (e.g., "45/2025")
 * @returns Object with number and year, or null if invalid
 */
export const parseTaskNumber = (taskNumber: string): { number: number; year: number } | null => {
  if (!isValidTaskNumberFormat(taskNumber)) {
    return null;
  }

  const [numberStr, yearStr] = taskNumber.split("/");
  return {
    number: parseInt(numberStr, 10),
    year: parseInt(yearStr, 10),
  };
};

/**
 * Generates a task number from its components
 * @param number - The task number
 * @param year - The year
 * @returns Formatted task number string
 */
export const generateTaskNumber = (number: number, year: number): string => {
  return `${number}/${year}`;
};

/**
 * Gets all task numbers for a specific year
 * @param tasks - Array of educational tasks
 * @param year - Year to filter by
 * @returns Array of task numbers for the year
 */
export const getTaskNumbersForYear = (tasks: EducationalTask[], year: number): number[] => {
  return tasks
    .map((task) => parseTaskNumber(task.taskNumber))
    .filter(Boolean)
    .filter((parsed) => parsed!.year === year)
    .map((parsed) => parsed!.number)
    .sort((a, b) => a - b);
};

/**
 * Gets all used task numbers for a specific year
 * @param tasks - Array of educational tasks
 * @param year - Year to filter by
 * @param excludeTaskId - Task ID to exclude from the list (for editing)
 * @returns Array of used task numbers
 */
export const getUsedTaskNumbers = (tasks: EducationalTask[], year: number, excludeTaskId?: string): Set<number> => {
  return new Set(
    tasks
      .filter((task) => !excludeTaskId || task.id !== excludeTaskId)
      .map((task) => parseTaskNumber(task.taskNumber))
      .filter(Boolean)
      .filter((parsed) => parsed!.year === year)
      .map((parsed) => parsed!.number)
  );
};

/**
 * Suggests the next available task number for a given year
 * @param tasks - Array of educational tasks
 * @param year - Year to suggest number for
 * @param excludeTaskId - Task ID to exclude (for editing)
 * @returns Next suggested task number
 */
export const suggestNextTaskNumber = (tasks: EducationalTask[], year: number, excludeTaskId?: string): string => {
  const usedNumbers = getUsedTaskNumbers(tasks, year, excludeTaskId);

  // Find the first available number starting from 1
  let suggestedNumber = 1;
  while (usedNumbers.has(suggestedNumber)) {
    suggestedNumber++;
  }

  return generateTaskNumber(suggestedNumber, year);
};

/**
 * Checks if a task number is already in use
 * @param tasks - Array of educational tasks
 * @param taskNumber - Task number to check
 * @param excludeTaskId - Task ID to exclude (for editing)
 * @returns boolean indicating if the number is taken
 */
export const isTaskNumberTaken = (tasks: EducationalTask[], taskNumber: string, excludeTaskId?: string): boolean => {
  const parsed = parseTaskNumber(taskNumber);
  if (!parsed) {
    return false; // Invalid format, so not "taken"
  }

  const usedNumbers = getUsedTaskNumbers(tasks, parsed.year, excludeTaskId);
  return usedNumbers.has(parsed.number);
};

/**
 * Gets the current year (used for default task number generation)
 * @returns Current year as number
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Validates task number with custom error message for Polish UI
 * @param taskNumber - Task number to validate
 * @param tasks - Array of existing tasks
 * @param excludeTaskId - Task ID to exclude (for editing)
 * @returns Validation result with Polish error messages
 */
export const validateTaskNumber = (
  taskNumber: string,
  tasks: EducationalTask[],
  excludeTaskId?: string
): { isValid: boolean; errorMessage?: string } => {
  // Check format
  if (!taskNumber.trim()) {
    return { isValid: false, errorMessage: "Numer zadania jest wymagany" };
  }

  if (!isValidTaskNumberFormat(taskNumber)) {
    return { isValid: false, errorMessage: "Numer zadania musi mieć format: liczba/rok (np. 45/2025)" };
  }

  // Check if number is taken
  if (isTaskNumberTaken(tasks, taskNumber, excludeTaskId)) {
    return { isValid: false, errorMessage: "Ten numer zadania jest już zajęty" };
  }

  return { isValid: true };
};

/**
 * Generates multiple suggested task numbers for display
 * @param tasks - Array of educational tasks
 * @param year - Year to generate suggestions for
 * @param excludeTaskId - Task ID to exclude (for editing)
 * @param count - Number of suggestions to generate
 * @returns Array of suggested task numbers
 */
export const generateTaskNumberSuggestions = (
  tasks: EducationalTask[],
  year: number,
  excludeTaskId?: string,
  count: number = 5
): string[] => {
  const usedNumbers = getUsedTaskNumbers(tasks, year, excludeTaskId);
  const suggestions: string[] = [];
  let currentNumber = 1;

  while (suggestions.length < count) {
    if (!usedNumbers.has(currentNumber)) {
      suggestions.push(generateTaskNumber(currentNumber, year));
    }
    currentNumber++;
  }

  return suggestions;
};
