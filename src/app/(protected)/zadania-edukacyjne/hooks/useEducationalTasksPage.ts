import { useReducer, useCallback, useMemo } from "react";
import { useEducationalTasks } from "./useEducationalTasks";
import { useConfirmDialog } from "@/components/shared";
import { educationalTasksPageReducer, actions } from "../reducers/educationalTasksPageReducer";
import { INITIAL_PAGE_STATE } from "../types";
import { applyFiltersAndGrouping } from "../utils";
import { MESSAGES } from "../constants";
import type { UseEducationalTasksPageProps, EducationalTasksFilters } from "../types";
import type { EducationalTask, CreateEducationalTaskFormData } from "@/types";

export const useEducationalTasksPage = ({ onCreate, onUpdate, onDelete }: UseEducationalTasksPageProps = {}) => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useEducationalTasks();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // Centralized state management with useReducer
  const [state, dispatch] = useReducer(educationalTasksPageReducer, INITIAL_PAGE_STATE);

  // Destructure state for easier access
  const { openForm, editTask, expandedTasks, filters } = state;

  // Memoized filter and grouping logic
  const filteredResults = useMemo(() => applyFiltersAndGrouping(tasks, filters), [tasks, filters]);

  // Event handlers
  const handleAddTask = useCallback(() => {
    dispatch(actions.setEditTask(null));
    dispatch(actions.setFormOpen(true));
  }, []);

  const handleEditTask = useCallback((task: EducationalTask) => {
    dispatch(actions.setEditTask(task));
  }, []);

  const handleDeleteTask = useCallback(
    (id: string) => {
      showConfirm(
        MESSAGES.CONFIRMATION.DELETE_TITLE,
        MESSAGES.CONFIRMATION.DELETE_MESSAGE,
        () => deleteTask(id),
        MESSAGES.CONFIRMATION.DELETE_ACTION
      );
    },
    [showConfirm, deleteTask]
  );

  const handleFormSave = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        if (editTask) {
          await updateTask(editTask.id, data as unknown as CreateEducationalTaskFormData);
          onUpdate?.(editTask.id, data as unknown as CreateEducationalTaskFormData);
        } else {
          await createTask(data as unknown as CreateEducationalTaskFormData);
          onCreate?.(data as unknown as CreateEducationalTaskFormData);
        }
        dispatch(actions.setFormClosed());
      } catch (error) {
        console.error("Error saving task:", error);
        throw error;
      }
    },
    [editTask, updateTask, createTask, onUpdate, onCreate]
  );

  const handleFormClose = useCallback(() => {
    dispatch(actions.setFormClosed());
  }, []);

  const toggleTaskExpansion = useCallback((taskId: string) => {
    dispatch(actions.toggleTaskExpansion(taskId));
  }, []);

  const handleFilterChange = useCallback((key: keyof EducationalTasksFilters, value: string) => {
    dispatch(actions.setFilter(key, value));
  }, []);

  const resetFilters = useCallback(() => {
    dispatch(actions.resetFilters());
  }, []);

  return {
    // State
    state,
    filters,
    openForm,
    editTask,
    expandedTasks,

    // Data
    tasks: tasks || [],
    filteredTasks: filteredResults.filteredTasks,
    groupedTasks: filteredResults.groupedTasks,
    filterOptions: filteredResults.filterOptions,

    // Loading states
    loading,
    error,

    // Actions
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleFormSave,
    handleFormClose,
    toggleTaskExpansion,
    handleFilterChange,
    resetFilters,
    clearError,

    // Dialog
    ConfirmDialog,
  };
};
