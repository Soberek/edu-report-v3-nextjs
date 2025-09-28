"use client";
import React, { useState } from "react";
import { Container, Box, Typography, Collapse } from "@mui/material";
import { Add, ExpandMore, ExpandLess } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useEducationalTasks } from "./hooks/useEducationalTasks";
import { EducationalTaskForm } from "./components";
import { CreateEducationalTaskFormData, EducationalTask } from "@/types";

export default function EducationalTasks(): React.ReactNode {
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useEducationalTasks();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState<EducationalTask | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

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

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
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
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                      {task.title}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={3} mb={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Program:
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {task.programName}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Data:
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {new Date(task.date).toLocaleDateString("pl-PL")}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Ref:
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontFamily: "monospace" }}>
                          {task.referenceNumber}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Szkoła:
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontFamily: "monospace" }}>
                          {task.schoolId}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" gap={1}>
                    <PrimaryButton 
                      size="small" 
                      onClick={() => handleEditTask(task)}
                      sx={{ minWidth: 80 }}
                    >
                      Edytuj
                    </PrimaryButton>
                    <PrimaryButton
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                      sx={{ 
                        backgroundColor: "error.main", 
                        "&:hover": { backgroundColor: "error.dark" },
                        minWidth: 80
                      }}
                    >
                      Usuń
                    </PrimaryButton>
                  </Box>
                </Box>

                {/* Activities - Collapsible */}
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ 
                      cursor: "pointer",
                      p: 1.5,
                      backgroundColor: "grey.50",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "grey.100",
                        borderColor: "primary.main",
                      },
                    }}
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        Aktywności ({task.activities.length})
                      </Typography>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {task.activities.map((activity, index) => (
                          <Box
                            key={index}
                            sx={{
                              px: 1,
                              py: 0.25,
                              backgroundColor: "primary.main",
                              color: "white",
                              borderRadius: 0.5,
                              fontSize: "0.7rem",
                              fontWeight: "medium",
                            }}
                          >
                            {activity.type}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    {expandedTasks.has(task.id) ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
                  </Box>

                  <Collapse in={expandedTasks.has(task.id)}>
                    <Box mt={2}>
                      {task.activities.map((activity, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            backgroundColor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1.5,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                              {activity.title}
                            </Typography>
                            <Box display="flex" gap={1.5}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                  Typ:
                                </Typography>
                                <Box
                                  sx={{
                                    px: 1,
                                    py: 0.25,
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    borderRadius: 0.5,
                                    fontSize: "0.7rem",
                                    fontWeight: "medium",
                                  }}
                                >
                                  {activity.type}
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                  Działań:
                                </Typography>
                                <Typography variant="body2" color="text.primary" fontWeight="bold">
                                  {activity.actionCount}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                  Odbiorców:
                                </Typography>
                                <Typography variant="body2" color="text.primary" fontWeight="bold">
                                  {activity.audienceCount}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {activity.description}
                          </Typography>
                          {activity.media && (
                            <Box 
                              mt={1.5} 
                              p={1.5} 
                              sx={{ 
                                backgroundColor: "primary.50", 
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "primary.200",
                              }}
                            >
                              <Typography variant="body2" color="primary" fontWeight="bold" mb={0.5}>
                                📺 Media
                              </Typography>
                              <Typography variant="body2" color="text.primary" mb={0.5}>
                                {activity.media.title} ({activity.media.platform})
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="primary" 
                                sx={{ 
                                  wordBreak: "break-all",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  "&:hover": { color: "primary.dark" }
                                }}
                                onClick={() => activity.media && window.open(activity.media.link, '_blank')}
                              >
                                🔗 {activity.media.link}
                              </Typography>
                            </Box>
                          )}
                          {activity.materials && activity.materials.length > 0 && (
                            <Box 
                              mt={1.5} 
                              p={1.5} 
                              sx={{ 
                                backgroundColor: "success.50", 
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "success.200",
                              }}
                            >
                              <Typography variant="body2" color="success.dark" fontWeight="bold" mb={0.5}>
                                📦 Materiały
                              </Typography>
                              {activity.materials.map((material, materialIndex) => (
                                <Box key={materialIndex} display="flex" alignItems="center" gap={1} mb={0.5}>
                                  <Typography variant="body2" color="text.primary">
                                    • {material.name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      px: 1,
                                      py: 0.25,
                                      backgroundColor: "success.main",
                                      color: "white",
                                      borderRadius: 0.5,
                                      fontSize: "0.7rem",
                                      fontWeight: "medium",
                                    }}
                                  >
                                    {material.type}
                                  </Box>
                                  <Typography variant="body2" color="success.dark" fontWeight="bold">
                                    {material.distributedCount} egz.
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
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
