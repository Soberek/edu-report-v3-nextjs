import React, { useState } from "react";
import { Box, Paper, Typography, Stack, Fade, Divider } from "@mui/material";
import { Assignment, CalendarToday, School } from "@mui/icons-material";
import { Task } from "./task-item";
import TaskForm from "./form";
import type { Program } from "@/types";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import { TASK_TYPES } from "@/constants/tasks";

interface TaskListSectionProps {
  filteredData: { [month: string]: { [programId: string]: ScheduledTaskType[] } };
  programs: Program[];
  localizeMonth: (month: string) => string;
  handleScheduledTaskUpdate: (id: string, updates: Partial<ScheduledTaskType>) => void;
  handleScheduledTaskDeletion: (id: string) => void;
  userId?: string;
}

export const TaskListSection: React.FC<TaskListSectionProps> = ({
  filteredData,
  programs,
  localizeMonth,
  handleScheduledTaskUpdate,
  handleScheduledTaskDeletion,
  userId,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ScheduledTaskType | null>(null);

  const handleEditTask = (task: ScheduledTaskType) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (id: string, updates: Partial<ScheduledTaskType>) => {
    handleScheduledTaskUpdate(id, updates);
    handleCloseEditDialog();
  };
  const totalTasks = Object.values(filteredData).reduce(
    (acc, programs) => acc + Object.values(programs).reduce((sum, tasks) => sum + tasks.length, 0),
    0
  );

  return (
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
          Lista zadań ({totalTasks})
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
                                    onEdit={handleEditTask}
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

      {/* Edit Task Dialog */}
      <TaskForm
        mode="edit"
        task={selectedTask}
        onClose={handleCloseEditDialog}
        onSave={handleSaveTask}
        userId={userId}
        createTask={() => {}}
        refetch={async () => {}}
        loading={false}
      />
    </Paper>
  );
};
