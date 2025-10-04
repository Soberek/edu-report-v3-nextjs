"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Refresh, ContentCopy } from "@mui/icons-material";
import type { AdminUser } from "@/hooks/useAdminUsers";

interface ResetPasswordDialogProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onReset: (uid: string, password: string) => Promise<string>;
  onGeneratePassword: () => Promise<string>;
  loading?: boolean;
}

export function ResetPasswordDialog({
  open,
  user,
  onClose,
  onReset,
  onGeneratePassword,
  loading = false,
}: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedPassword, setSavedPassword] = useState<string | null>(null);
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setPassword("");
      setShowPassword(false);
      setError(null);
      setSuccess(false);
      setSavedPassword(null);
      setCopySuccess(false);
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

  const handleCopyPassword = async () => {
    if (savedPassword) {
      try {
        await navigator.clipboard.writeText(savedPassword);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        setError("Failed to copy password");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("No user selected");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const newPassword = await onReset(user.uid, password);
      setSavedPassword(newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Resetuj hasło
        {user && (
          <Typography variant="subtitle2" color="text.secondary">
            Użytkownik: {user.displayName || user.email}
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

          {success && savedPassword && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "success.light",
                border: "1px solid",
                borderColor: "success.main",
              }}
            >
              <Typography variant="subtitle2" gutterBottom color="success.dark">
                Hasło zresetowane pomyślnie!
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  p: 1,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {savedPassword}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyPassword}
                  color={copySuccess ? "success" : "default"}
                  title="Kopiuj hasło"
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Przekaż to hasło użytkownikowi. Po zalogowaniu może je zmienić.
              </Typography>
            </Paper>
          )}

          {!success && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                Wprowadź nowe hasło dla użytkownika lub wygeneruj bezpieczne hasło automatycznie.
              </Alert>

              <TextField
                label="Nowe hasło"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoFocus
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
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {success ? "Zamknij" : "Anuluj"}
          </Button>
          {!success && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Resetuj hasło"}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
