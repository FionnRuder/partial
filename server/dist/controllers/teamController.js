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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTeam = exports.createTeam = exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const auditLogger_1 = require("../lib/auditLogger");
const prisma = new client_1.PrismaClient();
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield prisma.disciplineTeam.findMany({
            where: {
                organizationId: req.auth.organizationId,
            },
            include: {
                programs: {
                    include: {
                        program: true,
                    },
                },
            },
        });
        const teamsWithUsernames = yield Promise.all(teams.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let teamManager = null;
            if (team.teamManagerUserId) {
                teamManager = yield prisma.user.findFirst({
                    where: {
                        id: team.teamManagerUserId,
                        organizationId: req.auth.organizationId,
                    },
                    select: { username: true, name: true },
                });
            }
            // Extract programs from DisciplineTeamToProgram relations
            const teamPrograms = ((_a = team.programs) === null || _a === void 0 ? void 0 : _a.map((dtp) => dtp.program).filter((program) => program !== null && program !== undefined)) || [];
            // Return team data without the original programs relation structure
            const { programs: _ } = team, teamData = __rest(team, ["programs"]);
            return Object.assign(Object.assign({}, teamData), { teamManagerUsername: teamManager === null || teamManager === void 0 ? void 0 : teamManager.username, teamManagerName: teamManager === null || teamManager === void 0 ? void 0 : teamManager.name, programs: teamPrograms });
        })));
        res.json(teamsWithUsernames);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving discipline teams: ${error.message}` });
    }
});
exports.getTeams = getTeams;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, teamManagerUserId, programIds } = req.body;
    try {
        // If teamManagerUserId is not provided, automatically assign the current user as team manager
        // This is especially useful during onboarding
        let finalTeamManagerUserId = teamManagerUserId;
        if (finalTeamManagerUserId === undefined || finalTeamManagerUserId === null) {
            finalTeamManagerUserId = req.auth.userId;
        }
        if (finalTeamManagerUserId !== undefined && finalTeamManagerUserId !== null) {
            const teamManager = yield prisma.user.findFirst({
                where: {
                    id: finalTeamManagerUserId,
                    organizationId: req.auth.organizationId,
                },
            });
            if (!teamManager) {
                res.status(404).json({ message: "Team manager not found" });
                return;
            }
        }
        // Validate programIds if provided
        if (programIds && Array.isArray(programIds) && programIds.length > 0) {
            const programIdNumbers = programIds.map((id) => Number(id));
            const programs = yield prisma.program.findMany({
                where: {
                    id: { in: programIdNumbers },
                    organizationId: req.auth.organizationId,
                },
            });
            if (programs.length !== programIdNumbers.length) {
                res.status(400).json({ message: "One or more programs not found or not accessible" });
                return;
            }
        }
        // Create team and automatically assign team manager to the team
        const newTeam = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const team = yield tx.disciplineTeam.create({
                data: {
                    organizationId: req.auth.organizationId,
                    name,
                    description,
                    teamManagerUserId: finalTeamManagerUserId || null,
                    programs: programIds && Array.isArray(programIds) && programIds.length > 0
                        ? {
                            create: programIds.map((programId) => ({
                                programId: Number(programId),
                            })),
                        }
                        : undefined,
                },
                include: {
                    programs: {
                        include: {
                            program: true,
                        },
                    },
                },
            });
            // Automatically assign team manager as a member of the team (set their disciplineTeamId)
            if (finalTeamManagerUserId !== undefined && finalTeamManagerUserId !== null) {
                yield tx.user.update({
                    where: {
                        id: finalTeamManagerUserId,
                    },
                    data: {
                        disciplineTeamId: team.id,
                    },
                });
            }
            return team;
        }));
        // Log team creation
        yield (0, auditLogger_1.logCreate)(req, "DisciplineTeam", newTeam.id, `Team created: ${newTeam.name}`, (0, auditLogger_1.sanitizeForAudit)(newTeam));
        res.status(201).json(newTeam);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating a team: ${error.message}` });
    }
});
exports.createTeam = createTeam;
const editTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId } = req.params;
    const { name, description, teamManagerUserId, programIds } = req.body;
    try {
        const teamIdNumber = Number(teamId);
        if (!Number.isInteger(teamIdNumber)) {
            res.status(400).json({ message: "teamId must be a valid integer" });
            return;
        }
        // Check if team exists and belongs to organization
        const existingTeam = yield prisma.disciplineTeam.findFirst({
            where: {
                id: teamIdNumber,
                organizationId: req.auth.organizationId,
            },
        });
        if (!existingTeam) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Validate team manager if provided
        if (teamManagerUserId !== undefined && teamManagerUserId !== null) {
            const teamManager = yield prisma.user.findFirst({
                where: {
                    id: teamManagerUserId,
                    organizationId: req.auth.organizationId,
                },
            });
            if (!teamManager) {
                res.status(404).json({ message: "Team manager not found" });
                return;
            }
        }
        // Validate programIds if provided
        if (programIds && Array.isArray(programIds) && programIds.length > 0) {
            const programIdNumbers = programIds.map((id) => Number(id));
            const programs = yield prisma.program.findMany({
                where: {
                    id: { in: programIdNumbers },
                    organizationId: req.auth.organizationId,
                },
            });
            if (programs.length !== programIdNumbers.length) {
                res.status(400).json({ message: "One or more programs not found or not accessible" });
                return;
            }
        }
        // Update team using transaction to handle program assignments
        const updatedTeam = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Update basic team fields
            const team = yield tx.disciplineTeam.update({
                where: { id: teamIdNumber },
                data: Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (description !== undefined && { description })), (teamManagerUserId !== undefined && {
                    teamManagerUserId: teamManagerUserId || null,
                })),
            });
            // Handle program assignments if programIds is provided
            if (programIds !== undefined) {
                // Delete existing program assignments
                yield tx.disciplineTeamToProgram.deleteMany({
                    where: { disciplineTeamId: teamIdNumber },
                });
                // Create new program assignments if any
                if (Array.isArray(programIds) && programIds.length > 0) {
                    yield tx.disciplineTeamToProgram.createMany({
                        data: programIds.map((programId) => ({
                            disciplineTeamId: teamIdNumber,
                            programId: Number(programId),
                        })),
                    });
                }
            }
            // Return team with programs
            const teamWithPrograms = yield tx.disciplineTeam.findUnique({
                where: { id: teamIdNumber },
                include: {
                    programs: {
                        include: {
                            program: true,
                        },
                    },
                },
            });
            // Get team manager info
            let teamManager = null;
            if (teamWithPrograms === null || teamWithPrograms === void 0 ? void 0 : teamWithPrograms.teamManagerUserId) {
                teamManager = yield tx.user.findFirst({
                    where: {
                        id: teamWithPrograms.teamManagerUserId,
                        organizationId: req.auth.organizationId,
                    },
                    select: { username: true, name: true },
                });
            }
            return Object.assign(Object.assign({}, teamWithPrograms), { teamManagerUsername: teamManager === null || teamManager === void 0 ? void 0 : teamManager.username, teamManagerName: teamManager === null || teamManager === void 0 ? void 0 : teamManager.name, programs: ((_a = teamWithPrograms === null || teamWithPrograms === void 0 ? void 0 : teamWithPrograms.programs) === null || _a === void 0 ? void 0 : _a.map((dtp) => dtp.program)) || [] });
        }));
        // Log team update
        if (updatedTeam && updatedTeam.id) {
            const changedFields = (0, auditLogger_1.getChangedFields)(existingTeam, updatedTeam);
            yield (0, auditLogger_1.logUpdate)(req, "DisciplineTeam", updatedTeam.id, `Team updated: ${updatedTeam.name || 'Unknown'}`, (0, auditLogger_1.sanitizeForAudit)(existingTeam), (0, auditLogger_1.sanitizeForAudit)(updatedTeam), changedFields);
        }
        res.json(updatedTeam);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating team: ${error.message}` });
    }
});
exports.editTeam = editTeam;
