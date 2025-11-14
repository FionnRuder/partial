import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Define a type for creates
type WorkItemCreate = {
  workItemType: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  tags?: string;
  dateOpened?: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;
  issueDetail?: {
    issueType: string;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType: string;
  };
  partIds?: number[];
};

// Define a type for updates
type WorkItemUpdate = {
  workItemType?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  dateOpened?: string;
  dueDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId?: number;
  dueByMilestoneId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  issueDetail?: {
    issueType?: string;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType?: string;
  };
  partIds?: number[];
};

const prisma = new PrismaClient();

/**
 * Get single WorkItem by ID
 */
export const getWorkItemById = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;

  const workItemIdNumber = Number(workItemId);
  if (!Number.isInteger(workItemIdNumber)) {
    res.status(400).json({ message: "workItemId must be a valid integer" });
    return;
  }

  try {
    const workItem = await prisma.workItem.findFirst({
      where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
      include: {
        program: true,
        dueByMilestone: true,
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
        partNumbers: {
          include: {
            part: true,
          },
        },
        attachments: true,
        comments: {
          include: {
            commenterUser: true,
          },
          orderBy: {
            dateCommented: "desc",
          },
        },
      },
    });

    if (!workItem) {
      res.status(404).json({ message: "Work item not found" });
      return;
    }

    res.json(workItem);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving work item: ${error.message}` });
  }
};

/**
 * Get WorkItems
 * Supports optional filtering by programId or partId
 */
const parseBoolean = (value: any): boolean => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
};

const getDescendantPartIds = async (
  organizationId: number,
  rootPartId: number
): Promise<number[]> => {
  const visited = new Set<number>();
  const queue: number[] = [rootPartId];
  visited.add(rootPartId);

  while (queue.length > 0) {
    const currentPartId = queue.shift()!;
    const children = await prisma.part.findMany({
      where: { parentId: currentPartId, organizationId },
      select: { id: true },
    });

    for (const child of children) {
      if (!visited.has(child.id)) {
        visited.add(child.id);
        queue.push(child.id);
      }
    }
  }

  return Array.from(visited);
};

export const getWorkItems = async (req: Request, res: Response): Promise<void> => {
  const { programId, partId, includeChildren } = req.query;

  try {
    const organizationId = req.auth.organizationId;
    const workItemInclude = {
      program: true,
      dueByMilestone: true,
      deliverableDetail: true,
      issueDetail: true,
      authorUser: true,
      assigneeUser: true,
      partNumbers: {
        include: {
          part: true,
        },
      },
      attachments: true,
      comments: {
        include: {
          commenterUser: true,
        },
        orderBy: {
          dateCommented: "desc" as const,
        },
      },
    };

    let workItems;

    if (programId) {
      const programIdNumber = Number(programId);
      if (!Number.isInteger(programIdNumber)) {
        res.status(400).json({ message: "programId must be a valid integer" });
        return;
      }

      const program = await prisma.program.findFirst({
        where: { id: programIdNumber, organizationId },
      });

      if (!program) {
        res.status(404).json({ message: "Program not found" });
        return;
      }

      workItems = await prisma.workItem.findMany({
        where: { programId: programIdNumber, organizationId },
        include: workItemInclude,
      });
    } else if (partId) {
      const rootPartId = Number(partId);
      if (!Number.isInteger(rootPartId)) {
        res.status(400).json({ message: "partId must be a valid integer" });
        return;
      }

      const rootPart = await prisma.part.findFirst({
        where: { id: rootPartId, organizationId },
      });

      if (!rootPart) {
        res.status(404).json({ message: "Part not found" });
        return;
      }

      const shouldIncludeChildren = parseBoolean(includeChildren);
      const partIds = shouldIncludeChildren
        ? await getDescendantPartIds(organizationId, rootPartId)
        : [rootPartId];

      workItems = await prisma.workItem.findMany({
        where: {
          organizationId,
          partNumbers: {
            some: {
              partId: {
                in: partIds,
              },
            },
          },
        },
        include: workItemInclude,
      });
    } else {
      workItems = await prisma.workItem.findMany({
        where: { organizationId },
        include: workItemInclude,
      });
    }

    res.json(workItems);
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving work items: ${error.message}`,
    });
  }
};

/**
 * Get WorkItems by User
 */
