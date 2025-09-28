import React from "react";
import { TextField, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import { Controller, Control, FieldError } from "react-hook-form";

interface BaseFieldProps {
  name: string;
  control: Control<any>;
  error?: FieldError;
  required?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "number" | "date" | "textarea";
  label: string;
  placeholder?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  label: string;
  options: { value: string; label: string }[];
}

interface CheckboxFieldProps extends BaseFieldProps {
  type: "checkbox";
  label: string;
}

type FormFieldProps = TextFieldProps | SelectFieldProps | CheckboxFieldProps;

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { name, control, error, required = false } = props;

  const renderField = () => {
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
                fullWidth
                multiline={props.multiline}
                minRows={props.minRows}
                maxRows={props.maxRows}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  },
                }}
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
                {...field}
                options={props.options}
                getOptionLabel={(option) => option.label}
                value={props.options.find(option => option.value === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue?.value || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={props.label}
                    required={required}
                    error={!!error}
                    helperText={error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        borderRadius: 2,
                      },
                    }}
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
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    color="primary"
                  />
                }
                label={props.label}
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
