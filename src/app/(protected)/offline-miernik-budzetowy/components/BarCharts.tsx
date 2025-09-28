import React from "react";
import { Box, Typography, Card, CardContent, useTheme, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Month, ExcelRow } from "../types";
import { MONTH_NAMES } from "../types";

interface BarChartsProps {
  rawData: ExcelRow[];
  selectedMonths: Month[];
}

export const BarCharts: React.FC<BarChartsProps> = React.memo(({ rawData, selectedMonths }) => {
  const theme = useTheme();

  // Calculate monthly data for charts
  const monthlyData = React.useMemo(() => {
    if (!rawData.length) {
      return [];
    }

    const selectedMonthNumbers = selectedMonths
      .filter((m) => m.selected)
      .map((m) => m.monthNumber);

    const monthData: { [key: number]: { actions: number; people: number } } = {};

    rawData.forEach((row) => {
      try {
        const date = new Date(row["Data"]);
        const month = date.getMonth() + 1;

        if (selectedMonthNumbers.includes(month)) {
          if (!monthData[month]) {
            monthData[month] = { actions: 0, people: 0 };
          }

          monthData[month].actions += Number(row["Liczba działań"]) || 0;
          monthData[month].people += Number(row["Liczba ludzi"]) || 0;
        }
      } catch (error) {
        // Skip invalid dates
      }
    });

    // Convert to array format for charts
    return selectedMonthNumbers
      .map((monthNumber) => ({
        month: MONTH_NAMES[monthNumber - 1],
        monthNumber,
        actions: monthData[monthNumber]?.actions || 0,
        people: monthData[monthNumber]?.people || 0,
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  }, [rawData, selectedMonths]);

  const hasData = monthlyData.length > 0;

  if (!hasData) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Brak danych do wyświetlenia
        </Typography>
        <Typography variant="body1">
          Wczytaj plik Excel i wybierz miesiące, aby zobaczyć wykresy
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Actions Chart */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            📈 Liczba działań według miesięcy
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                />
                <Legend />
                <Bar
                  dataKey="actions"
                  name="Liczba działań"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* People Chart */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            👥 Liczba odbiorców według miesięcy
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                />
                <Legend />
                <Bar
                  dataKey="people"
                  name="Liczba odbiorców"
                  fill={theme.palette.success.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Combined Chart */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            📊 Porównanie działań i odbiorców
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                />
                <Legend />
                <Bar
                  dataKey="actions"
                  name="Liczba działań"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="people"
                  name="Liczba odbiorców"
                  fill={theme.palette.success.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            📋 Podsumowanie miesięczne
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: theme.palette.grey[100] }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${theme.palette.divider}` }}>
                    Miesiąc
                  </th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                    Działania
                  </th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                    Odbiorcy
                  </th>
                  <th style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                    Średnia odbiorców/działanie
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => (
                  <tr key={data.month} style={{ backgroundColor: index % 2 === 0 ? "transparent" : theme.palette.grey[50] }}>
                    <td style={{ padding: "12px", borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body1" fontWeight="medium">
                        {data.month}
                      </Typography>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        {data.actions}
                      </Typography>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body1" color="success.main" fontWeight="bold">
                        {data.people}
                      </Typography>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body1" color="text.secondary">
                        {data.actions > 0 ? Math.round(data.people / data.actions) : 0}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: theme.palette.primary.main, color: "white" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    <Typography variant="body1" fontWeight="bold" color="white">
                      RAZEM
                    </Typography>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                    <Typography variant="body1" fontWeight="bold" color="white">
                      {monthlyData.reduce((sum, data) => sum + data.actions, 0)}
                    </Typography>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                    <Typography variant="body1" fontWeight="bold" color="white">
                      {monthlyData.reduce((sum, data) => sum + data.people, 0)}
                    </Typography>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                    <Typography variant="body1" fontWeight="bold" color="white">
                      {monthlyData.reduce((sum, data) => sum + data.actions, 0) > 0 
                        ? Math.round(monthlyData.reduce((sum, data) => sum + data.people, 0) / monthlyData.reduce((sum, data) => sum + data.actions, 0))
                        : 0}
                    </Typography>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});

BarCharts.displayName = "BarCharts";
