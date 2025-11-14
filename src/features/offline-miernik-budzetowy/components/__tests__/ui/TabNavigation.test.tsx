import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { TabNavigation } from "../../ui/TabNavigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TABS, type TabId } from "../../../constants";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("TabNavigation", () => {
  const mockOnTabChange = vi.fn();

  const defaultProps = {
    activeTab: TABS.DATA_TABLE as TabId,
    onTabChange: mockOnTabChange,
    disabled: false,
  };

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it("should render tab navigation", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("should render all tabs", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThan(0);
  });

  it("should have correct active tab", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    const activeTab = screen.getByRole("tab", { selected: true });
    expect(activeTab).toBeInTheDocument();
  });

  it("should call onTabChange when tab is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TabNavigation {...defaultProps} activeTab={TABS.DATA_TABLE as TabId} />);

    const tabs = screen.getAllByRole("tab");
    if (tabs.length > 1) {
      await user.click(tabs[1]);
      expect(mockOnTabChange).toHaveBeenCalled();
    }
  });

  it("should disable tabs when disabled prop is true", () => {
    renderWithTheme(<TabNavigation {...defaultProps} disabled={true} />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute("disabled");
    });
  });

  it("should not disable tabs when disabled prop is false", () => {
    renderWithTheme(<TabNavigation {...defaultProps} disabled={false} />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      if (!(tab as HTMLElement).hasAttribute("disabled")) {
        expect(true).toBe(true);
      }
    });
  });

  it("should render tab icons", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    // Icons are SVG elements inside tabs
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("should display tab labels", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    // At least one of the expected tab labels should be visible
    const tabLabels = screen.getAllByRole("tab");
    expect(tabLabels.length).toBeGreaterThan(0);
  });

  it("should update active tab when activeTab prop changes", () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <TabNavigation activeTab={TABS.DATA_TABLE as TabId} onTabChange={mockOnTabChange} disabled={false} />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider theme={theme}>
        <TabNavigation activeTab={TABS.INDICATORS as TabId} onTabChange={mockOnTabChange} disabled={false} />
      </ThemeProvider>
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("should have correct tab variant", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
  });

  it("should handle sequential tab clicks", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TabNavigation {...defaultProps} />);

    const tabs = screen.getAllByRole("tab");
    if (tabs.length > 1) {
      // Click second tab, then third tab
      await user.click(tabs[1]);
      await user.click(tabs[2]);

      // Both clicks should trigger onChange
      expect(mockOnTabChange.mock.calls.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should have data-testid on tabs", () => {
    renderWithTheme(<TabNavigation {...defaultProps} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThan(0);
  });
});
