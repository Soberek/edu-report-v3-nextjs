"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import type { AdminUser } from "@/hooks/useAdminUsers";

interface EditUserDialogProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSave: (uid: string, updates: {
    displayName?: string;
    email?: string;
    emailVerified?: boolean;
    disabled?: boolean;
    role?: string;
  }) => Promise<void>;
  loading?: boolean;
}

export function EditUserDialog({
  open,
  user,
  onClose,
  onSave,
  loading = false,
}: EditUserDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setEmailVerified(user.emailVerified);
      setDisabled(user.disabled);
      setRole(user.role || "user");
    }
  }, [user]);

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("No user selected");
      return;
    }

    try {
      await onSave(user.uid, {
        displayName,
        email,
        emailVerified,
        disabled,
        role,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edytuj użytkownika
        {user && (
          <Typography variant="subtitle2" color="text.secondary">
            UID: {user.uid}
          </Typography>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              disabled={loading}
              helperText="Uwaga: Zmiana email wymaga ponownej weryfikacji"
            />

            <TextField
              label="Nazwa wyświetlana"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Rola"
              select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              disabled={loading}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailVerified}
                    onChange={(e) => setEmailVerified(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Email zweryfikowany"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={disabled}
                    onChange={(e) => setDisabled(e.target.checked)}
                    disabled={loading}
                    color="error"
                  />
                }
                label="Konto zablokowane"
              />
            </Box>

            {user && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Utworzony: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Ostatnie logowanie: {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "N/A"}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Zapisz"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
