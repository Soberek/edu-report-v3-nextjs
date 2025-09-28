import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { CheckCircle, Assignment, Pending, CalendarMonth } from "@mui/icons-material";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import dayjs from "dayjs";

interface StatisticsCardsProps {
  tasks: ScheduledTaskType[];
  percentageOfCompletedTasks: number;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ tasks, percentageOfCompletedTasks }) => {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1; // 1-12

  // Get all tasks from January to current month of current year
  const yearToDateTasks = tasks.filter((task) => {
    const taskDate = dayjs(task.dueDate);
    return taskDate.year() === currentYear && taskDate.month() + 1 <= currentMonth;
  });

  const yearToDateCompleted = yearToDateTasks.filter((task) => task.status === "completed").length;
  const yearToDatePercentage = yearToDateTasks.length > 0 ? Math.round((yearToDateCompleted / yearToDateTasks.length) * 100) : 0;

  // Get tasks for current month only
  const currentMonthTasks = tasks.filter((task) => {
    const taskDate = dayjs(task.dueDate);
    return taskDate.year() === currentYear && taskDate.month() + 1 === currentMonth;
  });

  const currentMonthCompleted = currentMonthTasks.filter((task) => task.status === "completed").length;
  const currentMonthPercentage = currentMonthTasks.length > 0 ? Math.round((currentMonthCompleted / currentMonthTasks.length) * 100) : 0;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 2,
        mb: 3,
      }}
    >
      <Card
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <CheckCircle sx={{ fontSize: 32, mb: 0.5, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {percentageOfCompletedTasks}%
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Ukończonych zadań
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <Assignment sx={{ fontSize: 32, mb: 0.5, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {tasks.length}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Wszystkich zadań
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <Pending sx={{ fontSize: 32, mb: 0.5, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {tasks.filter((task) => task.status === "pending").length}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Oczekujących zadań
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <CalendarMonth sx={{ fontSize: 32, mb: 0.5, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {yearToDatePercentage}%
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Ukończonych od stycznia
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <CalendarMonth sx={{ fontSize: 32, mb: 0.5, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {currentMonthPercentage}%
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Ukończonych w tym miesiącu
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
