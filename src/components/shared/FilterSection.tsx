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
  Autocomplete,
  Chip,
  useTheme,
} from "@mui/material";
import { FilterList, Search, Clear } from "@mui/icons-material";

export interface FilterField {
  id: string;
  type: "text" | "select" | "autocomplete" | "multiselect";
  label: string;
  placeholder?: string;
  options?: string[];
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  clearable?: boolean;
  fullWidth?: boolean;
  gridColumn?: string;
}

export interface FilterSectionProps {
  title?: string;
  fields: FilterField[];
  onClearAll?: () => void;
  showClearAll?: boolean;
  sx?: object;
}

/**
 * Generic filter section component
 * Supports text search, select dropdowns, autocomplete, and multiselect filters
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  title = "Filtry",
  fields,
  onClearAll,
  showClearAll = true,
  sx = {},
}) => {
  const theme = useTheme();

  const renderField = (field: FilterField) => {
    const commonProps = {
      size: "small" as const,
      fullWidth: field.fullWidth ?? true,
      sx: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#fff",
          borderRadius: 1.5,
        },
      },
    };

    switch (field.type) {
      case "text":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            placeholder={field.placeholder}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        );

      case "select":
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              label={field.label}
            >
              <MenuItem value="">
                <em>Wszystkie</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "autocomplete":
        return (
          <Autocomplete
            value={field.value || ""}
            onChange={(_, newValue) => field.onChange(newValue || "")}
            options={field.options || []}
            renderInput={(params) => (
              <TextField
                {...params}
                {...commonProps}
                label={field.label}
                placeholder={field.placeholder}
              />
            )}
          />
        );

      case "multiselect":
        return (
          <Autocomplete
            multiple
            value={field.value || []}
            onChange={(_, newValue) => field.onChange(newValue)}
            options={field.options || []}
            renderInput={(params) => (
              <TextField
                {...params}
                {...commonProps}
                label={field.label}
                placeholder={field.placeholder}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
          />
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = fields.some((field) => {
    if (Array.isArray(field.value)) {
      return field.value.length > 0;
    }
    return field.value && field.value !== "";
  });

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        border: "1px solid #e9ecef",
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
            {title}
          </Typography>
        </Box>
        
        {showClearAll && hasActiveFilters && onClearAll && (
          <IconButton
            onClick={onClearAll}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                color: "primary.main",
              },
            }}
          >
            <Clear />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {fields.map((field) => (
          <Box
            key={field.id}
            sx={{
              gridColumn: field.gridColumn || "auto",
            }}
          >
            {renderField(field)}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Helper function to create common filter fields
export const createFilterFields = {
  search: (value: string, onChange: (value: string) => void, placeholder?: string): FilterField => ({
    id: "search",
    type: "text",
    label: "Szukaj",
    placeholder: placeholder || "Wprowadź wyszukiwany tekst...",
    value,
    onChange,
    gridColumn: "1 / -1",
  }),

  select: (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[]
  ): FilterField => ({
    id,
    type: "select",
    label,
    value,
    onChange,
    options,
  }),

  autocomplete: (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[]
  ): FilterField => ({
    id,
    type: "autocomplete",
    label,
    value,
    onChange,
    options,
  }),

  multiselect: (
    id: string,
    label: string,
    value: string[],
    onChange: (value: string[]) => void,
    options: string[]
  ): FilterField => ({
    id,
    type: "multiselect",
    label,
    value,
    onChange,
    options,
  }),
};
