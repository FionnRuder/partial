"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const milestoneController_1 = require("../controllers/milestoneController");
const router = (0, express_1.Router)();
router.get("/", milestoneController_1.getMilestones);
router.get("/milestones/by-program", milestoneController_1.getMilestonesByProgram);
router.post("/", milestoneController_1.createMilestone);
exports.default = router;
