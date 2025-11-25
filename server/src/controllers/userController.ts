import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import { isValidRole, roleToPrismaEnum } from "../lib/roles";

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const users = await prisma.user.findMany({
      where: { organizationId },
      include: {
        disciplineTeam: true,
        authoredWorkItems: {
          where: { organizationId },
        },
        assignedWorkItems: {
          where: { organizationId },
        },
        partNumbers: {
          where: { organizationId },
        },
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
    
    const user = await prisma.user.findFirst({
      where: { userId: Number(userId), organizationId: req.auth.organizationId },
      include: {
        disciplineTeam: true,
        authoredWorkItems: {
          where: { organizationId: req.auth.organizationId },
          include: {
            program: true,
            dueByMilestone: true,
            assigneeUser: true,
          },
        },
        assignedWorkItems: {
          where: { organizationId: req.auth.organizationId },
          include: {
            program: true,
            dueByMilestone: true,
            authorUser: true,
          },
        },
        partNumbers: {
          where: { organizationId: req.auth.organizationId },
        },
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
          { cognitoId },
          {
            AND: [
              { organizationId: req.auth.organizationId },
              { email }
            ]
          },
          {
            AND: [
              { organizationId: req.auth.organizationId },
              { username }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      res.status(409).json({ 
        message: "User with this email, username, or cognitoId already exists" 
      });
      return;
    }

    if (disciplineTeamId) {
      const disciplineTeam = await prisma.disciplineTeam.findFirst({
        where: {
          id: Number(disciplineTeamId),
          organizationId: req.auth.organizationId,
        },
      });

      if (!disciplineTeam) {
        res.status(404).json({ message: "Discipline team not found" });
        return;
      }
    }

    // Convert role to Prisma enum format (e.g., "Program Manager" -> "ProgramManager")
    const prismaRole: UserRole = roleToPrismaEnum(role);

    const user = await prisma.user.create({
      data: {
        cognitoId,
        username,
        name,
        email,
        phoneNumber,
        role: prismaRole, // Use Prisma enum format
        profilePictureUrl: profilePictureUrl || null,
        disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null,
        organizationId: req.auth.organizationId,
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
    const { 
      name, 
      phoneNumber, 
      role, 
      profilePictureUrl, 
      disciplineTeamId,
      emailNotificationsEnabled,
      emailWorkItemAssignment,
      emailWorkItemStatusChange,
      emailWorkItemComment,
      emailInvitation,
      emailApproachingDeadline,
    } = req.body;

    const userIdNumber = Number(userId);
    if (!Number.isInteger(userIdNumber)) {
      res.status(400).json({ message: "userId must be a valid integer" });
      return;
    }

    if (disciplineTeamId !== undefined && disciplineTeamId !== null) {
      const disciplineTeam = await prisma.disciplineTeam.findFirst({
        where: {
          id: Number(disciplineTeamId),
          organizationId: req.auth.organizationId,
        },
      });

      if (!disciplineTeam) {
        res.status(404).json({ message: "Discipline team not found" });
        return;
      }
    }

    // Convert role to Prisma enum format if provided
    const updateData: any = {
      ...(name && { name }),
      ...(phoneNumber && { phoneNumber }),
      ...(profilePictureUrl !== undefined && { profilePictureUrl }),
      ...(disciplineTeamId !== undefined && {
        disciplineTeamId: disciplineTeamId ? Number(disciplineTeamId) : null,
      }),
      // Email notification preferences
      ...(emailNotificationsEnabled !== undefined && { emailNotificationsEnabled: Boolean(emailNotificationsEnabled) }),
      ...(emailWorkItemAssignment !== undefined && { emailWorkItemAssignment: Boolean(emailWorkItemAssignment) }),
      ...(emailWorkItemStatusChange !== undefined && { emailWorkItemStatusChange: Boolean(emailWorkItemStatusChange) }),
      ...(emailWorkItemComment !== undefined && { emailWorkItemComment: Boolean(emailWorkItemComment) }),
      ...(emailInvitation !== undefined && { emailInvitation: Boolean(emailInvitation) }),
      ...(emailApproachingDeadline !== undefined && { emailApproachingDeadline: Boolean(emailApproachingDeadline) }),
    };
    
    if (role) {
      // Validate role before updating
      if (!isValidRole(role)) {
        res.status(400).json({ 
          message: `Invalid role. Must be one of: Admin, Manager, Program Manager, Engineer, Viewer` 
        });
        return;
      }
      updateData.role = roleToPrismaEnum(role) as UserRole; // Convert to Prisma enum format
    }

    const updateResult = await prisma.user.updateMany({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
      data: updateData,
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
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

export const getEmailPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const userIdNumber = Number(userId);
    
    if (!Number.isInteger(userIdNumber)) {
      res.status(400).json({ message: "userId must be a valid integer" });
      return;
    }

    // Users can only view their own preferences, or admins can view any
    const requestingUserId = req.auth.userId;
    const requestingUser = await prisma.user.findUnique({
      where: { userId: requestingUserId },
      select: { role: true },
    });

    if (userIdNumber !== requestingUserId && requestingUser?.role !== 'Admin') {
      res.status(403).json({ message: "You can only view your own email preferences" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
      select: {
        userId: true,
        emailNotificationsEnabled: true,
        emailWorkItemAssignment: true,
        emailWorkItemStatusChange: true,
        emailWorkItemComment: true,
        emailInvitation: true,
        emailApproachingDeadline: true,
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
      .json({ message: `Error retrieving email preferences: ${error.message}` });
  }
};

export const updateEmailPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const {
      emailNotificationsEnabled,
      emailWorkItemAssignment,
      emailWorkItemStatusChange,
      emailWorkItemComment,
      emailInvitation,
      emailApproachingDeadline,
    } = req.body;

    const userIdNumber = Number(userId);
    
    if (!Number.isInteger(userIdNumber)) {
      res.status(400).json({ message: "userId must be a valid integer" });
      return;
    }

    // Users can only update their own preferences, or admins can update any
    const requestingUserId = req.auth.userId;
    const requestingUser = await prisma.user.findUnique({
      where: { userId: requestingUserId },
      select: { role: true },
    });

    if (userIdNumber !== requestingUserId && requestingUser?.role !== 'Admin') {
      res.status(403).json({ message: "You can only update your own email preferences" });
      return;
    }

    const updateData: any = {};
    
    if (emailNotificationsEnabled !== undefined) {
      updateData.emailNotificationsEnabled = Boolean(emailNotificationsEnabled);
    }
    if (emailWorkItemAssignment !== undefined) {
      updateData.emailWorkItemAssignment = Boolean(emailWorkItemAssignment);
    }
    if (emailWorkItemStatusChange !== undefined) {
      updateData.emailWorkItemStatusChange = Boolean(emailWorkItemStatusChange);
    }
    if (emailWorkItemComment !== undefined) {
      updateData.emailWorkItemComment = Boolean(emailWorkItemComment);
    }
    if (emailInvitation !== undefined) {
      updateData.emailInvitation = Boolean(emailInvitation);
    }
    if (emailApproachingDeadline !== undefined) {
      updateData.emailApproachingDeadline = Boolean(emailApproachingDeadline);
    }

    const updateResult = await prisma.user.updateMany({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
      data: updateData,
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
      select: {
        userId: true,
        emailNotificationsEnabled: true,
        emailWorkItemAssignment: true,
        emailWorkItemStatusChange: true,
        emailWorkItemComment: true,
        emailInvitation: true,
        emailApproachingDeadline: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating email preferences: ${error.message}` });
  }
};
