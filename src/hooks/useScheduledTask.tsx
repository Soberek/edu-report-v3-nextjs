import type { ScheduledTaskDTOType, ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import { useFirebaseData } from "./useFirebaseData";
import { usePrograms } from "./useProgram";
import { useUser } from "./useUser";
import { ScheduledTaskDTO, ScheduledTaskSchema } from "../models/ScheduledTaskSchema";

export const useScheduledTask = () => {
  const { programs } = usePrograms();
  const userContext = useUser();
  const {
    data: tasks,
    createItem: createTask,
    updateItem: updateTask,
    deleteItem: deleteTask,
    refetch,
    error,
    loading,
  } = useFirebaseData<ScheduledTaskType>("scheduled-tasks", userContext.user?.uid);

  const handleScheduledTaskCreation = (itemData: ScheduledTaskDTOType) => {
    const newScheduledTask: ScheduledTaskDTOType = {
      ...itemData,
    };

    const parsedData = ScheduledTaskDTO.safeParse(newScheduledTask);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map((err) => err.message).join("\n");
      alert(`Błąd walidacji w useScheduledTask (create):\n${errorMessages}`);
      return;
    }

    createTask(parsedData.data);
  };

  const handleScheduledTaskUpdate = (id: string, updates: Partial<ScheduledTaskType>) => {
    const isValidId = ScheduledTaskSchema.shape.id.safeParse(id);
    if (!isValidId.success) {
      alert(`Błędne ID zadania: ${isValidId.error.issues.map((i) => i.message).join(", ")}`);
      return;
    }

    const parsedData = ScheduledTaskSchema.partial().safeParse(updates);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map((err) => err.message).join("\n");
      alert(`Błąd walidacji w useScheduledTask (update):\n${errorMessages}`);
      return;
    }

    updateTask(id, parsedData.data);
  };

  const handleScheduledTaskDeletion = (id: string) => {
    const isValid = ScheduledTaskSchema.shape.id.safeParse(id);
    if (!isValid.success) {
      alert(`Błędne ID zadania: ${isValid.error.issues.map((i) => i.message).join(", ")}`);
      return;
    }

    deleteTask(id);
  };

  return {
    programs,
    userContext,
    tasks,
    loading,
    error: error,
    handleScheduledTaskCreation,
    handleScheduledTaskUpdate,
    handleScheduledTaskDeletion,
    refetch,
  };
};
