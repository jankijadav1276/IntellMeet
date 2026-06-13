import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import http from "http";

import connectDB from "./config/db";

// Routes
import authRoutes from "./routes/authRoutes";
import meetingRoutes from "./routes/meetingRoutes";

// Socket
import { initSocket } from "./socket/socket";

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(express.json());
app.use(cors());

// Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests, please try again later",
});

app.use("/api/auth", authLimiter);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("IntellMeet Backend Running 🚀");
});

// Test Route
app.get("/test", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server working",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

// Handle Unknown Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT: number = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});