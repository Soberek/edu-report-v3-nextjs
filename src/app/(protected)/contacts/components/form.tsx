import { Controller, useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper, Grid, InputAdornment, Fade } from "@mui/material";
import { Person, Email, Phone, Save, Clear } from "@mui/icons-material";
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
    formState: { errors, isDirty },
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

  const handleReset = () => {
    reset();
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "Imię jest wymagane." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Imię"
                      required
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#666" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "white",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Nazwisko jest wymagane." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nazwisko"
                      required
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#666" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "white",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email jest wymagany.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Nieprawidłowy format email.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Adres email"
                      type="email"
                      required
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#666" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "white",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[\+]?[0-9\s\-\(\)]{9,}$/,
                      message: "Nieprawidłowy format numeru telefonu.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Numer telefonu"
                      type="tel"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message || "Opcjonalne"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: "#666" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "white",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
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
                    onClick={handleReset}
                    disabled={loading || !isDirty}
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
                    disabled={loading}
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
                    {loading ? "Dodawanie..." : "Dodaj kontakt"}
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
