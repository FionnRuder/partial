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
exports.updateProgram = exports.createProgram = exports.getPrograms = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
const getPrograms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const programs = yield prisma.program.findMany({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving programs: ${error.message}` });
    }
});
exports.getPrograms = getPrograms;
const createProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, programManagerUserId, startDate, endDate } = req.body;
    try {
        if (!name || !description || !startDate || !endDate) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (programManagerUserId !== undefined && programManagerUserId !== null) {
            const programManager = yield prisma.user.findFirst({
                where: {
                    id: programManagerUserId,
                    organizationId: req.auth.organizationId,
                },
            });
            if (!programManager) {
                res.status(404).json({ message: "Program manager not found" });
                return;
            }
        }
        const newProgram = yield prisma.program.create({
            data: {
                organizationId: req.auth.organizationId,
                name,
                description,
                programManagerUserId: programManagerUserId || null,
                startDate,
                endDate,
            },
        });
        // Log program creation
        yield (0, auditLogger_1.logCreate)(req, "Program", newProgram.id, `Program created: ${newProgram.name}`, (0, auditLogger_1.sanitizeForAudit)(newProgram));
        res.status(201).json(newProgram);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating a program: ${error.message}` });
    }
});
exports.createProgram = createProgram;
const updateProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { programId } = req.params;
    const { name, description, programManagerUserId, startDate, endDate } = req.body;
    try {
        const programIdNumber = Number(programId);
        if (!Number.isInteger(programIdNumber)) {
            res.status(400).json({ message: "programId must be a valid integer" });
            return;
        }
        // Get existing program before update for audit logging
        const existingProgram = yield prisma.program.findFirst({
            where: { id: programIdNumber, organizationId: req.auth.organizationId },
        });
        if (!existingProgram) {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        if (programManagerUserId !== undefined && programManagerUserId !== null) {
            const programManager = yield prisma.user.findFirst({
                where: {
                    id: programManagerUserId,
                    organizationId: req.auth.organizationId,
                },
            });
            if (!programManager) {
                res.status(404).json({ message: "Program manager not found" });
                return;
            }
        }
        const updateResult = yield prisma.program.updateMany({
            where: { id: programIdNumber, organizationId: req.auth.organizationId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (description !== undefined && { description })), (programManagerUserId !== undefined && {
                programManagerUserId: programManagerUserId || null,
            })), (startDate !== undefined && { startDate })), (endDate !== undefined && { endDate })),
        });
        if (updateResult.count === 0) {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        const updatedProgram = yield prisma.program.findUnique({
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
        // Log program update
        if (updatedProgram) {
            const changedFields = (0, auditLogger_1.getChangedFields)(existingProgram, updatedProgram);
            yield (0, auditLogger_1.logUpdate)(req, "Program", updatedProgram.id, `Program updated: ${updatedProgram.name}`, (0, auditLogger_1.sanitizeForAudit)(existingProgram), (0, auditLogger_1.sanitizeForAudit)(updatedProgram), changedFields);
        }
        res.json(updatedProgram);
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Error updating program: ${error.message}` });
    }
});
exports.updateProgram = updateProgram;
