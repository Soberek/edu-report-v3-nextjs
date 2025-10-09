import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Box, MenuItem, Select, FormControl, FormHelperText, SelectChangeEvent } from "@mui/material";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import type { CaseRecord } from "@/types";
import { FormField } from "@/components/shared";

interface EditActFormProps {
  caseRecord: CaseRecord | null;
  actsOptions: string[];
  suggestedReferenceNumber?: string;
  onSubmit: (data: CaseRecord | Omit<CaseRecord, "id" | "createdAt" | "userId">) => void;
}

// Form data type that matches the form structure
type FormData = {
  code: string;
  referenceNumber: string;
  date: string;
  title: string;
  startDate: string;
  endDate: string;
  sender: string;
  comments: string;
  notes: string;
};

export interface EditActFormRef {
  submit: () => void;
  isDirty: boolean;
}

const CustomSelectField: React.FC<{
  control: Control<FormData>;
  name: "code";
  label: string;
  options: string[];
  errors: FieldErrors<FormData>;
}> = ({ control, name, label, options, errors }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Kod jest wymagany" }}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors[name]}>
          <Select
            {...field}
            displayEmpty
            inputProps={{ "aria-placeholder": label }}
            onChange={(event: SelectChangeEvent) => field.onChange(event.target.value)}
            sx={{
              borderRadius: 2,
              background: "white",
            }}
          >
            <MenuItem value="" disabled>
              <em>{label}</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export const EditActForm = forwardRef<EditActFormRef, EditActFormProps>(
  ({ caseRecord, actsOptions, suggestedReferenceNumber, onSubmit }, ref) => {
    const formMethods = useForm<FormData>({
      defaultValues: {
        code: "",
        referenceNumber: "",
        date: "",
        title: "",
        startDate: "",
        endDate: "",
        sender: "",
        comments: "",
        notes: "",
      },
      mode: "onBlur", // Validate on blur
    });

    const {
      control,
      handleSubmit,
      reset,
      formState: { isDirty, errors },
    } = formMethods;

    // Expose form methods to parent
    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(handleFormSubmit)(),
      isDirty,
    }));

    // Update form when caseRecord changes
    useEffect(() => {
      if (caseRecord) {
        // Edit mode - populate with existing data
        reset({
          code: caseRecord.code,
          referenceNumber: caseRecord.referenceNumber,
          date: caseRecord.date,
          title: caseRecord.title,
          startDate: caseRecord.startDate,
          endDate: caseRecord.endDate,
          sender: caseRecord.sender,
          comments: caseRecord.comments,
          notes: caseRecord.notes,
        });
      } else {
        // Create mode - reset to default values
        const today = new Date().toISOString().split("T")[0];
        reset({
          code: "",
          referenceNumber: suggestedReferenceNumber || "OZiPZ.966",
          date: today,
          title: "",
          startDate: today,
          endDate: today,
          sender: "-",
          comments: "OZ",
          notes: "",
        });
      }
    }, [caseRecord, reset]);

    const handleFormSubmit = (data: FormData) => {
      // Convert FormData back to CaseRecord format
      if (caseRecord) {
        // Edit mode - include all fields
        const caseRecordData: CaseRecord = {
          id: caseRecord.id,
          ...data,
          createdAt: caseRecord.createdAt,
          userId: caseRecord.userId,
        };
        onSubmit(caseRecordData);
      } else {
        // Create mode - only pass form fields (id, createdAt, userId will be added by the service)
        const caseRecordData = data;
        onSubmit(caseRecordData);
      }
    };

    return (
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
          {/* Code Selection */}
          <Box>
            <CustomSelectField control={control} name="code" label="Wybierz kod" options={actsOptions} errors={errors} />
          </Box>

          {/* Reference Number */}
          <FormField
            name="referenceNumber"
            control={control}
            label="Numer referencyjny"
            placeholder="Wprowadź numer referencyjny np. OZiPZ.0442.1.2024"
            required
            helperText="Format: OZiPZ.XXXX.X.YYYY"
          />

          {/* Date */}
          <FormField name="date" control={control} label="Data" type="date" required />

          {/* Title */}
          <FormField name="title" control={control} label="Tytuł" required />

          {/* Start Date */}
          <FormField name="startDate" control={control} label="Data wszczęcia sprawy" type="date" required />

          {/* End Date */}
          <FormField name="endDate" control={control} label="Data zakończenia sprawy" type="date" required />

          {/* Sender */}
          <FormField name="sender" control={control} label="Nadawca" />

          {/* Comments */}
          <FormField name="comments" control={control} label="Uwagi" />
        </Box>

        {/* Notes - spanning full width */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <FormField
            name="notes"
            control={control}
            label="Notatki"
            type="textarea"
            rows={4}
            helperText="Szczegółowe uwagi dotyczące akt sprawy"
          />
        </Box>

        {/* Form is controlled via parent onSubmit prop */}
      </Box>
    );
  }
);

EditActForm.displayName = "EditActForm";
