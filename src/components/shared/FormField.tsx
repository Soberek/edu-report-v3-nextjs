import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { formatDateForInput } from "@/utils/shared/dayjsUtils";

// Polish validation helpers
export const getPolishValidationMessage = (type: string, label: string): string => {
  const lowerCaseLabel = label.toLowerCase();

  switch (type) {
    case "required":
      return `${label} jest wymagany${lowerCaseLabel.endsWith("a") ? "a" : ""}.`;
    case "minLength":
      return `${label} jest za krótki${lowerCaseLabel.endsWith("a") ? "" : ""}.`;
    case "maxLength":
      return `${label} jest za długi${lowerCaseLabel.endsWith("a") ? "" : ""}.`;
    case "email":
      return "Wprowadź poprawny adres email.";
    case "pattern":
      return `${label} ma niepoprawny format.`;
    case "min":
      return `${label} musi być większy od zera.`;
    case "max":
      return `${label} przekracza maksymalną wartość.`;
    default:
      return `Wprowadź poprawną wartość dla pola ${lowerCaseLabel}.`;
  }
};

// Polish typography helpers
export const polishTypographyProps = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  variant: "body2" as const,
};

export interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date";
  options?: Array<{ value: string | number; label: string }>;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  sx?: object;
  inputProps?: object;
}

export const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  options = [],
  multiline = false,
  rows = 3,
  required = false,
  disabled = false,
  placeholder,
  helperText,
  fullWidth = true,
  size = "medium",
  sx = {},
  inputProps = {},
}: FormFieldProps<T>) => {
  const theme = useTheme();

  const renderField = (field: any, fieldState: any) => {
    const error = fieldState.error;
    const hasError = !!error;

    const commonProps = {
      ...field,
      label,
      required,
      disabled,
      fullWidth,
      size,
      error: hasError,
      helperText: hasError ? error.message : helperText,
      // Polish-specific improvements for better UX
      autoComplete: type === "email" ? "email" : type === "password" ? "new-password" : type === "date" ? "bday" : undefined,
      placeholder,
      inputProps: type === "date" ? { ...inputProps, max: "9999-12-31" } : inputProps, // Prevent year overflow
      sx: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          background: type === "date" ? "white" : "transparent",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: size === "small" ? "0.875rem" : "1rem",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: "1px",
          },
          "& .MuiInputBase-input": {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            "&::placeholder": {
              opacity: 1,
              color: theme.palette.text.secondary,
            },
          },
        },
        "& .MuiFormLabel-root": {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: size === "small" ? "0.875rem" : "1rem",
        },
        "& .MuiFormHelperText-root": {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "0.75rem",
        },
        ...sx,
      },
      InputLabelProps: type === "date" ? { shrink: true } : undefined, // Ensure label stays up for date inputs
    };

    switch (type) {
      case "textarea":
        return <TextField {...commonProps} multiline rows={rows} />;

      case "select":
        return (
          <FormControl fullWidth={fullWidth} error={hasError} size={size}>
            <InputLabel required={required}>{label}</InputLabel>
            <Select {...field} label={label} disabled={disabled}>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{error.message}</FormHelperText>}
            {!hasError && helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value || false} disabled={disabled} color="primary" />}
            label={
              <Box>
                <Typography variant="body2" component="span">
                  {label}
                  {required && <span style={{ color: "red", fontWeight: "bold" }}> *</span>}
                </Typography>
                {helperText && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {helperText}
                  </Typography>
                )}
              </Box>
            }
          />
        );

      case "radio":
        return (
          <FormControl component="fieldset" error={hasError} fullWidth={fullWidth}>
            <FormLabel component="legend" required={required}>
              {label}
            </FormLabel>
            <RadioGroup {...field} row>
              {options.map((option) => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio disabled={disabled} />} label={option.label} />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{error.message}</FormHelperText>}
            {!hasError && helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case "date":
        // Ensure date value is in correct format for HTML5 date input
        const dateValue = field.value ? (typeof field.value === "string" ? field.value : formatDateForInput(field.value)) : "";

        return (
          <TextField
            {...commonProps}
            type="date"
            value={dateValue}
            onChange={(e) => {
              const value = e.target.value;
              // Always store in YYYY-MM-DD format for consistency with our dayjs utils
              field.onChange(value || "");
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.75rem",
                fontFamily: "Roboto, sans-serif",
              },
            }}
          />
        );

      default:
        return <TextField {...commonProps} type={type} />;
    }
  };

  return <Controller name={name} control={control} render={({ field, fieldState }) => renderField(field, fieldState)} />;
};

// Form section wrapper
export const FormSection: React.FC<{
  title?: string;
  children: React.ReactNode;
  sx?: object;
}> = ({ title, children, sx = {} }) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {title && (
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};
