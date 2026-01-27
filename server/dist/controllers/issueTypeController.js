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
exports.initializeSystemIssueTypes = exports.deleteIssueType = exports.updateIssueType = exports.createIssueType = exports.getIssueTypes = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
// System/default issue types that should be seeded for each organization
const SYSTEM_ISSUE_TYPES = [
    "Process / Manufacturing Issue",
    "Supply-Chain / Procurement Issue",
    "Integration / Interface Issue",
    "Test / Verification Anomaly",
    "Environmental / Reliability Issue",
    "Configuration / Documentation Control Issue",
    "Safety / Regulatory Issue",
    "Obsolescence / End-of-Life Issue",
];
/**
 * Get all issue types for the organization
 */
const getIssueTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const types = yield prisma.issueType.findMany({
            where: { organizationId },
            orderBy: [
                { isSystem: "desc" }, // System types first
                { name: "asc" },
            ],
        });
        res.json(types);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving issue types: ${error.message}` });
    }
});
exports.getIssueTypes = getIssueTypes;
/**
 * Create a new issue type
 */
const createIssueType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { name } = req.body;
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ message: "Name is required and must be a non-empty string" });
            return;
        }
        // Check if type already exists
        const existing = yield prisma.issueType.findFirst({
            where: {
                organizationId,
                name: name.trim(),
            },
        });
        if (existing) {
            res.status(409).json({ message: "Issue type with this name already exists" });
            return;
        }
        const newType = yield prisma.issueType.create({
            data: {
                organizationId,
                name: name.trim(),
                isSystem: false, // User-created types are not system types
            },
        });
        // Log issue type creation
        yield (0, auditLogger_1.logCreate)(req, "IssueType", newType.id, `Issue type created: ${newType.name}`, (0, auditLogger_1.sanitizeForAudit)(newType));
        res.status(201).json(newType);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating issue type: ${error.message}` });
    }
});
exports.createIssueType = createIssueType;
/**
 * Update an issue type
 */
const updateIssueType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { id } = req.params;
        const typeId = Number(id);
        const { name } = req.body;
        if (!Number.isInteger(typeId)) {
            res.status(400).json({ message: "Invalid issue type ID" });
            return;
        }
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ message: "Name is required and must be a non-empty string" });
            return;
        }
        // Find the type
        const existingType = yield prisma.issueType.findFirst({
            where: {
                id: typeId,
                organizationId,
            },
        });
        if (!existingType) {
            res.status(404).json({ message: "Issue type not found" });
            return;
        }
        // Check if name already exists for another type
        const nameConflict = yield prisma.issueType.findFirst({
            where: {
                organizationId,
                name: name.trim(),
                id: { not: typeId },
            },
        });
        if (nameConflict) {
            res.status(409).json({ message: "Issue type with this name already exists" });
            return;
        }
        const updatedType = yield prisma.issueType.update({
            where: { id: typeId },
            data: {
                name: name.trim(),
            },
        });
        // Log issue type update
        const changes = (0, auditLogger_1.getChangedFields)(existingType, updatedType);
        yield (0, auditLogger_1.logUpdate)(req, "IssueType", updatedType.id, `Issue type updated: ${updatedType.name}`, changes, (0, auditLogger_1.sanitizeForAudit)(existingType), (0, auditLogger_1.sanitizeForAudit)(updatedType));
        res.json(updatedType);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating issue type: ${error.message}` });
    }
});
exports.updateIssueType = updateIssueType;
/**
 * Delete an issue type
 */
const deleteIssueType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { id } = req.params;
        const typeId = Number(id);
        if (!Number.isInteger(typeId)) {
            res.status(400).json({ message: "Invalid issue type ID" });
            return;
        }
        // Find the type
        const type = yield prisma.issueType.findFirst({
            where: {
                id: typeId,
                organizationId,
            },
        });
        if (!type) {
            res.status(404).json({ message: "Issue type not found" });
            return;
        }
        // Check if type is in use
        const inUse = yield prisma.issueDetail.findFirst({
            where: {
                issueType: {
                    id: typeId,
                },
            },
        });
        if (inUse) {
            res.status(409).json({
                message: "Cannot delete issue type that is in use by existing issues",
            });
            return;
        }
        // Log issue type deletion
        yield (0, auditLogger_1.logDelete)(req, "IssueType", type.id, `Issue type deleted: ${type.name}`, (0, auditLogger_1.sanitizeForAudit)(type));
        // Delete the type
        yield prisma.issueType.delete({
            where: { id: typeId },
        });
        res.status(204).send();
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting issue type: ${error.message}` });
    }
});
exports.deleteIssueType = deleteIssueType;
/**
 * Initialize system issue types for an organization (called during organization setup)
 * This function is idempotent - it will create missing standard types without creating duplicates
 */
const initializeSystemIssueTypes = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get existing system types for this organization
        const existingTypes = yield prisma.issueType.findMany({
            where: {
                organizationId,
                isSystem: true,
            },
            select: { name: true },
        });
        const existingNames = new Set(existingTypes.map(t => t.name));
        // Find missing system types
        const missingTypes = SYSTEM_ISSUE_TYPES.filter(name => !existingNames.has(name));
        // Create missing system types
        if (missingTypes.length > 0) {
            const result = yield prisma.issueType.createMany({
                data: missingTypes.map((name) => ({
                    organizationId,
                    name,
                    isSystem: true,
                })),
                skipDuplicates: true, // Extra safety to prevent duplicates
            });
            console.log(`Created ${result.count} issue types for organization ${organizationId}`);
        }
        else {
            console.log(`All issue types already exist for organization ${organizationId}`);
        }
    }
    catch (error) {
        console.error(`Error in initializeSystemIssueTypes for organization ${organizationId}:`, error);
        throw error; // Re-throw to be caught by caller
    }
});
exports.initializeSystemIssueTypes = initializeSystemIssueTypes;
