# Error Boundaries & Error Handling

This directory contains error boundary components and error handling utilities for the application.

## Components

### `ErrorBoundary` (index.tsx)
A custom React error boundary component that catches JavaScript errors anywhere in the child component tree.

**Features:**
- Catches errors in component tree
- Provides user-friendly fallback UI
- Logs errors for debugging
- Supports error recovery
- Dark mode support

**Usage:**
```tsx
import ErrorBoundary from "@/components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### `RouteErrorBoundary`
An error boundary specifically designed for route-level errors. Uses `react-error-boundary` for better control.

**Features:**
- Automatically resets when route changes
- Route-specific error handling
- Better error recovery

**Usage:**
```tsx
import { RouteErrorBoundary } from "@/components/ErrorBoundary/RouteErrorBoundary";

<RouteErrorBoundary>
  <YourRouteComponent />
</RouteErrorBoundary>
```

### `GlobalErrorHandlerSetup`
A component that sets up global error handlers for unhandled errors and promise rejections.

**Usage:**
Place in root layout (already done):
```tsx
<GlobalErrorHandlerSetup />
```

## Utilities

### `errorHandler.ts`
Contains error handling utilities:

- `logError()` - Logs errors with context
- `getUserFriendlyErrorMessage()` - Converts errors to user-friendly messages
- `handleApiError()` - Handles API errors specifically
- `withErrorHandling()` - Wraps async functions with error handling
- `createErrorHandler()` - Creates error handlers for event handlers

### `globalErrorHandler.ts`
Sets up global error handlers:
- `setupGlobalErrorHandlers()` - Sets up window.onerror and unhandledrejection handlers
- `removeGlobalErrorHandlers()` - Removes handlers (for cleanup)

### `useErrorHandler` Hook
A React hook for handling errors in components:

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

const MyComponent = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  const handleClick = async () => {
    await handleAsyncError(
      async () => {
        // Your async operation
      },
      { component: "MyComponent", action: "handleClick" }
    );
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

## Error Message Types

The error handler recognizes and provides user-friendly messages for:

- **Network errors** - Connection issues
- **Authentication errors** - Session expired
- **Permission errors** - Access denied
- **Not found errors** - 404 errors
- **Validation errors** - Invalid input
- **Server errors** - 500 errors
- **Rate limiting** - Too many requests

## Integration

Error boundaries are already integrated at:
1. **Root level** - Catches all app-level errors
2. **Route level** - Catches route-specific errors
3. **Global handlers** - Catches unhandled errors and promise rejections

## Best Practices

1. **Use error boundaries** for component trees that might fail
2. **Use the error handler hook** for async operations
3. **Provide context** when logging errors (component, action)
4. **Show user-friendly messages** - Use `getUserFriendlyErrorMessage()`
5. **Log errors** - Always log errors for debugging

## Example

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { showApiError } from "@/lib/toast";

const MyComponent = () => {
  const { handleAsyncError } = useErrorHandler();

  const saveData = async () => {
    const result = await handleAsyncError(
      async () => {
        const response = await fetch("/api/data", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to save");
        return response.json();
      },
      { component: "MyComponent", action: "saveData" }
    );

    if (result) {
      showApiSuccess("Data saved successfully");
    }
  };

  return <button onClick={saveData}>Save</button>;
};
```

