"use client";
import type { Program } from "@/types";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";

import { TASK_TYPES } from "@/constants/tasks";
import { useMemo, useState, type JSX } from "react";
import { Task } from "./components/task-item";
import {
  Box,
  Button,
  Modal,
  Typography,
  Container,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  Divider,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { Add, FilterList, CalendarToday, Assignment, CheckCircle, Pending, School, Search, Clear } from "@mui/icons-material";
import dayjs from "dayjs";
import { useUser } from "@/hooks/useUser";
import TaskForm from "./components/form";
import { useScheduledTask } from "@/hooks/useScheduledTask";

function Schedule(): JSX.Element {
  const [openScheduleTaskForm, setOpenScheduleTaskForm] = useState(false);
  const [filter, setFilter] = useState({
    programIds: [] as string[],
    taskTypeId: "",
    month: "",
    status: "",
    search: "",
  });

  const { user } = useUser();

  const { tasks, handleScheduledTaskCreation, handleScheduledTaskUpdate, handleScheduledTaskDeletion, refetch, programs, loading } =
    useScheduledTask();

  // Filter out health programs and get unique programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => 
      !program.name.toLowerCase().includes('zdrowie') && 
      !program.name.toLowerCase().includes('health') &&
      !program.name.toLowerCase().includes('medyczny') &&
      !program.name.toLowerCase().includes('medical')
    );
  }, [programs]);

  const sortedEducationalTasks = useMemo(
    () => tasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
    [tasks]
  );

  const aggregateByMonthAndThenByProgram = useMemo(
    () =>
      sortedEducationalTasks.reduce(
        (acc, task) => {
          const month = dayjs(task.dueDate).format("MMMM YYYY");
          const programId = task.programId;

          if (!acc[month]) {
            acc[month] = {};
          }
          if (!acc[month][programId]) {
            acc[month][programId] = [];
          }
          acc[month][programId].push(task);
          return acc;
        },
        {} as {
          [month: string]: { [programId: string]: ScheduledTaskType[] };
        }
      ),
    [sortedEducationalTasks]
  );

  const months: { [key: string]: string } = {
    january: "Styczeń",
    february: "Luty",
    march: "Marzec",
    april: "Kwiecień",
    may: "Maj",
    june: "Czerwiec",
    july: "Lipiec",
    august: "Sierpień",
    september: "Wrzesień",
    october: "Październik",
    november: "Listopad",
    december: "Grudzień",
  };

  const localizeMonth = (month: string): string => {
    return months[month] || month;
  };

  const percentageOfCompletedTasks = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks]);

  // Enhanced filtering logic
  let filteredData = { ...aggregateByMonthAndThenByProgram };

  // Apply program filter
  if (filter.programIds.length > 0) {
    filteredData = Object.keys(aggregateByMonthAndThenByProgram).reduce((acc, month) => {
      const monthData = aggregateByMonthAndThenByProgram[month];
      const filteredPrograms: { [programId: string]: ScheduledTaskType[] } = {};
      
      filter.programIds.forEach(programId => {
        if (monthData?.[programId]) {
          filteredPrograms[programId] = monthData[programId];
        }
      });
      
      if (Object.keys(filteredPrograms).length > 0) {
        acc[month] = filteredPrograms;
      }
      return acc;
    }, {} as typeof aggregateByMonthAndThenByProgram);
  }

  // Apply month filter
  if (filter.month) {
    const filteredMonths = Object.keys(filteredData).filter((month) => month.toLowerCase().includes(filter.month.toLowerCase()));
    filteredData = filteredMonths.reduce((acc, month) => {
      acc[month] = filteredData[month];
      return acc;
    }, {} as typeof aggregateByMonthAndThenByProgram);
  }

  // Apply status and search filters to tasks within each program
  if (filter.status || filter.search || filter.taskTypeId) {
    filteredData = Object.keys(filteredData).reduce((acc, month) => {
      acc[month] = {};
      Object.keys(filteredData[month]).forEach((programId) => {
        const filteredTasks = filteredData[month][programId].filter((task) => {
          // Status filter
          if (filter.status && task.status !== filter.status) return false;

          // Search filter
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            const taskType = Object.values(TASK_TYPES).find((type) => type.id === task.taskTypeId);
            const program = programs.find((p) => p.id === task.programId);
            const searchText = `${taskType?.label || ""} ${task.description || ""} ${program?.name || ""}`.toLowerCase();
            if (!searchText.includes(searchLower)) return false;
          }

          // Task type filter
          if (filter.taskTypeId && task.taskTypeId !== filter.taskTypeId) return false;

          return true;
        });

        if (filteredTasks.length > 0) {
          acc[month][programId] = filteredTasks;
        }
      });
      return acc;
    }, {} as typeof aggregateByMonthAndThenByProgram);
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Harmonogram zadań edukacyjnych
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Zarządzaj harmonogramem zadań i śledź postęp
        </Typography>
      </Box>

      {/* Add Task Button */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => setOpenScheduleTaskForm(true)}
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Dodaj nowe zadanie
        </Button>
        </Box>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <CheckCircle sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {percentageOfCompletedTasks}%
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Ukończonych zadań
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Assignment sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {tasks.length}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Wszystkich zadań
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Pending sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {tasks.filter((task) => task.status === "pending").length}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Oczekujących zadań
        </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
          display: "flex",
              alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
            <FilterList sx={{ color: "#1976d2" }} />
            Filtry
        </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 3,
            }}
          >
            {/* Search Filter */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
                <Search sx={{ mr: 1, verticalAlign: "middle" }} />
                Wyszukaj zadania:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  placeholder="Szukaj po nazwie, opisie lub programie..."
                  value={filter.search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                />
                {filter.search && (
                  <IconButton
                    onClick={() => setFilter((prev) => ({ ...prev, search: "" }))}
                    size="small"
                    sx={{
                      background: "rgba(0,0,0,0.1)",
                      "&:hover": { background: "rgba(0,0,0,0.2)" },
                    }}
                  >
                    <Clear />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Status Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
                <CheckCircle sx={{ mr: 1, verticalAlign: "middle" }} />
                Status:
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Status zadania</InputLabel>
                <Select
                  value={filter.status}
                  onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
                  label="Status zadania"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assignment sx={{ fontSize: 16, color: "#666" }} />
                      <Typography>Wszystkie</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: "#4caf50" }} />
                      <Typography>Ukończone</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Pending sx={{ fontSize: 16, color: "#ff9800" }} />
                      <Typography>Oczekujące</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Month Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
                <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
                Miesiąc:
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Miesiąc</InputLabel>
                <Select
                  value={filter.month}
                  onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
                  label="Miesiąc"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                      <Typography>Wszystkie miesiące</Typography>
                    </Box>
                  </MenuItem>
                  {Object.entries(months).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: "#1976d2" }} />
                        <Typography>{label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Program Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
                <School sx={{ mr: 1, verticalAlign: "middle" }} />
                Programy:
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Wybierz programy</InputLabel>
                <Select
                  multiple
                  value={filter.programIds}
                  onChange={(e) => setFilter((prev) => ({ ...prev, programIds: e.target.value as string[] }))}
                  input={<OutlinedInput label="Wybierz programy" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const program = filteredPrograms.find(p => p.id === value);
                        return (
                          <Chip
                            key={value}
                            label={program ? `${program.code} ${program.name}` : value}
                            size="small"
                            sx={{
                              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                              color: "white",
                              fontSize: "0.75rem",
                              height: 20,
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                      minHeight: 40,
                    },
                  }}
                >
                  {filteredPrograms.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School sx={{ fontSize: 16, color: "#1976d2" }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {program.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {program.name}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Tasks List */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Assignment sx={{ color: "#1976d2" }} />
            Lista zadań (
            {Object.values(filteredData).reduce(
              (acc, programs) => acc + Object.values(programs).reduce((sum, tasks) => sum + tasks.length, 0),
              0
            )}
            )
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {Object.entries(filteredData).length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                background: "rgba(255,255,255,0.8)",
                borderRadius: 3,
              }}
            >
              <Assignment sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Brak zadań
        </Typography>
              <Typography variant="body2" color="text.secondary">
                Dodaj pierwsze zadanie do harmonogramu
        </Typography>
      </Box>
          ) : (
            <Stack spacing={3}>
        {Object.entries(filteredData).map(([month, programsInMonth]) => (
                <Fade in key={month} timeout={300}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        p: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday />
              {localizeMonth(month.split(" ")[0].toLowerCase()) + " " + month.split(" ")[1]}
            </Typography>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      <Stack spacing={2}>
            {Object.entries(programsInMonth).map(([programId, tasks]) => {
              const program: Program | undefined = programs.find((p: Program) => p.id === programId);
              return (
                            <Box key={programId}>
                              <Typography
                                variant="subtitle1"
                  sx={{
                                  fontWeight: "bold",
                                  color: "#2c3e50",
                                  mb: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <School sx={{ color: "#1976d2" }} />
                    {program ? `${program.code} ${program.name}` : "Nieznany program"}
                  </Typography>
                              <Stack spacing={1}>
                  {tasks.map((task) => {
                    const taskType = Object.values(TASK_TYPES).find((type) => type.id === task.taskTypeId);
                    return (
                      <Task
                        key={task.id}
                        task={task}
                        program={program}
                        taskType={taskType}
                        updateTask={handleScheduledTaskUpdate}
                        deleteTask={handleScheduledTaskDeletion}
                      />
                    );
                  })}
                              </Stack>
                              {Object.entries(programsInMonth).indexOf([programId, tasks]) < Object.entries(programsInMonth).length - 1 && (
                                <Divider sx={{ my: 2 }} />
                              )}
                </Box>
              );
            })}
                      </Stack>
                    </Box>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Add Task Modal */}
      <Modal open={openScheduleTaskForm} onClose={() => setOpenScheduleTaskForm(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            maxWidth: 700,
            bgcolor: "white",
            borderRadius: 4,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 3,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
              <Add />
              Dodaj nowe zadanie
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <TaskForm createTask={handleScheduledTaskCreation} refetch={refetch} userId={user?.uid} loading={loading} />
          </Box>
      </Box>
      </Modal>
    </Container>
  );
}

export default Schedule;
