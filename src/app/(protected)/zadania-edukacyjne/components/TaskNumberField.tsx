import React, { useState } from "react";
import { TextField, Box, Typography, Chip, Button, Alert } from "@mui/material";
import { Refresh, Warning } from "@mui/icons-material";
import type { EducationalTask } from "@/types";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useTaskNumberManager } from "../hooks/useTaskNumberManager";

interface TaskNumberFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  tasks: EducationalTask[];
  editTaskId?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TaskNumberField = <T extends FieldValues = FieldValues>({
  control,
  name,
  tasks,
  editTaskId,
  label = "Numer zadania",
  helperText,
  required = true,
  disabled = false,
}: TaskNumberFieldProps<T>) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  // Create manager with current field value
  const taskNumberManager = useTaskNumberManager({
    tasks,
    editTaskId,
    currentTaskNumber: currentValue,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Update current value when field value changes
        if (String(field.value || "") !== currentValue) {
          setCurrentValue(String(field.value || ""));
        }
        const handleQuickSuggestion = () => {
          const nextNumber = taskNumberManager.getNextSuggestion();
          field.onChange(String(nextNumber));
          setShowSuggestions(false);
        };

        return (
          <div>
            <TextField
              {...field}
              label={label}
              placeholder="np. 45/2025"
              fullWidth
              required={required}
              disabled={disabled}
              value={String(field.value || "")}
              error={!!fieldState.error || (!!field.value && !taskNumberManager.isValid)}
              helperText={
                fieldState.error?.message || (!!field.value && !taskNumberManager.isValid ? taskNumberManager.errorMessage : helperText)
              }
              onChange={(e) => {
                const newValue = e.target.value;
                field.onChange(newValue);
                // Don't call setState here - it will cause render issues
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={handleQuickSuggestion}
                disabled={disabled}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "medium",
                }}
              >
                Następny dostępny: {String(taskNumberManager.getNextSuggestion() || "")}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowSuggestions(!showSuggestions)}
                disabled={disabled}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "medium",
                }}
              >
                {showSuggestions ? "Ukryj sugestie" : "Pokaż sugestie"}
              </Button>
            </div>

            {/* Validation Status */}
            {Boolean(field.value) && (
              <Box sx={{ mb: 1 }}>
                {taskNumberManager.isValid ? (
                  <Alert severity="success" sx={{ py: 0.5 }}>
                    ✓ Numer zadnia jest dostępny
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ py: 0.5 }} icon={<Warning />}>
                    {taskNumberManager.errorMessage}
                  </Alert>
                )}
              </Box>
            )}

            {/* Suggestions */}
            {Boolean(showSuggestions) && (
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Sugerowane numery zadania dla roku {String(taskNumberManager.year)}:
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {taskNumberManager.suggestions.map((suggestion, index) => (
                    <Chip
                      key={`${suggestion}-${index}`}
                      label={String(suggestion)}
                      variant={suggestion === field.value ? "filled" : "outlined"}
                      color={suggestion === field.value ? "primary" : "default"}
                      onClick={() => {
                        field.onChange(String(suggestion));
                        setShowSuggestions(false);
                      }}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 2,
                        fontWeight: "medium",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: 2,
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Kliknij na numer, aby go użyć
                </Typography>
              </Box>
            )}

            {/* Usage Statistics */}
            {Boolean(tasks.length > 0) && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Statystyki użycia dla roku {String(taskNumberManager.year)}:
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Całkowita liczba zadań: {tasks.filter((t) => t.taskNumber.includes(`/${String(taskNumberManager.year)}`)).length}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Dostępne numery: {String(taskNumberManager.suggestions.length)}
                  </Typography>
                </Box>
              </Box>
            )}
          </div>
        );
      }}
    />
  );
};
