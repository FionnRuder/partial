import { Router } from "express";
import { createProgram, getPrograms, updateProgram } from "../controllers/programController";

const router = Router();

router.get("/", getPrograms);
router.post("/", createProgram);
router.patch("/:programId", updateProgram);

export default router;