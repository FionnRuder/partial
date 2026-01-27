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
const express_1 = require("express");
const auth_1 = require("../lib/auth");
const client_1 = require("@prisma/client");
const node_1 = require("better-auth/node");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Add /auth/me endpoint to get current user
// This endpoint requires authentication - we'll use Better Auth session
// IMPORTANT: This must be defined BEFORE the catch-all route below
router.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Better Auth session
        const auth = yield (0, auth_1.getAuth)();
        const session = yield auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!session || !session.user) {
            res.status(401).json({
                message: "Session expired or invalid. Please log in again.",
                requiresLogin: true
            });
            return;
        }
        // Find user by Better Auth user ID
        const user = yield prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                organization: true,
                disciplineTeam: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving user: ${error.message}` });
    }
}));
// Mount Better Auth handler
// This will handle all routes under /api/auth/*
// IMPORTANT: This catch-all must be AFTER specific routes like /me
router.all("*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const handler = yield (0, auth_1.getAuthHandler)();
        handler(req, res, next);
    }
    catch (error) {
        console.error("Better Auth handler error:", error);
        res.status(500).json({
            message: "Authentication service error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));
exports.default = router;
