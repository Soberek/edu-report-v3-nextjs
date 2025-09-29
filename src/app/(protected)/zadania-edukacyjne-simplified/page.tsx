"use client";
import React, { useReducer, useMemo } from "react";
import { Container, Box, Typography, Collapse, Chip, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { Add, ExpandMore, ExpandLess, FilterList } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useSimplifiedEducationalTasks, SimplifiedEducationalTask } from "../zadania-edukacyjne/hooks/useSimplifiedEducationalTasks";
import { SimplifiedEducationalTaskForm } from "../zadania-edukacyjne/components/SimplifiedEducationalTaskForm";
import { SimplifiedTaskFormData } from "../zadania-edukacyjne/hooks/useSimplifiedEducationalTasks";

// Simplified page state
interface SimplifiedPageState {
  openForm: boolean;
  editTask: SimplifiedEducationalTask | null;
  expandedTasks: Set<string>;
  filters: {
    year: string;
    month: string;
    program: string;
    activityType: string;
  };
}

const INITIAL_SIMPLIFIED_PAGE_STATE: SimplifiedPageState = {
  openForm: false,
  editTask: null,
  expandedTasks: new Set(),
  filters: {
    year: "",
    month: "",
    program: "",
    activityType: "",
  },
};

type SimplifiedPageAction =
  | { type: "SET_FORM_OPEN"; payload: boolean }
  | { type: "SET_EDIT_TASK"; payload: SimplifiedEducationalTask | null }
  | { type: "TOGGLE_TASK_EXPANSION"; payload: string }
  | { type: "SET_FILTER"; payload: { key: keyof SimplifiedPageState["filters"]; value: string } }
  | { type: "RESET_FILTERS" };

function simplifiedPageReducer(state: SimplifiedPageState, action: SimplifiedPageAction): SimplifiedPageState {
  switch (action.type) {
    case "SET_FORM_OPEN":
      return { ...state, openForm: action.payload };
    case "SET_EDIT_TASK":
      return { ...state, editTask: action.payload };
    case "TOGGLE_TASK_EXPANSION":
      const newExpanded = new Set(state.expandedTasks);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      return { ...state, expandedTasks: newExpanded };
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };
    case "RESET_FILTERS":
      return { ...state, filters: INITIAL_SIMPLIFIED_PAGE_STATE.filters };
    default:
      return state;
  }
}

const simplifiedActions = {
  setFormOpen: (open: boolean): SimplifiedPageAction => ({ type: "SET_FORM_OPEN", payload: open }),
  setEditTask: (task: SimplifiedEducationalTask | null): SimplifiedPageAction => ({ type: "SET_EDIT_TASK", payload: task }),
  toggleTaskExpansion: (taskId: string): SimplifiedPageAction => ({ type: "TOGGLE_TASK_EXPANSION", payload: taskId }),
  setFilter: (key: keyof SimplifiedPageState["filters"], value: string): SimplifiedPageAction => ({
    type: "SET_FILTER",
    payload: { key, value },
  }),
  resetFilters: (): SimplifiedPageAction => ({ type: "RESET_FILTERS" }),
  setFormClosed: (): SimplifiedPageAction => ({ type: "SET_FORM_OPEN", payload: false }),
};

