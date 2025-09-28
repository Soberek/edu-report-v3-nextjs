import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";

export const calculateCompletionPercentage = (tasks: ScheduledTaskType[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completedTasks / tasks.length) * 100);
};

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
