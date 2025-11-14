import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrganizationAndUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, username, name, email, phoneNumber, role, organizationName } = req.body;

    // Validate required fields
    if (!cognitoId || !username || !name || !email || !phoneNumber || !role) {
      res.status(400).json({ 
        message: "Missing required fields: cognitoId, username, name, email, phoneNumber, and role are required" 
      });
      return;
    }

    // Check if user with this cognitoId already exists
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingUser) {
      res.status(409).json({ 
        message: "User with this cognitoId already exists",
        user: existingUser
      });
      return;
    }

    // Create organization (use provided name or default)
    const orgName = organizationName || `${name}'s Organization`;
    const organization = await prisma.organization.create({
      data: {
        name: orgName,
      },
    });

    // Check if email or username already exists in any organization
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingEmail) {
      // Roll back organization creation
      await prisma.organization.delete({
        where: { id: organization.id },
      });
      res.status(409).json({ 
        message: "User with this email already exists in another organization" 
      });
      return;
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      // Roll back organization creation
      await prisma.organization.delete({
        where: { id: organization.id },
      });
      res.status(409).json({ 
        message: "User with this username already exists in another organization" 
      });
      return;
    }

    // Create user with the new organization
    const user = await prisma.user.create({
      data: {
        cognitoId,
        username,
        name,
        email,
        phoneNumber,
        role,
        organizationId: organization.id,
      },
      include: {
        disciplineTeam: true,
      },
    });

    res.status(201).json({
      user,
      organization,
    });
  } catch (error: any) {
    console.error("Error in createOrganizationAndUser:", error);
    res
      .status(500)
      .json({ message: `Error creating organization and user: ${error.message}` });
  }
};

export const joinOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, username, name, email, phoneNumber, role, organizationId, invitationToken } = req.body;

    // Validate required fields
    if (!cognitoId || !username || !name || !email || !phoneNumber || !role) {
      res.status(400).json({ 
        message: "Missing required fields: cognitoId, username, name, email, phoneNumber, and role are required" 
      });
      return;
    }

    // For now, require organizationId directly
    // In production, you'd validate the invitationToken and extract organizationId from it
    if (!organizationId) {
      res.status(400).json({ 
        message: "organizationId is required to join an existing organization" 
      });
      return;
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: Number(organizationId) },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Check if user with this cognitoId already exists
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingUser) {
      res.status(409).json({ 
        message: "User with this cognitoId already exists",
        user: existingUser
      });
      return;
    }

    // Check if email or username already exists in this organization
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        organizationId: organization.id,
      },
    });

    if (existingEmail) {
      res.status(409).json({ 
        message: "User with this email already exists in this organization" 
      });
      return;
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        organizationId: organization.id,
      },
    });

    if (existingUsername) {
      res.status(409).json({ 
        message: "User with this username already exists in this organization" 
      });
      return;
    }

    // Create user in the existing organization
    const user = await prisma.user.create({
      data: {
        cognitoId,
        username,
        name,
        email,
        phoneNumber,
        role,
        organizationId: organization.id,
      },
      include: {
        disciplineTeam: true,
      },
    });

    res.status(201).json({
      user,
      organization,
    });
  } catch (error: any) {
    console.error("Error in joinOrganization:", error);
    res
      .status(500)
      .json({ message: `Error joining organization: ${error.message}` });
  }
};

