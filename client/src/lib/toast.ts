import toast from "react-hot-toast";
import { getUserFriendlyErrorMessage, handleApiError, logError } from "./errorHandler";

/**
 * Toast notification utilities for consistent messaging across the app
 */

export const showToast = {
  /**
   * Show a success toast notification
   */
  success: (message: string, duration: number = 4000) => {
    toast.success(message, { duration });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, duration: number = 5000) => {
    toast.error(message, { duration });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, duration: number = 4000) => {
    toast(message, {
      icon: "⚠️",
      duration,
      style: {
        background: "#fbbf24",
        color: "#fff",
      },
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, duration: number = 4000) => {
    toast(message, {
      icon: "ℹ️",
      duration,
    });
  },

  /**
   * Show a loading toast notification
   * Returns a function to update the toast (success/error)
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Helper to show error from API response with user-friendly messages
 */
export const showApiError = (error: any, defaultMessage: string = "An error occurred") => {
  // Log the error for debugging
  logError(error, {
    component: "showApiError",
    action: "display_error",
  });

  // Get user-friendly error message
  const message = handleApiError(error, defaultMessage);
  showToast.error(message);
};

/**
 * Helper to show success message after API operation
 */
export const showApiSuccess = (message: string) => {
  showToast.success(message);
};

