/**
 * Avatar utility functions for deterministic contact avatars
 * Provides pure functions for generating initials, colors, and dimensions
 */

// Color palette for deterministic avatar backgrounds (16 colors for variety)
const AVATAR_COLORS = [
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#03a9f4", // Light Blue
  "#00bcd4", // Cyan
  "#009688", // Teal
  "#4caf50", // Green
  "#8bc34a", // Light Green
  "#cddc39", // Lime
  "#ffeb3b", // Yellow
  "#ffc107", // Amber
  "#ff9800", // Orange
  "#ff5722", // Deep Orange
] as const;

export type AvatarSize = "small" | "medium" | "large";

export interface AvatarDimensions {
  width: number;
  height: number;
  fontSize: string;
}

/**
 * Generate initials from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two-letter uppercase initials
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Get deterministic color based on first character of first name
 * @param firstName - User's first name
 * @returns Hex color code
 */
export function getAvatarColor(firstName: string): string {
  if (!firstName || firstName.length === 0) {
    return AVATAR_COLORS[0]; // Return first color for empty names
  }
  const charCode = firstName.charCodeAt(0);
  const index = charCode % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Get avatar dimensions (width, height, font size) based on size variant
 * @param size - Avatar size variant
 * @returns Dimensions object with width, height, and fontSize
 */
export function getAvatarDimensions(size: AvatarSize = "medium"): AvatarDimensions {
  const dimensionsMap: Record<AvatarSize, AvatarDimensions> = {
    small: { width: 32, height: 32, fontSize: "0.875rem" },
    medium: { width: 48, height: 48, fontSize: "1rem" },
    large: { width: 56, height: 56, fontSize: "1.25rem" },
  };

  return dimensionsMap[size];
}
