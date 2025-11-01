/**
 * Email menu state and logic hook
 * Extracts email menu management from table component
 * Handles: menu positioning, email collection, copying to clipboard
 */

import { useState, useMemo, useCallback } from "react";
import type { MappedParticipation } from "../types";
import { isValidEmail, deduplicateStrings } from "../utils/validation.utils";

/**
 * Email types for menu options
 */
export type EmailType = "coordinator" | "school" | "both";

/**
 * Hook managing email menu state and logic
 */
export const useEmailMenuLogic = (mappedParticipations: readonly MappedParticipation[]) => {
  const [emailMenuAnchor, setEmailMenuAnchor] = useState<null | HTMLElement>(null);

  // Count available emails by type (memoized to prevent unnecessary recalculation)
  const emailCounts = useMemo(() => {
    const coordinatorEmails = deduplicateStrings(
      mappedParticipations
        .map(row => row.coordinatorEmail)
        .filter(isValidEmail)
    );

    const schoolEmails = deduplicateStrings(
      mappedParticipations
        .map(row => row.schoolEmail)
        .filter(isValidEmail)
    );

    const allEmails = new Set<string>();
    [...coordinatorEmails, ...schoolEmails].forEach(email => allEmails.add(email));

    return {
      coordinator: coordinatorEmails.size,
      school: schoolEmails.size,
      both: allEmails.size,
    };
  }, [mappedParticipations]);

  // Collect emails by type
  const collectEmails = useCallback((type: EmailType): string[] => {
    const emails = new Set<string>();

    mappedParticipations.forEach(row => {
      if ((type === "coordinator" || type === "both") && isValidEmail(row.coordinatorEmail)) {
        emails.add(row.coordinatorEmail);
      }
      if ((type === "school" || type === "both") && isValidEmail(row.schoolEmail)) {
        emails.add(row.schoolEmail);
      }
    });

    return Array.from(emails);
  }, [mappedParticipations]);

  // Copy emails to clipboard
  const copyEmailsToClipboard = useCallback(async (type: EmailType): Promise<boolean> => {
    try {
      const emails = collectEmails(type);
      if (emails.length === 0) return false;

      const emailsText = emails.join("; ");
      await navigator.clipboard.writeText(emailsText);
      return true;
    } catch (error) {
      console.error("Failed to copy emails:", error);
      return false;
    }
  }, [collectEmails]);

  // Menu handlers
  const handleOpenEmailMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setEmailMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseEmailMenu = useCallback(() => {
    setEmailMenuAnchor(null);
  }, []);

  return {
    // State
    emailMenuAnchor,
    emailCounts,
    // Handlers
    handleOpenEmailMenu,
    handleCloseEmailMenu,
    // Actions
    collectEmails,
    copyEmailsToClipboard,
  };
};
