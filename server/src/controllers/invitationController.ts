import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { isValidRole, canCreateInvitations as canCreateInvitationsCheck, VALID_ROLES, roleToPrismaEnum, prismaEnumToRole } from "../lib/roles";

const prisma = new PrismaClient();

/**
 * Generate a cryptographically secure random token
 * Uses crypto.randomBytes for security (not Math.random)
 */
function generateSecureToken(): string {
  // Generate 32 random bytes (256 bits) and convert to base64url
  // Base64url is URL-safe (no +, /, or = padding issues)
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Create a new invitation
 * Only authorized users (admins/managers) can create invitations
 */
export const createInvitation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { invitedEmail, role, expiresInDays } = req.body;
    const organizationId = req.auth.organizationId;
    const createdByUserId = req.auth.userId;
    const creatorRole = req.auth.role;

    // Check if user has permission to create invitations
    if (!canCreateInvitationsCheck(creatorRole)) {
      res.status(403).json({ 
        message: "You do not have permission to create invitations. Only admins and managers can invite users." 
      });
      return;
    }

    // Validate required fields
    if (!role) {
      res.status(400).json({ 
        message: "Missing required field: role is required" 
      });
      return;
    }

    // Validate role is valid
    if (!isValidRole(role)) {
      res.status(400).json({ 
        message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` 
      });
      return;
    }

    // Validate email format if provided
    if (invitedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)) {
      res.status(400).json({ 
        message: "Invalid email format" 
      });
      return;
    }

    // Check if email is already a user in this organization
    if (invitedEmail) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: invitedEmail,
          organizationId: organizationId,
        },
      });

      if (existingUser) {
        res.status(409).json({ 
          message: "A user with this email already exists in your organization" 
        });
        return;
      }
    }

    // Set expiration (default 7 days, max 30 days)
    const days = Math.min(Math.max(1, expiresInDays || 7), 30);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Generate secure token
    const token = generateSecureToken();

    // Create invitation
    // Convert role display name to Prisma enum value (e.g., "Program Manager" -> "ProgramManager")
    const prismaRole = roleToPrismaEnum(role);
    
    // Use type assertion to bypass Prisma client type checking
    // The database already uses UserRole enum, but Prisma client needs regeneration
    const invitation = await (prisma as any).invitation.create({
      data: {
        organizationId,
        token,
        invitedEmail: invitedEmail || null,
        role: prismaRole, // This is already the correct enum value (e.g., "Manager", "ProgramManager")
        expiresAt,
        createdByUserId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      invitation: {
        id: invitation.id,
        token: invitation.token, // Include token so it can be sent to user
        invitedEmail: invitation.invitedEmail,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        organization: invitation.organization,
        createdBy: invitation.createdBy,
        createdAt: invitation.createdAt,
      },
      // Include invitation URL for convenience (frontend can construct this)
      invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/onboarding?invitation=${token}`,
    });
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ 
      message: `Error creating invitation: ${error.message}` 
    });
  }
};

/**
 * Validate an invitation token
 * Returns invitation details if valid, error if invalid
 */
