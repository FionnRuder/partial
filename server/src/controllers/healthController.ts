import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
    // TODO: Add authentication service health check when implementing better-auth.com
    // auth: {
    //   status: "up" | "down";
    //   error?: string;
    // };
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

// TODO: Add authentication service health check when implementing better-auth.com
// async function checkAuth(): Promise<{
//   status: "up" | "down";
//   error?: string;
// }> {
//   // Implementation for better-auth.com health check
// }

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
    const [databaseCheck] = await Promise.all([
      checkDatabase(),
      // TODO: Add auth check when implementing better-auth.com
      // checkAuth(),
    ]);

    // Determine overall status
    let status: HealthStatus;
    const allUp = databaseCheck.status === "up";
    const allDown = databaseCheck.status === "down";

    if (allUp) {
      status = "healthy";
    } else {
      status = "unhealthy"; // All critical services down
    }

    const result: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseCheck,
        // TODO: Add auth check when implementing better-auth.com
        // auth: authCheck,
      },
    };

    // Return appropriate HTTP status code
    const httpStatus = status === "healthy" ? 200 : 503;

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
        // TODO: Add auth check when implementing better-auth.com
        // auth: {
        //   status: "down",
        //   error: "Health check failed",
        // },
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




