import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logDelete, logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

const prisma = new PrismaClient();

// System/default deliverable types that should be seeded for each organization
const SYSTEM_DELIVERABLE_TYPES = [
  "Engineering Drawing & CAD Model",
  "Bill of Materials (BOM)",
  "Stress/Structural Analysis Report",
  "Thermal Analysis Report",
  "Electrical Schematics / PCB Layouts",
  "Design for Manufacturability (DFM) & Design for Test (DFT)",
  "First Article Inspection (FAI) Report",
  "Supplier Quality Records / Certificates of Conformance (CoC)",
  "Test Plans and Procedures",
  "Qualification Test Report",
  "Acceptance Test Procedure (ATP)",
  "Calibration Certificates",
  "Non-Conformance / Corrective Action Report (NCR/CAR)",
  "System/Subsystem Requirements Specification (SRS)",
  "Interface Control Document (ICD)",
  "Preliminary Design Review (PDR) Package",
  "Critical Design Review (CDR) Package",
];

/**
 * Get all deliverable types for the organization
 */
export const getDeliverableTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;

    const types = await prisma.deliverableType.findMany({
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
      .json({ message: `Error retrieving deliverable types: ${error.message}` });
  }
};

/**
 * Create a new deliverable type
 */
export const createDeliverableType = async (
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
    const existing = await prisma.deliverableType.findFirst({
      where: {
        organizationId,
        name: name.trim(),
      },
    });

    if (existing) {
      res.status(409).json({ message: "Deliverable type with this name already exists" });
      return;
    }

    const newType = await prisma.deliverableType.create({
      data: {
        organizationId,
        name: name.trim(),
        isSystem: false, // User-created types are not system types
      },
    });

    // Log deliverable type creation
    await logCreate(
      req,
      "DeliverableType",
      newType.id,
      `Deliverable type created: ${newType.name}`,
      sanitizeForAudit(newType)
    );

    res.status(201).json(newType);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating deliverable type: ${error.message}` });
  }
};

/**
 * Update a deliverable type
 */
export const updateDeliverableType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { id } = req.params;
    const typeId = Number(id);
    const { name } = req.body;

    if (!Number.isInteger(typeId)) {
      res.status(400).json({ message: "Invalid deliverable type ID" });
      return;
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ message: "Name is required and must be a non-empty string" });
      return;
    }

    // Find the type
    const existingType = await prisma.deliverableType.findFirst({
      where: {
        id: typeId,
        organizationId,
      },
    });

    if (!existingType) {
      res.status(404).json({ message: "Deliverable type not found" });
      return;
    }

    // Check if name already exists for another type
    const nameConflict = await prisma.deliverableType.findFirst({
      where: {
        organizationId,
        name: name.trim(),
        id: { not: typeId },
      },
    });

    if (nameConflict) {
      res.status(409).json({ message: "Deliverable type with this name already exists" });
      return;
    }

    const updatedType = await prisma.deliverableType.update({
      where: { id: typeId },
      data: {
        name: name.trim(),
      },
    });

    // Log deliverable type update
    const changes = getChangedFields(existingType, updatedType);
    await logUpdate(
      req,
      "DeliverableType",
      updatedType.id,
      `Deliverable type updated: ${updatedType.name}`,
      changes,
      sanitizeForAudit(existingType),
      sanitizeForAudit(updatedType)
    );

    res.json(updatedType);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating deliverable type: ${error.message}` });
  }
};

/**
 * Delete a deliverable type
 */
export const deleteDeliverableType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizationId = req.auth.organizationId;
    const { id } = req.params;
    const typeId = Number(id);

    if (!Number.isInteger(typeId)) {
      res.status(400).json({ message: "Invalid deliverable type ID" });
      return;
    }

    // Find the type
    const type = await prisma.deliverableType.findFirst({
      where: {
        id: typeId,
        organizationId,
      },
    });

    if (!type) {
      res.status(404).json({ message: "Deliverable type not found" });
      return;
    }

    // Check if type is in use
    const inUse = await prisma.deliverableDetail.findFirst({
      where: {
        deliverableTypeId: typeId,
      },
    });

    if (inUse) {
      res.status(409).json({
        message: "Cannot delete deliverable type that is in use by existing deliverables",
      });
      return;
    }

    // Log deliverable type deletion
    await logDelete(
      req,
      "DeliverableType",
      type.id,
      `Deliverable type deleted: ${type.name}`,
      sanitizeForAudit(type)
    );

    // Delete the type
    await prisma.deliverableType.delete({
      where: { id: typeId },
    });

    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting deliverable type: ${error.message}` });
  }
};

/**
 * Initialize system deliverable types for an organization (called during organization setup)
 * This function is idempotent - it will create missing standard types without creating duplicates
 */
export const initializeSystemDeliverableTypes = async (
  organizationId: number
): Promise<void> => {
  try {
    // Get existing system types for this organization
    const existingTypes = await prisma.deliverableType.findMany({
      where: { 
        organizationId,
        isSystem: true,
      },
      select: { name: true },
    });

    const existingNames = new Set(existingTypes.map(t => t.name));

    // Find missing system types
    const missingTypes = SYSTEM_DELIVERABLE_TYPES.filter(name => !existingNames.has(name));

    // Create missing system types
    if (missingTypes.length > 0) {
      const result = await prisma.deliverableType.createMany({
        data: missingTypes.map((name) => ({
          organizationId,
          name,
          isSystem: true,
        })),
        skipDuplicates: true, // Extra safety to prevent duplicates
      });
      console.log(`Created ${result.count} deliverable types for organization ${organizationId}`);
    } else {
      console.log(`All deliverable types already exist for organization ${organizationId}`);
    }
  } catch (error: any) {
    console.error(`Error in initializeSystemDeliverableTypes for organization ${organizationId}:`, error);
    throw error; // Re-throw to be caught by caller
  }
};

