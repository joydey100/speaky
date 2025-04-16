import dotenv from "dotenv";
import express from "express";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Allow all for testing
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "./frontend/dist")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  // console.log(`✅ Server running at http://localhost:${PORT}`);
});
