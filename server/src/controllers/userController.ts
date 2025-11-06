import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        disciplineTeam: true,
        authoredWorkItems: true,
        assignedWorkItems: true,
        partNumbers: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: {
        disciplineTeam: true,
        authoredWorkItems: {
          include: {
            program: true,
            dueByMilestone: true,
            assigneeUser: true,
          },
        },
        assignedWorkItems: {
          include: {
            program: true,
            dueByMilestone: true,
            authorUser: true,
          },
        },
        partNumbers: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, username, name, email, phoneNumber, role, profilePictureUrl, disciplineTeamId } = req.body;

    // Validate required fields
    if (!cognitoId || !username || !name || !email || !phoneNumber || !role) {
      res.status(400).json({ 
        message: "Missing required fields: cognitoId, username, name, email, phoneNumber, and role are required" 
      });
      return;
    }

    // Check if user with this email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { cognitoId }
        ]
      }
    });

    if (existingUser) {
      res.status(409).json({ 
        message: "User with this email, username, or cognitoId already exists" 
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        cognitoId,
        username,
        name,
        email,
        phoneNumber,
        role,
        profilePictureUrl: profilePictureUrl || null,
        disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null,
      },
      include: {
        disciplineTeam: true,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, phoneNumber, role, profilePictureUrl, disciplineTeamId } = req.body;

    const user = await prisma.user.update({
      where: { userId: Number(userId) },
      data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(role && { role }),
        ...(profilePictureUrl !== undefined && { profilePictureUrl }),
        ...(disciplineTeamId !== undefined && { disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null }),
      },
      include: {
        disciplineTeam: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Error updating user: ${error.message}` });
  }
};
