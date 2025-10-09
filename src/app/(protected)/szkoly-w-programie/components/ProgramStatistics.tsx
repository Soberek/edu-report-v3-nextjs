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
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="program-statistics-content"
          id="program-statistics-header"
          sx={{
            minHeight: "48px !important",
            py: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
            <TrendingUp color="primary" sx={{ fontSize: 20 }} />
            Statystyki programów edukacyjnych
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 2 }}>
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
            gap: 1.5,
          },
          minHeight: "48px !important",
          py: 1,
        }}
      >
        <TrendingUp color="primary" sx={{ fontSize: 20 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            Statystyki programów edukacyjnych
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, fontSize: "0.8rem" }}>
            {programStats.length} programów • {programStats.reduce((sum, stat) => sum + stat.schoolCount, 0)} szkół •{" "}
            {programStats.reduce((sum, stat) => sum + stat.totalStudents, 0).toLocaleString()} uczniów
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {programStats.map((stat) => (
            <Card variant="outlined" key={stat.programId} sx={{ flex: "1 1 280px", maxWidth: "320px", minWidth: "260px" }}>
              <CardContent sx={{ py: 1.5, px: 2, pb: "12px !important", "&:last-child": { pb: "12px" } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 1.5, width: 28, height: 28 }}>
                    <School sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {stat.programName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <School sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {stat.schoolCount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <People sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {stat.totalStudents.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Lata szkolne:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.25 }}>
                  {stat.schoolYears.map((year) => (
                    <Chip key={year} label={year} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: "18px", px: 0.5 }} />
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
