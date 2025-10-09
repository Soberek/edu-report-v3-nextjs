"use client";
import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip } from "@mui/material";
import type { Program } from "@/types";

interface ProgramWithCount extends Program {
  participationCount: number;
}

interface ProgramSelectorProps {
  selectedProgram: string | "all";
  onProgramChange: (programId: string | "all") => void;
  availablePrograms: ProgramWithCount[];
}

export const ProgramSelector: React.FC<ProgramSelectorProps> = ({ selectedProgram, onProgramChange, availablePrograms }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onProgramChange(value === "all" ? "all" : value);
  };

  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="program-select-label">Program</InputLabel>
        <Select labelId="program-select-label" id="program-select" value={selectedProgram} label="Program" onChange={handleChange}>
          <MenuItem value="all">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Wszystkie programy
              <Chip label={availablePrograms.length} size="small" color="primary" sx={{ ml: 1 }} />
            </Box>
          </MenuItem>
          {availablePrograms.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {program.name}
                <Chip label={program.participationCount} size="small" color="secondary" variant="outlined" />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedProgram !== "all" && (
        <Chip
          label={`Wybrany: ${availablePrograms.find((p) => p.id === selectedProgram)?.name || selectedProgram}`}
          color="primary"
          variant="filled"
          onDelete={() => onProgramChange("all")}
          sx={{ cursor: "pointer" }}
        />
      )}
    </Box>
  );
};
