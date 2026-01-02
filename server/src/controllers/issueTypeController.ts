import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logDelete, logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

const prisma = new PrismaClient();

// System/default issue types that should be seeded for each organization
const SYSTEM_ISSUE_TYPES = [
  "Process / Manufacturing Issue",
  "Supply-Chain / Procurement Issue",
  "Integration / Interface Issue",
  "Test / Verification Anomaly",
  "Environmental / Reliability Issue",
  "Configuration / Documentation Control Issue",
  "Safety / Regulatory Issue",
  "Obsolescence / End-of-Life Issue",
];

/**
 * Get all issue types for the organization
 */
export const getIssueTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;

    const types = await prisma.issueType.findMany({
      where: { organizationId },
      orderBy: [
        { isSystem: "desc" }, // System types first
        { name: "asc" },
      ],
    });

    res.json(types);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving issue types: ${error.message}` });
  }
};

/**
 * Create a new issue type
 */
export const createIssueType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ message: "Name is required and must be a non-empty string" });
      return;
    }

    // Check if type already exists
    const existing = await prisma.issueType.findFirst({
      where: {
        organizationId,
        name: name.trim(),
      },
    });

    if (existing) {
      res.status(409).json({ message: "Issue type with this name already exists" });
      return;
    }

    const newType = await prisma.issueType.create({
      data: {
        organizationId,
        name: name.trim(),
        isSystem: false, // User-created types are not system types
      },
    });

    // Log issue type creation
    await logCreate(
      req,
      "IssueType",
      newType.id,
      `Issue type created: ${newType.name}`,
      sanitizeForAudit(newType)
    );

    res.status(201).json(newType);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating issue type: ${error.message}` });
  }
};

/**
 * Update an issue type
 */
export const updateIssueType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { id } = req.params;
    const typeId = Number(id);
    const { name } = req.body;

    if (!Number.isInteger(typeId)) {
      res.status(400).json({ message: "Invalid issue type ID" });
      return;
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ message: "Name is required and must be a non-empty string" });
      return;
    }

    // Find the type
    const existingType = await prisma.issueType.findFirst({
      where: {
        id: typeId,
        organizationId,
      },
    });

    if (!existingType) {
      res.status(404).json({ message: "Issue type not found" });
      return;
    }

    // Check if name already exists for another type
    const nameConflict = await prisma.issueType.findFirst({
      where: {
        organizationId,
        name: name.trim(),
        id: { not: typeId },
      },
    });

    if (nameConflict) {
      res.status(409).json({ message: "Issue type with this name already exists" });
      return;
    }

    const updatedType = await prisma.issueType.update({
      where: { id: typeId },
      data: {
        name: name.trim(),
      },
    });

    // Log issue type update
    const changes = getChangedFields(existingType, updatedType);
    await logUpdate(
      req,
      "IssueType",
      updatedType.id,
      `Issue type updated: ${updatedType.name}`,
      changes,
      sanitizeForAudit(existingType),
      sanitizeForAudit(updatedType)
    );

    res.json(updatedType);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating issue type: ${error.message}` });
  }
};

/**
 * Delete an issue type
 */
export const deleteIssueType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { id } = req.params;
    const typeId = Number(id);

    if (!Number.isInteger(typeId)) {
      res.status(400).json({ message: "Invalid issue type ID" });
      return;
    }

    // Find the type
    const type = await prisma.issueType.findFirst({
      where: {
        id: typeId,
        organizationId,
      },
    });

    if (!type) {
      res.status(404).json({ message: "Issue type not found" });
      return;
    }

    // Check if type is in use
    const inUse = await prisma.issueDetail.findFirst({
      where: {
        issueType: {
          id: typeId,
        },
      },
    });

    if (inUse) {
      res.status(409).json({
        message: "Cannot delete issue type that is in use by existing issues",
      });
      return;
    }

    // Log issue type deletion
    await logDelete(
      req,
      "IssueType",
      type.id,
      `Issue type deleted: ${type.name}`,
      sanitizeForAudit(type)
    );

    // Delete the type
    await prisma.issueType.delete({
      where: { id: typeId },
    });

    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting issue type: ${error.message}` });
  }
};

/**
 * Initialize system issue types for an organization (called during organization setup)
 * This function is idempotent - it will create missing standard types without creating duplicates
 */
export const initializeSystemIssueTypes = async (
  organizationId: number
): Promise<void> => {
  try {
    // Get existing system types for this organization
    const existingTypes = await prisma.issueType.findMany({
      where: { 
        organizationId,
        isSystem: true,
      },
      select: { name: true },
    });

    const existingNames = new Set(existingTypes.map(t => t.name));

    // Find missing system types
    const missingTypes = SYSTEM_ISSUE_TYPES.filter(name => !existingNames.has(name));

    // Create missing system types
    if (missingTypes.length > 0) {
      const result = await prisma.issueType.createMany({
        data: missingTypes.map((name) => ({
          organizationId,
          name,
          isSystem: true,
        })),
        skipDuplicates: true, // Extra safety to prevent duplicates
      });
      console.log(`Created ${result.count} issue types for organization ${organizationId}`);
    } else {
      console.log(`All issue types already exist for organization ${organizationId}`);
    }
  } catch (error: any) {
    console.error(`Error in initializeSystemIssueTypes for organization ${organizationId}:`, error);
    throw error; // Re-throw to be caught by caller
  }
};

