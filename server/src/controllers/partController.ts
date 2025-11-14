import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getParts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parts = await prisma.part.findMany({
      where: {
        organizationId: req.auth.organizationId,
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
      .json({ message: `Error retrieving parts: ${error.message}` });
  }
};

export const getPartsByProgram = async (
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
      select: { id: true },
    });

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    const parts = await prisma.part.findMany({
      where: {
        organizationId: req.auth.organizationId,
        programId: programIdNumber,
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
  const userIdNumber = Number(userId);

  if (!Number.isInteger(userIdNumber)) {
    res.status(400).json({ message: "userId must be a valid integer" });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { userId: userIdNumber, organizationId: req.auth.organizationId },
      select: { userId: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const parts = await prisma.part.findMany({
      where: {
        organizationId: req.auth.organizationId,
        assignedUserId: userIdNumber,
      },
      include: {
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
  const {
    code,
    partName,
    level,
    state,
    revisionLevel,
    assignedUserId,
    programId,
    parentId,
  } = req.body;
  try {
    const newPart = await prisma.$transaction(async (tx) => {
      if (!programId || !Number.isInteger(Number(programId))) {
        throw new Error("Valid programId is required");
      }

      if (!assignedUserId || !Number.isInteger(Number(assignedUserId))) {
        throw new Error("Valid assignedUserId is required");
      }

      const organizationId = req.auth.organizationId;
      const program = await tx.program.findFirst({
        where: {
          id: Number(programId),
          organizationId,
        },
      });

      if (!program) {
        throw new Error("Program not found");
      }

      if (assignedUserId !== undefined && assignedUserId !== null) {
        const assignee = await tx.user.findFirst({
          where: {
            userId: Number(assignedUserId),
            organizationId,
          },
          select: { disciplineTeamId: true, userId: true },
        });

        if (!assignee) {
          throw new Error("Assigned user not found");
        }
      }

      if (parentId) {
        const parentPart = await tx.part.findFirst({
          where: { id: Number(parentId), organizationId },
        });

        if (!parentPart) {
          throw new Error("Parent part not found");
        }
      }

      const createdPart = await tx.part.create({
        data: {
          organizationId,
          code,
          partName,
          level,
          state,
          revisionLevel,
          assignedUserId: Number(assignedUserId),
          programId: Number(programId),
          parentId: parentId !== undefined && parentId !== null ? Number(parentId) : null,
        },
      });

      if (assignedUserId) {
        const assignedUser = await tx.user.findFirst({
          where: { userId: Number(assignedUserId), organizationId },
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
  const organizationId = req.auth.organizationId;

  try {
    const updatedPart = await prisma.$transaction(async (tx) => {
      const existingPart = await tx.part.findFirst({
        where: { id: Number(partId), organizationId },
      });

      if (!existingPart) {
        throw new Error("Part not found");
      }

      if (updates.programId !== undefined && updates.programId !== null) {
        const program = await tx.program.findFirst({
          where: {
            id: Number(updates.programId),
            organizationId,
          },
        });

        if (!program) {
          throw new Error("Program not found");
        }
      }

      if (updates.assignedUserId !== undefined && updates.assignedUserId !== null) {
        const assigneeExists = await tx.user.findFirst({
          where: {
            userId: Number(updates.assignedUserId),
            organizationId,
          },
        });

        if (!assigneeExists) {
          throw new Error("Assigned user not found");
        }
      }

      if (updates.parentId) {
        const parentExists = await tx.part.findFirst({
          where: { id: Number(updates.parentId), organizationId },
        });

        if (!parentExists) {
          throw new Error("Parent part not found");
        }
      }

      const result = await tx.part.update({
        where: { id: Number(partId) },
        data: {
          organizationId,
          code: updates.code,
          partName: updates.partName,
          level: updates.level,
          state: updates.state,
          revisionLevel: updates.revisionLevel,
          assignedUserId:
            updates.assignedUserId !== undefined && updates.assignedUserId !== null
              ? Number(updates.assignedUserId)
              : undefined,
          programId: updates.programId !== undefined ? Number(updates.programId) : undefined,
          parentId:
            updates.parentId === undefined
              ? undefined
              : updates.parentId === null
              ? null
              : Number(updates.parentId),
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
        const assignedUser = await tx.user.findFirst({
          where: { userId: finalAssignedUserId, organizationId },
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
  const partIdNumber = Number(partId);

  if (!Number.isInteger(partIdNumber)) {
    res.status(400).json({ message: "partId must be a valid integer" });
    return;
  }

  try {
    const deleteResult = await prisma.part.deleteMany({
      where: {
        id: partIdNumber,
        organizationId: req.auth.organizationId,
      },
    });

    if (deleteResult.count === 0) {
      res.status(404).json({ message: "Part not found" });
      return;
    }

    res.json({ message: "Part deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting part: ${error.message}` });
  }
};

