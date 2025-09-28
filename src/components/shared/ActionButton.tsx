import React from "react";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { LoadingSpinner } from "./LoadingSpinner";

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
  sx?: object;
  tooltip?: string;
  iconOnly?: boolean;
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
}) => {
  const theme = useTheme();

  const buttonProps = {
    variant,
    color,
    size,
    disabled: disabled || loading,
    onClick,
    type,
    fullWidth: iconOnly ? false : fullWidth,
    startIcon: loading ? <LoadingSpinner size={16} /> : startIcon,
    endIcon,
    sx: {
      borderRadius: 2,
      fontWeight: 600,
      textTransform: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: theme.shadows[4],
      },
      ...sx,
    },
  };

  const button = iconOnly ? (
    <IconButton {...buttonProps} size={size}>
      {loading ? <LoadingSpinner size={20} /> : startIcon}
    </IconButton>
  ) : (
    <Button {...buttonProps}>{children}</Button>
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
  <ActionButton {...props} iconOnly startIcon={<span>✏️</span>} tooltip="Edytuj" />
);

export const DeleteIconButton: React.FC<Omit<ActionButtonProps, "iconOnly" | "startIcon" | "color">> = (props) => (
  <ActionButton {...props} iconOnly startIcon={<span>🗑️</span>} color="error" tooltip="Usuń" />
);

export const ViewIconButton: React.FC<Omit<ActionButtonProps, "iconOnly" | "startIcon">> = (props) => (
  <ActionButton {...props} iconOnly startIcon={<span>👁️</span>} tooltip="Zobacz" />
);
