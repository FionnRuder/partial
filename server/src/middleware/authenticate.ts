import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdHeader = req.header("x-user-id");

    if (!userIdHeader) {
      res.status(401).json({ message: "Missing x-user-id header" });
      return;
    }

    const userId = Number(userIdHeader);

    if (!Number.isInteger(userId) || userId <= 0) {
      res
        .status(400)
        .json({ message: "x-user-id header must be a positive integer" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        organizationId: true,
        role: true,
      },
    });

    if (!user) {
      console.error(`User not found for userId: ${userId} (type: ${typeof userId})`);
      res.status(401).json({ message: "User not found for provided x-user-id" });
      return;
    }

    req.auth = {
      userId: user.userId,
      organizationId: user.organizationId,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

