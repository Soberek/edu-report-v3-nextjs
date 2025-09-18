"use client";
import type { Program } from "@/types";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";

import { TASK_TYPES } from "@/constants/tasks";
import { useMemo, useState, type JSX } from "react";
import { Task } from "./components/task-item";
import { Box, Button, Modal, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useUser } from "@/hooks/useUser";
import TaskForm from "./components/form";
import { useScheduledTask } from "@/hooks/useScheduledTask";

function Schedule(): JSX.Element {
  const [openScheduleTaskForm, setOpenScheduleTaskForm] = useState(false);
  const [filter, setFilter] = useState({
    programId: "",
    taskTypeId: "",
    month: "",
  });

  const { user } = useUser();

  const { tasks, handleScheduledTaskCreation, handleScheduledTaskUpdate, handleScheduledTaskDeletion, refetch, programs, loading } =
    useScheduledTask();

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

  console.log(filter);
  let filteredData = { ...aggregateByMonthAndThenByProgram };
  if (filter.programId) {
    filteredData = Object.keys(aggregateByMonthAndThenByProgram).reduce((acc, month) => {
      if (aggregateByMonthAndThenByProgram[month]?.[filter.programId]) {
        acc[month] = {
          [filter.programId]: aggregateByMonthAndThenByProgram[month][filter.programId],
        };
      }
      return acc;
    }, {} as typeof aggregateByMonthAndThenByProgram);
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mx: 2, mt: 2 }}>
        <Button onClick={() => setOpenScheduleTaskForm(true)}>Dodaj zadanie</Button>
      </Box>
      <Modal open={openScheduleTaskForm} onClose={() => setOpenScheduleTaskForm(false)}>
        <Box sx={{ p: 4, bgcolor: "white", margin: "10% auto", maxWidth: 600 }}>
          <TaskForm createTask={handleScheduledTaskCreation} refetch={refetch} userId={user?.uid} loading={loading} />
        </Box>
      </Modal>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          bgcolor: "white",
          borderRadius: 1,
          p: 2,
          mx: 2,
          mt: 2,
          boxShadow: 2,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ width: "100%", mb: 1, fontWeight: 500 }}>
          Filtruj po miesiącu:
        </Typography>
        {Object.entries(months).map(([key, label]) => (
          <Button key={key} onClick={() => setFilter((prev) => ({ ...prev, month: key }))} size="small">
            {label}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          bgcolor: "white",
          borderRadius: 1,
          p: 2,
          mx: 2,
          mt: 2,
          boxShadow: 2,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ width: "100%", mb: 1, fontWeight: 500 }}>
          Filtruj po programie:
        </Typography>
        <Button onClick={() => setFilter((prev) => ({ ...prev, programId: "" }))} size="small">
          Wszystkie
        </Button>
        {programs.map((program) => (
          <Button
            key={program.id}
            onClick={() => setFilter((prev) => ({ ...prev, programId: program.id }))}
            variant={filter.programId === program.id ? "contained" : "outlined"}
            size="small"
          >
            {program.code} {program.name}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",

          bgcolor: "white",
          borderRadius: 1,
          p: 2,
          mx: 2,
          mt: 2,
          boxShadow: 5,
        }}
      >
        <Typography component="h2" sx={{ mx: 2, mt: 2 }}>
          📋 Procent ukończonych zadań: {percentageOfCompletedTasks}%
        </Typography>
        <Typography component="h2" sx={{ mx: 2, mt: 2 }}>
          ✅ Wszystkie zadania: {tasks.length}
        </Typography>
      </Box>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mx: 2, mt: 2 }}>
        Harmonogram zadań edukacyjnych
      </Typography>
      <Box sx={{ mb: 4, border: "1px solid black" }}>
        {Object.entries(filteredData).map(([month, programsInMonth]) => (
          <Box key={month} sx={{ mx: 2, my: 2 }}>
            <Typography variant="h6" component="h2">
              {localizeMonth(month.split(" ")[0].toLowerCase()) + " " + month.split(" ")[1]}
            </Typography>
            {Object.entries(programsInMonth).map(([programId, tasks]) => {
              const program: Program | undefined = programs.find((p: Program) => p.id === programId);
              return (
                <Box
                  key={programId}
                  sx={{
                    mt: 2,
                    mb: 4,
                    border: "2px solid black",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle1" component="h3">
                    {program ? `${program.code} ${program.name}` : "Nieznany program"}
                  </Typography>
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
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default Schedule;
