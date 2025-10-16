import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, useTheme } from "@mui/material";
import type { ProgramsData } from "../../types";

interface DataTableProps {
  data: ProgramsData;
  allActions: number;
  allPeople: number;
}

export const DataTable: React.FC<DataTableProps> = React.memo(({ data, allActions, allPeople }) => {
  const theme = useTheme();

  const getProgramTypeColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
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
        📋 Szczegółowe dane programów
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem", py: 1.25, color: "text.primary" }} colSpan={2}>
                Typ programu - Nazwa programu
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
            {Object.entries(data).map(([programType, programs], typeIndex) => (
              <React.Fragment key={programType}>
                {/* Program Type Header */}
                <TableRow sx={{ backgroundColor: `${getProgramTypeColor(typeIndex)}08`, borderTop: `2px solid ${getProgramTypeColor(typeIndex)}20` }}>
                  <TableCell colSpan={5} sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 24,
                          borderRadius: 0.5,
                          backgroundColor: getProgramTypeColor(typeIndex),
                        }}
                      />
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.85rem" }}>
                        {programType.toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Program Details */}
                {Object.entries(programs).map(([programName, actions]) => (
                  <React.Fragment key={programName}>
                    {/* Program Name Row */}
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell sx={{ pl: 2, fontWeight: 600, color: "text.primary", fontSize: "0.8rem", py: 0.75 }}>
                        {programName}
                      </TableCell>
                      <TableCell colSpan={4} />
                    </TableRow>

                    {/* Actions */}
                    {Object.entries(actions).map(([actionName, stats]) => (
                      <TableRow
                        key={actionName}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}04`,
                          },
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell sx={{ pl: 4, py: 0.75 }} />
                        <TableCell sx={{ pl: 2, color: "text.secondary", fontSize: "0.8rem", py: 0.75 }} />
                        <TableCell sx={{ fontWeight: actionName === "Wizytacja" ? 700 : 500, fontSize: "0.8rem", py: 0.75, color: "text.primary" }}>
                          {actionName}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: "0.85rem", py: 0.75 }}>
                          {stats.actionNumber}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.success.main, fontSize: "0.85rem", py: 0.75 }}>
                          {stats.people}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {/* Summary Row */}
            <TableRow sx={{  color: "white", borderTop: `2px solid ${theme.palette.primary.dark}` }}>
              <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: "0.85rem", py: 1.25 }}>
                📊 PODSUMOWANIE
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.9rem", py: 1.25 }}>
                {allActions}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.9rem", py: 1.25 }}>
                {allPeople}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

DataTable.displayName = "DataTable";
