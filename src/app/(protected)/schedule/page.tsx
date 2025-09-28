"use client";
import { useState, type JSX } from "react";
import { Box, Button, Modal, Typography, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useUser } from "@/hooks/useUser";
import TaskForm from "./components/form";
import { useScheduledTask } from "@/hooks/useScheduledTask";
import { StatisticsCards } from "./components/StatisticsCards";
import { FilterSection } from "./components/FilterSection";
import { TaskListSection } from "./components/TaskListSection";
import { useScheduleFilters } from "./hooks/useScheduleFilters";
import { calculateCompletionPercentage, localizeMonth, getMonths } from "./utils/scheduleUtils";

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

  const { filteredPrograms, filteredData } = useScheduleFilters({ tasks, programs, filter });
  const percentageOfCompletedTasks = calculateCompletionPercentage(tasks);
  const months = getMonths();

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
      <StatisticsCards tasks={tasks} percentageOfCompletedTasks={percentageOfCompletedTasks} />

      {/* Filters */}
      <FilterSection filter={filter} setFilter={setFilter} filteredPrograms={filteredPrograms} months={months} />

      {/* Tasks List */}
      <TaskListSection
        filteredData={filteredData}
        programs={programs}
        localizeMonth={localizeMonth}
        handleScheduledTaskUpdate={handleScheduledTaskUpdate}
        handleScheduledTaskDeletion={handleScheduledTaskDeletion}
        userId={user?.uid}
      />

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
