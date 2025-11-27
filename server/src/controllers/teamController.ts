import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logCreate, logUpdate, sanitizeForAudit, getChangedFields } from "../lib/auditLogger";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.disciplineTeam.findMany({
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

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let teamManager = null;
        
        if (team.teamManagerUserId) {
          teamManager = await prisma.user.findFirst({
            where: {
              userId: team.teamManagerUserId,
              organizationId: req.auth.organizationId,
            },
            select: { username: true, name: true },
          });
        }

        // Extract programs from DisciplineTeamToProgram relations
        const teamPrograms = team.programs
          ?.map((dtp: any) => dtp.program)
          .filter((program: any) => program !== null && program !== undefined) || [];

        // Return team data without the original programs relation structure
        const { programs: _, ...teamData } = team;
        
        return {
          ...teamData,
          teamManagerUsername: teamManager?.username,
          teamManagerName: teamManager?.name,
          programs: teamPrograms,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving discipline teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, teamManagerUserId, programIds } = req.body;
  try {
    // If teamManagerUserId is not provided, automatically assign the current user as team manager
    // This is especially useful during onboarding
    let finalTeamManagerUserId = teamManagerUserId;
    if (finalTeamManagerUserId === undefined || finalTeamManagerUserId === null) {
      finalTeamManagerUserId = req.auth.userId;
    }

    if (finalTeamManagerUserId !== undefined && finalTeamManagerUserId !== null) {
      const teamManager = await prisma.user.findFirst({
        where: {
          userId: Number(finalTeamManagerUserId),
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
      const programIdNumbers = programIds.map((id: any) => Number(id));
      const programs = await prisma.program.findMany({
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
    const newTeam = await prisma.$transaction(async (tx) => {
      const team = await tx.disciplineTeam.create({
        data: {
          organizationId: req.auth.organizationId,
          name,
          description,
          teamManagerUserId:
            finalTeamManagerUserId !== undefined && finalTeamManagerUserId !== null
              ? Number(finalTeamManagerUserId)
              : null,
          programs: programIds && Array.isArray(programIds) && programIds.length > 0
            ? {
                create: programIds.map((programId: any) => ({
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
        await tx.user.update({
          where: {
            userId: Number(finalTeamManagerUserId),
          },
          data: {
            disciplineTeamId: team.id,
          },
        });
      }

      return team;
    });

    // Log team creation
    await logCreate(
      req,
      "DisciplineTeam",
      newTeam.id,
      `Team created: ${newTeam.name}`,
      sanitizeForAudit(newTeam)
    );

    res.status(201).json(newTeam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a team: ${error.message}` });
  }
};

export const editTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamId } = req.params;
  const { name, description, teamManagerUserId, programIds } = req.body;
  
  try {
    const teamIdNumber = Number(teamId);
    if (!Number.isInteger(teamIdNumber)) {
      res.status(400).json({ message: "teamId must be a valid integer" });
      return;
    }

    // Check if team exists and belongs to organization
    const existingTeam = await prisma.disciplineTeam.findFirst({
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
      const teamManager = await prisma.user.findFirst({
        where: {
          userId: Number(teamManagerUserId),
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
      const programIdNumbers = programIds.map((id: any) => Number(id));
      const programs = await prisma.program.findMany({
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
    const updatedTeam = await prisma.$transaction(async (tx) => {
      // Update basic team fields
      const team = await tx.disciplineTeam.update({
        where: { id: teamIdNumber },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(teamManagerUserId !== undefined && {
            teamManagerUserId: teamManagerUserId !== null ? Number(teamManagerUserId) : null,
          }),
        },
      });

      // Handle program assignments if programIds is provided
      if (programIds !== undefined) {
        // Delete existing program assignments
        await tx.disciplineTeamToProgram.deleteMany({
          where: { disciplineTeamId: teamIdNumber },
        });

        // Create new program assignments if any
        if (Array.isArray(programIds) && programIds.length > 0) {
          await tx.disciplineTeamToProgram.createMany({
            data: programIds.map((programId: any) => ({
              disciplineTeamId: teamIdNumber,
              programId: Number(programId),
            })),
          });
        }
      }

      // Return team with programs
      const teamWithPrograms = await tx.disciplineTeam.findUnique({
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
      if (teamWithPrograms?.teamManagerUserId) {
        teamManager = await tx.user.findFirst({
          where: {
            userId: teamWithPrograms.teamManagerUserId,
            organizationId: req.auth.organizationId,
          },
          select: { username: true, name: true },
        });
      }

      return {
        ...teamWithPrograms,
        teamManagerUsername: teamManager?.username,
        teamManagerName: teamManager?.name,
        programs: teamWithPrograms?.programs?.map((dtp: any) => dtp.program) || [],
      };
    });

    // Log team update
    if (updatedTeam && updatedTeam.id) {
      const changedFields = getChangedFields(existingTeam, updatedTeam);
      await logUpdate(
        req,
        "DisciplineTeam",
        updatedTeam.id,
        `Team updated: ${updatedTeam.name || 'Unknown'}`,
        sanitizeForAudit(existingTeam),
        sanitizeForAudit(updatedTeam),
        changedFields
      );
    }

    res.json(updatedTeam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating team: ${error.message}` });
  }
};