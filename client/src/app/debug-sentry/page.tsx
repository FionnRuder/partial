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
      throw new Error("Production client Sentry test – captured error (intentional)");
    } catch (e) {
      Sentry.captureException(e);
      alert("Test error sent to Sentry! Check your client-javascript-nextjs project in the Sentry dashboard.");
    }
  };

  // In production, show a simple test button
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sentry Production Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Click the button below to send a test error to Sentry. This will verify your client-side monitoring is working.
        </p>
        <button
          type="button"
          onClick={triggerCapturedError}
          className="px-6 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition font-medium"
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
          </ul>
        </div>
      </div>
    );
  }
  const triggerUnhandledError = () => {
    throw new Error("Sentry client test – unhandled error (intentional)");
  };

  const triggerCapturedError = () => {
    try {
      throw new Error("Sentry client test – captured error (intentional)");
    } catch (e) {
      Sentry.captureException(e);
    }
    alert("Error sent to Sentry. Check your client project in the dashboard.");
  };

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
