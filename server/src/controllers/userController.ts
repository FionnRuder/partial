import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import { isValidRole, roleToPrismaEnum, canManageUsers } from "../lib/roles";
import { logCreate, logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

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
      where: { id: userId, organizationId: req.auth.organizationId },
      include: {
        organization: true,
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
    const { username, name, email, phoneNumber, role, profilePictureUrl, disciplineTeamId } = req.body;

    // Validate required fields
    if (!username || !name || !email || !phoneNumber || !role) {
      res.status(400).json({ 
        message: "Missing required fields: username, name, email, phoneNumber, and role are required" 
      });
      return;
    }

    // Check if user with this email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
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
        message: "User with this email or username already exists" 
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

    // Log user creation
    await logCreate(
      req,
      "User",
      user.id,
      `User created: ${user.name} (${user.email}) with role ${role}`,
      sanitizeForAudit(user)
    );

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

    // Get existing user before update for audit logging
    const existingUser = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.auth.organizationId },
      include: {
        disciplineTeam: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
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
      // SECURITY: Only Admins, Managers, and Program Managers can update user roles
      const currentUserRole = req.auth.role || "";
      if (!canManageUsers(currentUserRole)) {
        res.status(403).json({ 
          message: "You do not have permission to update user roles. Only Admins, Managers, and Program Managers can update roles." 
        });
        return;
      }

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
      where: { id: userId, organizationId: req.auth.organizationId },
      data: updateData,
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.auth.organizationId },
      include: {
        organization: true,
        disciplineTeam: true,
      },
    });

    // Log user update
    if (user) {
      const changedFields = getChangedFields(existingUser, user);
      await logUpdate(
        req,
        "User",
        user.id,
        `User updated: ${user.name} (${user.email})`,
        sanitizeForAudit(existingUser),
        sanitizeForAudit(user),
        changedFields
      );
    }

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

    // Users can only view their own preferences, or admins can view any
    const requestingUserId = req.auth.userId;
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { role: true },
    });

    if (userId !== requestingUserId && requestingUser?.role !== 'Admin') {
      res.status(403).json({ message: "You can only view your own email preferences" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.auth.organizationId },
      select: {
        id: true,
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

    // Users can only update their own preferences, or admins can update any
    const requestingUserId = req.auth.userId;
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { role: true },
    });

    if (userId !== requestingUserId && requestingUser?.role !== 'Admin') {
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
      where: { id: userId, organizationId: req.auth.organizationId },
      data: updateData,
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.auth.organizationId },
      select: {
        id: true,
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
