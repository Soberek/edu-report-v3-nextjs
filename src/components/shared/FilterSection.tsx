import React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { FilterList, Search, Clear } from "@mui/icons-material";

type PrimitiveFilterOption = string | number;
interface FilterOptionObject {
  label: string;
  value: PrimitiveFilterOption;
}

type FilterOption = PrimitiveFilterOption | FilterOptionObject;

interface BaseFilterField {
  id: string;
  label: string;
  placeholder?: string;
  fullWidth?: boolean;
  gridColumn?: string;
  clearable?: boolean;
}

export interface TextFilterField extends BaseFilterField {
  type: "text";
  value: string;
  onChange: (value: string) => void;
}

export interface SelectFilterField extends BaseFilterField {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<FilterOption>;
  emptyOptionLabel?: string;
}

export interface AutocompleteFilterField extends BaseFilterField {
  type: "autocomplete";
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<FilterOption>;
}

export interface MultiselectFilterField extends BaseFilterField {
  type: "multiselect";
  value: string[];
  onChange: (value: string[]) => void;
  options: ReadonlyArray<FilterOption>;
}

export type FilterField =
  | TextFilterField
  | SelectFilterField
  | AutocompleteFilterField
  | MultiselectFilterField;

export interface FilterSectionProps {
  title?: string;
  fields: FilterField[];
  onClearAll?: () => void;
  showClearAll?: boolean;
  sx?: SxProps<Theme>;
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
  const isObjectOption = (option: FilterOption): option is FilterOptionObject =>
    typeof option === "object" && option !== null && "value" in option && "label" in option;

  const getOptionValue = (option: FilterOption): PrimitiveFilterOption =>
    isObjectOption(option) ? option.value : option;

  const getOptionLabel = (option: FilterOption): string =>
    isObjectOption(option) ? option.label : String(option);

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
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        );

      case "select": {
        const emptyLabel = field.emptyOptionLabel ?? "Wszystkie";
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={field.value ?? ""}
              onChange={(e) => {
                const selectedValue = String(e.target.value);
                field.onChange(selectedValue);
              }}
              label={field.label}
            >
              <MenuItem value="">
                <em>{emptyLabel}</em>
              </MenuItem>
              {field.options.map((option) => {
                const optionValue = String(getOptionValue(option));
                const optionLabel = getOptionLabel(option);
                return (
                  <MenuItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );
      }

      case "autocomplete":
        return (
          <Autocomplete<string, false, false, false>
            value={
              field.value
                ? getOptionLabel(
                    field.options.find((option) => String(getOptionValue(option)) === field.value) ?? field.value
                  )
                : ""
            }
            onChange={(_, newValue) => {
              if (!newValue) {
                field.onChange("");
                return;
              }
              const matchedOption = field.options.find((option) => getOptionLabel(option) === newValue);
              field.onChange(String(getOptionValue(matchedOption ?? newValue)));
            }}
            options={field.options.map((option) => getOptionLabel(option))}
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
          <Autocomplete<string, true, false, false>
            multiple
            value={(field.value ?? []).map((item) => {
              const matchedOption = field.options.find((option) => String(getOptionValue(option)) === item);
              return matchedOption ? getOptionLabel(matchedOption) : item;
            })}
            onChange={(_, newValue) => {
              const selectedValues = newValue.map((label) => {
                const matchedOption = field.options.find((option) => getOptionLabel(option) === label);
                return String(getOptionValue(matchedOption ?? label));
              });
              field.onChange(selectedValues);
            }}
            options={field.options.map((option) => getOptionLabel(option))}
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
                  key={`${field.id}-${option}`}
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
    return Boolean(field.value);
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
  search: (value: string, onChange: (value: string) => void, placeholder?: string): TextFilterField => ({
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
    options: ReadonlyArray<FilterOption>,
    emptyOptionLabel?: string,
  ): SelectFilterField => ({
    id,
    type: "select",
    label,
    value,
    onChange,
    options,
    emptyOptionLabel,
  }),

  autocomplete: (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: ReadonlyArray<FilterOption>
  ): AutocompleteFilterField => ({
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
    options: ReadonlyArray<FilterOption>
  ): MultiselectFilterField => ({
    id,
    type: "multiselect",
    label,
    value,
    onChange,
    options,
  }),
};
