import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logDelete, sanitizeForAudit } from "../lib/auditLogger";

const prisma = new PrismaClient();

// System/default issue types that should be seeded for each organization
const SYSTEM_ISSUE_TYPES = [
  "Defect",
  "Failure",
  "Requirement Waiver",
  "Non-Conformance Report (NCR)",
  "Process / Manufacturing Issue",
  "Supply-Chain / Procurement Issue",
  "Integration / Interface Issue",
  "Test / Verification Anomaly",
  "Environmental / Reliability Issue",
  "Configuration / Documentation Control Issue",
  "Safety / Regulatory Issue",
  "Programmatic / Risk Item",
  "Obsolescence / End-of-Life Issue",
  "Other",
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

    // Prevent deletion of system types
    if (type.isSystem) {
      res.status(403).json({ message: "Cannot delete system issue types" });
      return;
    }

    // Check if type is in use
    const inUse = await prisma.issueDetail.findFirst({
      where: {
        issueTypeId: typeId,
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
 */
export const initializeSystemIssueTypes = async (
  organizationId: number
): Promise<void> => {
  // Check if types already exist
  const existingCount = await prisma.issueType.count({
    where: { organizationId },
  });

  if (existingCount > 0) {
    return; // Already initialized
  }

  // Create all system types
  await prisma.issueType.createMany({
    data: SYSTEM_ISSUE_TYPES.map((name) => ({
      organizationId,
      name,
      isSystem: true,
    })),
  });
};

