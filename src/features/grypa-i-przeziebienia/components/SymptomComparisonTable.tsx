import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip } from "@mui/material";
import { SYMPTOM_COMPARISON } from "../constants";
import type { SymptomComparison } from "../types";

interface SymptomComparisonTableProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const SymptomComparisonTable: React.FC<SymptomComparisonTableProps> = ({ title = "Porównanie objawów", showTitle = true }) => {
  const getSeverityColor = (condition: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (condition.includes("Rzadko") || condition.includes("Łagodny")) return "success";
    if (condition.includes("Wysoka") || condition.includes("Ciężkie")) return "error";
    if (condition.includes("Ryzyko") || condition.includes("Zróżnicowany")) return "warning";
    return "default";
  };

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                },
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem", py: 2 }}>Cecha</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem", py: 2 }}>🤧 Przeziębienie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem", py: 2 }}>🔥 Grypa</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem", py: 2 }}>😷 COVID-19</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SYMPTOM_COMPARISON.map((row, index) => (
              <TableRow
                key={row.feature}
                sx={{
                  backgroundColor: index % 2 === 0 ? "rgba(0, 0, 0, 0.02)" : "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    opacity: 0.1,
                    transform: "scale(1.01)",
                    boxShadow: "0 4px 16px rgba(25, 118, 210, 0.2)",
                  },
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    py: 2,
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 600, borderRight: "1px solid", borderColor: "divider" }}>{row.feature}</TableCell>
                <TableCell>
                  <Chip
                    label={row.cold}
                    size="small"
                    color={getSeverityColor(row.cold)}
                    variant="outlined"
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                      fontWeight: 600,
                      borderWidth: 2,
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                        px: 1.5,
                        py: 0.5,
                      },
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.flu}
                    size="small"
                    color={getSeverityColor(row.flu)}
                    variant="outlined"
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                      fontWeight: 600,
                      borderWidth: 2,
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                        px: 1.5,
                        py: 0.5,
                      },
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.covid19}
                    size="small"
                    color={getSeverityColor(row.covid19)}
                    variant="outlined"
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                      fontWeight: 600,
                      borderWidth: 2,
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                        px: 1.5,
                        py: 0.5,
                      },
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
