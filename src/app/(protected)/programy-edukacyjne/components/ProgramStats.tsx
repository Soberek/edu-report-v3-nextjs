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
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Łączna liczba programów"
            value={totalPrograms}
            icon={<School />}
            color="primary"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Programy programowe"
            value={programowyCount}
            icon={<Assignment />}
            color="secondary"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Programy nieprogramowe"
            value={nieprogramowyCount}
            icon={<AssignmentInd />}
            color="info"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
