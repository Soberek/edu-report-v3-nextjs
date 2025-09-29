import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Fade,
  Paper,
} from "@mui/material";
import { Close, Person, Email, Phone, Save } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import type { Contact } from "@/types";
import type { ContactCreateDTO } from "@/hooks/useContact";

interface EditDialogProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (id: string, data: ContactCreateDTO) => void;
  loading: boolean;
}

type ContactFormFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function EditDialog({ open, contact, onClose, onSave, loading }: EditDialogProps) {
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

  // Reset form when contact changes
  React.useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone || "",
        email: contact.email || "",
      });
    }
  }, [contact, reset]);

  const onSubmit = (data: ContactFormFields) => {
    if (contact) {
      onSave(contact.id, data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!contact) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: getRandomColor(contact.firstName),
              fontWeight: "bold",
              fontSize: "1.2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {getInitials(contact.firstName, contact.lastName)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
              Edytuj kontakt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contact.firstName} {contact.lastName}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "#666",
            "&:hover": {
              background: "rgba(0,0,0,0.04)",
              color: "#1976d2",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, background: "transparent" }}>
        <Fade in timeout={300}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* First Name */}
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
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255,255,255,0.9)",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            background: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Last Name */}
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
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255,255,255,0.9)",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            background: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Email */}
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
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255,255,255,0.9)",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            background: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Phone */}
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
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255,255,255,0.9)",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            background: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              background: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading || !isDirty}
          startIcon={<Save />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "rgba(0,0,0,0.12)",
              color: "rgba(0,0,0,0.26)",
            },
          }}
        >
          {loading ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
