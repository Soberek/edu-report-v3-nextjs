"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Refresh } from "@mui/icons-material";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    email: string;
    password: string;
    displayName: string;
    role: string;
  }) => Promise<void>;
  onGeneratePassword: () => Promise<string>;
  loading?: boolean;
}

export function CreateUserDialog({
  open,
  onClose,
  onCreate,
  onGeneratePassword,
  loading = false,
}: CreateUserDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPassword, setGeneratingPassword] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRole("user");
      setShowPassword(false);
      setError(null);
      onClose();
    }
  };

  const handleGeneratePassword = async () => {
    setGeneratingPassword(true);
    try {
      const newPassword = await onGeneratePassword();
      setPassword(newPassword);
      setShowPassword(true);
    } catch (err) {
      setError("Failed to generate password");
    } finally {
      setGeneratingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await onCreate({ email, password, displayName, role });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Utwórz nowego użytkownika</DialogTitle>
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
              autoFocus
              disabled={loading}
            />

            <TextField
              label="Nazwa wyświetlana"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Hasło"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton
                      onClick={handleGeneratePassword}
                      edge="end"
                      disabled={loading || generatingPassword}
                      title="Wygeneruj bezpieczne hasło"
                    >
                      {generatingPassword ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Refresh />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Minimum 6 znaków. Kliknij ikonę odświeżania aby wygenerować bezpieczne hasło."
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
            {loading ? <CircularProgress size={24} /> : "Utwórz"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
