import { Router } from "express"
import { protect } from "../middleware/authMiddleware"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from "../controllers/notificationController"

const router = Router()

router.get("/", protect, getNotifications)

router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
)

router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
)

router.delete(
  "/clear-all",
  protect,
  clearNotifications
)

export default router