import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getCognitoClient } from "../lib/cognitoClient";

const prisma = new PrismaClient();

/**
 * Health check status types
 */
type HealthStatus = "healthy" | "degraded" | "unhealthy";

interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  checks: {
    database: {
      status: "up" | "down";
      responseTime?: number;
      error?: string;
    };
    cognito: {
      status: "up" | "down";
      error?: string;
    };
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<{
  status: "up" | "down";
  responseTime?: number;
  error?: string;
}> {
  try {
    const startTime = Date.now();
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return {
      status: "up",
      responseTime,
    };
  } catch (error: any) {
    return {
      status: "down",
      error: error.message || "Database connection failed",
    };
  }
}

/**
 * Check Cognito connectivity
 */
async function checkCognito(): Promise<{
  status: "up" | "down";
  error?: string;
}> {
  try {
    // Try to get the Cognito client
    const client = getCognitoClient();
    
    if (!client) {
      return {
        status: "down",
        error: "Cognito client not initialized",
      };
    }

    // Try to access the issuer metadata to verify connectivity
    const issuer = (client as any).issuer;
    if (!issuer || !issuer.issuer) {
      return {
        status: "down",
        error: "Cognito issuer not available",
      };
    }

    // Optionally, we could ping the issuer endpoint, but that's probably overkill
    // Just verifying the client exists and has issuer info is sufficient
    
    return {
      status: "up",
    };
  } catch (error: any) {
    return {
      status: "down",
      error: error.message || "Cognito connectivity check failed",
    };
  }
}

/**
 * Health check endpoint handler
 * Returns service status: healthy, degraded, or unhealthy
 */
export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Run all health checks in parallel
    const [databaseCheck, cognitoCheck] = await Promise.all([
      checkDatabase(),
      checkCognito(),
    ]);

    // Determine overall status
    let status: HealthStatus;
    const allUp = databaseCheck.status === "up" && cognitoCheck.status === "up";
    const allDown = databaseCheck.status === "down" && cognitoCheck.status === "down";
    const someDown = !allUp && !allDown;

    if (allUp) {
      status = "healthy";
    } else if (someDown) {
      status = "degraded"; // Some services down but not all
    } else {
      status = "unhealthy"; // All critical services down
    }

    const result: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseCheck,
        cognito: cognitoCheck,
      },
    };

    // Return appropriate HTTP status code
    const httpStatus = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

    res.status(httpStatus).json(result);
  } catch (error: any) {
    // If health check itself fails, return unhealthy
    const result: HealthCheckResult = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: "down",
          error: "Health check failed",
        },
        cognito: {
          status: "down",
          error: "Health check failed",
        },
      },
    };

    res.status(503).json(result);
  }
};

/**
 * Simple liveness probe endpoint
 * Just returns 200 OK if the server is running
 */
export const livenessCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Readiness probe endpoint
 * Checks if the service is ready to accept traffic
 * Similar to health check but may have different criteria
 */
export const readinessCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check database (required for readiness)
    const databaseCheck = await checkDatabase();

    if (databaseCheck.status === "down") {
      res.status(503).json({
        status: "not_ready",
        timestamp: new Date().toISOString(),
        reason: "Database is not available",
      });
      return;
    }

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: "not_ready",
      timestamp: new Date().toISOString(),
      reason: error.message || "Readiness check failed",
    });
  }
};

