import { Habit } from "../types";

export const calculateProgress = (value: number, goal: number): number => {
  return Math.min((value / goal) * 100, 100);
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getMoodEmoji = (mood: Habit["mood"]): string => {
  const moods: Record<Habit["mood"], string> = {
    excellent: "😄",
    good: "😊",
    neutral: "😐",
    bad: "😔",
    terrible: "😢",
  };
  return moods[mood] || "😐";
};

export const getMoodLabel = (mood: Habit["mood"]): string => {
  const labels: Record<Habit["mood"], string> = {
    excellent: "Świetnie",
    good: "Dobrze",
    neutral: "Neutralnie",
    bad: "Słabo",
    terrible: "Źle",
  };
  return labels[mood] || "Neutralnie";
};
