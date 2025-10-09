"use client";
import React, { useMemo, useState } from "react";
import { Box, Card, CardContent, Typography, Chip, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { School, People, TrendingUp, ExpandMore } from "@mui/icons-material";
import type { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import type { Program } from "@/types";

interface ProgramStatisticsProps {
  participations: readonly SchoolProgramParticipation[];
  programs: readonly Program[];
}

interface ProgramStats {
  programId: string;
  programName: string;
  schoolCount: number;
  totalStudents: number;
  schoolYears: string[];
}

export const ProgramStatistics: React.FC<ProgramStatisticsProps> = ({ participations, programs }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  const programStats = useMemo((): ProgramStats[] => {
    // Group participations by program
    const programGroups = participations.reduce((acc, participation) => {
      const programId = participation.programId;
      if (!acc[programId]) {
        acc[programId] = [];
      }
      acc[programId].push(participation);
      return acc;
    }, {} as Record<string, SchoolProgramParticipation[]>);

    // Calculate statistics for each program
    return Object.entries(programGroups)
      .map(([programId, programParticipations]) => {
        const program = programs.find((p) => p.id === programId);
        const schoolCount = programParticipations.length;
        const totalStudents = programParticipations.reduce((sum, p) => sum + p.studentCount, 0);
        const schoolYears = [...new Set(programParticipations.map((p) => p.schoolYear))].sort();

        return {
          programId,
          programName: program?.name || `Program ${programId}`,
          schoolCount,
          totalStudents,
          schoolYears,
        };
      })
      .sort((a, b) => b.schoolCount - a.schoolCount); // Sort by school count descending
  }, [participations, programs]);

  if (programStats.length === 0) {
    return (
      <Accordion expanded={expanded} onChange={handleChange} sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="program-statistics-content" id="program-statistics-header">
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp color="primary" />
            Statystyki programów edukacyjnych
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Brak danych do wyświetlenia. Dodaj pierwsze szkoły do programów, aby zobaczyć statystyki.
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Accordion expanded={expanded} onChange={handleChange} sx={{ mb: 3 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="program-statistics-content"
        id="program-statistics-header"
        sx={{
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 2,
          },
        }}
      >
        <TrendingUp color="primary" />
        <Box>
          <Typography variant="h6">Statystyki programów edukacyjnych</Typography>
          <Typography variant="body2" color="text.secondary">
            {programStats.length} programów • {programStats.reduce((sum, stat) => sum + stat.schoolCount, 0)} szkół •{" "}
            {programStats.reduce((sum, stat) => sum + stat.totalStudents, 0).toLocaleString()} uczniów
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Podsumowanie programów z udziałem szkół
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {programStats.map((stat) => (
            <Card variant="outlined" key={stat.programId} sx={{ mb: 1 }}>
              <CardContent sx={{ pb: "16px !important" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}>
                    <School fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {stat.programName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <School fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Szkoły:
                  </Typography>
                  <Chip label={stat.schoolCount} size="small" color="primary" sx={{ ml: 1 }} />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <People fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Uczniowie:
                  </Typography>
                  <Chip label={stat.totalStudents.toLocaleString()} size="small" color="secondary" sx={{ ml: 1 }} />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Lata szkolne:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                  {stat.schoolYears.map((year) => (
                    <Chip key={year} label={year} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: "20px" }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
