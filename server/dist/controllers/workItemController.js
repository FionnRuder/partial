"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDependencyFromWorkItem = exports.addDependencyToWorkItem = exports.deleteAttachmentForWorkItem = exports.updateAttachmentForWorkItem = exports.createAttachmentForWorkItem = exports.getAttachmentsForWorkItem = exports.deleteStatusLogForWorkItem = exports.updateStatusLogForWorkItem = exports.createStatusLogForWorkItem = exports.getStatusLogsForWorkItem = exports.deleteWorkItem = exports.deleteCommentForWorkItem = exports.updateCommentForWorkItem = exports.createCommentForWorkItem = exports.getCommentsForWorkItem = exports.editWorkItem = exports.updateWorkItemStatus = exports.createWorkItem = exports.getWorkItemsByUser = exports.getWorkItems = exports.getWorkItemById = void 0;
const client_1 = require("@prisma/client");
const emailService_1 = require("../lib/emailService");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
/**
 * Get single WorkItem by ID
 */
const getWorkItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
        res.status(400).json({ message: "workItemId must be a valid integer" });
        return;
    }
    try {
        const workItem = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
            include: {
                program: true,
                dueByMilestone: true,
                deliverableDetail: {
                    include: {
                        deliverableType: true,
                    },
                },
                issueDetail: {
                    include: {
                        issueType: true,
                    },
                },
                authorUser: true,
                assigneeUser: true,
                partNumbers: {
                    include: {
                        part: true,
                    },
                },
                attachments: {
                    include: {
                        uploadedByUser: true,
                    },
                    orderBy: {
                        dateAttached: "desc",
                    },
                },
                comments: {
                    include: {
                        commenterUser: true,
                    },
                    orderBy: {
                        dateCommented: "desc",
                    },
                },
                dependencies: {
                    include: {
                        dependencyWorkItem: {
                            include: {
                                program: true,
                                authorUser: true,
                                assigneeUser: true,
                            },
                        },
                    },
                },
            },
        });
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        res.json(workItem);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving work item: ${error.message}` });
    }
});
exports.getWorkItemById = getWorkItemById;
/**
 * Get WorkItems
 * Supports optional filtering by programId or partId
 */
const parseBoolean = (value) => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return Boolean(value);
};
const getDescendantPartIds = (organizationId, rootPartId) => __awaiter(void 0, void 0, void 0, function* () {
    const visited = new Set();
    const queue = [rootPartId];
    visited.add(rootPartId);
    while (queue.length > 0) {
        const currentPartId = queue.shift();
        const children = yield prisma.part.findMany({
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
});
const getWorkItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { programId, partId, includeChildren } = req.query;
    try {
        const organizationId = req.auth.organizationId;
        const workItemInclude = {
            program: true,
            dueByMilestone: true,
            deliverableDetail: {
                include: {
                    deliverableType: true,
                },
            },
            issueDetail: {
                include: {
                    issueType: true,
                },
            },
            authorUser: true,
            assigneeUser: true,
            partNumbers: {
                include: {
                    part: true,
                },
            },
            attachments: {
                include: {
                    uploadedByUser: true,
                },
                orderBy: {
                    dateAttached: "desc",
                },
            },
            comments: {
                include: {
                    commenterUser: true,
                },
                orderBy: {
                    dateCommented: "desc",
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
            const program = yield prisma.program.findFirst({
                where: { id: programIdNumber, organizationId },
            });
            if (!program) {
                res.status(404).json({ message: "Program not found" });
                return;
            }
            workItems = yield prisma.workItem.findMany({
                where: { programId: programIdNumber, organizationId },
                include: workItemInclude,
            });
        }
        else if (partId) {
            const rootPartId = Number(partId);
            if (!Number.isInteger(rootPartId)) {
                res.status(400).json({ message: "partId must be a valid integer" });
                return;
            }
            const rootPart = yield prisma.part.findFirst({
                where: { id: rootPartId, organizationId },
            });
            if (!rootPart) {
                res.status(404).json({ message: "Part not found" });
                return;
            }
            const shouldIncludeChildren = parseBoolean(includeChildren);
            const partIds = shouldIncludeChildren
                ? yield getDescendantPartIds(organizationId, rootPartId)
                : [rootPartId];
            workItems = yield prisma.workItem.findMany({
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
        }
        else {
            workItems = yield prisma.workItem.findMany({
                where: { organizationId },
                include: workItemInclude,
            });
        }
        res.json(workItems);
    }
    catch (error) {
        res.status(500).json({
            message: `Error retrieving work items: ${error.message}`,
        });
    }
});
exports.getWorkItems = getWorkItems;
/**
 * Get WorkItems by User
 */
const getWorkItemsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const organizationId = req.auth.organizationId;
        const user = yield prisma.user.findFirst({
            where: {
                id: userId,
                organizationId,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const workItems = yield prisma.workItem.findMany({
            where: {
                organizationId,
                OR: [
                    { authorUserId: userId },
                    { assignedUserId: userId },
                ],
            },
            include: {
                deliverableDetail: {
                    include: {
                        deliverableType: true,
                    },
                },
                issueDetail: {
                    include: {
                        issueType: true,
                    },
                },
                authorUser: true,
                assigneeUser: true,
            },
        });
        res.json(workItems);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving work items by user: ${error.message}` });
    }
});
exports.getWorkItemsByUser = getWorkItemsByUser;
/**
 * Create WorkItem
 * Handles DeliverableDetail or IssueDetail based on type
 */
const createWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const organizationId = req.auth.organizationId;
        const normalizedPartIds = Array.isArray(body.partIds)
            ? body.partIds.map((id) => Number(id))
            : [];
        const newWorkItem = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const program = yield tx.program.findFirst({
                where: {
                    id: Number(body.programId),
                    organizationId,
                },
            });
            if (!program) {
                throw new Error("Program not found");
            }
            const milestone = yield tx.milestone.findFirst({
                where: {
                    id: Number(body.dueByMilestoneId),
                    organizationId,
                },
            });
            if (!milestone) {
                throw new Error("Milestone not found");
            }
            const author = yield tx.user.findFirst({
                where: {
                    id: body.authorUserId,
                    organizationId,
                },
            });
            if (!author) {
                throw new Error("Author user not found");
            }
            const assignee = yield tx.user.findFirst({
                where: {
                    id: body.assignedUserId,
                    organizationId,
                },
            });
            if (!assignee) {
                throw new Error("Assigned user not found");
            }
            if (normalizedPartIds.length > 0) {
                const parts = yield tx.part.findMany({
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
            // Look up issue type ID if name is provided
            let issueTypeId;
            if (body.issueDetail) {
                if (body.issueDetail.issueTypeId) {
                    issueTypeId = body.issueDetail.issueTypeId;
                }
                else if (body.issueDetail.issueType) {
                    const issueType = yield tx.issueType.findFirst({
                        where: {
                            organizationId,
                            name: body.issueDetail.issueType,
                        },
                    });
                    if (!issueType) {
                        throw new Error(`Issue type "${body.issueDetail.issueType}" not found`);
                    }
                    issueTypeId = issueType.id;
                }
            }
            // Look up deliverable type ID if name is provided
            let deliverableTypeId;
            if (body.deliverableDetail) {
                if (body.deliverableDetail.deliverableTypeId) {
                    deliverableTypeId = body.deliverableDetail.deliverableTypeId;
                }
                else if (body.deliverableDetail.deliverableType) {
                    const deliverableType = yield tx.deliverableType.findFirst({
                        where: {
                            organizationId,
                            name: body.deliverableDetail.deliverableType,
                        },
                    });
                    if (!deliverableType) {
                        throw new Error(`Deliverable type "${body.deliverableDetail.deliverableType}" not found`);
                    }
                    deliverableTypeId = deliverableType.id;
                }
            }
            const workItemData = {
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
                authorUserId: body.authorUserId,
                assignedUserId: body.assignedUserId,
                issueDetail: body.issueDetail && issueTypeId
                    ? {
                        create: {
                            issueTypeId: issueTypeId,
                            rootCause: body.issueDetail.rootCause,
                            correctiveAction: body.issueDetail.correctiveAction,
                        },
                    }
                    : undefined,
                deliverableDetail: body.deliverableDetail && deliverableTypeId
                    ? {
                        create: {
                            deliverableTypeId: deliverableTypeId,
                        },
                    }
                    : undefined,
                partNumbers: normalizedPartIds.length > 0
                    ? {
                        create: normalizedPartIds.map((id) => ({
                            part: { connect: { id } },
                        })),
                    }
                    : undefined,
            };
            const createdWorkItem = yield tx.workItem.create({
                data: workItemData,
                include: {
                    program: true,
                    dueByMilestone: true,
                    deliverableDetail: {
                        include: {
                            deliverableType: true,
                        },
                    },
                    issueDetail: {
                        include: {
                            issueType: true,
                        },
                    },
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
            // If inputStatus is provided, create the first status log entry
            if (body.inputStatus && body.inputStatus.trim()) {
                yield tx.statusLog.create({
                    data: {
                        status: body.inputStatus.trim(),
                        engineerUserId: body.authorUserId,
                        workItemId: createdWorkItem.id,
                        organizationId: organizationId,
                    },
                });
            }
            // Create dependencies if provided
            if (body.dependencyWorkItemIds && body.dependencyWorkItemIds.length > 0) {
                const normalizedDependencyIds = body.dependencyWorkItemIds.map((id) => Number(id));
                // Verify all dependency work items exist and belong to the organization
                const dependencyWorkItems = yield tx.workItem.findMany({
                    where: {
                        id: { in: normalizedDependencyIds },
                        organizationId,
                    },
                    select: { id: true },
                });
                if (dependencyWorkItems.length !== normalizedDependencyIds.length) {
                    throw new Error("One or more dependency work items not found");
                }
                // Prevent self-dependency
                if (normalizedDependencyIds.includes(createdWorkItem.id)) {
                    throw new Error("A work item cannot depend on itself");
                }
                // Check for circular dependencies
                for (const depId of normalizedDependencyIds) {
                    const wouldCreateCycle = yield tx.workItemDependency.findFirst({
                        where: {
                            workItemId: depId,
                            dependencyWorkItemId: createdWorkItem.id,
                        },
                    });
                    if (wouldCreateCycle) {
                        throw new Error("Cannot create circular dependency");
                    }
                }
                // Create dependencies
                yield tx.workItemDependency.createMany({
                    data: normalizedDependencyIds.map((depId) => ({
                        workItemId: createdWorkItem.id,
                        dependencyWorkItemId: depId,
                    })),
                    skipDuplicates: true,
                });
            }
            // Fetch the created work item with dependencies
            const workItemWithDeps = yield tx.workItem.findUnique({
                where: { id: createdWorkItem.id },
                include: {
                    program: true,
                    dueByMilestone: true,
                    deliverableDetail: {
                        include: {
                            deliverableType: true,
                        },
                    },
                    issueDetail: {
                        include: {
                            issueType: true,
                        },
                    },
                    authorUser: true,
                    assigneeUser: true,
                    partNumbers: { include: { part: true } },
                    dependencies: {
                        include: {
                            dependencyWorkItem: {
                                include: {
                                    program: true,
                                    authorUser: true,
                                    assigneeUser: true,
                                },
                            },
                        },
                    },
                },
            });
            return workItemWithDeps || createdWorkItem;
        }));
        // Log work item creation
        yield (0, auditLogger_1.logCreate)(req, "WorkItem", newWorkItem.id, `Work item created: ${newWorkItem.title} (${newWorkItem.workItemType})`, (0, auditLogger_1.sanitizeForAudit)(newWorkItem));
        // Send assignment email to assignee (if different from author)
        if (newWorkItem.assigneeUser && newWorkItem.authorUser) {
            if (newWorkItem.assigneeUser.id !== newWorkItem.authorUser.id) {
                try {
                    yield (0, emailService_1.sendWorkItemAssignmentEmail)(newWorkItem.assigneeUser.email, newWorkItem.assigneeUser.name, newWorkItem.title, newWorkItem.id, newWorkItem.authorUser.name, newWorkItem.priority, newWorkItem.dueDate.toISOString(), newWorkItem.assigneeUser.id);
                }
                catch (emailError) {
                    console.error("Failed to send assignment email:", emailError);
                    // Don't fail the request if email fails
                }
            }
        }
        res.status(201).json(Object.assign(Object.assign({}, newWorkItem), { partIds: newWorkItem.partNumbers.map((p) => p.partId) }));
    }
    catch (error) {
        console.error("Error creating work item:", error);
        const knownNotFoundMessages = new Set([
            "Program not found",
            "Milestone not found",
            "Author user not found",
            "Assigned user not found",
            "One or more parts not found",
            "One or more dependency work items not found",
        ]);
        const knownBadRequestMessages = new Set([
            "A work item cannot depend on itself",
            "Cannot create circular dependency",
        ]);
        const knownTypeNotFoundMessages = new Set([
            /^Issue type ".*" not found$/,
            /^Deliverable type ".*" not found$/,
        ]);
        if (error instanceof Error && knownNotFoundMessages.has(error.message)) {
            res.status(404).json({ message: error.message });
            return;
        }
        if (error instanceof Error && knownBadRequestMessages.has(error.message)) {
            res.status(400).json({ message: error.message });
            return;
        }
        // Check for type not found errors
        if (error instanceof Error) {
            for (const pattern of knownTypeNotFoundMessages) {
                if (pattern.test(error.message)) {
                    res.status(404).json({ message: error.message });
                    return;
                }
            }
        }
        res.status(500).json({ message: `Error creating work item: ${error.message}` });
    }
});
exports.createWorkItem = createWorkItem;
/**
 * Update WorkItem Status
 */
const updateWorkItemStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const { status } = req.body;
    try {
        const workItemIdNumber = Number(workItemId);
        if (!Number.isInteger(workItemIdNumber)) {
            res.status(400).json({ message: "workItemId must be a valid integer" });
            return;
        }
        // If status is being set to Completed, check that all dependencies are completed
        if (status === "Completed") {
            const workItem = yield prisma.workItem.findFirst({
                where: {
                    id: workItemIdNumber,
                    organizationId: req.auth.organizationId,
                },
                include: {
                    dependencies: {
                        include: {
                            dependencyWorkItem: true,
                        },
                    },
                },
            });
            if (!workItem) {
                res.status(404).json({ message: "Work item not found" });
                return;
            }
            // Check if any dependencies are not completed
            const incompleteDependencies = workItem.dependencies.filter((dep) => dep.dependencyWorkItem.status !== "Completed");
            if (incompleteDependencies.length > 0) {
                const incompleteTitles = incompleteDependencies
                    .map((dep) => dep.dependencyWorkItem.title)
                    .join(", ");
                res.status(400).json({
                    message: `Cannot complete work item. The following dependencies must be completed first: ${incompleteTitles}`,
                });
                return;
            }
        }
        // If status is being set to Completed, automatically set percentComplete to 100
        const updateData = { status };
        if (status === "Completed") {
            updateData.percentComplete = 100;
        }
        const updateResult = yield prisma.workItem.updateMany({
            where: {
                id: workItemIdNumber,
                organizationId: req.auth.organizationId,
            },
            data: updateData,
        });
        if (updateResult.count === 0) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        const updatedWorkItem = yield prisma.workItem.findUnique({
            where: { id: workItemIdNumber },
            include: {
                dependencies: {
                    include: {
                        dependencyWorkItem: {
                            include: {
                                program: true,
                                authorUser: true,
                                assigneeUser: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(updatedWorkItem);
    }
    catch (error) {
        res.status(500).json({ message: `Error updating work item status: ${error.message}` });
    }
});
exports.updateWorkItemStatus = updateWorkItemStatus;
const editWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workItemId } = req.params;
    const updates = req.body;
    const organizationId = req.auth.organizationId;
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
        res.status(400).json({ message: "workItemId must be a valid integer" });
        return;
    }
    try {
        // Fetch existing work item before transaction for audit logging and email notifications
        const existingWorkItemFull = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId },
            include: {
                program: true,
                dueByMilestone: true,
                authorUser: true,
                assigneeUser: true,
            },
        });
        if (!existingWorkItemFull) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        const oldAssigneeId = existingWorkItemFull.assignedUserId;
        const oldStatus = existingWorkItemFull.status;
        const finalWorkItem = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const existingWorkItemInTx = yield tx.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId },
                include: { partNumbers: true },
            });
            if (!existingWorkItemInTx) {
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
                    const parts = yield tx.part.findMany({
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
                yield tx.workItemToPart.deleteMany({
                    where: { workItemId: workItemIdNumber },
                });
                if (normalizedPartIds.length > 0) {
                    yield tx.workItemToPart.createMany({
                        data: normalizedPartIds.map((partId) => ({
                            workItemId: workItemIdNumber,
                            partId,
                        })),
                    });
                }
            }
            if (updates.programId !== undefined) {
                const program = yield tx.program.findFirst({
                    where: { id: Number(updates.programId), organizationId },
                });
                if (!program) {
                    throw new Error("PROGRAM_NOT_FOUND");
                }
            }
            if (updates.dueByMilestoneId !== undefined) {
                const milestone = yield tx.milestone.findFirst({
                    where: { id: Number(updates.dueByMilestoneId), organizationId },
                });
                if (!milestone) {
                    throw new Error("MILESTONE_NOT_FOUND");
                }
            }
            if (updates.authorUserId !== undefined) {
                const author = yield tx.user.findFirst({
                    where: { id: updates.authorUserId, organizationId },
                });
                if (!author) {
                    throw new Error("AUTHOR_NOT_FOUND");
                }
            }
            if (updates.assignedUserId !== undefined) {
                const assignee = yield tx.user.findFirst({
                    where: { id: updates.assignedUserId, organizationId },
                });
                if (!assignee) {
                    throw new Error("ASSIGNEE_NOT_FOUND");
                }
            }
            // If status is being set to Completed, check that all dependencies are completed
            if (updates.status === "Completed") {
                const dependencies = yield tx.workItemDependency.findMany({
                    where: {
                        workItemId: workItemIdNumber,
                    },
                    include: {
                        dependencyWorkItem: true,
                    },
                });
                // Check if any dependencies are not completed
                const incompleteDependencies = dependencies.filter((dep) => dep.dependencyWorkItem.status !== "Completed");
                if (incompleteDependencies.length > 0) {
                    const incompleteTitles = incompleteDependencies
                        .map((dep) => dep.dependencyWorkItem.title)
                        .join(", ");
                    throw new Error(`Cannot complete work item. The following dependencies must be completed first: ${incompleteTitles}`);
                }
            }
            const updateData = {};
            if (updates.workItemType)
                updateData.workItemType = updates.workItemType;
            if (updates.title)
                updateData.title = updates.title;
            if (updates.description)
                updateData.description = updates.description;
            if (updates.status) {
                updateData.status = updates.status;
                // If status is being set to Completed, automatically set percentComplete to 100
                if (updates.status === "Completed") {
                    updateData.percentComplete = 100;
                }
            }
            if (updates.priority)
                updateData.priority = updates.priority;
            if (updates.tags)
                updateData.tags = updates.tags;
            if (updates.dateOpened)
                updateData.dateOpened = new Date(updates.dateOpened);
            if (updates.dueDate)
                updateData.dueDate = new Date(updates.dueDate);
            if (updates.estimatedCompletionDate)
                updateData.estimatedCompletionDate = new Date(updates.estimatedCompletionDate);
            if (updates.actualCompletionDate)
                updateData.actualCompletionDate = new Date(updates.actualCompletionDate);
            // Only set percentComplete from updates if status is not being set to Completed
            // (if status is Completed, we already set it to 100 above)
            if (typeof updates.percentComplete === "number" && updates.status !== "Completed")
                updateData.percentComplete = updates.percentComplete;
            // Check if inputStatus is being updated and if it's different from the current value
            const inputStatusChanged = updates.inputStatus !== undefined &&
                updates.inputStatus !== existingWorkItemInTx.inputStatus;
            if (updates.inputStatus)
                updateData.inputStatus = updates.inputStatus;
            if (updates.programId !== undefined)
                updateData.programId = Number(updates.programId);
            if (updates.dueByMilestoneId !== undefined)
                updateData.dueByMilestoneId = Number(updates.dueByMilestoneId);
            if (updates.authorUserId !== undefined)
                updateData.authorUserId = updates.authorUserId;
            if (updates.assignedUserId !== undefined)
                updateData.assignedUserId = updates.assignedUserId;
            const updatedWorkItem = yield tx.workItem.update({
                where: { id: workItemIdNumber },
                data: updateData,
                include: {
                    program: true,
                    dueByMilestone: true,
                    deliverableDetail: {
                        include: {
                            deliverableType: true,
                        },
                    },
                    issueDetail: {
                        include: {
                            issueType: true,
                        },
                    },
                    authorUser: true,
                    assigneeUser: true,
                    attachments: {
                        include: {
                            uploadedByUser: true,
                        },
                        orderBy: {
                            dateAttached: "desc",
                        },
                    },
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
            // If inputStatus was changed, create a status log entry
            if (inputStatusChanged && updates.inputStatus) {
                yield tx.statusLog.create({
                    data: {
                        status: updates.inputStatus,
                        engineerUserId: req.auth.userId,
                        workItemId: workItemIdNumber,
                        organizationId: organizationId,
                    },
                });
            }
            // Handle issue detail updates
            if (updates.issueDetail) {
                let issueTypeId;
                if (updates.issueDetail.issueTypeId) {
                    issueTypeId = updates.issueDetail.issueTypeId;
                }
                else if (updates.issueDetail.issueType) {
                    const issueType = yield tx.issueType.findFirst({
                        where: {
                            organizationId,
                            name: updates.issueDetail.issueType,
                        },
                    });
                    if (!issueType) {
                        throw new Error(`Issue type "${updates.issueDetail.issueType}" not found`);
                    }
                    issueTypeId = issueType.id;
                }
                if (issueTypeId !== undefined) {
                    const existingIssueDetail = yield tx.issueDetail.findUnique({
                        where: { id: workItemIdNumber },
                    });
                    if (existingIssueDetail) {
                        yield tx.issueDetail.update({
                            where: { id: workItemIdNumber },
                            data: Object.assign(Object.assign({ issueTypeId: issueTypeId }, (updates.issueDetail.rootCause !== undefined && {
                                rootCause: updates.issueDetail.rootCause,
                            })), (updates.issueDetail.correctiveAction !== undefined && {
                                correctiveAction: updates.issueDetail.correctiveAction,
                            })),
                        });
                    }
                    else {
                        yield tx.issueDetail.create({
                            data: {
                                id: workItemIdNumber,
                                issueTypeId: issueTypeId,
                                rootCause: updates.issueDetail.rootCause || null,
                                correctiveAction: updates.issueDetail.correctiveAction || null,
                            },
                        });
                    }
                }
                else if (updates.issueDetail.rootCause !== undefined || updates.issueDetail.correctiveAction !== undefined) {
                    // Update rootCause/correctiveAction without changing type
                    const existingIssueDetail = yield tx.issueDetail.findUnique({
                        where: { id: workItemIdNumber },
                    });
                    if (existingIssueDetail) {
                        yield tx.issueDetail.update({
                            where: { id: workItemIdNumber },
                            data: Object.assign(Object.assign({}, (updates.issueDetail.rootCause !== undefined && {
                                rootCause: updates.issueDetail.rootCause,
                            })), (updates.issueDetail.correctiveAction !== undefined && {
                                correctiveAction: updates.issueDetail.correctiveAction,
                            })),
                        });
                    }
                }
            }
            // Handle deliverable detail updates
            if (updates.deliverableDetail) {
                let deliverableTypeId;
                if (updates.deliverableDetail.deliverableTypeId) {
                    deliverableTypeId = updates.deliverableDetail.deliverableTypeId;
                }
                else if (updates.deliverableDetail.deliverableType) {
                    const deliverableType = yield tx.deliverableType.findFirst({
                        where: {
                            organizationId,
                            name: updates.deliverableDetail.deliverableType,
                        },
                    });
                    if (!deliverableType) {
                        throw new Error(`Deliverable type "${updates.deliverableDetail.deliverableType}" not found`);
                    }
                    deliverableTypeId = deliverableType.id;
                }
                if (deliverableTypeId !== undefined) {
                    const existingDeliverableDetail = yield tx.deliverableDetail.findUnique({
                        where: { id: workItemIdNumber },
                    });
                    if (existingDeliverableDetail) {
                        yield tx.deliverableDetail.update({
                            where: { id: workItemIdNumber },
                            data: {
                                deliverableTypeId: deliverableTypeId,
                            },
                        });
                    }
                    else {
                        yield tx.deliverableDetail.create({
                            data: {
                                id: workItemIdNumber,
                                deliverableTypeId: deliverableTypeId,
                            },
                        });
                    }
                }
            }
            // Handle dependency updates
            if (updates.dependencyWorkItemIds !== undefined) {
                const normalizedDependencyIds = updates.dependencyWorkItemIds.map((id) => Number(id));
                // Verify all dependency work items exist and belong to the organization
                if (normalizedDependencyIds.length > 0) {
                    const dependencyWorkItems = yield tx.workItem.findMany({
                        where: {
                            id: { in: normalizedDependencyIds },
                            organizationId,
                        },
                        select: { id: true },
                    });
                    if (dependencyWorkItems.length !== normalizedDependencyIds.length) {
                        throw new Error("One or more dependency work items not found");
                    }
                    // Prevent self-dependency
                    if (normalizedDependencyIds.includes(workItemIdNumber)) {
                        throw new Error("A work item cannot depend on itself");
                    }
                    // Check for circular dependencies
                    for (const depId of normalizedDependencyIds) {
                        const wouldCreateCycle = yield tx.workItemDependency.findFirst({
                            where: {
                                workItemId: depId,
                                dependencyWorkItemId: workItemIdNumber,
                            },
                        });
                        if (wouldCreateCycle) {
                            throw new Error("Cannot create circular dependency");
                        }
                    }
                }
                // Delete all existing dependencies
                yield tx.workItemDependency.deleteMany({
                    where: { workItemId: workItemIdNumber },
                });
                // Create new dependencies
                if (normalizedDependencyIds.length > 0) {
                    yield tx.workItemDependency.createMany({
                        data: normalizedDependencyIds.map((depId) => ({
                            workItemId: workItemIdNumber,
                            dependencyWorkItemId: depId,
                        })),
                        skipDuplicates: true,
                    });
                }
            }
            const finalWorkItem = yield tx.workItem.findUnique({
                where: { id: workItemIdNumber },
                include: {
                    program: true,
                    dueByMilestone: true,
                    deliverableDetail: {
                        include: {
                            deliverableType: true,
                        },
                    },
                    issueDetail: {
                        include: {
                            issueType: true,
                        },
                    },
                    authorUser: true,
                    assigneeUser: true,
                    attachments: {
                        include: {
                            uploadedByUser: true,
                        },
                        orderBy: {
                            dateAttached: "desc",
                        },
                    },
                    comments: {
                        include: {
                            commenterUser: true,
                        },
                        orderBy: {
                            dateCommented: "desc",
                        },
                    },
                    partNumbers: { include: { part: true } },
                    dependencies: {
                        include: {
                            dependencyWorkItem: {
                                include: {
                                    program: true,
                                    authorUser: true,
                                    assigneeUser: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!finalWorkItem) {
                throw new Error("WORK_ITEM_NOT_FOUND");
            }
            return finalWorkItem;
        }));
        // Send email notifications for updates (after transaction completes)
        try {
            const newAssigneeId = finalWorkItem.assignedUserId;
            const newStatus = finalWorkItem.status;
            // Send assignment email if assignee changed
            if (oldAssigneeId !== newAssigneeId && finalWorkItem.assigneeUser && finalWorkItem.authorUser) {
                // Only send if new assignee is different from the person making the change
                if (finalWorkItem.assigneeUser.id !== req.auth.userId) {
                    yield (0, emailService_1.sendWorkItemAssignmentEmail)(finalWorkItem.assigneeUser.email, finalWorkItem.assigneeUser.name, finalWorkItem.title, finalWorkItem.id, finalWorkItem.authorUser.name, finalWorkItem.priority, finalWorkItem.dueDate.toISOString(), finalWorkItem.assigneeUser.id);
                }
            }
            // Send status change email if status changed
            if (oldStatus !== newStatus && finalWorkItem.assigneeUser) {
                // Get the user who made the change
                const changedByUser = yield prisma.user.findUnique({
                    where: { id: req.auth.userId },
                    select: { name: true },
                });
                const changedByName = (changedByUser === null || changedByUser === void 0 ? void 0 : changedByUser.name) || "System";
                // Notify assignee and author (if different)
                const recipients = [];
                if (finalWorkItem.assigneeUser && finalWorkItem.assigneeUser.id !== req.auth.userId) {
                    recipients.push({
                        email: finalWorkItem.assigneeUser.email,
                        name: finalWorkItem.assigneeUser.name,
                        userId: finalWorkItem.assigneeUser.id,
                    });
                }
                if (finalWorkItem.authorUser &&
                    finalWorkItem.authorUser.id !== req.auth.userId &&
                    finalWorkItem.authorUser.id !== ((_a = finalWorkItem.assigneeUser) === null || _a === void 0 ? void 0 : _a.id)) {
                    recipients.push({
                        email: finalWorkItem.authorUser.email,
                        name: finalWorkItem.authorUser.name,
                        userId: finalWorkItem.authorUser.id,
                    });
                }
                for (const recipient of recipients) {
                    yield (0, emailService_1.sendWorkItemStatusChangeEmail)(recipient.email, recipient.name, finalWorkItem.title, finalWorkItem.id, oldStatus, newStatus, changedByName, recipient.userId);
                }
            }
        }
        catch (emailError) {
            console.error("Failed to send work item update emails:", emailError);
            // Don't fail the request if email fails
        }
        // Log work item update
        const changedFields = (0, auditLogger_1.getChangedFields)(existingWorkItemFull, finalWorkItem);
        yield (0, auditLogger_1.logUpdate)(req, "WorkItem", finalWorkItem.id, `Work item updated: ${finalWorkItem.title}`, (0, auditLogger_1.sanitizeForAudit)(existingWorkItemFull), (0, auditLogger_1.sanitizeForAudit)(finalWorkItem), changedFields);
        res.json(Object.assign(Object.assign({}, finalWorkItem), { partIds: finalWorkItem.partNumbers.map((p) => p.partId) }));
    }
    catch (error) {
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
        const badRequestErrors = new Set([
            "A work item cannot depend on itself",
            "Cannot create circular dependency",
            "One or more dependency work items not found",
        ]);
        if (errorMessage === "INVALID_PART_ID") {
            res.status(400).json({ message: "All partIds must be valid integers" });
            return;
        }
        // Check for dependency validation error
        if (errorMessage.startsWith("Cannot complete work item")) {
            res.status(400).json({ message: errorMessage });
            return;
        }
        if (badRequestErrors.has(errorMessage)) {
            res.status(400).json({ message: errorMessage });
            return;
        }
        if (notFoundErrors.has(errorMessage)) {
            const messageMap = {
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
});
exports.editWorkItem = editWorkItem;
const getCommentsForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
        res.status(400).json({ message: "workItemId must be a valid integer" });
        return;
    }
    try {
        const workItem = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
        });
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        const comments = yield prisma.comment.findMany({
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
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: `Error retrieving comments: ${error.message}` });
    }
});
exports.getCommentsForWorkItem = getCommentsForWorkItem;
const createCommentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        if (!Number.isInteger(workItemIdNumber)) {
            res.status(400).json({ message: "workItemId must be a valid integer." });
            return;
        }
        if (commenterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only create comments as yourself." });
            return;
        }
        const [workItem, commenter] = yield Promise.all([
            prisma.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
                include: {
                    assigneeUser: true,
                    authorUser: true,
                },
            }),
            prisma.user.findFirst({
                where: { id: commenterUserId, organizationId: req.auth.organizationId },
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
        const newComment = yield prisma.comment.create({
            data: {
                text: text.trim(),
                commenterUserId: commenterUserId,
                workItemId: workItemIdNumber,
                organizationId: req.auth.organizationId,
            },
            include: {
                commenterUser: true,
            },
        });
        // Send email notifications for new comment
        try {
            // Notify assignee and author (if different from commenter)
            const recipients = [];
            if (workItem.assigneeUser && workItem.assigneeUser.id !== commenterUserId) {
                recipients.push({
                    email: workItem.assigneeUser.email,
                    name: workItem.assigneeUser.name,
                    userId: workItem.assigneeUser.id,
                });
            }
            if (workItem.authorUser &&
                workItem.authorUser.id !== commenterUserId &&
                workItem.authorUser.id !== ((_a = workItem.assigneeUser) === null || _a === void 0 ? void 0 : _a.id)) {
                recipients.push({
                    email: workItem.authorUser.email,
                    name: workItem.authorUser.name,
                    userId: workItem.authorUser.id,
                });
            }
            // Send email to each recipient
            for (const recipient of recipients) {
                yield (0, emailService_1.sendWorkItemCommentEmail)(recipient.email, recipient.name, workItem.title, workItem.id, newComment.commenterUser.name, newComment.text, recipient.userId);
            }
        }
        catch (emailError) {
            console.error("Failed to send comment email:", emailError);
            // Don't fail the request if email fails
        }
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: `Error creating comment: ${error.message}` });
    }
});
exports.createCommentForWorkItem = createCommentForWorkItem;
const updateCommentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(commentIdNumber)) {
            res.status(400).json({ message: "workItemId and commentId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only edit your own comments." });
            return;
        }
        const existingComment = yield prisma.comment.findFirst({
            where: { id: commentIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingComment || existingComment.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Comment not found for this work item." });
            return;
        }
        if (existingComment.commenterUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only edit your own comments." });
            return;
        }
        const updatedComment = yield prisma.comment.update({
            where: { id: commentIdNumber },
            data: { text },
            include: {
                commenterUser: true,
            },
        });
        res.json(updatedComment);
    }
    catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: `Error updating comment: ${error.message}` });
    }
});
exports.updateCommentForWorkItem = updateCommentForWorkItem;
const deleteCommentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, commentId } = req.params;
    const { requesterUserId } = req.body;
    if (requesterUserId === undefined) {
        res.status(400).json({ message: "requesterUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const commentIdNumber = Number(commentId);
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(commentIdNumber)) {
            res.status(400).json({ message: "workItemId and commentId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only delete your own comments." });
            return;
        }
        const existingComment = yield prisma.comment.findFirst({
            where: { id: commentIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingComment || existingComment.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Comment not found for this work item." });
            return;
        }
        if (existingComment.commenterUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only delete your own comments." });
            return;
        }
        yield prisma.comment.deleteMany({
            where: {
                id: commentIdNumber,
                organizationId: req.auth.organizationId,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: `Error deleting comment: ${error.message}` });
    }
});
exports.deleteCommentForWorkItem = deleteCommentForWorkItem;
/**
 * Delete WorkItem (and its subtype details)
 */
const deleteWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    try {
        const workItemIdNumber = Number(workItemId);
        if (!Number.isInteger(workItemIdNumber)) {
            res.status(400).json({ message: "workItemId must be a valid integer" });
            return;
        }
        // Get work item before deletion for audit logging
        const workItemToDelete = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
            include: {
                program: true,
                authorUser: true,
                assigneeUser: true,
            },
        });
        if (!workItemToDelete) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const existingWorkItem = yield tx.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
            });
            if (!existingWorkItem) {
                throw new Error("WORK_ITEM_NOT_FOUND");
            }
            yield tx.comment.deleteMany({
                where: { workItemId: workItemIdNumber, organizationId: req.auth.organizationId },
            });
            yield tx.statusLog.deleteMany({
                where: { workItemId: workItemIdNumber, organizationId: req.auth.organizationId },
            });
            yield tx.attachment.deleteMany({
                where: { workItemId: workItemIdNumber, organizationId: req.auth.organizationId },
            });
            yield tx.workItemToPart.deleteMany({
                where: { workItemId: workItemIdNumber },
            });
            yield tx.issueDetail.deleteMany({
                where: { id: workItemIdNumber },
            });
            yield tx.deliverableDetail.deleteMany({
                where: { id: workItemIdNumber },
            });
            yield tx.workItem.delete({
                where: { id: workItemIdNumber },
            });
        }));
        // Log work item deletion
        yield (0, auditLogger_1.logDelete)(req, "WorkItem", workItemToDelete.id, `Work item deleted: ${workItemToDelete.title} (${workItemToDelete.workItemType})`, (0, auditLogger_1.sanitizeForAudit)(workItemToDelete));
        res.status(200).json({ message: `Work item ${workItemId} deleted successfully.` });
    }
    catch (error) {
        console.error("Error deleting work item:", error);
        if (error instanceof Error && error.message === "WORK_ITEM_NOT_FOUND") {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        res.status(500).json({ message: `Error deleting work item: ${error.message}` });
    }
});
exports.deleteWorkItem = deleteWorkItem;
/**
 * Get Status Logs for WorkItem
 */
const getStatusLogsForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
        res.status(400).json({ message: "workItemId must be a valid integer" });
        return;
    }
    try {
        const workItem = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
        });
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        const statusLogs = yield prisma.statusLog.findMany({
            where: {
                workItemId: workItemIdNumber,
                organizationId: req.auth.organizationId,
            },
            include: {
                engineerUser: true,
            },
            orderBy: {
                dateLogged: "desc",
            },
        });
        res.json(statusLogs);
    }
    catch (error) {
        console.error("Error fetching status logs:", error);
        res.status(500).json({ message: `Error retrieving status logs: ${error.message}` });
    }
});
exports.getStatusLogsForWorkItem = getStatusLogsForWorkItem;
/**
 * Create Status Log for WorkItem
 * Also updates the work item's inputStatus with the new status
 */
const createStatusLogForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const { status, engineerUserId } = req.body;
    if (!status || typeof status !== "string") {
        res.status(400).json({ message: "Status is required." });
        return;
    }
    if (engineerUserId === undefined) {
        res.status(400).json({ message: "engineerUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        if (!Number.isInteger(workItemIdNumber)) {
            res.status(400).json({ message: "workItemId must be a valid integer." });
            return;
        }
        if (engineerUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only create status logs as yourself." });
            return;
        }
        const [workItem, engineer] = yield Promise.all([
            prisma.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
            }),
            prisma.user.findFirst({
                where: { id: engineerUserId, organizationId: req.auth.organizationId },
            }),
        ]);
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        if (!engineer) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newStatusLog = yield tx.statusLog.create({
                data: {
                    status,
                    engineerUserId: engineerUserId,
                    workItemId: workItemIdNumber,
                    organizationId: req.auth.organizationId,
                },
                include: {
                    engineerUser: true,
                },
            });
            // Update the work item's inputStatus with the new status
            yield tx.workItem.update({
                where: { id: workItemIdNumber },
                data: {
                    inputStatus: status,
                },
            });
            return newStatusLog;
        }));
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating status log:", error);
        res.status(500).json({ message: `Error creating status log: ${error.message}` });
    }
});
exports.createStatusLogForWorkItem = createStatusLogForWorkItem;
/**
 * Update Status Log for WorkItem
 * Also updates the work item's inputStatus if this is the most recent status log
 */
const updateStatusLogForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, statusLogId } = req.params;
    const { status, requesterUserId } = req.body;
    if (!status || typeof status !== "string") {
        res.status(400).json({ message: "Status is required." });
        return;
    }
    if (requesterUserId === undefined) {
        res.status(400).json({ message: "requesterUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const statusLogIdNumber = Number(statusLogId);
        const requesterIdNumber = Number(requesterUserId);
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(statusLogIdNumber)) {
            res.status(400).json({ message: "workItemId and statusLogId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only edit your own status logs." });
            return;
        }
        const existingStatusLog = yield prisma.statusLog.findFirst({
            where: { id: statusLogIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingStatusLog || existingStatusLog.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Status log not found for this work item." });
            return;
        }
        if (existingStatusLog.engineerUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only edit your own status logs." });
            return;
        }
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedStatusLog = yield tx.statusLog.update({
                where: { id: statusLogIdNumber },
                data: { status },
                include: {
                    engineerUser: true,
                },
            });
            // Check if this is the most recent status log
            const mostRecentStatusLog = yield tx.statusLog.findFirst({
                where: {
                    workItemId: workItemIdNumber,
                    organizationId: req.auth.organizationId,
                },
                orderBy: {
                    dateLogged: "desc",
                },
            });
            // If this is the most recent status log, update the work item's inputStatus
            if (mostRecentStatusLog && mostRecentStatusLog.id === statusLogIdNumber) {
                yield tx.workItem.update({
                    where: { id: workItemIdNumber },
                    data: {
                        inputStatus: status,
                    },
                });
            }
            return updatedStatusLog;
        }));
        res.json(result);
    }
    catch (error) {
        console.error("Error updating status log:", error);
        res.status(500).json({ message: `Error updating status log: ${error.message}` });
    }
});
exports.updateStatusLogForWorkItem = updateStatusLogForWorkItem;
/**
 * Delete Status Log for WorkItem
 * Also updates the work item's inputStatus if this was the most recent status log
 */
const deleteStatusLogForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, statusLogId } = req.params;
    const { requesterUserId } = req.body;
    if (requesterUserId === undefined) {
        res.status(400).json({ message: "requesterUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const statusLogIdNumber = Number(statusLogId);
        const requesterIdNumber = Number(requesterUserId);
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(statusLogIdNumber)) {
            res.status(400).json({ message: "workItemId and statusLogId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only delete your own status logs." });
            return;
        }
        const existingStatusLog = yield prisma.statusLog.findFirst({
            where: { id: statusLogIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingStatusLog || existingStatusLog.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Status log not found for this work item." });
            return;
        }
        if (existingStatusLog.engineerUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only delete your own status logs." });
            return;
        }
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if this is the most recent status log before deleting
            const mostRecentStatusLog = yield tx.statusLog.findFirst({
                where: {
                    workItemId: workItemIdNumber,
                    organizationId: req.auth.organizationId,
                },
                orderBy: {
                    dateLogged: "desc",
                },
            });
            // Delete the status log
            yield tx.statusLog.delete({
                where: { id: statusLogIdNumber },
            });
            // If this was the most recent status log, update the work item's inputStatus
            // with the next most recent status log, or empty string if none exist
            if (mostRecentStatusLog && mostRecentStatusLog.id === statusLogIdNumber) {
                const nextMostRecentStatusLog = yield tx.statusLog.findFirst({
                    where: {
                        workItemId: workItemIdNumber,
                        organizationId: req.auth.organizationId,
                    },
                    orderBy: {
                        dateLogged: "desc",
                    },
                });
                yield tx.workItem.update({
                    where: { id: workItemIdNumber },
                    data: {
                        inputStatus: (nextMostRecentStatusLog === null || nextMostRecentStatusLog === void 0 ? void 0 : nextMostRecentStatusLog.status) || "",
                    },
                });
            }
        }));
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting status log:", error);
        res.status(500).json({ message: `Error deleting status log: ${error.message}` });
    }
});
exports.deleteStatusLogForWorkItem = deleteStatusLogForWorkItem;
/**
 * Get Attachments for WorkItem
 */
const getAttachmentsForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const workItemIdNumber = Number(workItemId);
    if (!Number.isInteger(workItemIdNumber)) {
        res.status(400).json({ message: "workItemId must be a valid integer" });
        return;
    }
    try {
        const workItem = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
        });
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        const attachments = yield prisma.attachment.findMany({
            where: {
                workItemId: workItemIdNumber,
                organizationId: req.auth.organizationId,
            },
            include: {
                uploadedByUser: true,
            },
            orderBy: {
                dateAttached: "desc",
            },
        });
        res.json(attachments);
    }
    catch (error) {
        console.error("Error fetching attachments:", error);
        res.status(500).json({ message: `Error retrieving attachments: ${error.message}` });
    }
});
exports.getAttachmentsForWorkItem = getAttachmentsForWorkItem;
/**
 * Create Attachment for WorkItem
 */
const createAttachmentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const { fileUrl, fileName, uploadedByUserId } = req.body;
    if (!fileUrl || typeof fileUrl !== "string") {
        res.status(400).json({ message: "fileUrl is required." });
        return;
    }
    if (!fileName || typeof fileName !== "string") {
        res.status(400).json({ message: "fileName is required." });
        return;
    }
    if (uploadedByUserId === undefined) {
        res.status(400).json({ message: "uploadedByUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        if (!Number.isInteger(workItemIdNumber)) {
            res.status(400).json({ message: "workItemId must be a valid integer." });
            return;
        }
        if (uploadedByUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only create attachments as yourself." });
            return;
        }
        const [workItem, uploader] = yield Promise.all([
            prisma.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId: req.auth.organizationId },
            }),
            prisma.user.findFirst({
                where: { id: uploadedByUserId, organizationId: req.auth.organizationId },
            }),
        ]);
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        if (!uploader) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const newAttachment = yield prisma.attachment.create({
            data: {
                fileUrl,
                fileName,
                uploadedByUserId: uploadedByUserId,
                workItemId: workItemIdNumber,
                organizationId: req.auth.organizationId,
            },
            include: {
                uploadedByUser: true,
            },
        });
        res.status(201).json(newAttachment);
    }
    catch (error) {
        console.error("Error creating attachment:", error);
        res.status(500).json({ message: `Error creating attachment: ${error.message}` });
    }
});
exports.createAttachmentForWorkItem = createAttachmentForWorkItem;
/**
 * Update Attachment for WorkItem (can update fileName and fileUrl)
 */
const updateAttachmentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, attachmentId } = req.params;
    const { fileName, fileUrl, requesterUserId } = req.body;
    if (!fileName || typeof fileName !== "string") {
        res.status(400).json({ message: "fileName is required." });
        return;
    }
    if (!fileUrl || typeof fileUrl !== "string") {
        res.status(400).json({ message: "fileUrl is required." });
        return;
    }
    if (requesterUserId === undefined) {
        res.status(400).json({ message: "requesterUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const attachmentIdNumber = Number(attachmentId);
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(attachmentIdNumber)) {
            res.status(400).json({ message: "workItemId and attachmentId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only edit your own attachments." });
            return;
        }
        const existingAttachment = yield prisma.attachment.findFirst({
            where: { id: attachmentIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingAttachment || existingAttachment.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Attachment not found for this work item." });
            return;
        }
        if (existingAttachment.uploadedByUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only edit your own attachments." });
            return;
        }
        const updatedAttachment = yield prisma.attachment.update({
            where: { id: attachmentIdNumber },
            data: { fileName, fileUrl },
            include: {
                uploadedByUser: true,
            },
        });
        res.json(updatedAttachment);
    }
    catch (error) {
        console.error("Error updating attachment:", error);
        res.status(500).json({ message: `Error updating attachment: ${error.message}` });
    }
});
exports.updateAttachmentForWorkItem = updateAttachmentForWorkItem;
/**
 * Delete Attachment for WorkItem
 */
const deleteAttachmentForWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, attachmentId } = req.params;
    const { requesterUserId } = req.body;
    if (requesterUserId === undefined) {
        res.status(400).json({ message: "requesterUserId is required." });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const attachmentIdNumber = Number(attachmentId);
        if (!Number.isInteger(workItemIdNumber) ||
            !Number.isInteger(attachmentIdNumber)) {
            res.status(400).json({ message: "workItemId and attachmentId must be valid integers." });
            return;
        }
        if (requesterUserId !== req.auth.userId) {
            res.status(403).json({ message: "You can only delete your own attachments." });
            return;
        }
        const existingAttachment = yield prisma.attachment.findFirst({
            where: { id: attachmentIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingAttachment || existingAttachment.workItemId !== workItemIdNumber) {
            res.status(404).json({ message: "Attachment not found for this work item." });
            return;
        }
        if (existingAttachment.uploadedByUserId !== requesterUserId) {
            res.status(403).json({ message: "You can only delete your own attachments." });
            return;
        }
        yield prisma.attachment.delete({
            where: { id: attachmentIdNumber },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting attachment:", error);
        res.status(500).json({ message: `Error deleting attachment: ${error.message}` });
    }
});
exports.deleteAttachmentForWorkItem = deleteAttachmentForWorkItem;
/**
 * Add Dependency to WorkItem
 */
const addDependencyToWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId } = req.params;
    const { dependencyWorkItemId } = req.body;
    if (!dependencyWorkItemId || typeof dependencyWorkItemId !== "number") {
        res.status(400).json({ message: "dependencyWorkItemId is required and must be a number" });
        return;
    }
    try {
        const workItemIdNumber = Number(workItemId);
        const dependencyIdNumber = Number(dependencyWorkItemId);
        if (!Number.isInteger(workItemIdNumber) || !Number.isInteger(dependencyIdNumber)) {
            res.status(400).json({ message: "workItemId and dependencyWorkItemId must be valid integers" });
            return;
        }
        // Prevent self-dependency
        if (workItemIdNumber === dependencyIdNumber) {
            res.status(400).json({ message: "A work item cannot depend on itself" });
            return;
        }
        const organizationId = req.auth.organizationId;
        // Verify both work items exist and belong to the organization
        const [workItem, dependencyWorkItem] = yield Promise.all([
            prisma.workItem.findFirst({
                where: { id: workItemIdNumber, organizationId },
            }),
            prisma.workItem.findFirst({
                where: { id: dependencyIdNumber, organizationId },
            }),
        ]);
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        if (!dependencyWorkItem) {
            res.status(404).json({ message: "Dependency work item not found" });
            return;
        }
        // Check if dependency already exists
        const existingDependency = yield prisma.workItemDependency.findFirst({
            where: {
                workItemId: workItemIdNumber,
                dependencyWorkItemId: dependencyIdNumber,
            },
        });
        if (existingDependency) {
            res.status(400).json({ message: "This dependency already exists" });
            return;
        }
        // Check for circular dependencies (if the dependency depends on this work item, it would create a cycle)
        const wouldCreateCycle = yield prisma.workItemDependency.findFirst({
            where: {
                workItemId: dependencyIdNumber,
                dependencyWorkItemId: workItemIdNumber,
            },
        });
        if (wouldCreateCycle) {
            res.status(400).json({ message: "Cannot create circular dependency" });
            return;
        }
        // Create the dependency
        const dependency = yield prisma.workItemDependency.create({
            data: {
                workItemId: workItemIdNumber,
                dependencyWorkItemId: dependencyIdNumber,
            },
            include: {
                dependencyWorkItem: {
                    include: {
                        program: true,
                        authorUser: true,
                        assigneeUser: true,
                    },
                },
            },
        });
        res.status(201).json(dependency);
    }
    catch (error) {
        console.error("Error adding dependency:", error);
        res.status(500).json({ message: `Error adding dependency: ${error.message}` });
    }
});
exports.addDependencyToWorkItem = addDependencyToWorkItem;
/**
 * Remove Dependency from WorkItem
 */
const removeDependencyFromWorkItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workItemId, dependencyId } = req.params;
    try {
        const workItemIdNumber = Number(workItemId);
        const dependencyIdNumber = Number(dependencyId);
        if (!Number.isInteger(workItemIdNumber) || !Number.isInteger(dependencyIdNumber)) {
            res.status(400).json({ message: "workItemId and dependencyId must be valid integers" });
            return;
        }
        const organizationId = req.auth.organizationId;
        // Verify the work item exists and belongs to the organization
        const workItem = yield prisma.workItem.findFirst({
            where: { id: workItemIdNumber, organizationId },
        });
        if (!workItem) {
            res.status(404).json({ message: "Work item not found" });
            return;
        }
        // Verify the dependency exists
        const dependency = yield prisma.workItemDependency.findFirst({
            where: {
                id: dependencyIdNumber,
                workItemId: workItemIdNumber,
            },
        });
        if (!dependency) {
            res.status(404).json({ message: "Dependency not found" });
            return;
        }
        // Delete the dependency
        yield prisma.workItemDependency.delete({
            where: { id: dependencyIdNumber },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error removing dependency:", error);
        res.status(500).json({ message: `Error removing dependency: ${error.message}` });
    }
});
exports.removeDependencyFromWorkItem = removeDependencyFromWorkItem;
