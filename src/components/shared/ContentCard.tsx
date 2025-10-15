import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  useTheme,
  Fade,
} from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess, MoreVert } from "@mui/icons-material";

export interface ContentCardProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  avatar?: React.ReactNode;
  avatarText?: string;
  avatarColor?: string;
  actions?: React.ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
  chips?: Array<{ label: string; color?: string; variant?: "filled" | "outlined" }>;
  variant?: "default" | "elevated" | "outlined";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  sx?: object;
}

/**
 * Generic content card component
 * Supports headers, content, actions, and expandable sections
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  content,
  avatar,
  avatarText,
  avatarColor,
  actions,
  expandable = false,
  expanded = false,
  onToggleExpanded,
  onEdit,
  onDelete,
  onMore,
  chips = [],
  variant = "default",
  size = "medium",
  loading = false,
  sx = {},
}) => {
  const theme = useTheme();

  const getCardVariant = () => {
    switch (variant) {
      case "elevated":
        return { elevation: 4 };
      case "outlined":
        return { variant: "outlined" as const };
      default:
        return { elevation: 1 };
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case "small":
        return { p: 2 };
      case "large":
        return { p: 4 };
      default:
        return { p: 3 };
    }
  };

  const renderAvatar = () => {
    if (avatar) return avatar;
    if (avatarText) {
      return (
        <Avatar
          sx={{
            backgroundColor: avatarColor || theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          {avatarText}
        </Avatar>
      );
    }
    return null;
  };

  const renderHeader = () => (
    <CardHeader
      avatar={renderAvatar()}
      title={
        <Typography
          variant={size === "small" ? "subtitle1" : "h6"}
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      }
      subheader={
        subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )
      }
      action={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {onMore && (
            <IconButton size="small" onClick={onMore}>
              <MoreVert />
            </IconButton>
          )}
          {expandable && onToggleExpanded && (
            <IconButton size="small" onClick={onToggleExpanded}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>
      }
      sx={{ pb: 1 }}
    />
  );

  const renderChips = () => {
    if (chips.length === 0) return null;

    return (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip.label}
            color={chip.color as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
            variant={chip.variant || "outlined"}
            size="small"
          />
        ))}
      </Box>
    );
  };

  const renderActions = () => {
    if (!actions && !onEdit && !onDelete) return null;

    return (
      <CardActions sx={{ pt: 1, justifyContent: "flex-end" }}>
        {actions}
        {onEdit && (
          <IconButton size="small" onClick={onEdit} color="primary">
            <Edit />
          </IconButton>
        )}
        {onDelete && (
          <IconButton size="small" onClick={onDelete} color="error">
            <Delete />
          </IconButton>
        )}
      </CardActions>
    );
  };

  return (
    <Fade in timeout={300}>
      <Card
        {...getCardVariant()}
        sx={{
          borderRadius: 3,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[8],
          },
          ...sx,
        }}
      >
        {renderHeader()}
        <CardContent sx={getSizeProps()}>
          {renderChips()}
          {content}
        </CardContent>
        {renderActions()}
      </Card>
    </Fade>
  );
};

// Specialized card variants
export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: { value: number; direction: "up" | "down" | "flat" };
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <ContentCard
    title={title}
    subtitle={subtitle}
    content={
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: color }}>
          {value}
        </Typography>
        {icon && <Box sx={{ color: color }}>{icon}</Box>}
      </Box>
    }
    variant="elevated"
    size="small"
  />
);

export const ContactCard: React.FC<{
  name: string;
  email?: string;
  phone?: string;
  avatarText?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ name, email, phone, avatarText, onEdit, onDelete }) => (
  <ContentCard
    title={name}
    subtitle={email}
    content={
      <Box>
        {phone && (
          <Typography variant="body2" color="text.secondary">
            📞 {phone}
          </Typography>
        )}
      </Box>
    }
    avatarText={avatarText}
    onEdit={onEdit}
    onDelete={onDelete}
    variant="outlined"
  />
);

export const TaskCard: React.FC<{
  title: string;
  description?: string;
  date?: string;
  status?: string;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ title, description, date, status, expandable, expanded, onToggleExpanded, onEdit, onDelete }) => (
  <ContentCard
    title={title}
    subtitle={date}
    content={
      <Box>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}
        {status && (
          <Chip label={status} size="small" color="primary" variant="outlined" />
        )}
      </Box>
    }
    expandable={expandable}
    expanded={expanded}
    onToggleExpanded={onToggleExpanded}
    onEdit={onEdit}
    onDelete={onDelete}
    chips={status ? [{ label: status, color: "primary" }] : []}
  />
);
