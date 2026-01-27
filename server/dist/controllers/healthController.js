"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readinessCheck = exports.livenessCheck = exports.healthCheck = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Check database connectivity
 */
function checkDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const startTime = Date.now();
            // Simple query to check database connectivity
            yield prisma.$queryRaw `SELECT 1`;
            const responseTime = Date.now() - startTime;
            return {
                status: "up",
                responseTime,
            };
        }
        catch (error) {
            return {
                status: "down",
                error: error.message || "Database connection failed",
            };
        }
    });
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
const healthCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run all health checks in parallel
        const [databaseCheck] = yield Promise.all([
            checkDatabase(),
            // TODO: Add auth check when implementing better-auth.com
            // checkAuth(),
        ]);
        // Determine overall status
        let status;
        const allUp = databaseCheck.status === "up";
        const allDown = databaseCheck.status === "down";
        if (allUp) {
            status = "healthy";
        }
        else {
            status = "unhealthy"; // All critical services down
        }
        const result = {
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
    }
    catch (error) {
        // If health check itself fails, return unhealthy
        const result = {
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
});
exports.healthCheck = healthCheck;
/**
 * Simple liveness probe endpoint
 * Just returns 200 OK if the server is running
 */
const livenessCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: "alive",
        timestamp: new Date().toISOString(),
    });
});
exports.livenessCheck = livenessCheck;
/**
 * Readiness probe endpoint
 * Checks if the service is ready to accept traffic
 * Similar to health check but may have different criteria
 */
const readinessCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check database (required for readiness)
        const databaseCheck = yield checkDatabase();
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
    }
    catch (error) {
        res.status(503).json({
            status: "not_ready",
            timestamp: new Date().toISOString(),
            reason: error.message || "Readiness check failed",
        });
    }
});
exports.readinessCheck = readinessCheck;
