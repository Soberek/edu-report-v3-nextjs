import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { FilterList, Search, Clear, CheckCircle, Assignment, Pending, CalendarToday, School } from "@mui/icons-material";
import type { Program } from "@/types";

interface FilterState {
  programIds: string[];
  taskTypeId: string;
  month: string;
  status: string;
  search: string;
  year: string;
}

interface FilterSectionProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredPrograms: Program[];
  months: { [key: string]: string };
  years: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({ filter, setFilter, filteredPrograms, months, years }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <FilterList sx={{ color: "#1976d2" }} />
          Filtry
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          {/* Search Filter */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
              <Search sx={{ mr: 1, verticalAlign: "middle" }} />
              Wyszukaj zadania:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                placeholder="Szukaj po nazwie, opisie lub programie..."
                value={filter.search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              />
              {filter.search && (
                <IconButton
                  onClick={() => setFilter((prev) => ({ ...prev, search: "" }))}
                  size="small"
                  sx={{
                    background: "rgba(0,0,0,0.1)",
                    "&:hover": { background: "rgba(0,0,0,0.2)" },
                  }}
                >
                  <Clear />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Status Filter */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
              <CheckCircle sx={{ mr: 1, verticalAlign: "middle" }} />
              Status:
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Status zadania</InputLabel>
              <Select
                value={filter.status}
                onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
                label="Status zadania"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Assignment sx={{ fontSize: 16, color: "#666" }} />
                    <Typography>Wszystkie</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: "#4caf50" }} />
                    <Typography>Ukończone</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="pending">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Pending sx={{ fontSize: 16, color: "#ff9800" }} />
                    <Typography>Oczekujące</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Month Filter */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
              <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
              Miesiąc:
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Miesiąc</InputLabel>
              <Select
                value={filter.month}
                onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
                label="Miesiąc"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                    <Typography>Wszystkie miesiące</Typography>
                  </Box>
                </MenuItem>
                {Object.entries(months).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: "#1976d2" }} />
                      <Typography>{label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Year Filter */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
              <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
              Rok:
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Rok</InputLabel>
              <Select
                value={filter.year}
                onChange={(e) => setFilter((prev) => ({ ...prev, year: e.target.value }))}
                label="Rok"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                    <Typography>Wszystkie lata</Typography>
                  </Box>
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: "#1976d2" }} />
                      <Typography>{year}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Program Filter */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
              <School sx={{ mr: 1, verticalAlign: "middle" }} />
              Programy:
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <FormControl sx={{ flex: 1 }} fullWidth size="small">
                <InputLabel>Wybierz programy</InputLabel>
                <Select
                  multiple
                  value={filter.programIds}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    // If the special ALL option was selected, clear selection
                    if (value.includes("ALL")) {
                      setFilter((prev) => ({ ...prev, programIds: [] }));
                    } else {
                      setFilter((prev) => ({ ...prev, programIds: value }));
                    }
                  }}
                  input={<OutlinedInput label="Wybierz programy" />}
                  renderValue={(selected) => {
                    const sel = (selected as string[]) || [];
                    if (sel.length === 0) {
                      return <Typography color="text.secondary">Wszystkie programy</Typography>;
                    }
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sel.map((value) => {
                          const program = filteredPrograms.find((p) => p.id === value);
                          return (
                            <Chip
                              key={value}
                              label={program ? `${program.code} ${program.name}` : value}
                              size="small"
                              sx={{
                                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                                color: "white",
                                fontSize: "0.75rem",
                                height: 20,
                              }}
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                      minHeight: 40,
                    },
                  }}
                >
                  <MenuItem value="ALL">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <School sx={{ fontSize: 16, color: "#666" }} />
                      <Typography>Wszystkie programy</Typography>
                    </Box>
                  </MenuItem>
                  {filteredPrograms.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <School sx={{ fontSize: 16, color: "#1976d2" }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {program.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {program.name}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Clear selected programs button */}
              {filter.programIds && filter.programIds.length > 0 && (
                <IconButton
                  aria-label="Wyczyść programy"
                  size="small"
                  onClick={() => setFilter((prev) => ({ ...prev, programIds: [] }))}
                  sx={{ background: "rgba(0,0,0,0.05)", borderRadius: 1 }}
                >
                  <Clear />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
