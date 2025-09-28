import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { CheckCircle, Assignment, Pending, CalendarMonth } from "@mui/icons-material";
import type { StatisticsCardsProps } from "../types";
import { useTaskStatistics } from "../hooks/useTaskStatistics";

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ tasks }) => {
  const statistics = useTaskStatistics(tasks);
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
            {statistics.overallCompletionPercentage}%
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
            {statistics.totalTasks}
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
            {statistics.pendingTasks}
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
            {statistics.yearToDatePercentage}%
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
            {statistics.currentMonthPercentage}%
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Ukończonych w tym miesiącu
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
