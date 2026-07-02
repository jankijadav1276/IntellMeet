import { Router } from "express";
import {
  createTeam,
  getTeam,
  getMyTeam,
  updateAdminPosition,
  inviteMember,
  getOnlineMembers,
  removeTeamMember,
} from "../controllers/teamController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createTeam);
router.get("/my-team", protect, getMyTeam);
router.post("/invite", protect, inviteMember);
router.delete("/member/:memberId", protect, removeTeamMember);
router.get("/online", protect, getOnlineMembers);
router.get("/:teamId", getTeam);
router.patch("/admin-position", protect, updateAdminPosition)

export default router;