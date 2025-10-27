import React from "react";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, type Theme, CircularProgress } from "@mui/material";
import type { ExcelRow, Month } from "../../../types";
import { useWskazniki } from "../hooks/useWskazniki";

interface IndicatorsViewProps {
  readonly rawData: ExcelRow[];
  readonly selectedMonths: Month[];
}

const CATEGORY_COLORS = [
  (theme: Theme) => theme.palette.primary.main,
  (theme: Theme) => theme.palette.success.main,
  (theme: Theme) => theme.palette.warning.main,
  (theme: Theme) => theme.palette.error.main,
  (theme: Theme) => theme.palette.info.main,
] as const;

const getCategoryColor = (theme: Theme, index: number) => {
  const colorFn = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return colorFn(theme);
};

/**
 * Displays data aggregated by indicator categories
 * Uses useWskazniki hook for all state and logic management
 */
export const IndicatorsView: React.FC<IndicatorsViewProps> = ({ rawData, selectedMonths }) => {
  const theme = useTheme();
  const { state, hasData, error, isLoading, formatGroupedName } = useWskazniki({
    rawData,
    selectedMonths,
    useAllGroupings: true,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography color="error">Błąd: {error}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!state || !hasData) {
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
            {state?.byCategory && Object.entries(state.byCategory).map(([mainCategory, programTypes], categoryIndex) => {
              const categoryColor = getCategoryColor(theme, categoryIndex);
              const categoryTotal = state?.categoryTotals[mainCategory];

              return (
                <React.Fragment key={mainCategory}>
                  {/* Category Header */}
                  <TableRow sx={{ backgroundColor: `${categoryColor}40`, borderTop: `2px solid ${categoryColor}20` }}>
                    <TableCell colSpan={5} sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 4, height: 24, borderRadius: 0.5, backgroundColor: categoryColor }} />
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
                        <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                          <TableCell sx={{ pl: 2, fontWeight: 600, color: "text.primary", fontSize: "0.8rem", py: 0.75 }}>
                            {formatGroupedName(programName)}
                          </TableCell>
                          <TableCell colSpan={4} />
                        </TableRow>

                        {/* Action Rows */}
                        {Object.entries(actions).map(([actionName, actionData]) => (
                          <TableRow key={actionName} sx={{ "&:hover": { backgroundColor: theme.palette.grey[50] } }}>
                            <TableCell colSpan={2} sx={{ pl: 4, fontSize: "0.75rem", py: 0.5 }} />
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
                {state.totalActions}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1.5 }}>
                {state.totalPeople}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
