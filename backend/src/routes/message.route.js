import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessageController,
  getUsersController,
  sendMessageController,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersController);
router.get("/:id", protectRoute, getMessageController);
router.post("/sender/:id", protectRoute, sendMessageController);

export default router;
