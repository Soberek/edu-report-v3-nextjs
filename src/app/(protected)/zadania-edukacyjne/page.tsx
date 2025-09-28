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
                  p: 3,
                  mb: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Program: {task.programName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {new Date(task.date).toLocaleDateString("pl-PL")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Numer referencyjny: {task.referenceNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Szkoła ID: {task.schoolId}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
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

                {/* Activities */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Aktywności ({task.activities.length})
                  </Typography>
                  {task.activities.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        backgroundColor: "grey.50",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Typ: {activity.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ilość działań: {activity.actionCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ilość odbiorców: {activity.audienceCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      {activity.media && (
                        <Box mt={1}>
                          <Typography variant="body2" color="primary">
                            Media: {activity.media.title} ({activity.media.platform})
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ wordBreak: "break-all" }}>
                            Link: {activity.media.link}
                          </Typography>
                        </Box>
                      )}
                      {activity.materials && activity.materials.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            Materiały:
                          </Typography>
                          {activity.materials.map((material, materialIndex) => (
                            <Typography key={materialIndex} variant="body2" color="primary">
                              • {material.name} ({material.type}) - {material.distributedCount} egzemplarzy
                            </Typography>
                          ))}
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
