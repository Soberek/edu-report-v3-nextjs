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
  IconButton
} from "@mui/material";
import { 
  Close, 
  Person, 
  Email, 
  Phone, 
  Save
} from "@mui/icons-material";
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

  if (!contact) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Edytuj kontakt
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, background: 'transparent' }}>
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                        <Person sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
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
                        <Person sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
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
                        <Email sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
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
                        <Phone sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3
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
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            }
          }}
        >
          {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
