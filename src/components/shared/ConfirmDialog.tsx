import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useTheme } from "@mui/material";
import { Warning, Delete, Info } from "@mui/icons-material";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "delete" | "info";
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Anuluj",
  type = "warning",
  loading = false,
  maxWidth = "sm",
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Delete sx={{ fontSize: 48, color: "error.main" }} />;
      case "info":
        return <Info sx={{ fontSize: 48, color: "info.main" }} />;
      default:
        return <Warning sx={{ fontSize: 48, color: "warning.main" }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "delete":
        return "error";
      case "info":
        return "primary";
      default:
        return "warning";
    }
  };

  const getDefaultConfirmText = () => {
    switch (type) {
      case "delete":
        return "Usuń";
      case "info":
        return "OK";
      default:
        return "Potwierdź";
    }
  };

  const finalConfirmText = confirmText || getDefaultConfirmText();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" component="span" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ minWidth: 100 }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={getConfirmButtonColor() as "primary" | "error" | "warning"}
          sx={{ minWidth: 100 }}
        >
          {finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Quick confirmation hook
export const useConfirmDialog = () => {
  const [state, setState] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    type?: "warning" | "delete" | "info";
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: "warning" | "delete" | "info" = "warning") => {
    setState({
      open: true,
      title,
      message,
      onConfirm,
      type,
    });
  };

  const hideConfirm = () => {
    setState({
      open: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleConfirm = () => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    hideConfirm();
  };

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: (
      <ConfirmDialog
        open={state.open}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={state.title}
        message={state.message}
        type={state.type}
      />
    ),
  };
};
