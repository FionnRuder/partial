"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.auth = void 0;
exports.clearAuthCache = clearAuthCache;
exports.getAuth = getAuth;
exports.getAuthHandler = getAuthHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Lazy load better-auth to handle ESM module in CommonJS context
// Note: Clear these caches if you need to reload the auth configuration
let _auth = null;
let _authHandler = null;
// Function to clear auth cache (useful for development/testing)
function clearAuthCache() {
    _auth = null;
    _authHandler = null;
}
function getAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_auth) {
            const { betterAuth } = yield Promise.resolve().then(() => __importStar(require("better-auth")));
            const { prismaAdapter } = yield Promise.resolve().then(() => __importStar(require("better-auth/adapters/prisma")));
            _auth = betterAuth({
                database: prismaAdapter(prisma, {
                    provider: "postgresql",
                }),
                emailAndPassword: {
                    enabled: true,
                },
                baseURL: process.env.BETTER_AUTH_URL || process.env.FRONTEND_URL || "http://localhost:3000",
                basePath: "/api/auth",
                secret: process.env.BETTER_AUTH_SECRET || process.env.SESSION_SECRET || "change-this-secret-in-production",
                trustedOrigins: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:3000"],
                advanced: {
                    defaultCookieAttributes: (() => {
                        const isProd = process.env.NODE_ENV === 'production' || (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));
                        const attrs = {
                            sameSite: isProd ? "none" : "lax",
                            secure: isProd ? true : false,
                        };
                        if (isProd) {
                            attrs.partitioned = true;
                        }
                        return attrs;
                    })(),
                },
                user: {
                    additionalFields: {
                        username: {
                            type: "string",
                            required: false, // Not required in input, will be set by hook
                            input: false, // Don't allow user to set username during signup
                        },
                        organizationId: {
                            type: "number",
                            required: false, // Not required in input, will be set by hook
                            input: false, // Don't allow user to set organizationId during signup
                        },
                        phoneNumber: {
                            type: "string",
                            required: false, // Optional in input, but required in database (set by hook if missing)
                            input: true, // Allow phone number to be passed during signup
                        },
                        role: {
                            type: "string",
                            required: false, // Not required in input, will be set by hook
                            input: false, // Don't allow user to set role during signup
                        },
                    },
                },
                databaseHooks: {
                    user: {
                        create: {
                            before: (userData, ctx) => __awaiter(this, void 0, void 0, function* () {
                                console.log("[Better Auth Hook] User create before hook called with data:", JSON.stringify(userData, null, 2));
                                try {
                                    // Get or create a default organization for new users
                                    // This will be updated by the onboarding endpoint
                                    let defaultOrg = yield prisma.organization.findFirst({
                                        orderBy: { id: 'asc' },
                                    });
                                    if (!defaultOrg) {
                                        console.log("[Better Auth Hook] Creating default organization");
                                        // Create a temporary default organization if none exists
                                        defaultOrg = yield prisma.organization.create({
                                            data: {
                                                name: "Default Organization",
                                            },
                                        });
                                    }
                                    console.log("[Better Auth Hook] Using organization ID:", defaultOrg.id);
                                    // Generate unique username from email if not provided
                                    const email = userData.email || "";
                                    let baseUsername = email.split('@')[0] || `user_${Date.now()}`;
                                    // Check if username already exists in this organization and make it unique
                                    let username = baseUsername;
                                    let counter = 1;
                                    let existingUser = yield prisma.user.findFirst({
                                        where: {
                                            AND: [
                                                { organizationId: defaultOrg.id },
                                                { username: username },
                                            ],
                                        },
                                    });
                                    while (existingUser) {
                                        username = `${baseUsername}${counter}`;
                                        counter++;
                                        existingUser = yield prisma.user.findFirst({
                                            where: {
                                                AND: [
                                                    { organizationId: defaultOrg.id },
                                                    { username: username },
                                                ],
                                            },
                                        });
                                    }
                                    console.log("[Better Auth Hook] Generated unique username:", username);
                                    // Return user data with required custom fields
                                    // Note: These are Prisma schema field names, not Better Auth field names
                                    // role must be a valid UserRole enum value
                                    // phoneNumber should come from the signup request if provided
                                    const result = {
                                        data: Object.assign(Object.assign({}, userData), { username: username, organizationId: defaultOrg.id, phoneNumber: userData.phoneNumber || "", role: (userData.role || "Engineer") }),
                                    };
                                    console.log("[Better Auth Hook] Returning data:", JSON.stringify(result, null, 2));
                                    return result;
                                }
                                catch (error) {
                                    console.error("[Better Auth Hook] Error in user create hook:", error);
                                    console.error("[Better Auth Hook] Error stack:", error.stack);
                                    // Don't abort - let Better Auth handle the error
                                    return { data: userData };
                                }
                            }),
                        },
                    },
                },
            });
        }
        return _auth;
    });
}
function getAuthHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_authHandler) {
            const { toNodeHandler } = yield Promise.resolve().then(() => __importStar(require("better-auth/node")));
            const auth = yield getAuth();
            _authHandler = toNodeHandler(auth);
        }
        return _authHandler;
    });
}
// Export auth for direct use (returns promise)
exports.auth = {
    get api() {
        return {
            getSession: (args) => __awaiter(this, void 0, void 0, function* () {
                const authInstance = yield getAuth();
                return authInstance.api.getSession(args);
            }),
            // Add other API methods as needed
        };
    },
};
