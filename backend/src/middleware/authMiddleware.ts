import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/User"
import { IMeeting } from "../models/Meeting"

// ===============================
// Strongly typed Auth Request
// ===============================
export interface AuthRequest extends Request {
  user?: {
    _id: string
    name: string
    email: string
    role?: string
  }

  // Meeting attached by meetingAccessMiddleware
  meeting?: IMeeting
}

// ===============================
// JWT payload type
// ===============================
interface DecodedToken extends JwtPayload {
  id: string
}

// ===============================
// AUTH MIDDLEWARE
// ===============================
const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    // No token
    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      })
      return
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      })
      return
    }

    // Attach safe user object
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: (user as any).role || "user",
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized or token expired",
    })
  }
}

export { protect }