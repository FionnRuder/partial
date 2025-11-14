import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPrograms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const programs = await prisma.program.findMany({
      where: {
        organizationId: req.auth.organizationId,
      },
      include: {
        partNumbers: true,
        disciplineTeams: {
          include: {
            disciplineTeam: true,
          },
        },
        milestones: true,
        workItems: true,
      },
    });
    res.json(programs);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving programs: ${error.message}` });
  }
};

export const createProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, programManagerUserId, startDate, endDate } = req.body;
  try {
    if (!name || !description || !startDate || !endDate) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (programManagerUserId !== undefined && programManagerUserId !== null) {
      const programManager = await prisma.user.findFirst({
        where: {
          userId: Number(programManagerUserId),
          organizationId: req.auth.organizationId,
        },
      });

      if (!programManager) {
        res.status(404).json({ message: "Program manager not found" });
        return;
      }
    }

    const newProgram = await prisma.program.create({
      data: {
        organizationId: req.auth.organizationId,
        name,
        description,
        programManagerUserId:
          programManagerUserId !== undefined && programManagerUserId !== null
            ? Number(programManagerUserId)
            : null,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProgram);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a program: ${error.message}` });
  }
};

export const updateProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { programId } = req.params;
  const { name, description, programManagerUserId, startDate, endDate } = req.body;

  try {
    const programIdNumber = Number(programId);
    if (!Number.isInteger(programIdNumber)) {
      res.status(400).json({ message: "programId must be a valid integer" });
      return;
    }

    if (programManagerUserId !== undefined && programManagerUserId !== null) {
      const programManager = await prisma.user.findFirst({
        where: {
          userId: Number(programManagerUserId),
          organizationId: req.auth.organizationId,
        },
      });

      if (!programManager) {
        res.status(404).json({ message: "Program manager not found" });
        return;
      }
    }

    const updateResult = await prisma.program.updateMany({
      where: { id: programIdNumber, organizationId: req.auth.organizationId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(programManagerUserId !== undefined && {
          programManagerUserId:
            programManagerUserId !== null ? Number(programManagerUserId) : null,
        }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
      },
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    const updatedProgram = await prisma.program.findUnique({
      where: { id: programIdNumber },
      include: {
        partNumbers: true,
        disciplineTeams: {
          include: {
            disciplineTeam: true,
          },
        },
        milestones: true,
        workItems: true,
      },
    });

    res.json(updatedProgram);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    res
      .status(500)
      .json({ message: `Error updating program: ${error.message}` });
  }
};