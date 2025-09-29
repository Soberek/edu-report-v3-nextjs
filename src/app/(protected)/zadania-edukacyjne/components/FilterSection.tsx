import React from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Stack, Chip } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import type { FilterSectionProps } from "../types";
import { FILTER_CONSTANTS, STYLE_CONSTANTS } from "../constants";

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  filterOptions,
  monthNames,
  onFilterChange,
}) => {
  const renderFilterSelect = (
    label: string,
    value: string,
    options: readonly string[] | readonly number[],
    onChange: (value: string) => void,
    width?: number
  ) => (
    <FormControl size="small" sx={{ minWidth: width || FILTER_CONSTANTS.MIN_WIDTH }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="">{FILTER_CONSTANTS.ALL_OPTION}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={String(option)}>
            {String(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderActiveFilters = () => (
    <Box mt={STYLE_CONSTANTS.SPACING.MEDIUM} display="flex" gap={STYLE_CONSTANTS.SPACING.SMALL} flexWrap="wrap">
      {filters.year && (
        <Chip
          label={`${FILTER_CONSTANTS.ACTIVE_FILTERS.YEAR}: ${filters.year}`}
          onDelete={() => onFilterChange("year", "")}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
      {filters.month && (
        <Chip
          label={`${FILTER_CONSTANTS.ACTIVE_FILTERS.MONTH}: ${monthNames[parseInt(filters.month) - 1]}`}
          onDelete={() => onFilterChange("month", "")}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
      {filters.program && (
        <Chip
          label={`${FILTER_CONSTANTS.ACTIVE_FILTERS.PROGRAM}: ${filters.program}`}
          onDelete={() => onFilterChange("program", "")}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
      {filters.activityType && (
        <Chip
          label={`${FILTER_CONSTANTS.ACTIVE_FILTERS.ACTIVITY_TYPE}: ${filters.activityType}`}
          onDelete={() => onFilterChange("activityType", "")}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ mb: STYLE_CONSTANTS.SPACING.LARGE, p: STYLE_CONSTANTS.SPACING.MEDIUM, backgroundColor: STYLE_CONSTANTS.COLORS.BACKGROUND_FILTER, borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM }}>
      <Box display="flex" alignItems="center" gap={STYLE_CONSTANTS.SPACING.SMALL} mb={STYLE_CONSTANTS.SPACING.MEDIUM}>
        <FilterList color="primary" />
        <Typography variant="h6" fontWeight="bold">
          {FILTER_CONSTANTS.FILTERS_TITLE}
        </Typography>
      </Box>

      <Stack direction="row" spacing={STYLE_CONSTANTS.SPACING.MEDIUM} flexWrap="wrap" useFlexGap>
        {renderFilterSelect(FILTER_CONSTANTS.YEAR_LABEL, filters.year, filterOptions.years, (value) => onFilterChange("year", value), FILTER_CONSTANTS.SELECT_WIDTHS.YEAR)}
        {renderFilterSelect(FILTER_CONSTANTS.MONTH_LABEL, filters.month, Array.from({ length: 12 }, (_, i) => i + 1), (value) => onFilterChange("month", value), FILTER_CONSTANTS.SELECT_WIDTHS.MONTH)}
        {renderFilterSelect(FILTER_CONSTANTS.PROGRAM_LABEL, filters.program, filterOptions.programs, (value) => onFilterChange("program", value), FILTER_CONSTANTS.SELECT_WIDTHS.PROGRAM)}
        {renderFilterSelect(FILTER_CONSTANTS.ACTIVITY_TYPE_LABEL, filters.activityType, filterOptions.activityTypes, (value) => onFilterChange("activityType", value), FILTER_CONSTANTS.SELECT_WIDTHS.ACTIVITY_TYPE)}
      </Stack>

      {renderActiveFilters()}
    </Box>
  );
};
