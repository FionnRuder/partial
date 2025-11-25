import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, getEmailPreferences, updateEmailPreferences } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.get("/:userId/email-preferences", getEmailPreferences);
router.put("/:userId/email-preferences", updateEmailPreferences);

export default router;