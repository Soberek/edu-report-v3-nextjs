import { useForm } from "react-hook-form";
import { Box, Button, Typography, Paper, Grid, Fade } from "@mui/material";
import { Person, Save, Clear } from "@mui/icons-material";
import { FormField } from "@/components/shared/FormField";
import { ContactFormData } from "../types";

interface ContactFormProps {
  onAddContact: (contact: ContactFormData) => Promise<void>;
  loading?: boolean;
}

/**
 * Contact creation form
 * Validates input and submits new contact data
 */
export default function ContactForm({ onAddContact, loading = false }: ContactFormProps) {
  const { handleSubmit, reset, control, formState: { errors, isDirty, isSubmitting } } = useForm<ContactFormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const isLoading = loading || isSubmitting;

  const onSubmit = async (data: ContactFormData) => {
    try {
      await onAddContact(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Fade in timeout={300}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Person sx={{ color: "#1976d2" }} />
          Dodaj nowy kontakt
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField<ContactFormData>
                  name="firstName"
                  control={control}
                  label="Imię"
                  type="text"
                  required
                  placeholder="np. Jan"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField<ContactFormData>
                  name="lastName"
                  control={control}
                  label="Nazwisko"
                  type="text"
                  required
                  placeholder="np. Kowalski"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField<ContactFormData>
                  name="email"
                  control={control}
                  label="Adres email"
                  type="email"
                  placeholder="np. jan.kowalski@example.com"
                  helperText="Opcjonalne"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                />
              </Grid>

              {/* Phone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField<ContactFormData>
                  name="phone"
                  control={control}
                  label="Numer telefonu"
                  type="text"
                  placeholder="np. 123 456 789"
                  helperText="Opcjonalne"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                    },
                  }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    mt: 2,
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset()}
                    disabled={isLoading || !isDirty}
                    startIcon={<Clear />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      px: 3,
                      py: 1,
                    }}
                  >
                    Wyczyść
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={<Save />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      px: 3,
                      py: 1,
                      background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                      },
                    }}
                  >
                    {isLoading ? "Dodawanie..." : "Dodaj kontakt"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
