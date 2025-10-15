import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close, Save, Cancel } from "@mui/icons-material";

export interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  showSave?: boolean;
  showCancel?: boolean;
  saveDisabled?: boolean;
  sx?: object;
}

/**
 * Generic dialog component with consistent styling and behavior
 * Supports save/cancel actions, loading states, and flexible content
 */
export const GenericDialog: React.FC<GenericDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  subtitle,
  children,
  maxWidth = "md",
  fullWidth = true,
  loading = false,
  saveText = "Zapisz",
  cancelText = "Anuluj",
  showSave = true,
  showCancel = true,
  saveDisabled = false,
  sx = {},
}) => {
  const theme = useTheme();

  const handleSave = () => {
    if (onSave && !loading && !saveDisabled) {
      onSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
          ...sx,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: subtitle ? 0.5 : 0 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, background: "transparent" }}>
        {children}
      </DialogContent>

      {(showSave || showCancel) && (
        <DialogActions
          sx={{
            p: 3,
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            gap: 1,
          }}
        >
          {showCancel && (
            <Button
              onClick={onClose}
              startIcon={<Cancel />}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              {cancelText}
            </Button>
          )}
          {showSave && onSave && (
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
              disabled={loading || saveDisabled}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              {loading ? "Zapisywanie..." : saveText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

// Specialized dialog variants
export const ConfirmDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  loading = false,
}) => (
  <GenericDialog
    open={open}
    onClose={onClose}
    onSave={onConfirm}
    title={title}
    maxWidth="sm"
    saveText={confirmText}
    cancelText={cancelText}
    loading={loading}
    saveDisabled={loading}
  >
    <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.6 }}>
      {message}
    </Typography>
  </GenericDialog>
);

export const FormDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  saveDisabled?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}> = (props) => (
  <GenericDialog
    {...props}
    showSave={true}
    showCancel={true}
    saveText="Zapisz"
    cancelText="Anuluj"
  />
);
