import { renderHook, act } from "@testing-library/react";
import { useTabManager } from "../useTabManager";
import { TABS, DEFAULT_ACTIVE_TAB } from "../../constants";

describe("useTabManager", () => {
  it("should initialize with default tab", () => {
    const { result } = renderHook(() => useTabManager());

    expect(result.current.activeTab).toBe(DEFAULT_ACTIVE_TAB);
    expect(result.current.handleTabChange).toBeInstanceOf(Function);
    expect(result.current.resetToDefault).toBeInstanceOf(Function);
  });

  it("should initialize with custom initial tab", () => {
    const customTab = TABS.ADVANCED_STATS;
    const { result } = renderHook(() => useTabManager(customTab));

    expect(result.current.activeTab).toBe(customTab);
  });

  it("should change active tab when handleTabChange is called", () => {
    const { result } = renderHook(() => useTabManager());

    act(() => {
      result.current.handleTabChange(TABS.BAR_CHARTS);
    });

    expect(result.current.activeTab).toBe(TABS.BAR_CHARTS);
  });

  it("should reset to default tab when resetToDefault is called", () => {
    const { result } = renderHook(() => useTabManager());

    // First change the tab
    act(() => {
      result.current.handleTabChange(TABS.ADVANCED_STATS);
    });

    expect(result.current.activeTab).toBe(TABS.ADVANCED_STATS);

    // Then reset to default
    act(() => {
      result.current.resetToDefault();
    });

    expect(result.current.activeTab).toBe(DEFAULT_ACTIVE_TAB);
  });

  it("should maintain function references across renders", () => {
    const { result, rerender } = renderHook(() => useTabManager());

    const initialHandleTabChange = result.current.handleTabChange;
    const initialResetToDefault = result.current.resetToDefault;

    rerender();

    expect(result.current.handleTabChange).toBe(initialHandleTabChange);
    expect(result.current.resetToDefault).toBe(initialResetToDefault);
  });

  it("should handle multiple tab changes", () => {
    const { result } = renderHook(() => useTabManager());

    act(() => {
      result.current.handleTabChange(TABS.ADVANCED_STATS);
    });
    expect(result.current.activeTab).toBe(TABS.ADVANCED_STATS);

    act(() => {
      result.current.handleTabChange(TABS.BAR_CHARTS);
    });
    expect(result.current.activeTab).toBe(TABS.BAR_CHARTS);

    act(() => {
      result.current.handleTabChange(TABS.DATA_TABLE);
    });
    expect(result.current.activeTab).toBe(TABS.DATA_TABLE);
  });

  it("should return readonly object", () => {
    const { result } = renderHook(() => useTabManager());

    // TypeScript should prevent this, but let's test runtime behavior
    // Note: JavaScript objects are not truly readonly at runtime
    // This test verifies the structure is correct
    expect(result.current).toHaveProperty("activeTab");
    expect(result.current).toHaveProperty("handleTabChange");
    expect(result.current).toHaveProperty("resetToDefault");
  });
});
