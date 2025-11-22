"use client";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logError } from "@/lib/errorHandler";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const RouteErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isDevelopment = process.env.NODE_ENV === "development";

  const handleGoHome = () => {
    router.push("/home");
    resetErrorBoundary();
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Log error
  React.useEffect(() => {
    logError(error, {
      component: "RouteErrorBoundary",
      action: "render",
      additionalInfo: { pathname },
    });
  }, [error, pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Page Error
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This page encountered an error. You can try refreshing or return to the
          home page.
        </p>

        {isDevelopment && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </button>
          <button
            onClick={handleReload}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

/**
 * Error boundary for route-level errors
 * Uses react-error-boundary for better control and reset capabilities
 */
export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  fallback: Fallback = RouteErrorFallback,
}) => {
  const pathname = usePathname();

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={(error, errorInfo) => {
        logError(error, {
          component: "RouteErrorBoundary",
          action: "onError",
          additionalInfo: {
            pathname,
            componentStack: errorInfo.componentStack,
          },
        });
      }}
      resetKeys={[pathname]} // Reset when route changes
      onReset={() => {
        // Optional: scroll to top on reset
        window.scrollTo(0, 0);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

