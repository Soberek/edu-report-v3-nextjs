import React, { useState } from "react";
import { TextField, Box, Typography, Chip, Button, Alert } from "@mui/material";
import { Refresh, Warning } from "@mui/icons-material";
import type { EducationalTask } from "@/types";
import { Controller, Control } from "react-hook-form";
import { useTaskNumberManager } from "../hooks/useTaskNumberManager";

interface TaskNumberFieldProps {
  control: Control<any>;
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
  const taskNumberManager = useTaskNumberManager({
    tasks,
    editTaskId,
  });

  const handleQuickSuggestion = () => {
    const nextNumber = taskNumberManager.getNextSuggestion();
    taskNumberManager.setTaskNumber(nextNumber);
    setShowSuggestions(false);
  };

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

          const result = taskNumberManager.validateCurrentNumber();
          return result.isValid ? true : result.errorMessage || "Nieprawidłowy numer zadania";
        },
      }}
      render={({ field, fieldState }) => {
        // Sync field value with internal state
        if (field.value !== taskNumberManager.currentTaskNumber) {
          taskNumberManager.setTaskNumber(field.value || "");
        }

        return (
          <Box>
            <TextField
              {...field}
              label={label}
              placeholder="np. 45/2025"
              fullWidth
              required={required}
              disabled={disabled}
              error={fieldState.error !== undefined || !taskNumberManager.isValid}
              helperText={fieldState.error?.message || taskNumberManager.errorMessage || helperText || "Format: liczba/rok (np. 45/2025)"}
              onChange={(e) => {
                field.onChange(e.target.value);
                taskNumberManager.setTaskNumber(e.target.value);
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
            {taskNumberManager.currentTaskNumber && (
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
                      variant={suggestion === taskNumberManager.currentTaskNumber ? "filled" : "outlined"}
                      color={suggestion === taskNumberManager.currentTaskNumber ? "primary" : "default"}
                      onClick={() => {
                        taskNumberManager.setTaskNumber(suggestion);
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
                    Całkowita liczba zadań: {tasks.filter((t) => t.referenceNumber.includes(`/${taskNumberManager.year}`)).length}
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
