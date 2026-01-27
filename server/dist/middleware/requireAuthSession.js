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
exports.requireAuthSession = void 0;
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
/**
 * Middleware that requires a Better Auth session but doesn't require user to exist in database
 * Used for onboarding routes where user is authenticated but hasn't completed profile setup
 */
const requireAuthSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Better Auth session
        const auth = yield (0, auth_1.getAuth)();
        const session = yield auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!session || !session.user) {
            res.status(401).json({
                message: "Authentication required. Please log in.",
                requiresLogin: true
            });
            return;
        }
        // Attach session to request for use in controllers
        req.betterAuthSession = session;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireAuthSession = requireAuthSession;
