"use client";
import React, { useReducer, useMemo } from "react";
import { Container, Box, Typography, Collapse, Chip, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { Add, ExpandMore, ExpandLess, FilterList } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useEducationalTasks } from "./hooks/useEducationalTasks";
import { EducationalTaskForm } from "./components";
import { CreateEducationalTaskFormData } from "@/types";
import { INITIAL_PAGE_STATE } from "./types";
import { educationalTasksPageReducer, actions } from "./reducers/educationalTasksPageReducer";
import type { EducationalTask } from "@/types";

export default function EducationalTasks(): React.ReactNode {
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useEducationalTasks();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // Centralized state management with useReducer
  const [state, dispatch] = useReducer(educationalTasksPageReducer, INITIAL_PAGE_STATE);

  // Destructure state for easier access
  const { openForm, editTask, expandedTasks, filters } = state;

  const handleAddTask = () => {
    dispatch(actions.setEditTask(null));
    dispatch(actions.setFormOpen(true));
  };

  const handleEditTask = (task: EducationalTask) => {
    dispatch(actions.setEditTask(task));
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
      dispatch(actions.setFormClosed());
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleFormClose = () => {
    dispatch(actions.setFormClosed());
  };

  const toggleTaskExpansion = (taskId: string) => {
    dispatch(actions.toggleTaskExpansion(taskId));
  };

  // Filter and group tasks
  const { filteredTasks, groupedTasks, filterOptions } = useMemo(() => {
    // Filter tasks
    const filtered = tasks.filter((task) => {
      const taskDate = new Date(task.date);
      const taskYear = taskDate.getFullYear().toString();
      const taskMonth = (taskDate.getMonth() + 1).toString();

      return (
        (!filters.year || taskYear === filters.year) &&
        (!filters.month || taskMonth === filters.month) &&
        (!filters.program || task.programName === filters.program) &&
        (!filters.activityType || task.activities.some((a) => a.type === filters.activityType))
      );
    });

    // Group by year and month
    const grouped = filtered.reduce((acc, task) => {
      const taskDate = new Date(task.date);
      const year = taskDate.getFullYear();
      const month = taskDate.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!acc[key]) {
        acc[key] = {
          year,
          month,
          tasks: [],
        };
      }
      acc[key].tasks.push(task);
      return acc;
    }, {} as Record<string, { year: number; month: number; tasks: EducationalTask[] }>);

    // Get filter options
    const years = [...new Set(tasks.map((t) => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
    const programs = [...new Set(tasks.map((t) => t.programName))].sort();
    const activityTypes = [...new Set(tasks.flatMap((t) => t.activities.map((a) => a.type)))].sort();

    return {
      filteredTasks: filtered,
      groupedTasks: Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, value]) => ({ key, ...value })),
      filterOptions: { years, programs, activityTypes },
    };
  }, [tasks, filters]);

  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

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

      {/* Filters */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "grey.50", borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Filtry
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rok</InputLabel>
            <Select value={filters.year} label="Rok" onChange={(e) => dispatch(actions.setFilter("year", e.target.value))}>
              <MenuItem value="">Wszystkie</MenuItem>
              {filterOptions.years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Miesiąc</InputLabel>
            <Select value={filters.month} label="Miesiąc" onChange={(e) => dispatch(actions.setFilter("month", e.target.value))}>
              <MenuItem value="">Wszystkie</MenuItem>
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={(index + 1).toString()}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Program</InputLabel>
            <Select value={filters.program} label="Program" onChange={(e) => dispatch(actions.setFilter("program", e.target.value))}>
              <MenuItem value="">Wszystkie</MenuItem>
              {filterOptions.programs.map((program) => (
                <MenuItem key={program} value={program}>
                  {program}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Typ aktywności</InputLabel>
            <Select
              value={filters.activityType}
              label="Typ aktywności"
              onChange={(e) => dispatch(actions.setFilter("activityType", e.target.value))}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              {filterOptions.activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Active filters */}
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {filters.year && (
            <Chip
              label={`Rok: ${filters.year}`}
              onDelete={() => dispatch(actions.setFilter("year", ""))}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {filters.month && (
            <Chip
              label={`Miesiąc: ${monthNames[parseInt(filters.month) - 1]}`}
              onDelete={() => dispatch(actions.setFilter("month", ""))}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {filters.program && (
            <Chip
              label={`Program: ${filters.program}`}
              onDelete={() => dispatch(actions.setFilter("program", ""))}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {filters.activityType && (
            <Chip
              label={`Aktywność: ${filters.activityType}`}
              onDelete={() => dispatch(actions.setFilter("activityType", ""))}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Task Form */}
      {openForm && (
        <EducationalTaskForm
          mode={editTask ? "edit" : "create"}
          task={editTask}
          tasks={tasks}
          onClose={handleFormClose}
          onSave={handleFormSave}
          loading={loading}
        />
      )}

      {/* Tasks List */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <LoadingSpinner message="Ładowanie zadań edukacyjnych..." />
        ) : filteredTasks.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {tasks.length === 0 ? "Brak zadań edukacyjnych" : "Brak zadań spełniających kryteria filtrowania"}
            </Typography>
            <Typography variant="body1" mb={3}>
              {tasks.length === 0 ? "Dodaj pierwsze zadanie edukacyjne, aby rozpocząć." : "Spróbuj zmienić filtry lub dodaj nowe zadanie."}
            </Typography>
            <PrimaryButton startIcon={<Add />} onClick={handleAddTask}>
              Dodaj zadanie
            </PrimaryButton>
          </Box>
        ) : (
          <Box>
            {groupedTasks.map((group) => (
              <Box key={group.key} sx={{ mb: 4 }}>
                {/* Month/Year Header */}
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {monthNames[group.month - 1]} {group.year}
                  </Typography>
                  <Chip
                    label={`${group.tasks.length} zadań`}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {/* Tasks for this month */}
                {group.tasks.map((task) => (
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
                        <PrimaryButton size="small" onClick={() => handleEditTask(task)} sx={{ minWidth: 80 }}>
                          Edytuj
                        </PrimaryButton>
                        <PrimaryButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          sx={{
                            backgroundColor: "error.main",
                            "&:hover": { backgroundColor: "error.dark" },
                            minWidth: 80,
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
                                      {activity.audienceGroups?.reduce((total, group) => total + group.count, 0) || 0}
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
                                      "&:hover": { color: "primary.dark" },
                                    }}
                                    onClick={() => activity.media && window.open(activity.media.link, "_blank")}
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
            ))}
          </Box>
        )}
      </Box>

      {/* Confirm Dialog */}
      {ConfirmDialog}
    </Container>
  );
}
