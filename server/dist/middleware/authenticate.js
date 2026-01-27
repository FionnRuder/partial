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
exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const authLogger_1 = require("../lib/authLogger");
const sentry_1 = require("../lib/sentry");
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
const prisma = new client_1.PrismaClient();
/**
 * Authentication middleware using Better Auth
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Better Auth session
        const auth = yield (0, auth_1.getAuth)();
        const session = yield auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!session || !session.user) {
            const context = (0, authLogger_1.getAuthContext)(req);
            (0, authLogger_1.logAuthEvent)(Object.assign(Object.assign({ eventType: authLogger_1.AuthEventType.SESSION_INVALID }, context), { reason: "No valid Better Auth session found" }));
            // Clear any old session cookies
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        (0, authLogger_1.logAuthEvent)(Object.assign(Object.assign({ eventType: authLogger_1.AuthEventType.SESSION_INVALID }, context), { error: err.message, reason: "Error destroying invalid session" }));
                    }
                });
            }
            res.status(401).json({
                message: "Session expired or invalid. Please log in again.",
                requiresLogin: true
            });
            return;
        }
        // Find user by Better Auth user ID
        const user = yield prisma.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                organizationId: true,
                role: true,
                email: true,
            },
        });
        if (!user) {
            // User authenticated but not found in database
            // This happens during first login - redirect to onboarding
            const context = (0, authLogger_1.getAuthContext)(req);
            (0, authLogger_1.logAuthEvent)(Object.assign(Object.assign({ eventType: authLogger_1.AuthEventType.ONBOARDING_REQUIRED }, context), { email: session.user.email, reason: "User authenticated but not found in database" }));
            res.status(401).json({
                message: "User authenticated but not found in database. Please complete onboarding.",
                requiresOnboarding: true
            });
            return;
        }
        // User found - attach to request and continue
        req.auth = {
            userId: user.id, // Keep userId name for backward compatibility in req.auth
            organizationId: user.organizationId,
            role: user.role,
        };
        // Set user context in Sentry for error tracking
        (0, sentry_1.setUserContext)(user.id, user.organizationId, user.email);
        // Log successful authentication
        (0, authLogger_1.logAuthEvent)(Object.assign(Object.assign({ eventType: authLogger_1.AuthEventType.LOGIN_SUCCESS }, (0, authLogger_1.getAuthContext)(req)), { email: user.email }));
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticate = authenticate;
