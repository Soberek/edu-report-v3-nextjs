import type { EducationalTask } from "@/types";
import type { EducationalTasksFilters, TaskGroup, FilterOptions, FilteredTasksResult } from "../types";
import { MONTH_NAMES } from "../types";

/**
 * Filters tasks based on provided filters
 */
export const filterTasks = (
  tasks: readonly EducationalTask[],
  filters: EducationalTasksFilters
): EducationalTask[] => {
  return tasks.filter((task) => {
    const taskDate = new Date(task.date);
    const taskYear = taskDate.getFullYear().toString();
    const taskMonth = (taskDate.getMonth() + 1).toString();

    return (
      (!filters.year || taskYear === filters.year) &&
      (!filters.month || taskMonth === filters.month) &&
      (!filters.program || task.programName === filters.program) &&
      (!filters.activityType || task.activities.some((a) => a.type === filters.activityType))
    );
  });
};

/**
 * Groups tasks by year and month
 */
export const groupTasksByMonth = (tasks: readonly EducationalTask[]): TaskGroup[] => {
  const grouped = tasks.reduce((acc, task) => {
    const taskDate = new Date(task.date);
    const year = taskDate.getFullYear();
    const month = taskDate.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!acc[key]) {
      acc[key] = {
        year,
        month,
        tasks: [],
      };
    }
    acc[key].tasks.push(task);
    return acc;
  }, {} as Record<string, { year: number; month: number; tasks: EducationalTask[] }>);

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, value]) => ({ key, ...value }));
};

/**
 * Extracts filter options from tasks
 */
export const extractFilterOptions = (tasks: readonly EducationalTask[]): FilterOptions => {
  const years = [...new Set(tasks.map((t) => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
  const programs = [...new Set(tasks.map((t) => t.programName))].sort();
  const activityTypes = [...new Set(tasks.flatMap((t) => t.activities.map((a) => a.type)))].sort();

  return { years, programs, activityTypes };
};

/**
 * Applies filters and grouping to tasks
 */
export const applyFiltersAndGrouping = (
  tasks: readonly EducationalTask[],
  filters: EducationalTasksFilters
): FilteredTasksResult => {
  const filteredTasks = filterTasks(tasks, filters);
  const groupedTasks = groupTasksByMonth(filteredTasks);
  const filterOptions = extractFilterOptions(tasks);

  return {
    filteredTasks,
    groupedTasks,
    filterOptions,
  };
};

/**
 * Gets month name by index (0-11)
 */
export const getMonthName = (monthIndex: number): string => {
  return MONTH_NAMES[monthIndex] || "Nieznany miesiąc";
};

/**
 * Formats task date for display
 */
export const formatTaskDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Gets task count text for display
 */
export const getTaskCountText = (count: number): string => {
  if (count === 0) return "Brak zadań";
  if (count === 1) return "1 zadanie";
  if (count < 5) return `${count} zadania`;
  return `${count} zadań`;
};

/**
 * Creates task key for grouping
 */
export const createTaskKey = (year: number, month: number): string => {
  return `${year}-${month.toString().padStart(2, "0")}`;
};

/**
 * Parses task key back to year and month
 */
export const parseTaskKey = (key: string): { year: number; month: number } => {
  const [year, month] = key.split("-").map(Number);
  return { year, month };
};

/**
 * Validates filter values
 */
export const isValidFilterValue = (value: string): boolean => {
  return value === "" || value.trim().length > 0;
};

/**
 * Sanitizes filter value
 */
export const sanitizeFilterValue = (value: string): string => {
  return value.trim();
};

/**
 * Creates default filter state
 */
export const createDefaultFilters = (): EducationalTasksFilters => ({
  year: "",
  month: "",
  program: "",
  activityType: "",
});

/**
 * Checks if any filters are active
 */
export const hasActiveFilters = (filters: EducationalTasksFilters): boolean => {
  return Object.values(filters).some((value) => value.trim() !== "");
};

/**
 * Gets active filter count
 */
export const getActiveFilterCount = (filters: EducationalTasksFilters): number => {
  return Object.values(filters).filter((value) => value.trim() !== "").length;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Truncates text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
