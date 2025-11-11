import { Router } from "express";
import { createPart, getParts, getPartsByProgram, getPartsByUser, editPart, deletePart } from "../controllers/partController"

const router = Router();

router.get("/", getParts);
router.get("/by-program", getPartsByProgram);
router.get("/user/:userId", getPartsByUser);
router.post("/", createPart);
router.patch("/:partId", editPart);
router.delete("/:partId", deletePart);

export default router;