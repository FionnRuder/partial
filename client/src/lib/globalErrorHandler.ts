"use client";

import { logError } from "./errorHandler";
import { showToast } from "./toast";

/**
 * Sets up global error handlers for unhandled errors and promise rejections
 * Should be called once in the app initialization
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled JavaScript errors
  if (typeof window !== "undefined") {
    const originalErrorHandler = window.onerror;
    window.onerror = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      // Call original handler if it exists
      if (originalErrorHandler) {
        originalErrorHandler(message, source, lineno, colno, error);
      }

      const messageStr = String(message);
      const errorMessage = error?.message || messageStr;
      
      // Ignore chunk loading errors - these are harmless and occur during navigation/logout
      if (
        messageStr.includes("Failed to load chunk") ||
        messageStr.includes("Loading chunk") ||
        messageStr.includes("ChunkLoadError") ||
        messageStr.includes("/_next/static/chunks/") ||
        errorMessage.includes("Failed to load chunk") ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("ChunkLoadError") ||
        errorMessage.includes("/_next/static/chunks/") ||
        (messageStr.includes("chunk") && messageStr.includes("module"))
      ) {
        // Silently ignore chunk loading errors - they're not actionable
        return false;
      }

      // Log the error
      const errorObj = error || new Error(messageStr);
      logError(errorObj, {
        component: "GlobalErrorHandler",
        action: "window.onerror",
        additionalInfo: {
          source,
          lineno,
          colno,
          message: messageStr,
        },
      });

      // Show user-friendly error message (only for unexpected errors)
      if (error && !error.message.includes("Script error")) {
        showToast.error(
          "An unexpected error occurred. Please refresh the page if the problem persists."
        );
      }

      // Return false to prevent default browser error handling
      return false;
    };

    // Handle unhandled promise rejections
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      // Call original handler if it exists
      if (originalUnhandledRejection) {
        originalUnhandledRejection(event);
      }

      const reasonStr = String(event.reason);
      const errorMessage = event.reason instanceof Error ? event.reason.message : reasonStr;
      
      // Ignore chunk loading errors - these are harmless and occur during navigation/logout
      if (
        reasonStr.includes("Failed to load chunk") ||
        reasonStr.includes("Loading chunk") ||
        reasonStr.includes("ChunkLoadError") ||
        reasonStr.includes("/_next/static/chunks/") ||
        errorMessage.includes("Failed to load chunk") ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("ChunkLoadError") ||
        errorMessage.includes("/_next/static/chunks/") ||
        (reasonStr.includes("chunk") && reasonStr.includes("module"))
      ) {
        // Silently ignore chunk loading errors - they're not actionable
        event.preventDefault();
        return;
      }

      // Log the error
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(reasonStr);
      logError(error, {
        component: "GlobalErrorHandler",
        action: "unhandledrejection",
        additionalInfo: {
          reason: event.reason,
        },
      });

      // Show user-friendly error message
      showToast.error(
        "An operation failed unexpectedly. Please try again or refresh the page."
      );

      // Prevent default browser error handling
      event.preventDefault();
    };
  }
};

/**
 * Removes global error handlers (useful for cleanup in tests)
 */
export const removeGlobalErrorHandlers = () => {
  if (typeof window !== "undefined") {
    window.onerror = null;
    window.onunhandledrejection = null;
  }
};

