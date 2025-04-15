import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessageController,
  getUsersController,
  sendMessageController,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersController);
router.post("/sender/:id", protectRoute, sendMessageController);
router.get("/conversation/:id", protectRoute, getMessageController);

export default router;
