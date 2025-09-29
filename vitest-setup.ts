import "@testing-library/jest-dom";
import React from "react";

// Mock CSS imports
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock CSS modules
vi.mock("*.css", () => ({}));
vi.mock("*.module.css", () => ({}));

// Mock MUI CSS imports
vi.mock("@mui/x-data-grid", () => ({
  DataGrid: () => React.createElement("div", { "data-testid": "data-grid" }),
}));

// Mock CSS imports from node_modules
vi.mock("**/*.css", () => ({}));
