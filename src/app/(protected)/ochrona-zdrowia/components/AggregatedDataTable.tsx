"use client";

import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { type AggregatedHealthData, FACILITY_TYPES } from "../types";

interface AggregatedDataTableProps {
  data: AggregatedHealthData;
}

const AggregatedDataTable: React.FC<AggregatedDataTableProps> = ({ data }) => {
  // Calculate totals
  const totals = useMemo(() => {
    return Object.values(data).reduce(
      (acc, curr) => ({
        skontrolowane: acc.skontrolowane + curr.skontrolowane,
        realizowane: acc.realizowane + curr.realizowane,
        zWykorzystaniemPalarni: acc.zWykorzystaniemPalarni + curr.zWykorzystaniemPalarni,
      }),
      { skontrolowane: 0, realizowane: 0, zWykorzystaniemPalarni: 0 }
    );
  }, [data]);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Łączne dane z {Object.keys(data).length} kategorii obiektów:
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "5%" }}>Lp.</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "45%" }}>RODZAJ OBIEKTU</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold", width: "20%" }}>
                LICZBA SKONTROLOWANYCH OBIEKTÓW
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                OGÓŁEM
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold", width: "15%" }}>
                W TYM Z WYKORZYSTANIEM PALARNI
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FACILITY_TYPES.map((type, index) => {
              const rowData = data[type] || {
                skontrolowane: 0,
                realizowane: 0,
                zWykorzystaniemPalarni: 0,
              };

              return (
                <TableRow
                  key={type}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor: index % 2 === 0 ? "grey.50" : "white",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{type}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {rowData.skontrolowane || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {rowData.realizowane || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {rowData.zWykorzystaniemPalarni || ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Totals Row */}
            <TableRow sx={{ bgcolor: "warning.lighter" }}>
              <TableCell colSpan={2}>
                <Typography variant="body1" fontWeight="bold">
                  RAZEM:
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1" fontWeight="bold">
                  {totals.skontrolowane}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1" fontWeight="bold">
                  {totals.realizowane}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1" fontWeight="bold">
                  {totals.zWykorzystaniemPalarni}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AggregatedDataTable;
