import React from "react";
import { Box, FormControl, Select, MenuItem, Paper, Typography } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import { ActRecordsPdfPreview } from "./pdf-preview";
import type { CaseRecord } from "@/types";

interface FilterSectionProps {
  selectedCode: { code: string; title: string };
  actsOptions: Array<{ code: string; name: string }>;
  sortedCaseRecords: CaseRecord[];
  onCodeChange: (code: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  selectedCode,
  actsOptions,
  sortedCaseRecords,
  onCodeChange,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
        overflow: "hidden",
        mb: 3,
      }}
    >
      <Box
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          p: 2,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FilterIcon sx={{ color: "#1976d2" }} />
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Filtrowanie i eksport
          </Typography>
          
          <FormControl sx={{ minWidth: 250 }}>
            <Select
              value={selectedCode.code}
              onChange={(event) => onCodeChange(event.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Wybierz kod" }}
              sx={{
                borderRadius: 2,
                background: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,0,0,0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem value="" disabled>
                <em>Wybierz kod</em>
              </MenuItem>
              <MenuItem value="">
                <em>Wszystkie</em>
              </MenuItem>
              {actsOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.code} - {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCode.title && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              Wybrany: {selectedCode.title}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <ActRecordsPdfPreview 
          caseRecords={sortedCaseRecords} 
          selectedCode={selectedCode.code} 
          title={selectedCode.title} 
          year="2025" 
        />
      </Box>
    </Paper>
  );
};
