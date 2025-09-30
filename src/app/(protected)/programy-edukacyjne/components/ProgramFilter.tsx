import React from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Stack, Paper, SelectChangeEvent } from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { ProgramFilter } from "../hooks/useProgramFilters";
import { Program } from "../types";

interface ProgramFilterProps {
  filter: ProgramFilter;
  onFilterChange: (filter: ProgramFilter) => void;
  uniqueProgramTypes: string[];
}

export const ProgramFilterComponent: React.FC<ProgramFilterProps> = ({ filter, onFilterChange, uniqueProgramTypes }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: event.target.value });
  };

  const handleProgramTypeChange = (event: SelectChangeEvent) => {
    onFilterChange({ ...filter, programType: event.target.value as "all" | "programowy" | "nieprogramowy" });
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    onFilterChange({ ...filter, sortBy: event.target.value as keyof Program });
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    onFilterChange({ ...filter, sortOrder: event.target.value as "asc" | "desc" });
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FilterList color="primary" />
        <Box component="h3" sx={{ m: 0, fontSize: "1.1rem", fontWeight: 600 }}>
          Filtry i sortowanie
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Szukaj programów"
          value={filter.search}
          onChange={handleSearchChange}
          placeholder="Wprowadź nazwę, kod lub opis..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Typ programu</InputLabel>
          <Select value={filter.programType} label="Typ programu" onChange={handleProgramTypeChange}>
            <MenuItem value="all">Wszystkie typy</MenuItem>
            {uniqueProgramTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === "programowy" ? "Programowy" : "Nieprogramowy"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sortuj według</InputLabel>
          <Select value={filter.sortBy} label="Sortuj według" onChange={handleSortByChange}>
            <MenuItem value="name">Nazwa</MenuItem>
            <MenuItem value="code">Kod</MenuItem>
            <MenuItem value="programType">Typ programu</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Kolejność</InputLabel>
          <Select value={filter.sortOrder} label="Kolejność" onChange={handleSortOrderChange}>
            <MenuItem value="asc">Rosnąco</MenuItem>
            <MenuItem value="desc">Malejąco</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};
