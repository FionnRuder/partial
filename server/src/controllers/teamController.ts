import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.disciplineTeam.findMany({
      where: {
        organizationId: req.auth.organizationId,
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

        return {
          ...team,
          teamManagerUsername: teamManager?.username,
          teamManagerName: teamManager?.name,
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
  const { name, description, teamManagerUserId } = req.body;
  try {
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

    const newTeam = await prisma.disciplineTeam.create({
      data: {
        organizationId: req.auth.organizationId,
        name,
        description,
        teamManagerUserId:
          teamManagerUserId !== undefined && teamManagerUserId !== null
            ? Number(teamManagerUserId)
            : null,
      },
    });
    res.status(201).json(newTeam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a team: ${error.message}` });
  }
};