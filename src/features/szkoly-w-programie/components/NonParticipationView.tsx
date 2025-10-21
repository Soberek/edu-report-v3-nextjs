"use client";
import React, { useMemo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { PageHeader, LoadingSpinner, StatsCard, FilterSection, TableWrapper, type FilterField } from "@/components/shared";
import { useParticipationData, useParticipationFilters, useParticipationStatus } from "../hooks/useSchoolParticipationContext";
import type { Program } from "@/types";
import type { SchoolParticipationInfo, ProgramStatsItem } from "../types/szkoly-w-programie.types";

type SchoolParticipationRow = SchoolParticipationInfo & {
  id: string;
  [key: string]: unknown;
};

type ProgramStatsRow = {
  id: string;
  programName: string;
  participating: number;
  notParticipating: number;
  eligible: number;
};

import { CUSTOM_SORT_ORDER, STATUS_FILTER_OPTIONS } from "../constants";

// ... (rest of the file is unchanged)

const renderPrograms = (programs: readonly Program[], color: "success" | "error") => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {programs.length > 0 ? (
      programs.map((program) => <Chip key={program.id} label={program.name} size="small" color={color} />)
    ) : (
      <Typography variant="body2" color="text.secondary">
        Brak
      </Typography>
    )}
  </Box>
);

export default function NonParticipationView() {
  const { isLoading } = useParticipationStatus();
  const { schoolsInfo, generalStats, programStats, schools, programs } = useParticipationData();
  const {
    schoolFilter,
    setSchoolFilter,
    programFilter,
    setProgramFilter,
    statusFilter,
    setStatusFilter,
  } = useParticipationFilters();

  const sortedProgramStats = useMemo(
    () =>
      Object.entries(programStats).sort(([nameA], [nameB]) => {
        const indexA = CUSTOM_SORT_ORDER.indexOf(nameA as (typeof CUSTOM_SORT_ORDER)[number]);
        const indexB = CUSTOM_SORT_ORDER.indexOf(nameB as (typeof CUSTOM_SORT_ORDER)[number]);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return nameA.localeCompare(nameB);
      }),
    [programStats]
  );

  const schoolOptions = useMemo(
    () => schools.map((school) => ({ label: school.name, value: school.name })),
    [schools]
  );

  const programOptions = useMemo(
    () => programs.map((program) => ({ label: program.name, value: program.id })),
    [programs]
  );

  const filterFields: FilterField[] = [
    {
      id: "schoolFilter",
      type: "select",
      label: "Szkoła",
      value: schoolFilter ?? "",
      onChange: (value) => setSchoolFilter(value || null),
      options: schoolOptions,
      emptyOptionLabel: "Wszystkie szkoły",
    },
    {
      id: "programFilter",
      type: "select",
      label: "Program",
      value: programFilter ?? "",
      onChange: (value) => setProgramFilter(value || null),
      options: programOptions,
      emptyOptionLabel: "Wszystkie programy",
    },
    {
      id: "statusFilter",
      type: "select",
      label: "Status uczestnictwa",
      value: statusFilter,
      onChange: (value) => setStatusFilter((value as "all" | "participating" | "notParticipating") || "all"),
      options: STATUS_FILTER_OPTIONS,
    },
  ];

  const handleClearFilters = () => {
    setSchoolFilter(null);
    setProgramFilter(null);
    setStatusFilter("all");
  };

  const programStatsRows: ProgramStatsRow[] = useMemo(
    () =>
      sortedProgramStats.map(([name, stats]) => ({
        id: name,
        programName: name,
        participating: stats.participating,
        notParticipating: stats.notParticipating,
        eligible: stats.eligible,
      })),
    [sortedProgramStats]
  );

  const programStatsColumns: GridColDef<ProgramStatsRow>[] = useMemo(
    () => [
      { field: "programName", headerName: "Nazwa programu", flex: 1, minWidth: 220 },
      { field: "participating", headerName: "Uczestniczące", flex: 0.6, minWidth: 150, type: "number" },
      { field: "notParticipating", headerName: "Nieuczestniczące", flex: 0.7, minWidth: 170, type: "number" },
      { field: "eligible", headerName: "Kwalifikujące się szkoły", flex: 0.8, minWidth: 190, type: "number" },
    ],
    []
  );

  const schoolRows: SchoolParticipationRow[] = useMemo(
    () =>
      schoolsInfo.map((school) => ({
        id: school.schoolName,
        ...school,
      })),
    [schoolsInfo]
  );

  const schoolColumns: GridColDef<SchoolParticipationRow>[] = useMemo(
    () => [
      { field: "schoolName", headerName: "Nazwa szkoły", flex: 1, minWidth: 240 },
      {
        field: "participating",
        headerName: "Programy, w których szkoła uczestniczy",
        flex: 1.2,
        minWidth: 260,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<SchoolParticipationRow, SchoolParticipationRow["participating"]>) =>
          renderPrograms(params.row.participating, "success"),
      },
      {
        field: "notParticipating",
        headerName: "Brakujące programy",
        flex: 1.2,
        minWidth: 260,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<SchoolParticipationRow, SchoolParticipationRow["notParticipating"]>) =>
          renderPrograms(params.row.notParticipating, "error"),
      },
    ],
    []
  );

  if (isLoading) {
    return <LoadingSpinner message="Ładowanie danych o udziale szkół..." />;
  }

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <PageHeader
        title="Status udziału szkół w programach"
        subtitle="Przegląd udziału w programach i kwalifikowalności dla każdej szkoły."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatsCard title="Liczba wszystkich szkół" value={generalStats.totalSchools.toString()} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatsCard title="Szkoły z brakującymi programami" value={generalStats.nonParticipatingCount.toString()} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatsCard title="Łączna liczba uczestnictw" value={generalStats.totalParticipations.toString()} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatsCard title="Łączna liczba brakujących uczestnictw" value={generalStats.totalMissingParticipations.toString()} />
        </Grid>
      </Grid>

      <FilterSection fields={filterFields} onClearAll={handleClearFilters} sx={{ maxWidth: 1200 }} />

      <TableWrapper<ProgramStatsRow>
        title="Statystyki programów"
        subtitle="Porównanie udziału i kwalifikowalności szkół w programach"
        data={programStatsRows}
        columns={programStatsColumns}
        height={Math.min(400, 160 + programStatsRows.length * 56)}
        emptyTitle="Brak statystyk programów"
        emptyDescription="Brak danych spełniających kryteria filtrów."
        getRowId={(row) => row.id}
      />

      <TableWrapper<SchoolParticipationRow>
        title="Szczegóły szkół"
        subtitle="Zestawienie programów realizowanych i brakujących dla poszczególnych szkół"
        data={schoolRows}
        columns={schoolColumns}
        height={600}
        emptyTitle="Nie znaleziono szkół pasujących do wybranych filtrów."
        emptyDescription="Zmodyfikuj filtry, aby wyświetlić listę szkół."
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
