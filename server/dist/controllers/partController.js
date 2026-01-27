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
exports.deletePart = exports.editPart = exports.createPart = exports.getPartsByUser = exports.getPartsByProgram = exports.getParts = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
const getParts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parts = yield prisma.part.findMany({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving parts: ${error.message}` });
    }
});
exports.getParts = getParts;
const getPartsByProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const program = yield prisma.program.findFirst({
            where: { id: programIdNumber, organizationId: req.auth.organizationId },
            select: { id: true },
        });
        if (!program) {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        const parts = yield prisma.part.findMany({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving parts by program: ${error.message}` });
    }
});
exports.getPartsByProgram = getPartsByProgram;
const getPartsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield prisma.user.findFirst({
            where: { id: userId, organizationId: req.auth.organizationId },
            select: { id: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const parts = yield prisma.part.findMany({
            where: {
                organizationId: req.auth.organizationId,
                assignedUserId: userId,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        res.json(parts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving parts by user: ${error.message}` });
    }
});
exports.getPartsByUser = getPartsByUser;
const createPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, partName, level, state, revisionLevel, assignedUserId, programId, parentId, } = req.body;
    try {
        const newPart = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (!programId || !Number.isInteger(Number(programId))) {
                throw new Error("Valid programId is required");
            }
            if (!assignedUserId || typeof assignedUserId !== 'string') {
                throw new Error("Valid assignedUserId is required");
            }
            const organizationId = req.auth.organizationId;
            const program = yield tx.program.findFirst({
                where: {
                    id: Number(programId),
                    organizationId,
                },
            });
            if (!program) {
                throw new Error("Program not found");
            }
            if (assignedUserId !== undefined && assignedUserId !== null) {
                const assignee = yield tx.user.findFirst({
                    where: {
                        id: assignedUserId,
                        organizationId,
                    },
                    select: { disciplineTeamId: true, id: true },
                });
                if (!assignee) {
                    throw new Error("Assigned user not found");
                }
            }
            if (parentId) {
                const parentPart = yield tx.part.findFirst({
                    where: { id: Number(parentId), organizationId },
                });
                if (!parentPart) {
                    throw new Error("Parent part not found");
                }
            }
            const createdPart = yield tx.part.create({
                data: {
                    organizationId,
                    code,
                    partName,
                    level,
                    state,
                    revisionLevel,
                    assignedUserId: assignedUserId,
                    programId: Number(programId),
                    parentId: parentId !== undefined && parentId !== null ? Number(parentId) : null,
                },
            });
            if (assignedUserId) {
                const assignedUser = yield tx.user.findFirst({
                    where: { id: assignedUserId, organizationId },
                    select: { disciplineTeamId: true },
                });
                if (assignedUser === null || assignedUser === void 0 ? void 0 : assignedUser.disciplineTeamId) {
                    const existingRelation = yield tx.disciplineTeamToProgram.findFirst({
                        where: {
                            disciplineTeamId: assignedUser.disciplineTeamId,
                            programId,
                        },
                    });
                    if (!existingRelation) {
                        yield tx.disciplineTeamToProgram.create({
                            data: {
                                disciplineTeamId: assignedUser.disciplineTeamId,
                                programId,
                            },
                        });
                    }
                }
            }
            return createdPart;
        }));
        // Log part creation
        yield (0, auditLogger_1.logCreate)(req, "Part", newPart.id, `Part created: ${newPart.partName} (${newPart.code})`, (0, auditLogger_1.sanitizeForAudit)(newPart));
        res.status(201).json(newPart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating a part: ${error.message}` });
    }
});
exports.createPart = createPart;
const editPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partId } = req.params;
    const updates = req.body; // Partial<Part>
    const organizationId = req.auth.organizationId;
    try {
        // Get existing part before update for audit logging
        const existingPartFull = yield prisma.part.findFirst({
            where: { id: Number(partId), organizationId },
            include: {
                assignedUser: true,
                program: true,
                parent: true,
            },
        });
        if (!existingPartFull) {
            res.status(404).json({ message: "Part not found" });
            return;
        }
        const updatedPart = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const existingPart = yield tx.part.findFirst({
                where: { id: Number(partId), organizationId },
            });
            if (!existingPart) {
                throw new Error("Part not found");
            }
            if (updates.programId !== undefined && updates.programId !== null) {
                const program = yield tx.program.findFirst({
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
                const assigneeExists = yield tx.user.findFirst({
                    where: {
                        id: updates.assignedUserId,
                        organizationId,
                    },
                });
                if (!assigneeExists) {
                    throw new Error("Assigned user not found");
                }
            }
            if (updates.parentId) {
                const parentExists = yield tx.part.findFirst({
                    where: { id: Number(updates.parentId), organizationId },
                });
                if (!parentExists) {
                    throw new Error("Parent part not found");
                }
            }
            const result = yield tx.part.update({
                where: { id: Number(partId) },
                data: {
                    organizationId,
                    code: updates.code,
                    partName: updates.partName,
                    level: updates.level,
                    state: updates.state,
                    revisionLevel: updates.revisionLevel,
                    assignedUserId: updates.assignedUserId || undefined,
                    programId: updates.programId !== undefined ? Number(updates.programId) : undefined,
                    parentId: updates.parentId === undefined
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
            const finalAssignedUserId = updates.assignedUserId !== undefined
                ? updates.assignedUserId
                : existingPart.assignedUserId;
            const finalProgramId = updates.programId !== undefined ? updates.programId : existingPart.programId;
            if (finalAssignedUserId) {
                const assignedUser = yield tx.user.findFirst({
                    where: { id: finalAssignedUserId, organizationId },
                    select: { disciplineTeamId: true },
                });
                if (assignedUser === null || assignedUser === void 0 ? void 0 : assignedUser.disciplineTeamId) {
                    const relationExists = yield tx.disciplineTeamToProgram.findFirst({
                        where: {
                            disciplineTeamId: assignedUser.disciplineTeamId,
                            programId: finalProgramId,
                        },
                    });
                    if (!relationExists) {
                        yield tx.disciplineTeamToProgram.create({
                            data: {
                                disciplineTeamId: assignedUser.disciplineTeamId,
                                programId: finalProgramId,
                            },
                        });
                    }
                }
            }
            return result;
        }));
        // Log part update
        const changedFields = (0, auditLogger_1.getChangedFields)(existingPartFull, updatedPart);
        yield (0, auditLogger_1.logUpdate)(req, "Part", updatedPart.id, `Part updated: ${updatedPart.partName} (${updatedPart.code})`, (0, auditLogger_1.sanitizeForAudit)(existingPartFull), (0, auditLogger_1.sanitizeForAudit)(updatedPart), changedFields);
        res.json(updatedPart);
    }
    catch (error) {
        console.error("Error updating part:", error);
        res
            .status(500)
            .json({ message: `Error updating part: ${error.message}` });
    }
});
exports.editPart = editPart;
const deletePart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partId } = req.params;
    const partIdNumber = Number(partId);
    if (!Number.isInteger(partIdNumber)) {
        res.status(400).json({ message: "partId must be a valid integer" });
        return;
    }
    try {
        // Get part before deletion for audit logging
        const partToDelete = yield prisma.part.findFirst({
            where: {
                id: partIdNumber,
                organizationId: req.auth.organizationId,
            },
            include: {
                assignedUser: true,
                program: true,
            },
        });
        if (!partToDelete) {
            res.status(404).json({ message: "Part not found" });
            return;
        }
        const deleteResult = yield prisma.part.deleteMany({
            where: {
                id: partIdNumber,
                organizationId: req.auth.organizationId,
            },
        });
        if (deleteResult.count === 0) {
            res.status(404).json({ message: "Part not found" });
            return;
        }
        // Log part deletion
        yield (0, auditLogger_1.logDelete)(req, "Part", partToDelete.id, `Part deleted: ${partToDelete.partName} (${partToDelete.code})`, (0, auditLogger_1.sanitizeForAudit)(partToDelete));
        res.json({ message: "Part deleted successfully." });
    }
    catch (error) {
        res.status(500).json({ message: `Error deleting part: ${error.message}` });
    }
});
exports.deletePart = deletePart;
