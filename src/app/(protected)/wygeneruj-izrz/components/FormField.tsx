import React, { useCallback } from "react";
import { TextField, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import { Controller, Control, FieldError } from "react-hook-form";
import type { IzrzFormData } from "../schemas/izrzSchemas";
import { STYLE_CONSTANTS, FORM_CONSTANTS } from "../constants";
import type { FormFieldType, SelectOption } from "../types";

interface BaseFieldProps {
  readonly name: keyof IzrzFormData;
  readonly control: Control<IzrzFormData>;
  readonly error?: FieldError;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  readonly type: "text" | "number" | "date" | "textarea";
  readonly label: string;
  readonly placeholder?: string;
  readonly multiline?: boolean;
  readonly minRows?: number;
  readonly maxRows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  readonly type: "select";
  readonly label: string;
  readonly options: readonly SelectOption[];
}

interface CheckboxFieldProps extends BaseFieldProps {
  readonly type: "checkbox";
  readonly label: string;
}

type FormFieldProps = TextFieldProps | SelectFieldProps | CheckboxFieldProps;

// Common field styles
const commonFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.SMALL,
    fontSize: STYLE_CONSTANTS.FONT_SIZES.MEDIUM,
  },
  "& .MuiInputLabel-root": {
    fontSize: STYLE_CONSTANTS.FONT_SIZES.MEDIUM,
  },
  "& .MuiFormHelperText-root": {
    fontSize: STYLE_CONSTANTS.FONT_SIZES.SMALL,
  },
} as const;

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { name, control, error, required = false, disabled = false } = props;

  // Handle text field value changes
  const handleTextFieldChange = useCallback(
    (field: any, type: FormFieldType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      switch (type) {
        case "number":
          field.onChange(value === "" ? 0 : Number(value));
          break;
        case "date":
          field.onChange(value);
          break;
        default:
          field.onChange(value);
      }
    },
    []
  );

  // Handle select field changes
  const handleSelectChange = useCallback(
    (field: any, options: readonly SelectOption[]) => (_: any, newValue: SelectOption | null) => {
      field.onChange(newValue?.value || "");
    },
    []
  );

  // Find selected option for select field
  const findSelectedOption = useCallback(
    (value: string | number | boolean | File | null | undefined, options: readonly SelectOption[]): SelectOption | null => {
      const stringValue = String(value || "");
      return options.find((option) => option.value === stringValue) || null;
    },
    []
  );

  const renderField = (): React.ReactNode => {
    switch (props.type) {
      case "text":
      case "number":
      case "date":
      case "textarea":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type={props.type}
                label={props.label}
                placeholder={props.placeholder}
                required={required}
                disabled={disabled}
                fullWidth
                multiline={props.multiline}
                minRows={props.minRows || FORM_CONSTANTS.TEXTAREA_ROWS.DEFAULT}
                maxRows={props.maxRows || FORM_CONSTANTS.TEXTAREA_ROWS.MAX}
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error?.message}
                onChange={handleTextFieldChange(field, props.type)}
                sx={commonFieldStyles}
              />
            )}
          />
        );

      case "select":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={props.options}
                getOptionLabel={(option) => option.label}
                value={findSelectedOption(field.value, props.options)}
                onChange={handleSelectChange(field, props.options)}
                disabled={disabled}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={props.label}
                    required={required}
                    error={!!error}
                    helperText={error?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={Boolean(field.value)} disabled={disabled} color="primary" size="small" />}
                label={props.label}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: STYLE_CONSTANTS.FONT_SIZES.MEDIUM,
                  },
                }}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};
