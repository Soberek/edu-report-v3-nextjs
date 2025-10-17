import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip } from "@mui/material";

export interface SelectorItem {
  id: string;
  name: string;
  count?: number;
}

interface SelectorWithCountsProps {
  label: string;
  value: string;
  items: SelectorItem[];
  onChange: (value: string) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  showChipForSelected?: boolean;
  minWidth?: number;
  size?: "small" | "medium";
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * Generic selector component with chip counts for each option
 * Supports "All" option with total count and selected item chip display
 * 
 * @example
 * const programs = [
 *   { id: "1", name: "Program A", count: 15 },
 *   { id: "2", name: "Program B", count: 23 }
 * ];
 * 
 * <SelectorWithCounts
 *   label="Program"
 *   value={selectedProgram}
 *   items={programs}
 *   onChange={setSelectedProgram}
 *   showAllOption
 *   allOptionLabel="Wszystkie programy"
 * />
 */
export const SelectorWithCounts: React.FC<SelectorWithCountsProps> = ({
  label,
  value,
  items,
  onChange,
  showAllOption = true,
  allOptionLabel = "Wszystkie",
  allOptionValue = "all",
  showChipForSelected = true,
  minWidth = 200,
  size = "medium",
  disabled = false,
  fullWidth = false,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    onChange(newValue === allOptionValue ? allOptionValue : newValue);
  };

  const sortItemsByCount = items.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
const dontShow0Counts = sortItemsByCount.filter(item => item.count && item.count > 0);

  const totalCount = dontShow0Counts.reduce((sum, item) => sum + (item.count ?? 0), 0);

  const selectedItem = items.find((item) => item.id === value);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: showChipForSelected ? 3 : 0 }}>
      <FormControl sx={{ minWidth, ...(fullWidth && { width: "100%" }) }} size={size} disabled={disabled}>
        <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-select-label`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {showAllOption && (
            <MenuItem value={allOptionValue}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>{allOptionLabel}</span>
                {totalCount > 0 && (
                  <Chip label={totalCount} size="small" color="primary" sx={{ ml: 1 }} />
                )}
              </Box>
            </MenuItem>
          )}
          {dontShow0Counts.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>{item.name}</span>
                {item.count !== undefined && (
                  <Chip label={item.count} size="small" color="primary" variant="outlined" />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showChipForSelected && value !== allOptionValue && selectedItem && (
        <Chip
          label={`Wybrany: ${selectedItem.name}`}
          color="primary"
          variant="filled"
          onDelete={() => onChange(allOptionValue)}
          sx={{ cursor: "pointer" }}
        />
      )}
    </Box>
  );
};
