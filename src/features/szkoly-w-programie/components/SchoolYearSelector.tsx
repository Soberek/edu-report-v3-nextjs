"use client";
import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip } from "@mui/material";
import { SchoolYear } from "@/types";

interface SchoolYearSelectorProps {
  selectedYear: SchoolYear | "all";
  onYearChange: (year: SchoolYear | "all") => void;
  availableYears: SchoolYear[];
}

const SCHOOL_YEARS: SchoolYear[] = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];

export const SchoolYearSelector: React.FC<SchoolYearSelectorProps> = ({ selectedYear, onYearChange, availableYears }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onYearChange(value === "all" ? "all" : (value as SchoolYear));
  };

  // Filter available years to only show those that have data
  const displayYears = SCHOOL_YEARS.filter((year) => availableYears.includes(year));

  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="school-year-select-label">Rok szkolny</InputLabel>
        <Select labelId="school-year-select-label" id="school-year-select" value={selectedYear} label="Rok szkolny" onChange={handleChange}>
          <MenuItem value="all">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Wszystkie lata
              <Chip label={availableYears.length} size="small" color="primary" sx={{ ml: 1 }} />
            </Box>
          </MenuItem>
          {displayYears.map((year) => (
            <MenuItem key={year} value={year}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {year}
                <Chip label={availableYears.filter((y) => y === year).length} size="small" color="secondary" variant="outlined" />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedYear !== "all" && (
        <Chip
          label={`Wybrany: ${selectedYear}`}
          color="primary"
          variant="filled"
          onDelete={() => onYearChange("all")}
          sx={{ cursor: "pointer" }}
        />
      )}
    </Box>
  );
};
