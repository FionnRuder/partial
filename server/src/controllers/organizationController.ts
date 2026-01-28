import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

const prisma = new PrismaClient();

/**
 * Get organization by ID (for the authenticated user's organization)
 */
export const getOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.json(organization);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving organization: ${error.message}` });
  }
};

/**
 * Update organization
 * Only Admins can update organization details
 */
export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { name } = req.body;

    // Check if user is Admin
    if (req.auth.role !== "Admin") {
      res.status(403).json({ 
        message: "Only Admins can update organization details" 
      });
      return;
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ 
        message: "Organization name is required and must be a non-empty string" 
      });
      return;
    }

    // Get existing organization before update for audit logging
    const existingOrganization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrganization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: name.trim(),
      },
    });

    // Log organization update
    const changedFields = getChangedFields(existingOrganization, updatedOrganization);
    await logUpdate(
      req,
      "Organization",
      updatedOrganization.id,
      `Organization updated: ${updatedOrganization.name}`,
      sanitizeForAudit(existingOrganization),
      sanitizeForAudit(updatedOrganization),
      changedFields
    );

    res.json(updatedOrganization);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Organization not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Error updating organization: ${error.message}` });
  }
};
