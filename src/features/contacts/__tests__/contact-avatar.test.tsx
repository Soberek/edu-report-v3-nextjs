/**
 * Tests for ContactAvatar component
 * Tests rendering with different sizes and deterministic colors
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactAvatar from "../components/contact-avatar";

describe("ContactAvatar Component", () => {
  describe("rendering", () => {
    it("should render avatar with initials", () => {
      render(<ContactAvatar firstName="John" lastName="Doe" />);
      const avatar = screen.getByText("JD");
      expect(avatar).toBeInTheDocument();
    });

    it("should render with correct initials for different names", () => {
      const { rerender } = render(
        <ContactAvatar firstName="Jane" lastName="Smith" />
      );
      expect(screen.getByText("JS")).toBeInTheDocument();

      rerender(<ContactAvatar firstName="Robert" lastName="Brown" />);
      expect(screen.getByText("RB")).toBeInTheDocument();
    });
  });

  describe("sizing", () => {
    it("should render with small size", () => {
      const { container } = render(
        <ContactAvatar firstName="John" lastName="Doe" size="small" />
      );
      const avatar = container.querySelector("div[class*='MuiAvatar']");
      expect(avatar).toHaveStyle("width: 32px");
      expect(avatar).toHaveStyle("height: 32px");
    });

    it("should render with medium size (default)", () => {
      const { container } = render(
        <ContactAvatar firstName="John" lastName="Doe" size="medium" />
      );
      const avatar = container.querySelector("div[class*='MuiAvatar']");
      expect(avatar).toHaveStyle("width: 48px");
      expect(avatar).toHaveStyle("height: 48px");
    });

    it("should render with large size", () => {
      const { container } = render(
        <ContactAvatar firstName="John" lastName="Doe" size="large" />
      );
      const avatar = container.querySelector("div[class*='MuiAvatar']");
      expect(avatar).toHaveStyle("width: 56px");
      expect(avatar).toHaveStyle("height: 56px");
    });

    it("should default to medium size when not specified", () => {
      const { container } = render(
        <ContactAvatar firstName="John" lastName="Doe" />
      );
      const avatar = container.querySelector("div[class*='MuiAvatar']");
      expect(avatar).toHaveStyle("width: 48px");
      expect(avatar).toHaveStyle("height: 48px");
    });
  });

  describe("styling", () => {
    it("should have background color", () => {
      const { container } = render(
        <ContactAvatar firstName="John" lastName="Doe" />
      );
      const avatar = container.querySelector("div[class*='MuiAvatar']");
      const styles = window.getComputedStyle(avatar!);
      expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    });

    it("should have consistent color for same first name", () => {
      const { container: container1 } = render(
        <ContactAvatar firstName="John" lastName="Doe" />
      );
      const avatar1 = container1.querySelector("div[class*='MuiAvatar']");
      const color1 = window.getComputedStyle(avatar1!).backgroundColor;

      const { container: container2 } = render(
        <ContactAvatar firstName="John" lastName="Smith" />
      );
      const avatar2 = container2.querySelector("div[class*='MuiAvatar']");
      const color2 = window.getComputedStyle(avatar2!).backgroundColor;

      expect(color1).toBe(color2);
    });
  });

  describe("accessibility", () => {
    it("should have text content for screen readers", () => {
      render(<ContactAvatar firstName="John" lastName="Doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("should handle special characters in names", () => {
      render(<ContactAvatar firstName="Łukasz" lastName="Żółw" />);
      expect(screen.getByText("ŁŻ")).toBeInTheDocument();
    });
  });
});
