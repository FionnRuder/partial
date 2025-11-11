import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getParts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parts = await prisma.part.findMany({
      include: {
        assignedUser: true,
        program: true,
        parent: true,
        children: true,
      },
    });
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving parts: ${error.message}` });
  }
};

export const getPartsByProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {programId} = req.query;
  try {
    const parts = await prisma.part.findMany({ // GRAB PARTS SPECIFICALLY FROM THAT PROGRAM ID
        where: {
            programId: Number(programId),
        },
        include: {
            assignedUser: true,
            program: true,
            parent: true,
            children: true,
        },
    });
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving parts by program: ${error.message}` });
  }
};

export const getPartsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const parts = await prisma.part.findMany({ // GRAB PARTS SPECIFICALLY FOR THAT USER
        where: {
            assignedUserId: Number(userId),
        },
        include: {
            //assignedUser: true,
            //program: true,
            parent: true,
            children: true,
        },
    });
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving parts by user: ${error.message}` });
  }
};

export const createPart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, partName, level, state, revisionLevel, assignedUserId, programId, parentId } = req.body;
  try {
    const newPart = await prisma.$transaction(async (tx) => {
      const createdPart = await tx.part.create({
        data: {
          code,
          partName,
          level,
          state,
          revisionLevel,
          assignedUserId,
          programId,
          parentId,
        },
      });

      if (assignedUserId) {
        const assignedUser = await tx.user.findUnique({
          where: { userId: assignedUserId },
          select: { disciplineTeamId: true },
        });

        if (assignedUser?.disciplineTeamId) {
          const existingRelation = await tx.disciplineTeamToProgram.findFirst({
            where: {
              disciplineTeamId: assignedUser.disciplineTeamId,
              programId,
            },
          });

          if (!existingRelation) {
            await tx.disciplineTeamToProgram.create({
              data: {
                disciplineTeamId: assignedUser.disciplineTeamId,
                programId,
              },
            });
          }
        }
      }

      return createdPart;
    });

    res.status(201).json(newPart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a part: ${error.message}` });
  }
};

export const editPart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { partId } = req.params;
  const updates = req.body; // Partial<Part>

  try {
    const updatedPart = await prisma.$transaction(async (tx) => {
      const existingPart = await tx.part.findUnique({
        where: { id: Number(partId) },
      });

      if (!existingPart) {
        throw new Error("Part not found");
      }

      const result = await tx.part.update({
        where: { id: Number(partId) },
        data: {
          code: updates.code,
          partName: updates.partName,
          level: updates.level,
          state: updates.state,
          revisionLevel: updates.revisionLevel,
          assignedUserId: updates.assignedUserId,
          programId: updates.programId,
          parentId: updates.parentId ?? null,
        },
        include: {
          assignedUser: true,
          program: true,
          parent: true,
          children: true,
        },
      });

      const finalAssignedUserId =
        updates.assignedUserId !== undefined
          ? updates.assignedUserId
          : existingPart.assignedUserId;
      const finalProgramId =
        updates.programId !== undefined ? updates.programId : existingPart.programId;

      if (finalAssignedUserId) {
        const assignedUser = await tx.user.findUnique({
          where: { userId: finalAssignedUserId },
          select: { disciplineTeamId: true },
        });

        if (assignedUser?.disciplineTeamId) {
          const relationExists = await tx.disciplineTeamToProgram.findFirst({
            where: {
              disciplineTeamId: assignedUser.disciplineTeamId,
              programId: finalProgramId,
            },
          });

          if (!relationExists) {
            await tx.disciplineTeamToProgram.create({
              data: {
                disciplineTeamId: assignedUser.disciplineTeamId,
                programId: finalProgramId,
              },
            });
          }
        }
      }

      return result;
    });

    res.json(updatedPart);
  } catch (error: any) {
    console.error("Error updating part:", error);
    res
      .status(500)
      .json({ message: `Error updating part: ${error.message}` });
  }
};

export const deletePart = async (req: Request, res: Response): Promise<void> => {
  const { partId } = req.params;
  try {
    await prisma.part.delete({
      where: { id: Number(partId) },
    });
    res.json({ message: "Part deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting part: ${error.message}` });
  }
};

