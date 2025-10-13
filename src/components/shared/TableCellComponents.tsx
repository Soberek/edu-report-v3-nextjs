import React from "react";
import { Avatar, Typography, Box, Chip, Tooltip } from "@mui/material";
import { CalendarToday, Group, Notes } from "@mui/icons-material";
import { formatDateForTable, formatDate } from "@/utils/dayjsUtils";

// Utility functions
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
};

export const getRandomColor = (name: string): string => {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Reusable Avatar with Text component
export interface AvatarWithTextProps {
  text: string;
  avatarSize?: number;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  variant?: "body1" | "body2" | "caption";
}

export const AvatarWithText: React.FC<AvatarWithTextProps> = ({
  text,
  avatarSize = 32,
  fontSize = "0.8rem",
  fontWeight = "bold",
  color = "#2c3e50",
  variant = "body2",
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      justifyContent: "center",
      width: "100%",
      py: 1,
    }}
  >
    <Avatar
      sx={{
        width: avatarSize,
        height: avatarSize,
        background: getRandomColor(text),
        fontWeight: "bold",
        fontSize: fontSize,
        flexShrink: 0,
      }}
    >
      {getInitials(text)}
    </Avatar>
    <Typography
      variant={variant}
      sx={{
        fontWeight,
        color,
        wordBreak: "break-word",
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      {text}
    </Typography>
  </Box>
);

// Reusable Tag component
export interface TagProps {
  label: string;
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  backgroundColor?: string;
  textColor?: string;
  maxWidth?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = "filled",
  size = "small",
  color = "primary",
  backgroundColor,
  textColor = "white",
  maxWidth = "100%",
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      py: 1,
    }}
  >
    <Chip
      label={label}
      color={color}
      variant={variant}
      size={size}
      sx={{
        background: backgroundColor || (color === "primary" ? "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)" : undefined),
        color: textColor,
        fontWeight: "bold",
        fontSize: "0.75rem",
        height: "auto",
        minHeight: 24,
        maxWidth,
        "& .MuiChip-label": {
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.2,
          padding: "4px 8px",
        },
      }}
    />
  </Box>
);

// Reusable Info Badge component
export interface InfoBadgeProps {
  icon: React.ReactElement;
  text: string | number;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  textColor?: string;
  maxWidth?: string;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({
  icon,
  text,
  backgroundColor = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  borderColor = "#e0e0e0",
  iconColor = "#1976d2",
  textColor = "#2c3e50",
  maxWidth = "fit-content",
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      px: 1,
      py: 0.5,
      borderRadius: 1.5,
      background: backgroundColor,
      border: `1px solid ${borderColor}`,
      justifyContent: "center",
      width: maxWidth,
      mx: "auto",
    }}
  >
    {icon && <Box sx={{ color: iconColor, fontSize: 16 }}>{icon}</Box>}
    <Typography variant="caption" sx={{ fontWeight: "bold", color: textColor }}>
      {text}
    </Typography>
  </Box>
);

// Notes cell component
export interface NotesCellProps {
  notes: string;
  tooltipTitle?: string;
}

export const NotesCell: React.FC<NotesCellProps> = ({ notes, tooltipTitle }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      py: 1,
    }}
  >
    <Tooltip title={tooltipTitle || notes || "Brak notatek"} arrow>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          background: notes ? "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" : "rgba(0,0,0,0.04)",
          border: notes ? "1px solid #ff9800" : "1px solid #e0e0e0",
          cursor: "pointer",
          maxWidth: "100%",
          minHeight: 32,
        }}
      >
        <Notes
          sx={{
            color: notes ? "#ff9800" : "#999",
            fontSize: 16,
            flexShrink: 0,
            mt: 0.2,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: notes ? "#e65100" : "#999",
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.3,
            textAlign: "left",
          }}
        >
          {notes || "Brak"}
        </Typography>
      </Box>
    </Tooltip>
  </Box>
);

// Date cell component
export interface DateCellProps {
  date: string | Date;
  format?: "full" | "short";
}

export const DateCell: React.FC<DateCellProps> = ({ date, format = "short" }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      py: 1,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        fontWeight: "500",
        wordBreak: "break-word",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        lineHeight: 1.3,
        textAlign: "center",
      }}
    >
      {format === "short" ? formatDateForTable(date) : formatDate(date, format === "full" ? "long" : "medium")}
    </Typography>
  </Box>
);