export const validateInvitation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ 
        message: "Invitation token is required" 
      });
      return;
    }

    // Find invitation by token
    const invitation = await (prisma as any).invitation.findUnique({
      where: { token },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      res.status(404).json({ 
        message: "Invitation not found" 
      });
      return;
    }

    // Check if already used
    if (invitation.used) {
      res.status(410).json({ 
        message: "This invitation has already been used",
        usedAt: invitation.usedAt,
      });
      return;
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      res.status(410).json({ 
        message: "This invitation has expired",
        expiresAt: invitation.expiresAt,
      });
      return;
    }

    // Return invitation details (without sensitive info)
    // Convert Prisma enum to display name for frontend
    res.json({
      invitation: {
        id: invitation.id,
        invitedEmail: invitation.invitedEmail,
        role: prismaEnumToRole(invitation.role), // Convert ProgramManager -> "Program Manager"
        expiresAt: invitation.expiresAt,
        organization: invitation.organization,
        createdBy: invitation.createdBy,
        createdAt: invitation.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error validating invitation:", error);
    res.status(500).json({ 
      message: `Error validating invitation: ${error.message}` 
    });
  }
};

/**
 * Accept an invitation and join the organization
 * User must be authenticated via Cognito first
 */
export const acceptInvitation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User must be authenticated via Cognito
    if (!req.cognitoUserInfo) {
      res.status(401).json({ 
        message: "Authentication required. Please log in via Cognito first." 
      });
      return;
    }

    const { token } = req.body;
    const { username, name, email, phoneNumber } = req.body;
    const cognitoId = req.cognitoUserInfo.sub;
    const cognitoEmail = req.cognitoUserInfo.email;
    const cognitoName = req.cognitoUserInfo.name;

    // Use email from Cognito session (more trustworthy)
    const userEmail = cognitoEmail || email;
    const userName = cognitoName || name;

    if (!token) {
      res.status(400).json({ 
        message: "Invitation token is required" 
      });
      return;
    }

    // Validate required fields
    if (!username || !userName || !userEmail || !phoneNumber) {
      res.status(400).json({ 
        message: "Missing required fields: username, name, email, and phoneNumber are required" 
      });
      return;
    }

    // Find and validate invitation
    const invitation = await (prisma as any).invitation.findUnique({
      where: { token },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      res.status(404).json({ 
        message: "Invitation not found" 
      });
      return;
    }

    // Check if already used
    if (invitation.used) {
      res.status(410).json({ 
        message: "This invitation has already been used" 
      });
      return;
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      res.status(410).json({ 
        message: "This invitation has expired" 
      });
      return;
    }

    // If invitation has an email restriction, verify it matches
    if (invitation.invitedEmail && invitation.invitedEmail.toLowerCase() !== userEmail.toLowerCase()) {
      res.status(403).json({ 
        message: "This invitation is for a different email address. Please use the email address the invitation was sent to." 
      });
      return;
    }

    // Check if user with this cognitoId already exists
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingUser) {
      res.status(409).json({ 
        message: "You already have an account. Please log in instead.",
        user: existingUser
      });
      return;
    }

    // Check if email already exists in this organization
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: userEmail,
        organizationId: invitation.organizationId,
      },
    });

    if (existingEmail) {
      res.status(409).json({ 
        message: "A user with this email already exists in this organization" 
      });
      return;
    }

    // Check if username already exists in this organization
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        organizationId: invitation.organizationId,
      },
    });

    if (existingUsername) {
      res.status(409).json({ 
        message: "A user with this username already exists in this organization" 
      });
      return;
    }

      // Use transaction to create user and mark invitation as used atomically
      const result = await prisma.$transaction(async (tx) => {
        // Create user in the organization
        // invitation.role is already in Prisma enum format (e.g., ProgramManager)
        const user = await tx.user.create({
          data: {
            cognitoId,
            username,
            name: userName,
            email: userEmail,
            phoneNumber,
            role: invitation.role, // Use role from invitation (already in Prisma enum format)
            organizationId: invitation.organizationId,
          },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Mark invitation as used
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          used: true,
          usedAt: new Date(),
          usedByUserId: user.userId,
        },
      });

      return user;
    });

    res.status(201).json({
      user: result,
      organization: result.organization,
      message: "Successfully joined organization",
    });
  } catch (error: any) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ 
      message: `Error accepting invitation: ${error.message}` 
    });
  }
};

/**
 * Get all invitations for the current organization
 * Only authorized users can view invitations
 */
export const getInvitations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const userRole = req.auth.role;

    // Check if user has permission to view invitations
    if (!canCreateInvitationsCheck(userRole)) {
      res.status(403).json({ 
        message: "You do not have permission to view invitations" 
      });
      return;
    }

    const invitations = await (prisma as any).invitation.findMany({
      where: {
        organizationId,
      },
      include: {
        createdBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        usedBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Prisma enum values to display names for frontend
    const invitationsWithDisplayRoles = invitations.map((inv: any) => ({
      ...inv,
      role: prismaEnumToRole(inv.role), // Convert ProgramManager -> "Program Manager"
    }));

    res.json(invitationsWithDisplayRoles);
  } catch (error: any) {
    console.error("Error retrieving invitations:", error);
    res.status(500).json({ 
      message: `Error retrieving invitations: ${error.message}` 
    });
  }
};

/**
 * Revoke (delete) an invitation
 * Only authorized users can revoke invitations
 */
export const revokeInvitation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { invitationId } = req.params;
    const organizationId = req.auth.organizationId;
    const userRole = req.auth.role;

    // Check if user has permission
    if (!canCreateInvitationsCheck(userRole)) {
      res.status(403).json({ 
        message: "You do not have permission to revoke invitations" 
      });
      return;
    }

    const invitationIdNumber = Number(invitationId);
    if (!Number.isInteger(invitationIdNumber)) {
      res.status(400).json({ 
        message: "invitationId must be a valid integer" 
      });
      return;
    }

    // Find invitation and verify it belongs to user's organization
    const invitation = await (prisma as any).invitation.findFirst({
      where: {
        id: invitationIdNumber,
        organizationId,
      },
    });

    if (!invitation) {
      res.status(404).json({ 
        message: "Invitation not found" 
      });
      return;
    }

    // Check if already used
    if (invitation.used) {
      res.status(400).json({ 
        message: "Cannot revoke an invitation that has already been used" 
      });
      return;
    }

    // Delete invitation
    await (prisma as any).invitation.delete({
      where: { id: invitationIdNumber },
    });

    res.json({ 
      message: "Invitation revoked successfully" 
    });
  } catch (error: any) {
    console.error("Error revoking invitation:", error);
    res.status(500).json({ 
      message: `Error revoking invitation: ${error.message}` 
    });
  }
};

