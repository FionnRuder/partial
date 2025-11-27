import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logDelete, sanitizeForAudit } from "../lib/auditLogger";

const prisma = new PrismaClient();

// System/default deliverable types that should be seeded for each organization
const SYSTEM_DELIVERABLE_TYPES = [
  "System/Subsystem Requirements Specification (SRS)",
  "Interface Control Document (ICD)",
  "Preliminary Design Review (PDR) Package",
  "Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report",
  "Development & Verification Plan / V&V Matrix",
  "Engineering Drawing & CAD Model",
  "Bill of Materials (BOM)",
  "Stress/Structural Analysis Report",
  "Thermal Analysis Report",
  "Electrical Schematics / PCB Layouts",
  "Design for Manufacturability (DFM) & Design for Test (DFT) Review Report",
  "Critical Design Review (CDR) Package",
  "Work Instructions / Assembly Procedures",
  "First Article Inspection (FAI) Report",
  "Supplier Quality Records / Certificates of Conformance (CoC)",
  "Test Plans and Procedures",
  "Qualification Test Report",
  "Acceptance Test Procedure (ATP) & Report",
  "Calibration Certificates",
  "Non-Conformance / Corrective Action Report (NCR/CAR)",
  "Requirements Verification Report",
  "As-Built Configuration / End-Item Data Package",
  "User / Operations Manual",
  "Maintenance & Repair Manual / Spare Parts List",
  "Certificates of Compliance",
  "Lessons-Learned & Post-Project Report",
  "Other",
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

    // Prevent deletion of system types
    if (type.isSystem) {
      res.status(403).json({ message: "Cannot delete system deliverable types" });
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
 */
export const initializeSystemDeliverableTypes = async (
  organizationId: number
): Promise<void> => {
  // Check if types already exist
  const existingCount = await prisma.deliverableType.count({
    where: { organizationId },
  });

  if (existingCount > 0) {
    return; // Already initialized
  }

  // Create all system types
  await prisma.deliverableType.createMany({
    data: SYSTEM_DELIVERABLE_TYPES.map((name) => ({
      organizationId,
      name,
      isSystem: true,
    })),
  });
};

