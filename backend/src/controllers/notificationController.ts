import { Response } from "express"
import Notification from "../models/Notification"
import { AuthRequest } from "../middleware/authMiddleware"

export const getNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const notifications =
      await Notification.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .populate("sender", "name email avatar")

    return res.status(200).json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    return res.status(200).json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    )

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const clearNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    await Notification.deleteMany({
      user: req.user._id,
    })

    return res.status(200).json({
      success: true,
      message: "Notifications cleared successfully",
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}