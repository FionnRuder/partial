"use client";

import { useCallback } from "react";
import { logError, getUserFriendlyErrorMessage, createErrorHandler } from "@/lib/errorHandler";
import { showToast } from "@/lib/toast";

/**
 * Hook for handling errors in components
 */
export const useErrorHandler = () => {
  const handleError = useCallback(
    (error: Error | unknown, context?: { component?: string; action?: string }) => {
      logError(error, context);
      const message = getUserFriendlyErrorMessage(error);
      showToast.error(message);
      return message;
    },
    []
  );

  const handleAsyncError = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      context?: { component?: string; action?: string },
      onError?: (error: Error) => void
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        logError(error, context);
        const message = getUserFriendlyErrorMessage(error);
        showToast.error(message);
        if (onError && error instanceof Error) {
          onError(error);
        }
        return null;
      }
    },
    []
  );

  return {
    handleError,
    handleAsyncError,
    createErrorHandler: (context?: { component?: string; action?: string }) =>
      createErrorHandler(context),
  };
};

