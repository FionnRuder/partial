import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

const prisma = new PrismaClient();

export const getMilestones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestones = await prisma.milestone.findMany({
      where: {
        organizationId: req.auth.organizationId,
      },
      include: {
        program: true,
        workItems: true,
      },
    });
    res.json(milestones);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving milestones: ${error.message}` });
  }
};

export const getMilestonesByProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { programId } = req.query;
  if (!programId) {
    res.status(400).json({ message: "programId query parameter is required" });
    return;
  }

  const programIdNumber = Number(programId);
  if (!Number.isInteger(programIdNumber)) {
    res.status(400).json({ message: "programId must be a valid integer" });
    return;
  }

  try {
    const program = await prisma.program.findFirst({
      where: { id: programIdNumber, organizationId: req.auth.organizationId },
    });

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    const milestones = await prisma.milestone.findMany({
      where: {
        organizationId: req.auth.organizationId,
        programId: programIdNumber,
      },
      include: {
        program: true,
        workItems: true,
      },
    });
    res.json(milestones);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving milestones by program: ${error.message}` });
  }
};

export const createMilestone = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, date, programId } = req.body;
  try {
    if (!programId || !Number.isInteger(Number(programId))) {
      res.status(400).json({ message: "Valid programId is required" });
      return;
    }

    const program = await prisma.program.findFirst({
      where: {
        id: Number(programId),
        organizationId: req.auth.organizationId,
      },
    });

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    const newMilestone = await prisma.milestone.create({
      data: {
        organizationId: req.auth.organizationId,
        name,
        description,
        date,
        programId: Number(programId),
      },
    });

    // Log milestone creation
    await logCreate(
      req,
      "Milestone",
      newMilestone.id,
      `Milestone created: ${newMilestone.name}`,
      sanitizeForAudit(newMilestone)
    );

    res.status(201).json(newMilestone);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a milestone: ${error.message}` });
  }
};