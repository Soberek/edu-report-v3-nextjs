"use client";
import React from "react";
import { BudgetMeterPage } from "./components/BudgetMeterPage";

/**
 * Offline Budget Meter route page
 * Delegates to the main component for better separation of concerns
 */
const OfflineMiernikPage: React.FC = () => {
  return <BudgetMeterPage />;
};

export default OfflineMiernikPage;
