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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        Szczegółowe dane programów
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }} colSpan={2}>
                Typ programu - Nazwa programu
              </TableCell>
              {/* <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Nazwa programu</TableCell> */}
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Działanie</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                Liczba działań
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                Liczba odbiorców
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([programType, programs], typeIndex) => (
              <React.Fragment key={programType}>
                {/* Program Type Header */}
                <TableRow sx={{ backgroundColor: `${getProgramTypeColor(typeIndex)}10` }}>
                  <TableCell colSpan={5} sx={{ fontWeight: "bold", fontSize: "1rem", py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={programType}
                        size="small"
                        sx={{
                          backgroundColor: getProgramTypeColor(typeIndex),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Program Details */}
                {Object.entries(programs).map(([programName, actions]) => (
                  <React.Fragment key={programName}>
                    {/* Program Name Row */}
                    <TableRow sx={{ backgroundColor: "#252525" }}>
                      <TableCell sx={{ pl: 1, fontWeight: 600, color: "white" }}>{programName}</TableCell>
                      <TableCell colSpan={4} />
                    </TableRow>

                    {/* Actions */}
                    {Object.entries(actions).map(([actionName, stats]) => (
                      <TableRow
                        key={actionName}
                        hover
                        sx={{ textAlign: "center" }}
                        className="[&>td]:outline outline-1 outline-transparent hover:[&>td]:outline-gray-300 "
                      >
                        <TableCell sx={{ pl: 4, color: "text.secondary" }} />
                        <TableCell sx={{ pl: 2, color: "text.secondary" }} />
                        <TableCell sx={{ fontWeight: 500 }}>{actionName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                          {stats.actionNumber}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                          {stats.people}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {/* Summary Row */}
            <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                PODSUMOWANIE
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {allActions}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
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
