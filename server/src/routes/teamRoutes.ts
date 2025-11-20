import { Router } from "express";
import { createTeam, getTeams, editTeam } from "../controllers/teamController";

const router = Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.patch("/:teamId", editTeam);

export default router;