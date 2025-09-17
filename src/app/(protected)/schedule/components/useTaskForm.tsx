import { useForm } from "react-hook-form";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import { type ScheduledTaskDTOType } from "@/models/ScheduledTaskSchema";

import { ScheduledTaskDTO } from "@/models/ScheduledTaskSchema";

type Props = {
  userId: string | undefined;
  createTask: (itemData: ScheduledTaskDTOType) => void;
  refetch: () => Promise<void>;
};

export const useTaskForm = ({ userId, createTask, refetch }: Props) => {
  const { control, handleSubmit } = useForm<ScheduledTaskDTOType>({
    defaultValues: {
      taskTypeId: TASK_TYPES.PRELEKCJA.id,
      programId: programs[0]?.id || "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
    },
  });

  const onSubmit = async (data: ScheduledTaskDTOType) => {
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
