"use client";
import React, { useMemo } from "react";
import { Container, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, EmptyState } from "@/components/shared";
import { 
  EducationalTaskForm,
  FilterSection, 
  TaskGroups, 
  useEducationalTasksPage,
  MONTH_NAMES,
  PAGE_CONSTANTS, 
  UI_CONSTANTS, 
  BUTTON_LABELS, 
  MESSAGES, 
  STYLE_CONSTANTS,
  type EducationalTaskFormProps
} from "@/features/zadania-edukacyjne";
// import type { EducationalTask } from "@/types";

export default function EducationalTasks(): React.ReactNode {
  // Use custom hook for page logic
  const {
    state,
    filters,
    openForm,
    editTask,
    tasks,
    filteredTasks,
    groupedTasks,
    filterOptions,
    loading,
    error,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleFormSave,
    handleFormClose,
    toggleTaskExpansion,
    clearError,
    ConfirmDialog,
  } = useEducationalTasksPage();

  // Memoized form props
  const formProps: EducationalTaskFormProps = useMemo(
    () => ({
      mode: editTask ? "edit" : "create",
      task: editTask || undefined,
      tasks: [...tasks],
      onClose: handleFormClose,
      onSave: handleFormSave,
      loading,
    }),
    [editTask, tasks, handleFormClose, handleFormSave, loading]
  );

  // Render functions for better organization
  const renderHeader = () => (
    <PageHeader
      title={PAGE_CONSTANTS.TITLE}
      subtitle={PAGE_CONSTANTS.SUBTITLE}
      actions={
        <PrimaryButton startIcon={<Add />} onClick={handleAddTask}>
          {BUTTON_LABELS.ADD_TASK}
        </PrimaryButton>
      }
    />
  );

  const renderErrorDisplay = () => error && <ErrorDisplay error={error} onRetry={clearError} retryText="Spróbuj ponownie" />;

  const renderFilters = () => (
    <FilterSection
      filters={filters}
      filterOptions={filterOptions}
      monthNames={MONTH_NAMES}
      onFilterChange={(key, value) => {
        // This will be handled by the reducer
        // We need to implement the filter change logic in the hook
      }}
    />
  );

  const renderForm = () => openForm && <EducationalTaskForm {...formProps} />;

  const renderTaskList = () => {
    if (loading) {
      return <LoadingSpinner message={MESSAGES.LOADING.LOADING_TASKS} />;
    }

    if (filteredTasks.length === 0) {
      const title = tasks.length > 0 ? PAGE_CONSTANTS.EMPTY_STATE.NO_FILTERED_TASKS : PAGE_CONSTANTS.EMPTY_STATE.NO_TASKS;
      const description = tasks.length > 0 ? PAGE_CONSTANTS.EMPTY_STATE.NO_FILTERED_DESCRIPTION : PAGE_CONSTANTS.EMPTY_STATE.NO_TASKS_DESCRIPTION;
      
      return (
        <EmptyState
          title={title}
          description={description}
          action={{
            label: BUTTON_LABELS.ADD_TASK,
            onClick: handleAddTask,
            icon: <Add />
          }}
        />
      );
    }

    return (
      <Box>
        {groupedTasks.map((group) => (
          <TaskGroups
            key={group.key}
            group={group}
            expandedTasks={state.expandedTasks}
            onToggleExpansion={toggleTaskExpansion}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth={UI_CONSTANTS.CONTAINER_MAX_WIDTH} sx={{ py: STYLE_CONSTANTS.SPACING.LARGE }}>
      {renderHeader()}
      {renderErrorDisplay()}
      {renderFilters()}
      {renderForm()}
      <Box sx={{ mb: STYLE_CONSTANTS.SPACING.LARGE }}>{renderTaskList()}</Box>
      {ConfirmDialog}
    </Container>
  );
}
