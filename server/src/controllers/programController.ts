import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPrograms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const programs = await prisma.program.findMany({
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
    const newProgram = await prisma.program.create({
      data: {
        name,
        description,
        programManagerUserId,
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
    const updatedProgram = await prisma.program.update({
      where: { id: Number(programId) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(programManagerUserId !== undefined && { programManagerUserId }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
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