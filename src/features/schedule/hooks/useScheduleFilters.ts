import { useMemo } from "react";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";
import { TASK_TYPES } from "@/constants/tasks";
import dayjs from "dayjs";

interface FilterState {
  programIds: string[];
  taskTypeId: string;
  month: string;
  status: string;
  search: string;
  year: string;
}

interface UseScheduleFiltersProps {
  tasks: ScheduledTaskType[];
  programs: Program[];
  filter: FilterState;
}

export const useScheduleFilters = ({ tasks, programs, filter }: UseScheduleFiltersProps) => {
  // Filter out health programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(
      (program) =>
        !program.name.toLowerCase().includes("zdrowie") &&
        !program.name.toLowerCase().includes("health") &&
        !program.name.toLowerCase().includes("medyczny") &&
        !program.name.toLowerCase().includes("medical")
    );
  }, [programs]);

  // Sort tasks by due date
  const sortedTasks = useMemo(
    () => tasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      // Program filter
      if (filter.programIds.length > 0 && !filter.programIds.includes(task.programId)) {
        return false;
      }

      // Task type filter
      if (filter.taskTypeId && task.taskTypeId !== filter.taskTypeId) {
        return false;
      }

      // Status filter
      if (filter.status && task.status !== filter.status) {
        return false;
      }

      const taskDate = dayjs(task.dueDate);

      // Year filter
      if (filter.year && taskDate.year().toString() !== filter.year) {
        return false;
      }

      // Month filter
      if (filter.month && taskDate.format("MMMM").toLowerCase() !== filter.month.toLowerCase()) {
        return false;
      }

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const taskType = Object.values(TASK_TYPES).find((type) => type.id === task.taskTypeId);
        const program = programs.find((p) => p.id === task.programId);
        const searchText = `${taskType?.label || ""} ${task.description || ""} ${program?.name || ""}`.toLowerCase();
        if (!searchText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [sortedTasks, filter, programs]);

  // Aggregate tasks by month and program
  const filteredData = useMemo(() => {
    return filteredTasks.reduce(
      (acc, task) => {
        const month = dayjs(task.dueDate).format("MMMM YYYY");
        const programId = task.programId;

        if (!acc[month]) {
          acc[month] = {};
        }
        if (!acc[month][programId]) {
          acc[month][programId] = [];
        }
        acc[month][programId].push(task);
        return acc;
      },
      {} as { [month: string]: { [programId: string]: ScheduledTaskType[] } }
    );
  }, [filteredTasks]);

  return {
    filteredPrograms,
    filteredTasks,
    filteredData,
  };
};
