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

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:5173" : "/",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.Node_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
