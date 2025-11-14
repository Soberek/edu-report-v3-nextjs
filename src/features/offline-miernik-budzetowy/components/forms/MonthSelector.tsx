import React, { useReducer, useCallback, useMemo } from "react";
import { Box, Typography, Button, useTheme, Chip, Divider } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { MONTH_NAMES } from "../../types";
import type { Month } from "../../types";

interface MonthSelectorProps {
  months: Month[];
  onMonthToggle: (monthNumber: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectPreset?: (monthNumbers: number[]) => void;
  selectedCount: number;
  disabled?: boolean;
}

// Month emojis for visual representation
const MONTH_EMOJIS = ["❄️", "🥶", "🌸", "🌱", "🌞", "🌻", "🏖️", "🌳", "🍂", "🎃", "🍁", "🎄"];

// Quick presets for common selections
const QUICK_PRESETS = [
  { label: "Bieżący miesiąc", get: () => [new Date().getMonth() + 1] },
  { label: "1 Kwartał", get: () => [1, 2, 3] },
  { label: "2 Kwartał", get: () => [4, 5, 6] },
  { label: "3 Kwartał", get: () => [7, 8, 9] },
  { label: "4 Kwartał", get: () => [10, 11, 12] },
  { label: "1 Półrocze", get: () => [1, 2, 3, 4, 5, 6] },
  { label: "2 Półrocze", get: () => [7, 8, 9, 10, 11, 12] },
  { label: "Rok", get: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];

// Reducer state type
interface SelectionState {
  rangeStart: number | null;
  rangeMode: boolean;
  hoverMonth: number | null;
}

// Reducer action types
type SelectionAction =
  | { type: "START_RANGE"; payload: number }
  | { type: "END_RANGE" }
  | { type: "CLEAR_RANGE" }
  | { type: "SET_HOVER"; payload: number | null }
  | { type: "RESET" };

// Reducer function
const selectionReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
  switch (action.type) {
    case "START_RANGE":
      return { ...state, rangeStart: action.payload, rangeMode: true };
    case "END_RANGE":
      return { ...state, rangeStart: null, rangeMode: false };
    case "CLEAR_RANGE":
      return { ...state, rangeStart: null, rangeMode: false };
    case "SET_HOVER":
      return { ...state, hoverMonth: action.payload };
    case "RESET":
      return { rangeStart: null, rangeMode: false, hoverMonth: null };
    default:
      return state;
  }
};

const initialSelectionState: SelectionState = {
  rangeStart: null,
  rangeMode: false,
  hoverMonth: null,
};

export const MonthSelector: React.FC<MonthSelectorProps> = React.memo(
  ({ months, onMonthToggle, onSelectAll, onDeselectAll, onSelectPreset, selectedCount, disabled = false }) => {
    const theme = useTheme();
    const [selectionState, dispatch] = useReducer(selectionReducer, initialSelectionState);

    // Apply a preset selection - use batch operation if available, otherwise fall back to individual toggles
    const applyPreset = useCallback(
      (presetMonths: number[]) => {
        if (disabled) return;

        // Check if preset is already selected to avoid unnecessary re-renders
        const isPresetAlreadySelected = presetMonths.every((monthNum) => {
          const month = months.find((m) => m.monthNumber === monthNum);
          return month?.selected === true;
        });

        // Also check that NO other months are selected
        const onlyPresetMonthsSelected = months.every((month) => {
          return presetMonths.includes(month.monthNumber) ? month.selected : !month.selected;
        });

        // If the exact preset is already selected, don't do anything
        if (isPresetAlreadySelected && onlyPresetMonthsSelected) {
          return;
        }

        // If batch preset function is available, use it
        if (onSelectPreset) {
          onSelectPreset(presetMonths);
        } else {
          // Fallback: deselect all first, then select preset months
          months.forEach((month) => {
            if (month.selected) {
              onMonthToggle(month.monthNumber);
            }
          });

          // Select only preset months
          presetMonths.forEach((monthNum) => {
            const month = months.find((m) => m.monthNumber === monthNum);
            if (month && !month.selected) {
              onMonthToggle(monthNum);
            }
          });
        }

        // Clear range state
        dispatch({ type: "RESET" });
      },
      [months, onMonthToggle, onSelectPreset, disabled]
    );

    // Handle range selection with Shift+Click
    const handleMonthClick = useCallback(
      (monthNumber: number, e: React.MouseEvent) => {
        if (disabled) return;

        if (e.shiftKey) {
          if (selectionState.rangeStart === null) {
            // Start a new range
            dispatch({ type: "START_RANGE", payload: monthNumber });
          } else {
            // Complete the range selection
            const start = Math.min(selectionState.rangeStart, monthNumber);
            const end = Math.max(selectionState.rangeStart, monthNumber);

            // Select all months in range
            for (let i = start; i <= end; i++) {
              const month = months.find((m) => m.monthNumber === i);
              if (month && !month.selected) {
                onMonthToggle(i);
              }
            }

            // Clear range state
            dispatch({ type: "END_RANGE" });
          }
        } else {
          // Normal toggle without Shift key
          onMonthToggle(monthNumber);
          dispatch({ type: "CLEAR_RANGE" });
        }
      },
      [months, onMonthToggle, selectionState.rangeStart, disabled]
    );

    return (
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          backgroundColor: "background.paper",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header with Title and Counter */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Miesiące
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              ✅ {selectedCount} z 12 wybranych
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 0.75 }}>
            <Button
              size="small"
              onClick={onSelectAll}
              disabled={disabled || selectedCount === 12}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.75rem",
                px: 1,
                py: 0.25,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              ✅ Zaznacz wszystkie
            </Button>
            <Button
              size="small"
              onClick={onDeselectAll}
              disabled={disabled || selectedCount === 0}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.75rem",
                px: 1,
                py: 0.25,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              ❌ Odznacz wszystkie
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 0.75 }} />

        {/* Quick Presets Section */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}>
            ⚡ Szybko:
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {QUICK_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                size="small"
                variant="outlined"
                onClick={() => applyPreset(preset.get())}
                disabled={disabled}
                sx={{
                  textTransform: "none",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  borderRadius: 1,
                  px: 1.25,
                  py: 0.35,
                  minHeight: "26px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}10`,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {preset.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 0.75 }} />

        {/* Month Grid - Calendar Style */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))", gap: 0.75 }}>
            {months.map((month) => {
              const monthFullName = [
                "Styczeń",
                "Luty",
                "Marzec",
                "Kwiecień",
                "Maj",
                "Czerwiec",
                "Lipiec",
                "Sierpień",
                "Wrzesień",
                "Październik",
                "Listopad",
                "Grudzień",
              ][month.monthNumber - 1];

              return (
                <Box
                  key={month.monthNumber}
                  onClick={(e) => handleMonthClick(month.monthNumber, e)}
                  sx={{
                    position: "relative",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 0.75,
                      textAlign: "center",
                      borderRadius: 1,
                      border: `1.5px solid ${month.selected ? theme.palette.primary.main : theme.palette.divider}`,
                      backgroundColor: month.selected ? `${theme.palette.primary.main}15` : "transparent",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": disabled
                        ? {}
                        : {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}10`,
                            transform: "translateY(-1px)",
                            boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                          },
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.25, fontSize: "1.2rem" }}>
                      {MONTH_EMOJIS[month.monthNumber - 1]}
                    </Typography>

                    <Typography variant="caption" color="text.primary" sx={{ display: "block", fontSize: "0.75rem", fontWeight: 600 }}>
                      {monthFullName}
                    </Typography>

                    {/* Selection checkmark */}
                    {month.selected && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: "50%",
                          p: 0.125,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 1px 3px ${theme.palette.primary.main}40`,
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 12, color: "white" }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Helper Text */}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.4, fontSize: "0.7rem", mb: 0.5 }}>
          💡 <strong>Shift+Click</strong> dla zakresu
        </Typography>

        {/* Range mode indicator */}
        {selectionState.rangeMode && (
          <Chip
            label="Tryb zakresu - kliknij drugi miesiąc"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 0.5, height: "22px", fontSize: "0.7rem" }}
          />
        )}
      </Box>
    );
  }
);

MonthSelector.displayName = "MonthSelector";
