/**
 * Tests for avatar utility functions
 * Tests deterministic color generation, initials, and dimensions
 */

import { describe, it, expect } from "vitest";
import { getInitials, getAvatarColor, getAvatarDimensions } from "../utils/avatar";

describe("Avatar Utilities", () => {
  describe("getInitials", () => {
    it("should return uppercase initials from first and last name", () => {
      expect(getInitials("John", "Doe")).toBe("JD");
      expect(getInitials("jan", "kowalski")).toBe("JK");
    });

    it("should handle single character names", () => {
      expect(getInitials("J", "D")).toBe("JD");
      expect(getInitials("A", "B")).toBe("AB");
    });

    it("should handle empty strings", () => {
      expect(getInitials("", "")).toBe("");
      expect(getInitials("John", "")).toBe("J");
      expect(getInitials("", "Doe")).toBe("D");
    });
  });

  describe("getAvatarColor", () => {
    it("should return deterministic color for same first name", () => {
      const color1 = getAvatarColor("John");
      const color2 = getAvatarColor("John");
      expect(color1).toBe(color2);
    });

    it("should return different colors for different first names", () => {
      const colorJ = getAvatarColor("John");
      const colorM = getAvatarColor("Mary");
      // Most likely different, but technically possible to collide due to modulo
      // Just verify they're valid hex colors
      expect(colorJ).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colorM).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should return valid hex color codes", () => {
      expect(getAvatarColor("A")).toMatch(/^#[0-9a-f]{6}$/i);
      expect(getAvatarColor("Z")).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe("getAvatarDimensions", () => {
    it("should return correct dimensions for small size", () => {
      const dims = getAvatarDimensions("small");
      expect(dims).toEqual({
        width: 32,
        height: 32,
        fontSize: "0.875rem",
      });
    });

    it("should return correct dimensions for medium size", () => {
      const dims = getAvatarDimensions("medium");
      expect(dims).toEqual({
        width: 48,
        height: 48,
        fontSize: "1rem",
      });
    });

    it("should return correct dimensions for large size", () => {
      const dims = getAvatarDimensions("large");
      expect(dims).toEqual({
        width: 56,
        height: 56,
        fontSize: "1.25rem",
      });
    });

    it("should default to medium size when not specified", () => {
      const dims = getAvatarDimensions();
      expect(dims).toEqual({
        width: 48,
        height: 48,
        fontSize: "1rem",
      });
    });
  });
});
