import { useMemo } from "react";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";
import { TASK_TYPES } from "@/constants/tasks";

interface FilterState {
  programIds: string[];
  taskTypeId: string;
  month: string;
  status: string;
  search: string;
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

  // Aggregate tasks by month and program
  const aggregateByMonthAndThenByProgram = useMemo(
    () =>
      sortedTasks.reduce(
        (acc, task) => {
          const month = new Date(task.dueDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
        {} as {
          [month: string]: { [programId: string]: ScheduledTaskType[] };
        }
      ),
    [sortedTasks]
  );

  // Apply filters
  const filteredData = useMemo(() => {
    let result = { ...aggregateByMonthAndThenByProgram };

    // Apply program filter
    if (filter.programIds.length > 0) {
      result = Object.keys(aggregateByMonthAndThenByProgram).reduce((acc, month) => {
        const monthData = aggregateByMonthAndThenByProgram[month];
        const filteredPrograms: { [programId: string]: ScheduledTaskType[] } = {};

        filter.programIds.forEach((programId) => {
          if (monthData?.[programId]) {
            filteredPrograms[programId] = monthData[programId];
          }
        });

        if (Object.keys(filteredPrograms).length > 0) {
          acc[month] = filteredPrograms;
        }
        return acc;
      }, {} as typeof aggregateByMonthAndThenByProgram);
    }

    // Apply month filter
    if (filter.month) {
      const filteredMonths = Object.keys(result).filter((month) =>
        month.toLowerCase().includes(filter.month.toLowerCase())
      );
      result = filteredMonths.reduce((acc, month) => {
        acc[month] = result[month];
        return acc;
      }, {} as typeof aggregateByMonthAndThenByProgram);
    }

    // Apply status and search filters to tasks within each program
    if (filter.status || filter.search || filter.taskTypeId) {
      result = Object.keys(result).reduce((acc, month) => {
        acc[month] = {};
        Object.keys(result[month]).forEach((programId) => {
          const filteredTasks = result[month][programId].filter((task) => {
            // Status filter
            if (filter.status && task.status !== filter.status) return false;

            // Search filter
            if (filter.search) {
              const searchLower = filter.search.toLowerCase();
              const taskType = Object.values(TASK_TYPES).find((type) => type.id === task.taskTypeId);
              const program = programs.find((p) => p.id === task.programId);
              const searchText = `${taskType?.label || ""} ${task.description || ""} ${program?.name || ""}`.toLowerCase();
              if (!searchText.includes(searchLower)) return false;
            }

            // Task type filter
            if (filter.taskTypeId && task.taskTypeId !== filter.taskTypeId) return false;

            return true;
          });

          if (filteredTasks.length > 0) {
            acc[month][programId] = filteredTasks;
          }
        });
        return acc;
      }, {} as typeof aggregateByMonthAndThenByProgram);
    }

    return result;
  }, [aggregateByMonthAndThenByProgram, filter, programs]);

  return {
    filteredPrograms,
    filteredData,
  };
};
