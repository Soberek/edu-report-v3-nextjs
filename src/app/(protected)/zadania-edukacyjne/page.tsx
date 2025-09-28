"use client";
import React, { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useEducationalTasks } from "./hooks/useEducationalTasks";
import { EducationalTaskForm } from "./components";
import { CreateEducationalTaskFormData, EducationalTask } from "@/types";

export default function EducationalTasks(): React.ReactNode {
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useEducationalTasks();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState<EducationalTask | null>(null);

  const handleAddTask = () => {
    setEditTask(null);
    setOpenForm(true);
  };

  const handleEditTask = (task: EducationalTask) => {
    setEditTask(task);
    setOpenForm(true);
  };

  const handleDeleteTask = (id: string) => {
    showConfirm(
      "Usuń zadanie edukacyjne",
      "Czy na pewno chcesz usunąć to zadanie edukacyjne? Ta operacja nie może zostać cofnięta.",
      () => deleteTask(id),
      "delete"
    );
  };

  const handleFormSave = async (data: any) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, data as CreateEducationalTaskFormData);
      } else {
        await createTask(data as CreateEducationalTaskFormData);
      }
      setOpenForm(false);
      setEditTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditTask(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <PageHeader
        title="Zadania edukacyjne"
        subtitle="Zarządzaj zadaniami edukacyjnymi i ich aktywnościami"
        actions={
          <PrimaryButton startIcon={<Add />} onClick={handleAddTask}>
            Dodaj zadanie
          </PrimaryButton>
        }
      />

      {/* Error Display */}
      {error && <ErrorDisplay error={error} onRetry={clearError} retryText="Spróbuj ponownie" />}

      {/* Task Form */}
      {openForm && (
        <EducationalTaskForm
          mode={editTask ? "edit" : "create"}
          task={editTask}
          onClose={handleFormClose}
          onSave={handleFormSave}
          loading={loading}
        />
      )}

      {/* Tasks List */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <LoadingSpinner message="Ładowanie zadań edukacyjnych..." />
        ) : tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Brak zadań edukacyjnych
            </Typography>
            <Typography variant="body1" mb={3}>
              Dodaj pierwsze zadanie edukacyjne, aby rozpocząć.
            </Typography>
            <PrimaryButton startIcon={<Add />} onClick={handleAddTask}>
              Dodaj zadanie
            </PrimaryButton>
          </Box>
        ) : (
          <Box>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  p: 2,
                  mb: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "background.paper",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {task.title}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        Program: {task.programName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Data: {new Date(task.date).toLocaleDateString("pl-PL")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ref: {task.referenceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Szkoła: {task.schoolId}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" gap={0.5}>
                    <PrimaryButton size="small" onClick={() => handleEditTask(task)}>
                      Edytuj
                    </PrimaryButton>
                    <PrimaryButton
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                      sx={{ backgroundColor: "error.main", "&:hover": { backgroundColor: "error.dark" } }}
                    >
                      Usuń
                    </PrimaryButton>
                  </Box>
                </Box>

                {/* Activities - Compact */}
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" mb={0.5}>
                    Aktywności ({task.activities.length}):
                  </Typography>
                  {task.activities.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1,
                        mb: 0.5,
                        backgroundColor: "grey.50",
                        borderRadius: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.75rem" }}>
                          {activity.title}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            {activity.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            {activity.actionCount} działań
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            {activity.audienceCount} odbiorców
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                        {activity.description}
                      </Typography>
                      {activity.media && (
                        <Box mt={0.5}>
                          <Typography variant="caption" color="primary" sx={{ fontSize: "0.7rem" }}>
                            Media: {activity.media.title} ({activity.media.platform})
                          </Typography>
                        </Box>
                      )}
                      {activity.materials && activity.materials.length > 0 && (
                        <Box mt={0.5}>
                          <Typography variant="caption" color="primary" fontWeight="bold" sx={{ fontSize: "0.7rem" }}>
                            Materiały: {activity.materials.map(m => `${m.name} (${m.distributedCount})`).join(", ")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Confirm Dialog */}
      {ConfirmDialog}
    </Container>
  );
}