export const getWorkItemsByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const organizationId = req.auth.organizationId;
    const userIdNumber = Number(userId);

    if (!Number.isInteger(userIdNumber)) {
      res.status(400).json({ message: "userId must be a valid integer" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        userId: userIdNumber,
        organizationId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const workItems = await prisma.workItem.findMany({
      where: {
        organizationId,
        OR: [
          { authorUserId: userIdNumber },
          { assignedUserId: userIdNumber },
        ],
      },
      include: {
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
      },
    });
    res.json(workItems);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving work items by user: ${error.message}` });
  }
};

/**
 * Create WorkItem
 * Handles DeliverableDetail or IssueDetail based on type
 */
export const createWorkItem = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as WorkItemCreate;

  try {
    const organizationId = req.auth.organizationId;
    const normalizedPartIds = Array.isArray(body.partIds)
      ? body.partIds.map((id) => Number(id))
      : [];

    const newWorkItem = await prisma.$transaction(async (tx) => {
      const program = await tx.program.findFirst({
        where: {
          id: Number(body.programId),
          organizationId,
        },
      });

      if (!program) {
        throw new Error("Program not found");
      }

      const milestone = await tx.milestone.findFirst({
        where: {
          id: Number(body.dueByMilestoneId),
          organizationId,
        },
      });

      if (!milestone) {
        throw new Error("Milestone not found");
      }

      const author = await tx.user.findFirst({
        where: {
          userId: Number(body.authorUserId),
          organizationId,
        },
      });

      if (!author) {
        throw new Error("Author user not found");
      }

      const assignee = await tx.user.findFirst({
        where: {
          userId: Number(body.assignedUserId),
          organizationId,
        },
      });

      if (!assignee) {
        throw new Error("Assigned user not found");
      }

      if (normalizedPartIds.length > 0) {
        const parts = await tx.part.findMany({
          where: {
            id: { in: normalizedPartIds },
            organizationId,
          },
          select: { id: true },
        });

        if (parts.length !== normalizedPartIds.length) {
          throw new Error("One or more parts not found");
        }
      }

      const workItemData: any = {
        organizationId,
        workItemType: body.workItemType,
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        tags: body.tags,
        dateOpened: body.dateOpened ? new Date(body.dateOpened) : undefined,
        dueDate: new Date(body.dueDate),
        estimatedCompletionDate: new Date(body.estimatedCompletionDate),
        actualCompletionDate: body.actualCompletionDate ? new Date(body.actualCompletionDate) : undefined,
        percentComplete: body.percentComplete,
        inputStatus: body.inputStatus,
        programId: Number(body.programId),
        dueByMilestoneId: Number(body.dueByMilestoneId),
        authorUserId: Number(body.authorUserId),
        assignedUserId: Number(body.assignedUserId),
        issueDetail: body.issueDetail
          ? {
              create: {
                issueType: body.issueDetail.issueType,
                rootCause: body.issueDetail.rootCause,
                correctiveAction: body.issueDetail.correctiveAction,
              },
            }
          : undefined,
        deliverableDetail: body.deliverableDetail
          ? {
              create: {
                deliverableType: body.deliverableDetail.deliverableType,
              },
            }
          : undefined,
        partNumbers:
          normalizedPartIds.length > 0
            ? {
                create: normalizedPartIds.map((id) => ({
                  part: { connect: { id } },
                })),
              }
            : undefined,
      };

      return tx.workItem.create({
        data: workItemData,
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          comments: {
            include: {
              commenterUser: true,
            },
            orderBy: {
              dateCommented: "desc",
            },
          },
          partNumbers: { include: { part: true } },
        },
      });
    });

    res.status(201).json({
      ...newWorkItem,
      partIds: newWorkItem.partNumbers.map((p) => p.partId),
    });
  } catch (error: any) {
    console.error("Error creating work item:", error);
    const knownNotFoundMessages = new Set([
      "Program not found",
      "Milestone not found",
      "Author user not found",
      "Assigned user not found",
      "One or more parts not found",
    ]);

    if (error instanceof Error && knownNotFoundMessages.has(error.message)) {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: `Error creating work item: ${error.message}` });
  }
};

/**
 * Update WorkItem Status
 */
export const updateWorkItemStatus = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;
  const { status } = req.body;
  try {
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
      res.status(400).json({ message: "workItemId must be a valid integer" });
      return;
    }

    const updateResult = await prisma.workItem.updateMany({
      where: {
        id: workItemIdNumber,
        organizationId: req.auth.organizationId,
      },
      data: {
        status,
      },
    });

    if (updateResult.count === 0) {
      res.status(404).json({ message: "Work item not found" });
      return;
    }

    const updatedWorkItem = await prisma.workItem.findUnique({
      where: { id: workItemIdNumber },
    });

    res.json(updatedWorkItem);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating work item status: ${error.message}` });
  }
};


