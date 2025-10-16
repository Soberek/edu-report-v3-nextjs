import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";

/**
 * Calculate the completion percentage of tasks
 * @param tasks Array of scheduled tasks
 * @returns Percentage of completed tasks (0-100), rounded to nearest integer
 * @example
 * const tasks = [
 *   { status: "completed" },
 *   { status: "pending" },
 *   { status: "completed" }
 * ];
 * calculateCompletionPercentage(tasks) // 66
 */
export const calculateCompletionPercentage = (tasks: ScheduledTaskType[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Convert English month name to Polish localization
 * @param month Month name in English (lowercase)
 * @returns Polish month name or original value if not found
 * @example
 * localizeMonth("january") // "Styczeń"
 * localizeMonth("december") // "Grudzień"
 */
export const localizeMonth = (month: string): string => {
  const months: { [key: string]: string } = {
    january: "Styczeń",
    february: "Luty",
    march: "Marzec",
    april: "Kwiecień",
    may: "Maj",
    june: "Czerwiec",
    july: "Lipiec",
    august: "Sierpień",
    september: "Wrzesień",
    october: "Październik",
    november: "Listopad",
    december: "Grudzień",
  };

  return months[month] || month;
};

/**
 * Extract unique years from tasks sorted in descending order
 * @param tasks Array of scheduled tasks with dueDate property
 * @returns Array of unique year strings sorted from newest to oldest
 * @example
 * const tasks = [
 *   { dueDate: "2024-10-15" },
 *   { dueDate: "2023-05-20" },
 *   { dueDate: "2024-03-10" }
 * ];
 * getYears(tasks) // ["2024", "2023"]
 */
export const getYears = (tasks: ScheduledTaskType[]): string[] => {
  if (!tasks) return [];
  const years = new Set<string>();
  tasks.forEach((task) => {
    years.add(new Date(task.dueDate).getFullYear().toString());
  });
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
};

/**
 * Get mapping of English month names to Polish localized names
 * @returns Object with month keys (january-december) and Polish names as values
 * @example
 * const months = getMonths();
 * console.log(months.january) // "Styczeń"
 * console.log(months.december) // "Grudzień"
 */
export const getMonths = (): { [key: string]: string } => ({
  january: "Styczeń",
  february: "Luty",
  march: "Marzec",
  april: "Kwiecień",
  may: "Maj",
  june: "Czerwiec",
  july: "Lipiec",
  august: "Sierpień",
  september: "Wrzesień",
  october: "Październik",
  november: "Listopad",
  december: "Grudzień",
});