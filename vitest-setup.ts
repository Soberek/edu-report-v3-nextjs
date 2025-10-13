import "@testing-library/jest-dom";
import React from "react";

// Setup DOM environment
import { configure } from "@testing-library/react";

// Configure testing library
configure({
  testIdAttribute: "data-testid",
});

// Setup DOM environment for testing
if (typeof document !== 'undefined') {
  // Ensure document.body exists
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }
  
  // Create a container element for React to render into
  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
}

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
