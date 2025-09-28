import React from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import type { SchoolFilterProps } from "../types";

export const SchoolFilter: React.FC<SchoolFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        border: "1px solid #e9ecef",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <FilterList sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Filtry
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {/* Search */}
        <TextField
          label="Szukaj"
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              borderRadius: 1.5,
            },
          }}
        />

        {/* Type Filter */}
        <Autocomplete
          value={filter.type}
          onChange={(_, newValue) => onFilterChange({ type: newValue || "" })}
          options={[]} // Will be populated by parent component
          renderInput={(params) => (
            <TextField
              {...params}
              label="Typ szkoły"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: 1.5,
                },
              }}
            />
          )}
        />

        {/* City Filter */}
        <Autocomplete
          value={filter.city}
          onChange={(_, newValue) => onFilterChange({ city: newValue || "" })}
          options={[]} // Will be populated by parent component
          renderInput={(params) => (
            <TextField
              {...params}
              label="Miasto"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: 1.5,
                },
              }}
            />
          )}
        />
      </Box>
    </Paper>
  );
};
