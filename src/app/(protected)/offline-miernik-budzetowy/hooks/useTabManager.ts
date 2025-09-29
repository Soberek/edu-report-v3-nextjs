import { useState, useCallback } from "react";
import { DEFAULT_ACTIVE_TAB, type TabId } from "../constants";

/**
 * Custom hook for managing tab state
 * Provides tab switching functionality with type safety
 */
export const useTabManager = (initialTab: TabId = DEFAULT_ACTIVE_TAB) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const resetToDefault = useCallback(() => {
    setActiveTab(DEFAULT_ACTIVE_TAB);
  }, []);

  return {
    activeTab,
    handleTabChange,
    resetToDefault,
  } as const;
};
