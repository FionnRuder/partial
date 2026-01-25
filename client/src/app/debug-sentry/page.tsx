"use client";

import * as Sentry from "@sentry/nextjs";

/**
 * Dev-only page to verify client Sentry monitoring.
 * Visit /debug-sentry and click the buttons to trigger test events.
 * Only accessible in development environment.
 */
export default function DebugSentryPage() {
  const triggerCapturedError = () => {
    try {
      // Check if Sentry is initialized
      const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
      if (!dsn) {
        alert("ERROR: NEXT_PUBLIC_SENTRY_DSN is not set! Check your Railway environment variables.");
        console.error("Sentry DSN missing:", dsn);
        return;
      }

      const errorMessage = process.env.NODE_ENV === "production"
        ? "Production client Sentry test – captured error (intentional)"
        : "Sentry client test – captured error (intentional)";
      
      const testError = new Error(errorMessage);
      
      // Add additional context
      Sentry.withScope((scope) => {
        scope.setTag("test", "true");
        scope.setContext("test-info", {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          url: window.location.href,
        });
        const eventId = Sentry.captureException(testError);
        console.log("Sentry event ID:", eventId);
        
        alert(
          `Test error sent to Sentry!\n` +
          `Event ID: ${eventId}\n` +
          `DSN configured: ${dsn ? "Yes" : "No"}\n\n` +
          `Check your client-javascript-nextjs project in the Sentry dashboard.`
        );
      });
    } catch (e) {
      console.error("Error sending to Sentry:", e);
      alert(`Failed to send error to Sentry: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const triggerUnhandledError = () => {
    throw new Error("Sentry client test – unhandled error (intentional)");
  };

  // In production, show a simple test button
  if (process.env.NODE_ENV === "production") {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    const isConfigured = !!dsn;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sentry Production Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Click the button below to send a test error to Sentry. This will verify your client-side monitoring is working.
        </p>
        
        {/* Diagnostic info */}
        <div className={`mt-4 p-4 rounded-lg max-w-md ${isConfigured ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
          <p className="text-sm font-semibold mb-2">
            Configuration Status:
          </p>
          <ul className="text-sm space-y-1">
            <li>DSN Configured: <span className={isConfigured ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{isConfigured ? "✓ Yes" : "✗ No"}</span></li>
            <li>Environment: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{process.env.NODE_ENV || "unknown"}</code></li>
            {dsn && (
              <li className="text-xs text-gray-500 dark:text-gray-400 break-all">
                DSN: {dsn.substring(0, 30)}...
              </li>
            )}
          </ul>
          {!isConfigured && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              ⚠️ Add NEXT_PUBLIC_SENTRY_DSN to your Railway environment variables!
            </p>
          )}
        </div>
        
        <button
          type="button"
          onClick={triggerCapturedError}
          disabled={!isConfigured}
          className={`px-6 py-3 rounded-lg transition font-medium ${
            isConfigured
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Send Test Error to Sentry
        </button>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Other test options:</strong>
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>Server: Visit <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/api/test-sentry</code></li>
            <li>Check Sentry dashboard for real errors from your app</li>
            <li>Open browser console (F12) to see Sentry debug logs</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Sentry client test
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Use these buttons to confirm client-side Sentry is receiving events.
        Check your <strong>client-javascript-nextjs</strong> project in Sentry.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={triggerUnhandledError}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Trigger unhandled error
        </button>
        <button
          type="button"
          onClick={triggerCapturedError}
          className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
        >
          Trigger captured error
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        With <code>debug: true</code> in dev, you should see Sentry logs in the
        browser console when events are sent.
      </p>
    </div>
  );
}
