import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  showActions?: boolean;
}

export const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  loading = false,
  saveText = "Zapisz",
  cancelText = "Anuluj",
  maxWidth = "md",
  fullWidth = true,
  showActions = true,
}) => {
  const theme = useTheme();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
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
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.light} 50%, transparent 100%)`,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Edit sx={{ fontSize: "1.5rem" }} />
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 2,
            backgroundColor: "transparent",
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </DialogContent>

      {/* Actions */}
      {showActions && (
        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            size="medium"
            startIcon={<Close />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: theme.palette.grey[400],
              color: theme.palette.grey[600],
              "&:hover": {
                borderColor: theme.palette.grey[600],
                backgroundColor: theme.palette.grey[50],
              },
            }}
          >
            {cancelText}
          </Button>
          
          {onSave && (
            <Button
              onClick={onSave}
              variant="contained"
              size="medium"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Edit />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
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
