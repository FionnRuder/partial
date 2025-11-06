import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);

export default router;