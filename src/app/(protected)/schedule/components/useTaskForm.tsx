import React from "react";
import { useForm } from "react-hook-form";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import { type ScheduledTaskDTOType, type ScheduledTaskType } from "@/models/ScheduledTaskSchema";

import { ScheduledTaskDTO } from "@/models/ScheduledTaskSchema";

type Props = {
  userId: string | undefined;
  createTask: (itemData: ScheduledTaskDTOType) => void;
  refetch: () => Promise<void>;
  mode?: "create" | "edit";
  task?: ScheduledTaskType | null;
  onSave?: (id: string, updates: Partial<ScheduledTaskType>) => void;
};

export const useTaskForm = ({ userId, createTask, refetch, mode = "create", task, onSave }: Props) => {
  const { control, handleSubmit, reset } = useForm<ScheduledTaskDTOType>({
    defaultValues: {
      taskTypeId: TASK_TYPES.PRELEKCJA.id,
      programId: programs[0]?.id || "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
      completedDate: "",
    },
  });

  // Reset form with task data when in edit mode
  React.useEffect(() => {
    if (mode === "edit" && task) {
      reset({
        taskTypeId: task.taskTypeId,
        programId: task.programId,
        description: task.description || "",
        dueDate: task.dueDate.split("T")[0], // Format YYYY-MM-DD
        completedDate: task.completedDate || "",
      });
    }
  }, [mode, task, reset]);

  const onSubmit = async (data: ScheduledTaskDTOType) => {
    if (mode === "edit" && task && onSave) {
      // Edit mode
      const updates: Partial<ScheduledTaskType> = {
        taskTypeId: data.taskTypeId,
        programId: data.programId,
        dueDate: new Date(data.dueDate).toISOString(),
        description: data.description || "",
        completedDate: data.completedDate || "",
        status: data.completedDate ? "completed" : "pending",
        updatedAt: new Date().toISOString(),
      };

      onSave(task.id, updates);
      return;
    }

    // Create mode
    if (!userId) {
      alert("User ID is required to create a task.");
      return;
    }

    const newScheduledTask: ScheduledTaskDTOType = {
      ...data,
      description: data.description || "",
      completedDate: data.completedDate || "",
      status: "pending",
    };

    const validation = ScheduledTaskDTO.safeParse(newScheduledTask);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map((err) => `${err.message} (at ${err.path.join(", ")})`).join("\n");
      alert(`Błąd walidacji w useTaskForm:\n${errorMessages}`);
      return;
    }

    try {
      createTask(newScheduledTask);
      await refetch();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return { control, handleSubmit, onSubmit };
};
