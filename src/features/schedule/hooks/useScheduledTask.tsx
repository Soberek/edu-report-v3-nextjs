import type { ScheduledTaskDTOType, ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { usePrograms } from "@/features/programy-edukacyjne/hooks/useProgram";
import { useUser } from "@/hooks/useUser";
import { useGlobalNotification } from "@/providers/NotificationProvider";
import { logError, createErrorContext, safeAsync } from "@/utils";
import { ScheduledTaskDTO, ScheduledTaskSchema } from "@/models/ScheduledTaskSchema";

export const useScheduledTask = () => {
  const { programs } = usePrograms();
  const userContext = useUser();
  const { showSuccess, showError } = useGlobalNotification();

  const {
    data: tasks,
    createItem: createTask,
    updateItem: updateTask,
    deleteItem: deleteTask,
    refetch,
    error,
    loading,
  } = useFirebaseData<ScheduledTaskType>("scheduled-tasks", userContext.user?.uid);

  const handleScheduledTaskCreation = async (itemData: ScheduledTaskDTOType) => {
    console.log("handleScheduledTaskCreation called with itemData:", itemData);
    const newScheduledTask: ScheduledTaskDTOType = {
      ...itemData,
    };

    const parsedData = ScheduledTaskDTO.safeParse(newScheduledTask);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map((err) => err.message).join("\n");
      const validationError = new Error(`Błąd walidacji zadania: ${errorMessages}`);

      logError(validationError, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskCreation",
        {
          validationIssues: parsedData.error.issues,
          itemData
        },
        userContext.user?.uid
      ));

      showError("Nie udało się utworzyć zadania - błędne dane");
      return;
    }

    try {
      console.log("Task validation passed, creating task with data:", parsedData.data);
      await safeAsync(
        () => createTask(parsedData.data),
        "Tworzenie zadania",
        null
      );

      showSuccess("Zadanie zostało pomyślnie utworzone");
      console.log("Task creation completed successfully");
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskCreation",
        { itemData: parsedData.data },
        userContext.user?.uid
      ));

      showError("Nie udało się utworzyć zadania");
    }
  };

  const handleScheduledTaskUpdate = async (id: string, updates: Partial<ScheduledTaskType>) => {
    const isValidId = ScheduledTaskSchema.shape.id.safeParse(id);
    if (!isValidId.success) {
      const idError = new Error(`Błędne ID zadania: ${isValidId.error.issues.map((i) => i.message).join(", ")}`);
      logError(idError, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskUpdate",
        { id, validationIssues: isValidId.error.issues },
        userContext.user?.uid
      ));
      showError("Nie udało się zaktualizować zadania - błędne ID");
      return;
    }

    const parsedData = ScheduledTaskSchema.partial().safeParse(updates);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map((err) => err.message).join("\n");
      const validationError = new Error(`Błąd walidacji zadania: ${errorMessages}`);
      logError(validationError, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskUpdate",
        {
          id,
          updates,
          validationIssues: parsedData.error.issues
        },
        userContext.user?.uid
      ));
      showError("Nie udało się zaktualizować zadania - błędne dane");
      return;
    }

    try {
      await safeAsync(
        () => updateTask(id, parsedData.data),
        "Aktualizacja zadania",
        false
      );

      showSuccess("Zadanie zostało pomyślnie zaktualizowane");
    } catch (error) {
      logError(error as Error, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskUpdate",
        { id, updates: parsedData.data },
        userContext.user?.uid
      ));
      showError("Nie udało się zaktualizować zadania");
    }
  };

  const handleScheduledTaskDeletion = async (id: string) => {
    const isValid = ScheduledTaskSchema.shape.id.safeParse(id);
    if (!isValid.success) {
      const idError = new Error(`Błędne ID zadania: ${isValid.error.issues.map((i) => i.message).join(", ")}`);
      logError(idError, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskDeletion",
        { id, validationIssues: isValid.error.issues },
        userContext.user?.uid
      ));
      showError("Nie udało się usunąć zadania - błędne ID");
      return;
    }

    try {
      await safeAsync(
        () => deleteTask(id),
        "Usuwanie zadania",
        false
      );

      showSuccess("Zadanie zostało pomyślnie usunięte");
    } catch (error) {
      logError(error as Error, createErrorContext(
        "useScheduledTask",
        "handleScheduledTaskDeletion",
        { id },
        userContext.user?.uid
      ));
      showError("Nie udało się usunąć zadania");
    }
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