export const editWorkItem = async (req: Request, res: Response) => {
  const { workItemId } = req.params;
  const updates = req.body as WorkItemUpdate;
  const organizationId = req.auth.organizationId;
  const workItemIdNumber = Number(workItemId);

  if (!Number.isInteger(workItemIdNumber)) {
    res.status(400).json({ message: "workItemId must be a valid integer" });
    return;
  }

  try {
    const finalWorkItem = await prisma.$transaction(async (tx) => {
      const existingWorkItem = await tx.workItem.findFirst({
        where: { id: workItemIdNumber, organizationId },
        include: { partNumbers: true },
      });

      if (!existingWorkItem) {
        throw new Error("WORK_ITEM_NOT_FOUND");
      }

      const normalizedPartIds = Array.isArray(updates.partIds)
        ? updates.partIds.map((partId) => Number(partId))
        : undefined;

      if (normalizedPartIds) {
        if (normalizedPartIds.some((id) => !Number.isInteger(id))) {
          throw new Error("INVALID_PART_ID");
        }

        if (normalizedPartIds.length > 0) {
          const parts = await tx.part.findMany({
            where: {
              id: { in: normalizedPartIds },
              organizationId,
            },
            select: { id: true },
          });

          if (parts.length !== normalizedPartIds.length) {
            throw new Error("PART_NOT_FOUND");
          }
        }

        await tx.workItemToPart.deleteMany({
          where: { workItemId: workItemIdNumber },
        });

        if (normalizedPartIds.length > 0) {
          await tx.workItemToPart.createMany({
            data: normalizedPartIds.map((partId) => ({
              workItemId: workItemIdNumber,
              partId,
            })),
          });
        }
      }

      if (updates.programId !== undefined) {
        const program = await tx.program.findFirst({
          where: { id: Number(updates.programId), organizationId },
        });

        if (!program) {
          throw new Error("PROGRAM_NOT_FOUND");
        }
      }

      if (updates.dueByMilestoneId !== undefined) {
        const milestone = await tx.milestone.findFirst({
          where: { id: Number(updates.dueByMilestoneId), organizationId },
        });

        if (!milestone) {
          throw new Error("MILESTONE_NOT_FOUND");
        }
      }

      if (updates.authorUserId !== undefined) {
        const author = await tx.user.findFirst({
          where: { userId: Number(updates.authorUserId), organizationId },
        });

        if (!author) {
          throw new Error("AUTHOR_NOT_FOUND");
        }
      }

      if (updates.assignedUserId !== undefined) {
        const assignee = await tx.user.findFirst({
          where: { userId: Number(updates.assignedUserId), organizationId },
        });

        if (!assignee) {
          throw new Error("ASSIGNEE_NOT_FOUND");
        }
      }

      const updateData: any = {};

      if (updates.workItemType) updateData.workItemType = updates.workItemType;
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.dateOpened) updateData.dateOpened = new Date(updates.dateOpened);
      if (updates.dueDate) updateData.dueDate = new Date(updates.dueDate);
      if (updates.estimatedCompletionDate)
        updateData.estimatedCompletionDate = new Date(updates.estimatedCompletionDate);
      if (updates.actualCompletionDate)
        updateData.actualCompletionDate = new Date(updates.actualCompletionDate);
      if (typeof updates.percentComplete === "number")
        updateData.percentComplete = updates.percentComplete;
      if (updates.inputStatus) updateData.inputStatus = updates.inputStatus;
      if (updates.programId !== undefined) updateData.programId = Number(updates.programId);
      if (updates.dueByMilestoneId !== undefined)
        updateData.dueByMilestoneId = Number(updates.dueByMilestoneId);
      if (updates.authorUserId !== undefined)
        updateData.authorUserId = Number(updates.authorUserId);
      if (updates.assignedUserId !== undefined)
        updateData.assignedUserId = Number(updates.assignedUserId);

      const updatedWorkItem = await tx.workItem.update({
        where: { id: workItemIdNumber },
        data: updateData,
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          comments: {
            include: {
              commenterUser: true,
            },
            orderBy: {
              dateCommented: "desc",
            },
          },
          partNumbers: { include: { part: true } },
        },
      });

      if (updates.issueDetail && updates.issueDetail.issueType) {
        const existingIssueDetail = await tx.issueDetail.findUnique({
          where: { id: workItemIdNumber },
        });

        if (existingIssueDetail) {
          await tx.issueDetail.update({
            where: { id: workItemIdNumber },
            data: {
              issueType: updates.issueDetail.issueType as any,
              ...(updates.issueDetail.rootCause !== undefined && {
                rootCause: updates.issueDetail.rootCause,
              }),
              ...(updates.issueDetail.correctiveAction !== undefined && {
                correctiveAction: updates.issueDetail.correctiveAction,
              }),
            },
          });
        } else {
          await tx.issueDetail.create({
            data: {
              id: workItemIdNumber,
              issueType: updates.issueDetail.issueType as any,
              rootCause: updates.issueDetail.rootCause || null,
              correctiveAction: updates.issueDetail.correctiveAction || null,
            },
          });
        }
      }

      if (updates.deliverableDetail && updates.deliverableDetail.deliverableType) {
        const existingDeliverableDetail = await tx.deliverableDetail.findUnique({
          where: { id: workItemIdNumber },
        });

        if (existingDeliverableDetail) {
          await tx.deliverableDetail.update({
            where: { id: workItemIdNumber },
            data: {
              deliverableType: updates.deliverableDetail.deliverableType as any,
            },
          });
        } else {
          await tx.deliverableDetail.create({
            data: {
              id: workItemIdNumber,
              deliverableType: updates.deliverableDetail.deliverableType as any,
            },
          });
        }
      }

      const finalWorkItem = await tx.workItem.findUnique({
        where: { id: workItemIdNumber },
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          comments: {
            include: {
              commenterUser: true,
            },
            orderBy: {
              dateCommented: "desc",
            },
          },
          partNumbers: { include: { part: true } },
        },
      });

      if (!finalWorkItem) {
        throw new Error("WORK_ITEM_NOT_FOUND");
      }

      return finalWorkItem;
    });

    res.json({
      ...finalWorkItem,
      partIds: finalWorkItem.partNumbers.map((p) => p.partId),
    });
  } catch (error: any) {
    console.error("Error updating work item:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    const notFoundErrors = new Set([
      "WORK_ITEM_NOT_FOUND",
      "PROGRAM_NOT_FOUND",
      "MILESTONE_NOT_FOUND",
      "AUTHOR_NOT_FOUND",
      "ASSIGNEE_NOT_FOUND",
      "PART_NOT_FOUND",
    ]);

    if (errorMessage === "INVALID_PART_ID") {
      res.status(400).json({ message: "All partIds must be valid integers" });
      return;
    }

    if (notFoundErrors.has(errorMessage)) {
      const messageMap: Record<string, string> = {
        WORK_ITEM_NOT_FOUND: "Work item not found",
        PROGRAM_NOT_FOUND: "Program not found",
        MILESTONE_NOT_FOUND: "Milestone not found",
        AUTHOR_NOT_FOUND: "Author user not found",
        ASSIGNEE_NOT_FOUND: "Assigned user not found",
        PART_NOT_FOUND: "One or more parts not found",
      };
      res.status(404).json({ message: messageMap[errorMessage] });
      return;
    }

    res.status(500).json({
      message: `Error updating work item: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};


export const getCommentsForWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;

  const workItemIdNumber = Number(workItemId);
  if (!Number.isInteger(workItemIdNumber)) {
    res.status(400).json({ message: "workItemId must be a valid integer" });
    return;
  }

  try {
    const workItem = await prisma.workItem.findFirst({
      where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
    });

    if (!workItem) {
      res.status(404).json({ message: "Work item not found" });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: {
        workItemId: workItemIdNumber,
        organizationId: req.auth.organizationId,
      },
      include: {
        commenterUser: true,
      },
      orderBy: {
        dateCommented: "desc",
      },
    });

    res.json(comments);
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: `Error retrieving comments: ${error.message}` });
  }
};

export const createCommentForWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;
  const { text, commenterUserId } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ message: "Comment text is required." });
    return;
  }
  if (commenterUserId === undefined) {
    res.status(400).json({ message: "commenterUserId is required." });
    return;
  }

  try {
    const workItemIdNumber = Number(workItemId);
    const commenterIdNumber = Number(commenterUserId);

    if (!Number.isInteger(workItemIdNumber) || !Number.isInteger(commenterIdNumber)) {
      res.status(400).json({ message: "workItemId and commenterUserId must be valid integers." });
      return;
    }

    if (commenterIdNumber !== req.auth.userId) {
      res.status(403).json({ message: "You can only create comments as yourself." });
      return;
    }

    const [workItem, commenter] = await Promise.all([
      prisma.workItem.findFirst({
        where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
      }),
      prisma.user.findFirst({
        where: { userId: commenterIdNumber, organizationId: req.auth.organizationId },
      }),
    ]);

    if (!workItem) {
      res.status(404).json({ message: "Work item not found" });
      return;
    }

    if (!commenter) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        commenterUserId: commenterIdNumber,
        workItemId: workItemIdNumber,
        organizationId: req.auth.organizationId,
      },
      include: {
        commenterUser: true,
      },
    });

    res.status(201).json(newComment);
  } catch (error: any) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};

export const updateCommentForWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId, commentId } = req.params;
  const { text, requesterUserId } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ message: "Comment text is required." });
    return;
  }
  if (requesterUserId === undefined) {
    res.status(400).json({ message: "requesterUserId is required." });
    return;
  }

  try {
    const workItemIdNumber = Number(workItemId);
    const commentIdNumber = Number(commentId);
    const requesterIdNumber = Number(requesterUserId);

    if (
      !Number.isInteger(workItemIdNumber) ||
      !Number.isInteger(commentIdNumber) ||
      !Number.isInteger(requesterIdNumber)
    ) {
      res.status(400).json({ message: "Identifiers must be valid integers." });
      return;
    }

    if (requesterIdNumber !== req.auth.userId) {
      res.status(403).json({ message: "You can only edit your own comments." });
      return;
    }

    const existingComment = await prisma.comment.findFirst({
      where: { id: commentIdNumber, organizationId: req.auth.organizationId },
    });

    if (!existingComment || existingComment.workItemId !== workItemIdNumber) {
      res.status(404).json({ message: "Comment not found for this work item." });
      return;
    }

    if (existingComment.commenterUserId !== requesterIdNumber) {
      res.status(403).json({ message: "You can only edit your own comments." });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentIdNumber },
      data: { text },
      include: {
        commenterUser: true,
      },
    });

    res.json(updatedComment);
  } catch (error: any) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: `Error updating comment: ${error.message}` });
  }
};

export const deleteCommentForWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId, commentId } = req.params;
  const { requesterUserId } = req.body;

  if (requesterUserId === undefined) {
    res.status(400).json({ message: "requesterUserId is required." });
    return;
  }

  try {
    const workItemIdNumber = Number(workItemId);
    const commentIdNumber = Number(commentId);
    const requesterIdNumber = Number(requesterUserId);

    if (
      !Number.isInteger(workItemIdNumber) ||
      !Number.isInteger(commentIdNumber) ||
      !Number.isInteger(requesterIdNumber)
    ) {
      res.status(400).json({ message: "Identifiers must be valid integers." });
      return;
    }

    if (requesterIdNumber !== req.auth.userId) {
      res.status(403).json({ message: "You can only delete your own comments." });
      return;
    }

    const existingComment = await prisma.comment.findFirst({
      where: { id: commentIdNumber, organizationId: req.auth.organizationId },
    });

    if (!existingComment || existingComment.workItemId !== workItemIdNumber) {
      res.status(404).json({ message: "Comment not found for this work item." });
      return;
    }

    if (existingComment.commenterUserId !== requesterIdNumber) {
      res.status(403).json({ message: "You can only delete your own comments." });
      return;
    }

    await prisma.comment.deleteMany({
      where: {
        id: commentIdNumber,
        organizationId: req.auth.organizationId,
      },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: `Error deleting comment: ${error.message}` });
  }
};


/**
 * Delete WorkItem (and its subtype details)
 */
export const deleteWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;

  try {
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
      res.status(400).json({ message: "workItemId must be a valid integer" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const existingWorkItem = await tx.workItem.findFirst({
        where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
      });

      if (!existingWorkItem) {
        throw new Error("WORK_ITEM_NOT_FOUND");
      }

      await tx.comment.deleteMany({
        where: { workItemId: workItemIdNumber, organizationId: req.auth.organizationId },
      });

      await tx.attachment.deleteMany({
        where: { workItemId: workItemIdNumber, organizationId: req.auth.organizationId },
      });

      await tx.workItemToPart.deleteMany({
        where: { workItemId: workItemIdNumber },
      });

      await tx.issueDetail.deleteMany({
        where: { id: workItemIdNumber },
      });

      await tx.deliverableDetail.deleteMany({
        where: { id: workItemIdNumber },
      });

      await tx.workItem.delete({
        where: { id: workItemIdNumber },
      });
    });

    res.status(200).json({ message: `Work item ${workItemId} deleted successfully.` });
  } catch (error: any) {
    console.error("Error deleting work item:", error);
    if (error instanceof Error && error.message === "WORK_ITEM_NOT_FOUND") {
      res.status(404).json({ message: "Work item not found" });
      return;
    }
    res.status(500).json({ message: `Error deleting work item: ${error.message}` });
  }
};


