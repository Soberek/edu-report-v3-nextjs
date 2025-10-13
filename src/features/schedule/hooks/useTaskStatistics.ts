import { useMemo } from "react";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import dayjs from "dayjs";

interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overallCompletionPercentage: number;
  yearToDateTasks: number;
  yearToDateCompleted: number;
  yearToDatePercentage: number;
  currentMonthTasks: number;
  currentMonthCompleted: number;
  currentMonthPercentage: number;
}

export const useTaskStatistics = (tasks: ScheduledTaskType[]): TaskStatistics => {
  return useMemo(() => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1; // 1-12

    // Basic statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const overallCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Year-to-date statistics
    const yearToDateTasks = tasks.filter((task) => {
      const taskDate = dayjs(task.dueDate);
      return taskDate.year() === currentYear && taskDate.month() + 1 <= currentMonth;
    });

    const yearToDateCompleted = yearToDateTasks.filter((task) => task.status === "completed").length;
    const yearToDatePercentage = yearToDateTasks.length > 0 ? Math.round((yearToDateCompleted / yearToDateTasks.length) * 100) : 0;

    // Current month statistics
    const currentMonthTasks = tasks.filter((task) => {
      const taskDate = dayjs(task.dueDate);
      return taskDate.year() === currentYear && taskDate.month() + 1 === currentMonth;
    });

    const currentMonthCompleted = currentMonthTasks.filter((task) => task.status === "completed").length;
    const currentMonthPercentage = currentMonthTasks.length > 0 ? Math.round((currentMonthCompleted / currentMonthTasks.length) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overallCompletionPercentage,
      yearToDateTasks: yearToDateTasks.length,
      yearToDateCompleted,
      yearToDatePercentage,
      currentMonthTasks: currentMonthTasks.length,
      currentMonthCompleted,
      currentMonthPercentage,
    };
  }, [tasks]);
};
