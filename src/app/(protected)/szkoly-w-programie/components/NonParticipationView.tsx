"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { PageHeader, LoadingSpinner, StatsCard, NoDataEmptyState, EmptyState } from "@/components/shared";
import { useSzkolyWProgramie } from "@/app/(protected)/szkoly-w-programie/hooks/useSzkolyWProgramie";

type NonParticipationViewProps = ReturnType<typeof useSzkolyWProgramie>;

export default function NonParticipationView(props: NonParticipationViewProps) {
  const {
    schoolsInfo,
    generalStats,
    programStats,
    isLoading,
    schools,
    programs,
    schoolFilter,
    setSchoolFilter,
    programFilter,
    setProgramFilter,
    statusFilter,
    setStatusFilter,
  } = props;

  if (isLoading) {
    return <LoadingSpinner message="Ładowanie danych o udziale szkół..." />;
  }

  const customSortOrder = [
    "Zdrowe zęby mamy, marchewkę zajadamy",
    "Czyste powietrze wokół nas",
    "Higiena naszą tarczą ochronną",
    "Porozmawiajmy o zdrowiu i nowych zagrożeniach",
    "Trzymaj formę",
  ];

  const sortedProgramStats = Object.entries(programStats).sort(([nameA], [nameB]) => {
    const indexA = customSortOrder.indexOf(nameA);
    const indexB = customSortOrder.indexOf(nameB);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return nameA.localeCompare(nameB);
  });

  const schoolOptions = schools.map((s) => ({ id: s.name, name: s.name }));
  const programOptions = programs.map((p) => ({ id: p.id, name: p.name }));

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Status udziału szkół w programach"
        subtitle="Przegląd udziału w programach i kwalifikowalności dla każdej szkoły."
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtry
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={schoolOptions}
                getOptionLabel={(o) => o.name}
                value={schoolOptions.find((o) => o.id === schoolFilter) || null}
                onChange={(_e, value: { id: string; name: string } | null) => setSchoolFilter(value?.id || null)}
                renderInput={(params) => <TextField {...params} label="Filtruj według szkoły" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={programOptions}
                getOptionLabel={(o) => o.name}
                value={programOptions.find((o) => o.id === programFilter) || null}
                onChange={(_e, value: { id: string; name: string } | null) => setProgramFilter(value?.id || null)}
                renderInput={(params) => <TextField {...params} label="Filtruj według programu" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={(_e: React.MouseEvent<HTMLElement>, newValue: "all" | "participating" | "notParticipating" | null) => {
                  if (newValue) setStatusFilter(newValue);
                }}
                aria-label="participation status"
                fullWidth
              >
                <ToggleButton value="all" aria-label="all schools">
                  Wszystkie
                </ToggleButton>
                <ToggleButton value="participating" aria-label="participating schools">
                  Uczestniczące
                </ToggleButton>
                <ToggleButton value="notParticipating" aria-label="not participating schools">
                  Nieuczestniczące
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Statystyki programów
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nazwa programu</TableCell>
                  <TableCell align="right">Uczestniczące</TableCell>
                  <TableCell align="right">Nieuczestniczące</TableCell>
                  <TableCell align="right">Szkoły kwalifikujące się</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProgramStats.map(([name, stats]) => (
                  <TableRow key={name}>
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    <TableCell align="right">{stats.participating}</TableCell>
                    <TableCell align="right">{stats.notParticipating}</TableCell>
                    <TableCell align="right">{stats.eligible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Szczegóły szkół
      </Typography>
      {schoolsInfo.length === 0 && !isLoading ? (
        <EmptyState title="Nie znaleziono szkół pasujących do wybranych filtrów." />
      ) : (
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa szkoły</TableCell>
                <TableCell>Programy, w których szkoła uczestniczy</TableCell>
                <TableCell>Brakujące programy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schoolsInfo.map((school) => (
                <TableRow key={school.schoolName}>
                  <TableCell component="th" scope="row" sx={{ verticalAlign: "top" }}>
                    {school.schoolName}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {school.participating.length > 0 ? (
                        school.participating.map((p) => <Chip key={p.id} label={p.name} size="small" color="success" />)
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Brak
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {school.notParticipating.length > 0 ? (
                        school.notParticipating.map((p) => <Chip key={p.id} label={p.name} size="small" color="error" />)
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Brak
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
