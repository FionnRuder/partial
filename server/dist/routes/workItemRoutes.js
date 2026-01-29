"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workItemController_1 = require("../controllers/workItemController");
const router = express_1.default.Router();
// ✅ GET all work items (optionally filter by programId or partId)
router.get("/", workItemController_1.getWorkItems);
// ✅ GET all work items authored or assigned to a user
router.get("/user/:userId", workItemController_1.getWorkItemsByUser);
// ✅ Comments
router.get("/:workItemId/comments", workItemController_1.getCommentsForWorkItem);
router.post("/:workItemId/comments", workItemController_1.createCommentForWorkItem);
router.patch("/:workItemId/comments/:commentId", workItemController_1.updateCommentForWorkItem);
router.delete("/:workItemId/comments/:commentId", workItemController_1.deleteCommentForWorkItem);
// ✅ Status Logs
router.get("/:workItemId/statusLogs", workItemController_1.getStatusLogsForWorkItem);
router.post("/:workItemId/statusLogs", workItemController_1.createStatusLogForWorkItem);
router.patch("/:workItemId/statusLogs/:statusLogId", workItemController_1.updateStatusLogForWorkItem);
router.delete("/:workItemId/statusLogs/:statusLogId", workItemController_1.deleteStatusLogForWorkItem);
// ✅ Attachments
router.get("/:workItemId/attachments", workItemController_1.getAttachmentsForWorkItem);
router.post("/:workItemId/attachments", workItemController_1.createAttachmentForWorkItem);
router.patch("/:workItemId/attachments/:attachmentId", workItemController_1.updateAttachmentForWorkItem);
router.delete("/:workItemId/attachments/:attachmentId", workItemController_1.deleteAttachmentForWorkItem);
// ✅ Dependencies
router.post("/:workItemId/dependencies", workItemController_1.addDependencyToWorkItem);
router.delete("/:workItemId/dependencies/:dependencyId", workItemController_1.removeDependencyFromWorkItem);
// ✅ GET single work item by ID (must be last to avoid conflicts)
router.get("/:workItemId", workItemController_1.getWorkItemById);
// ✅ CREATE a new work item (with DeliverableDetail or IssueDetail if applicable)
router.post("/", workItemController_1.createWorkItem);
// ✅ UPDATE status of a work item
router.patch("/:workItemId/status", workItemController_1.updateWorkItemStatus);
// ✅ EDIT (PATCH) a work item
router.patch("/:workItemId", workItemController_1.editWorkItem);
// ✅ DELETE a work item (and its related details)
router.delete("/:workItemId", workItemController_1.deleteWorkItem);
exports.default = router;
