import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { School, Assignment, AssignmentInd } from "@mui/icons-material";
import { StatsCard } from "@/components/shared";

interface ProgramStatsProps {
  totalPrograms: number;
  programowyCount: number;
  nieprogramowyCount: number;
}

export const ProgramStats: React.FC<ProgramStatsProps> = ({ totalPrograms, programowyCount, nieprogramowyCount }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" color="primary.main" mb={2}>
        Statystyki programów
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard title="Łączna liczba programów" value={totalPrograms} icon={<School />} color="primary" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard title="Programy programowe" value={programowyCount} icon={<Assignment />} color="secondary" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard title="Programy nieprogramowe" value={nieprogramowyCount} icon={<AssignmentInd />} color="info" />
        </Grid>
      </Grid>
    </Box>
  );
};
