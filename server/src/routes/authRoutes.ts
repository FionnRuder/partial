import { Router, Request, Response } from "express";
import { getAuthHandler, getAuth } from "../lib/auth";
import { PrismaClient } from "@prisma/client";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();
const prisma = new PrismaClient();

// Add /auth/me endpoint to get current user
// This endpoint requires authentication - we'll use Better Auth session
// IMPORTANT: This must be defined BEFORE the catch-all route below
router.get("/me", async (req: Request, res: Response) => {
  try {
    // Get Better Auth session
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({ 
        message: "Session expired or invalid. Please log in again.",
        requiresLogin: true
      });
      return;
    }

    // Find user by Better Auth user ID
    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving user: ${error.message}` });
  }
});

// Mount Better Auth handler
// This will handle all routes under /api/auth/*
// IMPORTANT: This catch-all must be AFTER specific routes like /me
router.all("*", async (req, res, next) => {
  try {
    const handler = await getAuthHandler();
    handler(req, res, next);
  } catch (error: any) {
    console.error("Better Auth handler error:", error);
    res.status(500).json({ 
      message: "Authentication service error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
