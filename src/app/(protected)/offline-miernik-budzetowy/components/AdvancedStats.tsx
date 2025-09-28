import React from "react";
import { Box, Typography, Grid, Card, CardContent, useTheme, Chip, Divider } from "@mui/material";
import { TrendingUp, People, Assignment, CalendarMonth, Assessment, Timeline } from "@mui/icons-material";
import type { AggregatedData, Month } from "../types";
import { MONTH_NAMES } from "../types";

interface AdvancedStatsProps {
  data: AggregatedData;
  selectedMonths: Month[];
  rawData: any[];
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = React.memo(({ data, selectedMonths, rawData }) => {
  const theme = useTheme();

  // Calculate month-based statistics
  const monthStats = React.useMemo(() => {
    const selectedMonthNumbers = selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);
    const monthData: { [key: number]: { actions: number; people: number; programs: number } } = {};

    rawData.forEach((row) => {
      try {
        const date = new Date(row["Data"]);
        const month = date.getMonth() + 1;

        if (selectedMonthNumbers.includes(month)) {
          if (!monthData[month]) {
            monthData[month] = { actions: 0, people: 0, programs: 0 };
          }

          monthData[month].actions += Number(row["Liczba działań"]) || 0;
          monthData[month].people += Number(row["Liczba ludzi"]) || 0;
          monthData[month].programs += 1;
        }
      } catch (error) {
        // Skip invalid dates
      }
    });

    return monthData;
  }, [rawData, selectedMonths]);

  // Calculate program type statistics
  const programTypeStats = React.useMemo(() => {
    const stats: { [key: string]: { count: number; actions: number; people: number } } = {};

    Object.entries(data.aggregated).forEach(([programType, programs]) => {
      stats[programType] = { count: 0, actions: 0, people: 0 };

      Object.entries(programs).forEach(([programName, actions]) => {
        stats[programType].count += 1;

        Object.entries(actions).forEach(([actionName, actionData]) => {
          stats[programType].actions += actionData.actionNumber;
          stats[programType].people += actionData.people;
        });
      });
    });

    return stats;
  }, [data.aggregated]);

  // Calculate averages
  const averages = React.useMemo(() => {
    const selectedCount = selectedMonths.filter((m) => m.selected).length;
    const totalPrograms = Object.values(programTypeStats).reduce((sum, stat) => sum + stat.count, 0);

    return {
      actionsPerMonth: selectedCount > 0 ? Math.round(data.allActions / selectedCount) : 0,
      peoplePerMonth: selectedCount > 0 ? Math.round(data.allPeople / selectedCount) : 0,
      actionsPerProgram: totalPrograms > 0 ? Math.round(data.allActions / totalPrograms) : 0,
      peoplePerProgram: totalPrograms > 0 ? Math.round(data.allPeople / totalPrograms) : 0,
    };
  }, [data.allActions, data.allPeople, selectedMonths, programTypeStats]);

  // Find top performing month
  const topMonth = React.useMemo(() => {
    let maxActions = 0;
    let topMonthNumber = 0;

    Object.entries(monthStats).forEach(([month, stats]) => {
      if (stats.actions > maxActions) {
        maxActions = stats.actions;
        topMonthNumber = Number(month);
      }
    });

    return topMonthNumber > 0 ? MONTH_NAMES[topMonthNumber - 1] : null;
  }, [monthStats]);

  // Find most active program type
  const topProgramType = React.useMemo(() => {
    let maxActions = 0;
    let topType = "";

    Object.entries(programTypeStats).forEach(([type, stats]) => {
      if (stats.actions > maxActions) {
        maxActions = stats.actions;
        topType = type;
      }
    });

    return topType;
  }, [programTypeStats]);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "primary",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  }) => {
    const colorValue = theme.palette[color].main;

    return (
      <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: `${colorValue}15`,
                color: colorValue,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" color={colorValue}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        📊 Zaawansowane Statystyki
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Średnia działań/miesiąc"
            value={averages.actionsPerMonth}
            subtitle={`Z ${selectedMonths.filter((m) => m.selected).length} miesięcy`}
            icon={<CalendarMonth />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Średnia odbiorców/miesiąc"
            value={averages.peoplePerMonth}
            subtitle={`Z ${selectedMonths.filter((m) => m.selected).length} miesięcy`}
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Średnia działań/program"
            value={averages.actionsPerProgram}
            subtitle={`Z ${Object.values(programTypeStats).reduce((sum, stat) => sum + stat.count, 0)} programów`}
            icon={<Assignment />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Średnia odbiorców/program"
            value={averages.peoplePerProgram}
            subtitle={`Z ${Object.values(programTypeStats).reduce((sum, stat) => sum + stat.count, 0)} programów`}
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Top Performers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                🏆 Najaktywniejszy miesiąc
              </Typography>
              {topMonth ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label={topMonth} color="primary" variant="filled" sx={{ fontSize: "1rem", fontWeight: "bold" }} />
                  <Typography variant="body2" color="text.secondary">
                    {
                      monthStats[selectedMonths.find((m) => m.selected && MONTH_NAMES[m.monthNumber - 1] === topMonth)?.monthNumber || 0]
                        ?.actions
                    }{" "}
                    działań
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Brak danych
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                🎯 Najpopularniejszy typ programu
              </Typography>
              {topProgramType ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label={topProgramType} color="secondary" variant="filled" sx={{ fontSize: "1rem", fontWeight: "bold" }} />
                  <Typography variant="body2" color="text.secondary">
                    {programTypeStats[topProgramType]?.actions} działań
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Brak danych
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            📅 Szczegóły miesięczne
          </Typography>
          <Grid container spacing={2}>
            {selectedMonths
              .filter((month) => month.selected)
              .map((month) => {
                const monthData = monthStats[month.monthNumber];
                return (
                  <Grid item xs={12} sm={6} md={4} key={month.monthNumber}>
                    <Box
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50],
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        {MONTH_NAMES[month.monthNumber - 1]}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Działania: <strong>{monthData?.actions || 0}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Odbiorcy: <strong>{monthData?.people || 0}</strong>
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Programy: <strong>{monthData?.programs || 0}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </CardContent>
      </Card>

      {/* Program Type Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            📚 Statystyki typów programów
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(programTypeStats).map(([type, stats]) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Box
                  sx={{
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[50],
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                    {type}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Programy:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stats.count}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Działania:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stats.actions}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Odbiorcy:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stats.people}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Średnia działań/program:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stats.count > 0 ? Math.round(stats.actions / stats.count) : 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

AdvancedStats.displayName = "AdvancedStats";
