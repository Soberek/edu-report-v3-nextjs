import { Controller, useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { ContactCreateDTO } from "@/hooks/useContact";

interface Props {
  onAddContact: (contact: ContactCreateDTO) => void;
  loading: boolean;
}

type ContactFormFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function ContactForm({ onAddContact, loading }: Props) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (data: ContactFormFields) => {
    onAddContact(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4, px: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dodaj kontakt
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Controller
          name="firstName"
          control={control}
          rules={{ required: "Imię jest wymagane." }}
          render={({ field }) => (
            <TextField label="Imię" required {...field} size="small" error={!!errors.firstName} helperText={errors.firstName?.message} />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: "Nazwisko jest wymagane." }}
          render={({ field }) => (
            <TextField label="Nazwisko" required {...field} size="small" error={!!errors.lastName} helperText={errors.lastName?.message} />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{ required: "Telefon jest wymagany." }}
          render={({ field }) => (
            <TextField
              label="Telefon"
              //   required
              {...field}
              size="small"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email jest wymagany.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Nieprawidłowy email.",
            },
          }}
          render={({ field }) => (
            <TextField label="Email" required {...field} size="small" error={!!errors.email} helperText={errors.email?.message} />
          )}
        />

        <Button type="submit" variant="contained" disabled={loading} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}>
          Dodaj
        </Button>
      </Box>
    </Box>
  );
}
