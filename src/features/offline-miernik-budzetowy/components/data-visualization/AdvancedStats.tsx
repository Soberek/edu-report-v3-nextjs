import React from "react";
import { Box, Typography, Grid, Card, CardContent, useTheme, Chip } from "@mui/material";
import { TrendingUp, People, Assignment, CalendarMonth } from "@mui/icons-material";
import type { AggregatedData, Month, ExcelRow } from "../../types";
import { MONTH_NAMES } from "../../types";

interface AdvancedStatsProps {
  data: AggregatedData;
  selectedMonths: Month[];
  rawData: ExcelRow[];
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
      } catch {
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

      Object.entries(programs).forEach(([, actions]) => {
        stats[programType].count += 1;

        Object.entries(actions).forEach(([, actionData]) => {
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
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor: `${colorValue}08`,
          border: `1px solid ${colorValue}20`,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: `${colorValue}12`,
            borderColor: `${colorValue}40`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: `${colorValue}15`,
            color: colorValue,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            {title}
          </Typography>
          <Typography variant="body1" fontWeight={700} color={colorValue} sx={{ lineHeight: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 1.5, fontSize: "0.95rem" }}>
        📊 Zaawansowane Statystyki
      </Typography>

      {/* Overview Stats - 2x2 Grid */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Średnia działań/miesiąc"
            value={averages.actionsPerMonth}
            subtitle={`Z ${selectedMonths.filter((m) => m.selected).length} miesięcy`}
            icon={<CalendarMonth sx={{ fontSize: 16 }} />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Średnia odbiorców/miesiąc"
            value={averages.peoplePerMonth}
            icon={<People sx={{ fontSize: 16 }} />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Średnia działań/program"
            value={averages.actionsPerProgram}
            subtitle={`Z ${Object.values(programTypeStats).reduce((sum, stat) => sum + stat.count, 0)} programów`}
            icon={<Assignment sx={{ fontSize: 16 }} />}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Średnia odbiorców/program"
            value={averages.peoplePerProgram}
            icon={<TrendingUp sx={{ fontSize: 16 }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Top Performers */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 0.75 }}>
              🏆 Najaktywniejszy miesiąc
            </Typography>
            {topMonth ? (
              <Chip label={topMonth} color="primary" size="small" sx={{ height: 24, fontSize: "0.75rem" }} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Brak danych
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 0.75 }}>
              🎯 Najpopularniejszy typ
            </Typography>
            {topProgramType ? (
              <Chip label={topProgramType} color="primary" size="small" sx={{ height: 24, fontSize: "0.75rem"}} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Brak danych
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Monthly Breakdown - Compact */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 1 }}>
          📅 Szczegóły miesięczne
        </Typography>
        <Grid container spacing={0.75}>
          {selectedMonths
            .filter((month) => month.selected)
            .map((month) => {
              const monthData = monthStats[month.monthNumber];
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={month.monthNumber}>
                  <Box
                    sx={{
                      p: 1.25,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.75 }}>
                      {MONTH_NAMES[month.monthNumber - 1]}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          Działania:
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.7rem" }}>
                          {monthData?.actions || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          Odbiorcy:
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.7rem" }}>
                          {monthData?.people || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          Programy:
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.7rem" }}>
                          {monthData?.programs || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
        </Grid>
      </Box>

      {/* Program Type Breakdown - Compact */}
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.7rem", display: "block", mb: 1 }}>
          📚 Typy programów
        </Typography>
        <Grid container spacing={0.75}>
          {Object.entries(programTypeStats).map(([type, stats]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type}>
              <Box
                sx={{
                  p: 1.25,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.paper,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.75 }}>
                  {type}
                </Typography>
                <Grid container spacing={0.5}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ fontSize: "0.65rem" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block" }}>
                        Programy
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
                        {stats.count}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ fontSize: "0.65rem" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block" }}>
                        Działania
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
                        {stats.actions}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ fontSize: "0.65rem" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block" }}>
                        Odbiorcy
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
                        {stats.people}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ fontSize: "0.65rem" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block" }}>
                        Średnia
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
                        {stats.count > 0 ? Math.round(stats.actions / stats.count) : 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
});

AdvancedStats.displayName = "AdvancedStats";