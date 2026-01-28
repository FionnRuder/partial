import { Router } from "express";
import { getOrganization, updateOrganization } from "../controllers/organizationController";

const router = Router();

router.get("/", getOrganization);
router.put("/", updateOrganization);

export default router;
