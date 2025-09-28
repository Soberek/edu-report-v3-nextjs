import React from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { FileDownload, TableChart } from "@mui/icons-material";
import { exportPostsToCSV, exportHolidaysToExcel, validatePostsForExport, validateHolidaysForExport } from "../utils/exportUtils";
import type { Post, EducationalHolidayWithQuery } from "../types";

interface ExportSectionProps {
  posts: Post[];
  holidays: EducationalHolidayWithQuery[];
  onError: (error: string) => void;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ posts, holidays, onError }) => {
  const handleExportToCSV = () => {
    try {
      if (!validatePostsForExport(posts)) {
        onError("Invalid posts data for CSV export");
        return;
      }
      exportPostsToCSV(posts);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to export CSV");
    }
  };

  const handleExportToExcel = () => {
    try {
      if (!validateHolidaysForExport(holidays)) {
        onError("Invalid holidays data for Excel export");
        return;
      }
      exportHolidaysToExcel(holidays);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to export Excel");
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Eksport danych
      </Typography>

      <Grid container spacing={3}>
        <Grid size={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <TableChart color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Eksportuj posty do pliku Excel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Eksportuj wyodrębnione święta zdrowotne do pliku Excel
            </Typography>
            <Button variant="contained" startIcon={<TableChart />} onClick={handleExportToExcel} sx={{ px: 3, py: 1.5 }}>
              Eksportuj do Excel
            </Button>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <FileDownload color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Eksportuj posty do pliku CSV
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Eksportuj wygenerowane posty do pliku CSV
            </Typography>
            <Button variant="contained" startIcon={<FileDownload />} onClick={handleExportToCSV} sx={{ px: 3, py: 1.5 }}>
              Eksportuj do CSV
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
