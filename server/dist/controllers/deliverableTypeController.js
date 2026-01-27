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
exports.initializeSystemDeliverableTypes = exports.deleteDeliverableType = exports.updateDeliverableType = exports.createDeliverableType = exports.getDeliverableTypes = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
// System/default deliverable types that should be seeded for each organization
const SYSTEM_DELIVERABLE_TYPES = [
    "Engineering Drawing & CAD Model",
    "Bill of Materials (BOM)",
    "Stress/Structural Analysis Report",
    "Thermal Analysis Report",
    "Electrical Schematics / PCB Layouts",
    "Design for Manufacturability (DFM) & Design for Test (DFT)",
    "First Article Inspection (FAI) Report",
    "Supplier Quality Records / Certificates of Conformance (CoC)",
    "Test Plans and Procedures",
    "Qualification Test Report",
    "Acceptance Test Procedure (ATP)",
    "Calibration Certificates",
    "Non-Conformance / Corrective Action Report (NCR/CAR)",
    "System/Subsystem Requirements Specification (SRS)",
    "Interface Control Document (ICD)",
    "Preliminary Design Review (PDR) Package",
    "Critical Design Review (CDR) Package",
];
/**
 * Get all deliverable types for the organization
 */
const getDeliverableTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const types = yield prisma.deliverableType.findMany({
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
            .json({ message: `Error retrieving deliverable types: ${error.message}` });
    }
});
exports.getDeliverableTypes = getDeliverableTypes;
/**
 * Create a new deliverable type
 */
const createDeliverableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { name } = req.body;
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ message: "Name is required and must be a non-empty string" });
            return;
        }
        // Check if type already exists
        const existing = yield prisma.deliverableType.findFirst({
            where: {
                organizationId,
                name: name.trim(),
            },
        });
        if (existing) {
            res.status(409).json({ message: "Deliverable type with this name already exists" });
            return;
        }
        const newType = yield prisma.deliverableType.create({
            data: {
                organizationId,
                name: name.trim(),
                isSystem: false, // User-created types are not system types
            },
        });
        // Log deliverable type creation
        yield (0, auditLogger_1.logCreate)(req, "DeliverableType", newType.id, `Deliverable type created: ${newType.name}`, (0, auditLogger_1.sanitizeForAudit)(newType));
        res.status(201).json(newType);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating deliverable type: ${error.message}` });
    }
});
exports.createDeliverableType = createDeliverableType;
/**
 * Update a deliverable type
 */
const updateDeliverableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { id } = req.params;
        const typeId = Number(id);
        const { name } = req.body;
        if (!Number.isInteger(typeId)) {
            res.status(400).json({ message: "Invalid deliverable type ID" });
            return;
        }
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ message: "Name is required and must be a non-empty string" });
            return;
        }
        // Find the type
        const existingType = yield prisma.deliverableType.findFirst({
            where: {
                id: typeId,
                organizationId,
            },
        });
        if (!existingType) {
            res.status(404).json({ message: "Deliverable type not found" });
            return;
        }
        // Check if name already exists for another type
        const nameConflict = yield prisma.deliverableType.findFirst({
            where: {
                organizationId,
                name: name.trim(),
                id: { not: typeId },
            },
        });
        if (nameConflict) {
            res.status(409).json({ message: "Deliverable type with this name already exists" });
            return;
        }
        const updatedType = yield prisma.deliverableType.update({
            where: { id: typeId },
            data: {
                name: name.trim(),
            },
        });
        // Log deliverable type update
        const changes = (0, auditLogger_1.getChangedFields)(existingType, updatedType);
        yield (0, auditLogger_1.logUpdate)(req, "DeliverableType", updatedType.id, `Deliverable type updated: ${updatedType.name}`, changes, (0, auditLogger_1.sanitizeForAudit)(existingType), (0, auditLogger_1.sanitizeForAudit)(updatedType));
        res.json(updatedType);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating deliverable type: ${error.message}` });
    }
});
exports.updateDeliverableType = updateDeliverableType;
/**
 * Delete a deliverable type
 */
const deleteDeliverableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.auth.organizationId;
        const { id } = req.params;
        const typeId = Number(id);
        if (!Number.isInteger(typeId)) {
            res.status(400).json({ message: "Invalid deliverable type ID" });
            return;
        }
        // Find the type
        const type = yield prisma.deliverableType.findFirst({
            where: {
                id: typeId,
                organizationId,
            },
        });
        if (!type) {
            res.status(404).json({ message: "Deliverable type not found" });
            return;
        }
        // Check if type is in use
        const inUse = yield prisma.deliverableDetail.findFirst({
            where: {
                deliverableTypeId: typeId,
            },
        });
        if (inUse) {
            res.status(409).json({
                message: "Cannot delete deliverable type that is in use by existing deliverables",
            });
            return;
        }
        // Log deliverable type deletion
        yield (0, auditLogger_1.logDelete)(req, "DeliverableType", type.id, `Deliverable type deleted: ${type.name}`, (0, auditLogger_1.sanitizeForAudit)(type));
        // Delete the type
        yield prisma.deliverableType.delete({
            where: { id: typeId },
        });
        res.status(204).send();
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting deliverable type: ${error.message}` });
    }
});
exports.deleteDeliverableType = deleteDeliverableType;
/**
 * Initialize system deliverable types for an organization (called during organization setup)
 * This function is idempotent - it will create missing standard types without creating duplicates
 */
const initializeSystemDeliverableTypes = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get existing system types for this organization
        const existingTypes = yield prisma.deliverableType.findMany({
            where: {
                organizationId,
                isSystem: true,
            },
            select: { name: true },
        });
        const existingNames = new Set(existingTypes.map(t => t.name));
        // Find missing system types
        const missingTypes = SYSTEM_DELIVERABLE_TYPES.filter(name => !existingNames.has(name));
        // Create missing system types
        if (missingTypes.length > 0) {
            const result = yield prisma.deliverableType.createMany({
                data: missingTypes.map((name) => ({
                    organizationId,
                    name,
                    isSystem: true,
                })),
                skipDuplicates: true, // Extra safety to prevent duplicates
            });
            console.log(`Created ${result.count} deliverable types for organization ${organizationId}`);
        }
        else {
            console.log(`All deliverable types already exist for organization ${organizationId}`);
        }
    }
    catch (error) {
        console.error(`Error in initializeSystemDeliverableTypes for organization ${organizationId}:`, error);
        throw error; // Re-throw to be caught by caller
    }
});
exports.initializeSystemDeliverableTypes = initializeSystemDeliverableTypes;
