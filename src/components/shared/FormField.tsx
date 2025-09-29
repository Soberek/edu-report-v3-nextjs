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
      placeholder,
      inputProps,
      sx: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        },
        ...sx,
      },
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
                  {required && <span style={{ color: "red" }}> *</span>}
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
