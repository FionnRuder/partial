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
exports.createMilestone = exports.getMilestonesByProgram = exports.getMilestones = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
const getMilestones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const milestones = yield prisma.milestone.findMany({
            where: {
                organizationId: req.auth.organizationId,
            },
            include: {
                program: true,
                workItems: true,
            },
        });
        res.json(milestones);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving milestones: ${error.message}` });
    }
});
exports.getMilestones = getMilestones;
const getMilestonesByProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        });
        if (!program) {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        const milestones = yield prisma.milestone.findMany({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving milestones by program: ${error.message}` });
    }
});
exports.getMilestonesByProgram = getMilestonesByProgram;
const createMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, date, programId } = req.body;
    try {
        if (!programId || !Number.isInteger(Number(programId))) {
            res.status(400).json({ message: "Valid programId is required" });
            return;
        }
        const program = yield prisma.program.findFirst({
            where: {
                id: Number(programId),
                organizationId: req.auth.organizationId,
            },
        });
        if (!program) {
            res.status(404).json({ message: "Program not found" });
            return;
        }
        const newMilestone = yield prisma.milestone.create({
            data: {
                organizationId: req.auth.organizationId,
                name,
                description,
                date,
                programId: Number(programId),
            },
        });
        // Log milestone creation
        yield (0, auditLogger_1.logCreate)(req, "Milestone", newMilestone.id, `Milestone created: ${newMilestone.name}`, (0, auditLogger_1.sanitizeForAudit)(newMilestone));
        res.status(201).json(newMilestone);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating a milestone: ${error.message}` });
    }
});
exports.createMilestone = createMilestone;
