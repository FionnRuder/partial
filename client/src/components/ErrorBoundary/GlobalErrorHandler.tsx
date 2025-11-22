"use client";

import { useEffect } from "react";
import { setupGlobalErrorHandlers, removeGlobalErrorHandlers } from "@/lib/globalErrorHandler";

/**
 * Component that sets up global error handlers on mount
 * Should be placed high in the component tree (e.g., in root layout)
 */
export const GlobalErrorHandlerSetup = () => {
  useEffect(() => {
    // Setup global error handlers
    setupGlobalErrorHandlers();

    // Cleanup on unmount
    return () => {
      removeGlobalErrorHandlers();
    };
  }, []);

  // This component doesn't render anything
  return null;
};

