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
exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const raw = req.query.query;
    const query = typeof raw === "string" ? raw : "";
    try {
        // 🔎 Search across all WorkItems
        const workItems = yield prisma.workItem.findMany({
            where: {
                organizationId: req.auth.organizationId,
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { tags: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                issueDetail: true,
                deliverableDetail: true,
                program: true,
                dueByMilestone: true,
                authorUser: true,
                assigneeUser: true,
                partNumbers: {
                    include: { part: true },
                },
            },
        });
        // 🔎 Other entities
        const programs = yield prisma.program.findMany({
            where: {
                organizationId: req.auth.organizationId,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
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
        const users = yield prisma.user.findMany({
            where: {
                organizationId: req.auth.organizationId,
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { phoneNumber: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                disciplineTeam: true,
                authoredWorkItems: true,
                assignedWorkItems: true,
                partNumbers: true,
            },
        });
        const milestones = yield prisma.milestone.findMany({
            where: {
                organizationId: req.auth.organizationId,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                program: true,
                workItems: true,
            },
        });
        const parts = yield prisma.part.findMany({
            where: {
                organizationId: req.auth.organizationId,
                OR: [
                    { code: { contains: query, mode: "insensitive" } },
                    { partName: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                assignedUser: true,
                program: true,
                parent: true,
                children: true,
            },
        });
        res.json({
            workItems, // ✅ unified
            programs,
            users,
            milestones,
            parts,
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error performing search: ${error.message}` });
    }
});
exports.search = search;
