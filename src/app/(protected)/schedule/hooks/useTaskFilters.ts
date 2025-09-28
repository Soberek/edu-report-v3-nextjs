import { useMemo } from "react";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";
import type { FilterFormData } from "../schemas/taskSchemas";
import { TASK_TYPES } from "@/constants/tasks";
import dayjs from "dayjs";

interface UseTaskFiltersProps {
  tasks: ScheduledTaskType[];
  programs: Program[];
  filters: FilterFormData;
}

export const useTaskFilters = ({ tasks, programs, filters }: UseTaskFiltersProps) => {
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

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      // Program filter
      if (filters.programIds.length > 0 && !filters.programIds.includes(task.programId)) {
        return false;
      }

      // Task type filter
      if (filters.taskTypeId && task.taskTypeId !== filters.taskTypeId) {
        return false;
      }

      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Month filter
      if (filters.month) {
        const taskMonth = dayjs(task.dueDate).format("MMMM YYYY");
        if (!taskMonth.toLowerCase().includes(filters.month.toLowerCase())) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const taskType = Object.values(TASK_TYPES).find((type) => type.id === task.taskTypeId);
        const program = programs.find((p) => p.id === task.programId);
        const searchText = `${taskType?.label || ""} ${task.description || ""} ${program?.name || ""}`.toLowerCase();
        if (!searchText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [sortedTasks, filters, programs]);

  // Aggregate tasks by month and program
  const aggregatedTasks = useMemo(() => {
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
    aggregatedTasks,
  };
};
