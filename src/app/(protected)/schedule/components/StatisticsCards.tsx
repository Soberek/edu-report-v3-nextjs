import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { CheckCircle, Assignment, Pending } from "@mui/icons-material";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";

interface StatisticsCardsProps {
  tasks: ScheduledTaskType[];
  percentageOfCompletedTasks: number;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  tasks,
  percentageOfCompletedTasks,
}) => {
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
    </Box>
  );
};
