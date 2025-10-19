import React from "react";
import { Avatar } from "@mui/material";
import { getInitials, getAvatarColor, getAvatarDimensions, type AvatarSize } from "../utils";

interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  size?: AvatarSize;
}

/**
 * Reusable contact avatar component
 * Displays initials with deterministic color based on first name
 */
export default function ContactAvatar({
  firstName,
  lastName,
  size = "medium",
}: ContactAvatarProps) {
  const dimensions = getAvatarDimensions(size);
  const backgroundColor = getAvatarColor(firstName);
  const initials = getInitials(firstName, lastName);

  return (
    <Avatar
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        background: backgroundColor,
        fontWeight: "bold",
        fontSize: dimensions.fontSize,
        flexShrink: 0,
      }}
    >
      {initials}
    </Avatar>
  );
}