export default function SimplifiedEducationalTasks(): React.ReactNode {
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useSimplifiedEducationalTasks();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // Centralized state management with useReducer
  const [state, dispatch] = useReducer(simplifiedPageReducer, INITIAL_SIMPLIFIED_PAGE_STATE);

  // Destructure state for easier access
  const { openForm, editTask, expandedTasks, filters } = state;

  const handleAddTask = () => {
    dispatch(simplifiedActions.setEditTask(null));
    dispatch(simplifiedActions.setFormOpen(true));
  };

  const handleEditTask = (task: SimplifiedEducationalTask) => {
    dispatch(simplifiedActions.setEditTask(task));
    dispatch(simplifiedActions.setFormOpen(true));
  };

  const handleDeleteTask = (id: string) => {
    showConfirm(
      "Usuń zadanie edukacyjne",
      "Czy na pewno chcesz usunąć to zadanie edukacyjne? Ta operacja nie może zostać cofnięta.",
      () => deleteTask(id),
      "delete"
    );
  };

  const handleFormSave = async (data: SimplifiedTaskFormData) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, data);
      } else {
        await createTask(data);
      }
      dispatch(simplifiedActions.setFormClosed());
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleFormClose = () => {
    dispatch(simplifiedActions.setFormClosed());
  };

  const toggleTaskExpansion = (taskId: string) => {
    dispatch(simplifiedActions.toggleTaskExpansion(taskId));
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
        (!filters.activityType || task.activityType === filters.activityType)
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
    }, {} as Record<string, { year: number; month: number; tasks: SimplifiedEducationalTask[] }>);

    // Get filter options
    const years = [...new Set(tasks.map((t) => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
    const programs = [...new Set(tasks.map((t) => t.programName))].sort();
    const activityTypes = [...new Set(tasks.map((t) => t.activityType))].sort();

    return {
      filteredTasks: filtered,
      groupedTasks: grouped,
      filterOptions: { years, programs, activityTypes },
    };
  }, [tasks, filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Zadania edukacyjne (Uproszczone)"
        subtitle="Zarządzaj zadaniami edukacyjnymi w prostszy sposób"
        action={
          <PrimaryButton startIcon={<Add />} onClick={handleAddTask}>
            Dodaj zadanie
          </PrimaryButton>
        }
      />

      {error && <ErrorDisplay error={error} onClose={clearError} />}

      {/* Filters */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "grey.50", borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterList color="primary" />
          <Typography variant="subtitle2" fontWeight="bold">
            Filtry:
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rok</InputLabel>
            <Select value={filters.year} onChange={(e) => dispatch(simplifiedActions.setFilter("year", e.target.value))} label="Rok">
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
            <Select value={filters.month} onChange={(e) => dispatch(simplifiedActions.setFilter("month", e.target.value))} label="Miesiąc">
              <MenuItem value="">Wszystkie</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month.toString()}>
                  {new Date(2024, month - 1).toLocaleString("pl", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Program</InputLabel>
            <Select
              value={filters.program}
              onChange={(e) => dispatch(simplifiedActions.setFilter("program", e.target.value))}
              label="Program"
            >
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
              onChange={(e) => dispatch(simplifiedActions.setFilter("activityType", e.target.value))}
              label="Typ aktywności"
            >
              <MenuItem value="">Wszystkie</MenuItem>
              {filterOptions.activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <PrimaryButton variant="outlined" size="small" onClick={() => dispatch(simplifiedActions.resetFilters())}>
            Wyczyść filtry
          </PrimaryButton>
        </Stack>
      </Box>

      {/* Tasks List */}
      {Object.keys(groupedTasks).length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Brak zadań edukacyjnych
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Kliknij "Dodaj zadanie" aby rozpocząć
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {Object.entries(groupedTasks)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, group]) => (
              <Box key={key} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleTaskExpansion(key)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {new Date(group.year, group.month - 1).toLocaleString("pl", {
                        year: "numeric",
                        month: "long",
                      })}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip label={`${group.tasks.length} zadań`} size="small" variant="outlined" />
                      {expandedTasks.has(key) ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </Stack>
                </Box>

                <Collapse in={expandedTasks.has(key)}>
                  <Box sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      {group.tasks.map((task) => (
                        <Box
                          key={task.id}
                          sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "grey.300",
                            borderRadius: 1,
                            backgroundColor: "white",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {task.title}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip label={task.programName} size="small" color="primary" />
                                <Chip label={task.activityType} size="small" color="secondary" />
                                <Chip label={`${task.audienceCount} odbiorców`} size="small" variant="outlined" />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Aktywność:</strong> {task.activityTitle}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Opis:</strong> {task.activityDescription}
                              </Typography>
                              {task.materials && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Materiały:</strong> {task.materials}
                                </Typography>
                              )}
                              {task.mediaLink && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Link:</strong> {task.mediaLink}
                                </Typography>
                              )}
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <PrimaryButton variant="outlined" size="small" onClick={() => handleEditTask(task)}>
                                Edytuj
                              </PrimaryButton>
                              <PrimaryButton variant="outlined" size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                                Usuń
                              </PrimaryButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            ))}
        </Stack>
      )}

      {/* Form Dialog */}
      {openForm && (
        <SimplifiedEducationalTaskForm
          mode={editTask ? "edit" : "create"}
          task={editTask}
          onClose={handleFormClose}
          onSave={handleFormSave}
          loading={loading}
        />
      )}

      <ConfirmDialog />
    </Container>
  );
}
