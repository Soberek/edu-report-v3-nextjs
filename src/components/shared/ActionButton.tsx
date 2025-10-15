import React from "react";
import { Button, IconButton, Tooltip, useTheme, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
} from "@mui/icons-material";

export interface ActionButtonProps {
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  tooltip?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  children,
  onClick,
  type = "button",
  fullWidth = false,
  sx = {},
  tooltip,
  iconOnly = false,
  ariaLabel,
}) => {
  const theme = useTheme();

  const commonSx: SxProps<Theme> = {
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: theme.shadows[4],
    },
    ...sx,
  };

  const loadingIndicator = (
    <CircularProgress size={iconOnly ? 20 : 16} color="inherit" sx={{ display: "inline-flex" }} />
  );

  const defaultIcon = loading ? loadingIndicator : startIcon ?? children;

  const button = iconOnly ? (
    <IconButton
      color={color}
      size={size === "large" ? "large" : size}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel || tooltip || undefined}
      sx={{
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[3],
        },
        ...sx,
      }}
    >
      {defaultIcon}
    </IconButton>
  ) : (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
  startIcon={loading ? loadingIndicator : startIcon}
      endIcon={endIcon}
      sx={commonSx}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

// Common button variants
export const PrimaryButton: React.FC<Omit<ActionButtonProps, "color" | "variant">> = (props) => (
  <ActionButton {...props} variant="contained" color="primary" />
);

export const SecondaryButton: React.FC<Omit<ActionButtonProps, "color" | "variant">> = (props) => (
  <ActionButton {...props} variant="outlined" color="primary" />
);

export const DangerButton: React.FC<Omit<ActionButtonProps, "color" | "variant">> = (props) => (
  <ActionButton {...props} variant="contained" color="error" />
);

export const SuccessButton: React.FC<Omit<ActionButtonProps, "color" | "variant">> = (props) => (
  <ActionButton {...props} variant="contained" color="success" />
);

// Icon button variants
export const EditIconButton: React.FC<Omit<ActionButtonProps, "iconOnly" | "startIcon">> = (props) => (
  <ActionButton {...props} iconOnly startIcon={<EditOutlined fontSize="small" />} tooltip="Edytuj" ariaLabel="Edytuj" />
);

export const DeleteIconButton: React.FC<Omit<ActionButtonProps, "iconOnly" | "startIcon" | "color">> = (props) => (
  <ActionButton
    {...props}
    iconOnly
    color="error"
    startIcon={<DeleteOutline fontSize="small" />}
    tooltip="Usuń"
    ariaLabel="Usuń"
  />
);

export const ViewIconButton: React.FC<Omit<ActionButtonProps, "iconOnly" | "startIcon">> = (props) => (
  <ActionButton
    {...props}
    iconOnly
    startIcon={<VisibilityOutlined fontSize="small" />}
    tooltip="Zobacz"
    ariaLabel="Zobacz"
  />
);
