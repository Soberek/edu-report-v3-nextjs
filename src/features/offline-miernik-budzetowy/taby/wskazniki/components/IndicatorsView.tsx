import React, { useMemo } from "react";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from "@mui/material";
import type { ExcelRow, Month } from "../../../types";
import { aggregateByIndicators } from "../utils/aggregateByIndicators";

interface IndicatorsViewProps {
  readonly rawData: ExcelRow[];
  readonly selectedMonths: Month[];
}

/**
 * Displays data aggregated by indicator categories
 * Shows breakdown by main health categories (Szczepienia, Otyłość, etc)
 */
export const IndicatorsView: React.FC<IndicatorsViewProps> = ({ rawData, selectedMonths }) => {
  const theme = useTheme();

  // Calculate aggregated data by categories
  const aggregatedData = useMemo(() => {
    const selectedMonthNumbers = selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);
    return aggregateByIndicators(rawData, selectedMonthNumbers.length > 0 ? selectedMonthNumbers : undefined);
  }, [rawData, selectedMonths]);

  if (!aggregatedData.byCategory || Object.keys(aggregatedData.byCategory).length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Brak danych dla wskaźników.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 1.5, fontSize: "0.95rem" }}>
        📊 Wskaźniki - Zagregowane działania
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", py: 1.25, color: "text.primary" }} colSpan={2}>
                Kategoria - Nazwa programu
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", py: 1.25, color: "text.primary" }}>
                Działanie
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.8rem", py: 1.25, color: "text.primary" }}>
                Działań
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.8rem", py: 1.25, color: "text.primary" }}>
                Odbiorców
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(aggregatedData.byCategory).map(([mainCategory, programTypes], categoryIndex) => {
              const categoryColor = getCategoryColor(categoryIndex);
              const categoryTotal = aggregatedData.categoryTotals[mainCategory];

              return (
                <React.Fragment key={mainCategory}>
                  {/* Category Header */}
                  <TableRow sx={{ backgroundColor: `${categoryColor}08`, borderTop: `2px solid ${categoryColor}20` }}>
                    <TableCell colSpan={5} sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 24,
                            borderRadius: 0.5,
                            backgroundColor: categoryColor,
                          }}
                        />
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.85rem" }}>
                          {mainCategory}
                        </Typography>
                        {categoryTotal && (
                          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "text.secondary", ml: "auto" }}>
                            {categoryTotal.actions} działań • {categoryTotal.people} osób
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Program Details */}
                  {Object.entries(programTypes).map(([programType, programs]) =>
                    Object.entries(programs).map(([programName, actions]) => (
                      <React.Fragment key={`${programType}-${programName}`}>
                        {/* Program Name Row */}
                        <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                          <TableCell sx={{ pl: 2, fontWeight: 600, color: "text.primary", fontSize: "0.8rem", py: 0.75 }}>
                            {programName}
                          </TableCell>
                          <TableCell colSpan={4} />
                        </TableRow>

                        {/* Action Rows */}
                        {Object.entries(actions).map(([actionName, actionData]) => (
                          <TableRow key={actionName} sx={{ "&:hover": { backgroundColor: theme.palette.grey[50] } }}>
                            <TableCell sx={{ pl: 4, fontSize: "0.75rem", py: 0.5 }} />
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5, color: "text.secondary" }}>
                              {actionName}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", py: 0.5, fontWeight: 600 }}>
                              {actionData.actionNumber}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", py: 0.5, fontWeight: 600 }}>
                              {actionData.people}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </React.Fragment>
              );
            })}

            {/* Grand Total Row */}
            <TableRow sx={{ backgroundColor: theme.palette.grey[100], fontWeight: 700 }}>
              <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1.5 }}>
                RAZEM
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1.5 }}>
                {aggregatedData.totalActions}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1.5 }}>
                {aggregatedData.totalPeople}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
