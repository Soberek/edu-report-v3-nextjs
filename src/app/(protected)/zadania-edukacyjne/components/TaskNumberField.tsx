import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, Chip, Button, Alert } from "@mui/material";
import { Refresh, Warning } from "@mui/icons-material";
import type { EducationalTask } from "@/types";
import { Controller, Control } from "react-hook-form";
import { useTaskNumberManager } from "../hooks/useTaskNumberManager";

interface TaskNumberFieldProps {
  control: Control<Record<string, unknown>>;
  name: string;
  tasks: EducationalTask[];
  editTaskId?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TaskNumberField: React.FC<TaskNumberFieldProps> = ({
  control,
  name,
  tasks,
  editTaskId,
  label = "Numer zadania",
  helperText,
  required = true,
  disabled = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Create manager with current field value
  const taskNumberManager = useTaskNumberManager({
    tasks,
    editTaskId,
    currentTaskNumber: "",
  });

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Numer zadania jest wymagany" : false,
        validate: (value: string) => {
          if (!value.trim()) {
            return required ? "Numer zadania jest wymagany" : true;
          }
          return true; // Validation will be handled by taskNumberManager in render
        },
      }}
      render={({ field, fieldState }) => {

        const handleQuickSuggestion = () => {
          const nextNumber = taskNumberManager.getNextSuggestion();
          field.onChange(nextNumber);
          setShowSuggestions(false);
        };

        return (
          <Box>
            <TextField
              {...field}
              label={label}
              placeholder="np. 45/2025"
              fullWidth
              required={required}
              disabled={disabled}
              value={field.value || ""}
              error={fieldState.error !== undefined || !taskNumberManager.isValid}
              helperText={fieldState.error?.message || taskNumberManager.errorMessage || helperText || "Format: liczba/rok (np. 45/2025)"}
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
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                Następny dostępny: {taskNumberManager.getNextSuggestion()}
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
            </Box>

            {/* Validation Status */}
            {field.value && (
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
            {showSuggestions && (
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Sugerowane numery zadania dla roku {taskNumberManager.year}:
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {taskNumberManager.suggestions.map((suggestion, index) => (
                    <Chip
                      key={`${suggestion}-${index}`}
                      label={suggestion}
                      variant={suggestion === field.value ? "filled" : "outlined"}
                      color={suggestion === field.value ? "primary" : "default"}
                      onClick={() => {
                        field.onChange(suggestion);
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
            {tasks.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Statystyki użycia dla roku {taskNumberManager.year}:
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Całkowita liczba zadań: {tasks.filter((t) => t.taskNumber.includes(`/${taskNumberManager.year}`)).length}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Dostępne numery: {taskNumberManager.suggestions.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};
