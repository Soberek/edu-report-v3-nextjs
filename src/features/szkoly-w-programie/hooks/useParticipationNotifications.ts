/**
 * Standardized notification hook for the szkoły-w-programie feature
 * Provides consistent, typed notification patterns across the feature
 * Eliminates duplication and ensures messaging consistency
 */

import { useCallback } from "react";
import { useNotification } from "@/hooks";
import { MESSAGES } from "../constants";

/**
 * Hook providing typed notification functions for participation operations
 * Wraps useNotification to ensure consistent messaging and error handling
 */
export const useParticipationNotifications = () => {
  const { showSuccess, showError } = useNotification();

  // Success notifications
  const notifyParticipationAdded = useCallback(() => {
    showSuccess(MESSAGES.SUCCESS.PARTICIPATION_ADDED);
  }, [showSuccess]);

  const notifyParticipationUpdated = useCallback(() => {
    showSuccess(MESSAGES.SUCCESS.PARTICIPATION_UPDATED);
  }, [showSuccess]);

  const notifyParticipationDeleted = useCallback(() => {
    showSuccess(MESSAGES.SUCCESS.PARTICIPATION_DELETED);
  }, [showSuccess]);

  const notifySuccess = useCallback((message: string) => {
    showSuccess(message);
  }, [showSuccess]);

  // Error notifications
  const notifySaveFailed = useCallback(() => {
    showError(MESSAGES.ERROR.SAVE_FAILED);
  }, [showError]);

  const notifyUpdateFailed = useCallback(() => {
    showError(MESSAGES.ERROR.UPDATE_FAILED);
  }, [showError]);

  const notifyDeleteFailed = useCallback(() => {
    showError(MESSAGES.ERROR.DELETE_FAILED);
  }, [showError]);

  const notifyInvalidId = useCallback(() => {
    showError(MESSAGES.ERROR.INVALID_ID);
  }, [showError]);

  const notifyError = useCallback((message: string) => {
    showError(message);
  }, [showError]);

  return {
    // Success notifications
    notifyParticipationAdded,
    notifyParticipationUpdated,
    notifyParticipationDeleted,
    notifySuccess,
    // Error notifications
    notifySaveFailed,
    notifyUpdateFailed,
    notifyDeleteFailed,
    notifyInvalidId,
    notifyError,
  };
};
