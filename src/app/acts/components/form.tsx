import { TextField, Button, Box, Stack, Select, MenuItem } from "@mui/material";
import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit } from "react-hook-form";
import type { CaseRecord } from "@/types";

type Props = {
  control: Control<CaseRecord, unknown, CaseRecord>;
  handleSubmit: UseFormHandleSubmit<CaseRecord, CaseRecord>;
  onSubmit: (data: CaseRecord) => void;
  errors: FieldErrors<CaseRecord>;
  actsOptions: string[];
};

export const ActForm = ({ control, errors, handleSubmit, onSubmit, actsOptions }: Props) => {
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, mx: "auto", my: 4 }}>
      <Stack spacing={2}>
        <Controller
          name="code"
          control={control}
          rules={{ required: "Kod jest wymagany" }}
          render={({ field }) => (
            <Select
              {...field}
              label="Kod"
              fullWidth
              onChange={(event) => field.onChange(event.target.value)}
              displayEmpty
              inputProps={{ "aria-placeholder": "Wybierz kod" }}
              error={!!errors.code}
            >
              <MenuItem value="" disabled>
                <em>Wybierz kod</em>
              </MenuItem>
              {actsOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <Controller
          name="referenceNumber"
          control={control}
          rules={{ required: "Numer referencyjny jest wymagany" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Wprowadź numer referencyjny np. OZiPZ.0442.1.2024"
              label="Numer referencyjny"
              fullWidth
              error={!!errors.referenceNumber}
              helperText={errors.referenceNumber?.message}
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          rules={{ required: "Data jest wymagana" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          rules={{ required: "Tytuł jest wymagany" }}
          render={({ field }) => (
            <TextField {...field} label="Tytuł" fullWidth error={!!errors.title} helperText={errors.title?.message} />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          rules={{ required: "Data wszczęcia sprawy jest wymagana" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              label="Data wszczęcia sprawy"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          rules={{ required: "Data zakończenia sprawy jest wymagana" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data zakończenia sprawy"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
          )}
        />
        <Controller
          name="comments"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Uwagi"
              fullWidth
              error={!!errors.comments}
              helperText={errors.comments?.message}
            />
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <TextField {...field} label="Notatki" multiline rows={3} fullWidth />}
        />

        <Controller
          name="sender"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nadawca"
              fullWidth
              error={!!errors.sender}
              helperText={errors.sender?.message}
            />
          )}
        />
        <Button type="submit" variant="contained">
          Zapisz
        </Button>
      </Stack>
    </Box>
  );
};
