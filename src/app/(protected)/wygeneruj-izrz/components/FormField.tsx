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
                size="small"
                error={!!error}
                helperText={error?.message}
                onChange={(e) => {
                  const value = e.target.value;
                  if (props.type === "number") {
                    field.onChange(value === "" ? 0 : Number(value));
                  } else {
                    field.onChange(value);
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 1.5,
                    fontSize: "0.9rem",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.9rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.8rem",
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
                value={props.options.find((option) => option.value === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue?.value || "")}
                size="small"
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
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.9rem",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "0.8rem",
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
                control={<Checkbox {...field} checked={field.value} color="primary" size="small" />}
                label={props.label}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.9rem",
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
