import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketServer } from "socket.io";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { setupSocket } from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO with improved options
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,   // 60 seconds – keep connection alive
  pingInterval: 25000,   // send ping every 25 seconds
  transports: ["websocket", "polling"], // allow fallback
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.get("/", (req, res) => res.send("Server running"));

// Socket.IO handler
setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`   REST API:   http://localhost:${PORT}/api`);
  console.log(`   WebSocket:  ws://localhost:${PORT}`);
});