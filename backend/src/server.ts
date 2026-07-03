import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"
import http from "http"
import path from "path"
import connectDB from "./config/db"

// Routes
import authRoutes from "./routes/authRoutes"
import meetingRoutes from "./routes/meetingRoutes"
import recordingRoutes from "./routes/recordingRoutes"
import teamRoutes from "./routes/teamRoutes";
import aiRoutes from "./routes/ai.routes"
import analyticsRoutes from "./routes/analyticsRoutes"
// Socket
import { initSocket } from "./socket/socket"

// Load env
dotenv.config()

// DB connect
connectDB()

const app = express()

// ======================
// MIDDLEWARE (FIRST)
// ======================
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.use(express.json())

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
)

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later",
})

app.use("/api/auth", authLimiter)


// ======================
// ROUTES
// ======================
app.get("/", (req: Request, res: Response) => {
  res.send("IntellMeet Backend Running 🚀")
})

app.get("/test", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server working",
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/meetings", meetingRoutes)
app.use("/api/recordings",recordingRoutes)
app.use("/api/team", teamRoutes);
app.use("/api/ai", aiRoutes)
app.use("/api/analytics", analyticsRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// ======================
// HTTP SERVER + SOCKET
// ======================
const server = http.createServer(app)

// IMPORTANT: socket AFTER server creation (correct)
initSocket(server)

// ======================
// START SERVER
// ======================
const PORT: number = Number(process.env.PORT) || 5000


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})