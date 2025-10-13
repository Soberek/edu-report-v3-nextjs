import React from "react";
import { Box, Typography, Button, Grid, useTheme } from "@mui/material";
import { MONTH_NAMES } from "../../types";
import type { Month } from "../../types";

interface MonthSelectorProps {
  months: Month[];
  onMonthToggle: (monthNumber: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectedCount: number;
  disabled?: boolean;
}

export const MonthSelector: React.FC<MonthSelectorProps> = React.memo(
  ({ months, onMonthToggle, onSelectAll, onDeselectAll, selectedCount, disabled = false }) => {
    const theme = useTheme();

    return (
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Wybierz miesiące ({selectedCount}/12)
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onSelectAll}
              disabled={disabled || selectedCount === 12}
              sx={{ textTransform: "none" }}
            >
              Zaznacz wszystkie
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onDeselectAll}
              disabled={disabled || selectedCount === 0}
              sx={{ textTransform: "none" }}
            >
              Odznacz wszystkie
            </Button>
          </Box>
        </Box>

        {/* Month Grid */}
        <Grid container spacing={2}>
          {months.map((month) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={month.monthNumber}>
              <Button
                variant={month.selected ? "contained" : "outlined"}
                fullWidth
                onClick={() => onMonthToggle(month.monthNumber)}
                disabled={disabled}
                sx={{
                  height: 56,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  ...(month.selected && {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    },
                  }),
                  ...(!month.selected && {
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                    },
                  }),
                }}
              >
                {MONTH_NAMES[month.monthNumber - 1]}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

MonthSelector.displayName = "MonthSelector";
