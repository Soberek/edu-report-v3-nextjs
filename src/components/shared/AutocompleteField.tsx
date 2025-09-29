import React from "react";
import {
  Autocomplete,
  TextField,
  Box,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";

export interface AutocompleteOption {
  id: string;
  name: string;
  [key: string]: any;
}

export interface AutocompleteFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: AutocompleteOption[];
  getOptionLabel?: (option: AutocompleteOption) => string;
  isOptionEqualToValue?: (option: AutocompleteOption, value: AutocompleteOption) => boolean;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: AutocompleteOption) => React.ReactNode;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  startAdornment?: React.ReactNode;
  fullWidth?: boolean;
  sx?: object;
}

export const AutocompleteField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  getOptionLabel = (option) => option.name,
  isOptionEqualToValue = (option, value) => option.id === value?.id,
  renderOption,
  helperText,
  required = false,
  disabled = false,
  multiple = false,
  startAdornment,
  fullWidth = true,
  sx = {},
}: AutocompleteFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} jest wymagane.` : false }}
      render={({ field, fieldState: { error } }) => {
        const autocompleteValue = multiple 
          ? (field.value || []).map((id: string) => options.find(opt => opt.id === id)).filter(Boolean) as AutocompleteOption[]
          : field.value 
            ? options.find(opt => opt.id === field.value) || null 
            : null;

        const handleChange = (_: any, value: AutocompleteOption | AutocompleteOption[] | null) => {
          if (multiple) {
            field.onChange((value as AutocompleteOption || []).map((item: AutocompleteOption) => item.id));
          } else {
            field.onChange((value as AutocompleteOption)?.id || '');
          }
        };

        return (
          <FormControl fullWidth={fullWidth} error={!!error}>
            <Autocomplete
              value={autocompleteValue}
              onChange={handleChange}
              options={options}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
              renderOption={renderOption}
              multiple={multiple}
              disabled={disabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={!!error}
                  helperText={error?.message || helperText}
                  required={required}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: startAdornment ? (
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mr: 1 }}>
                        {startAdornment}
                      </Box>
                    ) : undefined,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                    ...sx,
                  }}
                />
              )}
            />
            {error && (
              <FormHelperText sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                {error.message}
              </FormHelperText>
            )}
            {!error && helperText && (
              <FormHelperText sx={{ mt: 0.5 }}>{helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};
