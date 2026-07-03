import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getDashboardAnalytics } from "../services/other/analytics.service";

export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const analytics = await getDashboardAnalytics(req.user._id);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};