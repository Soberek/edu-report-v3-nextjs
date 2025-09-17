"use client";
import React, { createContext, useContext, useState } from "react";

type StateContextType = {
  isDrawerOpen: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  return (
    <StateContext.Provider value={{ isDrawerOpen, handleDrawerOpen, handleDrawerClose }}>
      {children}
    </StateContext.Provider>
  );
}

export function useNavContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useNavContext must be used within NavProvider");
  }
  return context;
}
