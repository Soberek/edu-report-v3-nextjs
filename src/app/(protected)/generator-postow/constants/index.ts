import { PostTemplate } from "../types";

/**
 * Post templates configuration
 */
export const postTemplates: PostTemplate[] = [
  { id: "minimal", name: "Minimal", description: "Clean and simple design" },
  { id: "modern", name: "Modern", description: "Contemporary with gradients" },
  { id: "classic", name: "Classic", description: "Traditional educational style" },
  { id: "vibrant", name: "Vibrant", description: "Colorful and energetic" },
];

/**
 * Tab configuration for the post generator
 */
export const tabs = [
  { id: 0, label: "Nowy Post", icon: "TextFields" },
  { id: 1, label: "Moje Posty", icon: "ImageIcon" },
  { id: 2, label: "Historia", icon: "History" },
  { id: 3, label: "Ulubione", icon: "Favorite" },
] as const;

/**
 * Platform options for posts
 */
export const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
] as const;

/**
 * Text overlay position options
 */
export const textOverlayPositions = [
  { value: "top", label: "Góra" },
  { value: "center", label: "Środek" },
  { value: "bottom", label: "Dół" },
] as const;

/**
 * Font weight options
 */
export const fontWeights = [
  { value: "normal", label: "Normalny" },
  { value: "bold", label: "Pogrubiony" },
] as const;
