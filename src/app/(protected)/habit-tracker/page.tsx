"use client";
import React from "react";
import { HealthHub } from "./context/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initHydrationReminders } from "./components/HydrationReminder";

export default function HabitTracker() {
  // Initialize hydration reminders
  React.useEffect(() => {
    initHydrationReminders();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <HealthHub />
      </div>
    </ErrorBoundary>
  );
}
