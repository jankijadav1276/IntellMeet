import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

// Extend Express Request
export interface AuthRequest extends Request {
  user?: unknown;
}

interface DecodedToken extends JwtPayload {
  id: string;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      req.user = await User.findById(decoded.id).select("-password");

      next();
      return;
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }
  }

  res.status(401).json({
    success: false,
    message: "No token provided",
  });
};

export { protect };