import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { createTaskSchema, editTaskSchema, type CreateTaskFormData, type EditTaskFormData } from "../schemas/taskSchemas";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import dayjs from "dayjs";

interface UseTaskFormProps {
  mode: "create" | "edit";
  task?: ScheduledTaskType | null;
  userId?: string;
  onSubmit: (data: CreateTaskFormData | EditTaskFormData) => Promise<void>;
}

type TaskFormData = CreateTaskFormData | EditTaskFormData;

export const useTaskForm = ({ mode, task, userId, onSubmit }: UseTaskFormProps) => {
  const isEditMode = mode === "edit";
  const schema = isEditMode ? editTaskSchema : createTaskSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: isEditMode 
      ? {
          taskTypeId: task?.taskTypeId || TASK_TYPES.PRELEKCJA.id,
          programId: task?.programId || programs[0]?.id || "",
          description: task?.description || "",
          dueDate: task?.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
          completedDate: task?.completedDate || "",
          status: task?.status || "pending",
        }
      : {
          taskTypeId: TASK_TYPES.PRELEKCJA.id,
          programId: programs[0]?.id || "",
          description: "",
          dueDate: dayjs().format("YYYY-MM-DD"),
          completedDate: "",
          status: "pending",
          userId: userId || "",
        },
  });

  const { control, handleSubmit, reset, formState, watch } = form;
  const watchedCompletedDate = watch("completedDate");

  // Auto-set status based on completed date
  const status = useMemo(() => {
    return watchedCompletedDate ? "completed" : "pending";
  }, [watchedCompletedDate]);

  // Reset form when task changes (edit mode)
  useEffect(() => {
    if (isEditMode && task) {
      reset({
        taskTypeId: task.taskTypeId,
        programId: task.programId,
        description: task.description || "",
        dueDate: dayjs(task.dueDate).format("YYYY-MM-DD"),
        completedDate: task.completedDate || "",
        status: task.status,
      });
    }
  }, [isEditMode, task, reset]);

  // Handle form submission
  const handleFormSubmit = handleSubmit((data) => {
    const formData = {
      ...data,
      status,
      ...(isEditMode && { id: task?.id }),
      ...(mode === "create" && { userId }),
    };
    onSubmit(formData as CreateTaskFormData | EditTaskFormData);
  });

  // Validation helpers
  const isFormValid = formState.isValid;
  const hasErrors = Object.keys(formState.errors).length > 0;

  return {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    isFormValid,
    hasErrors,
    status,
    reset,
  };
};
