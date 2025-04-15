import express from "express";
import {
  authenticatedUser,
  deleteProfileController,
  loginController,
  logoutController,
  removeProfilePicController,
  signUpController,
  updateProfilePicController,
  updateProfileNameController,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.put("/updateprofilepic/", protectRoute, updateProfilePicController);
router.put("/updateprofilename/", protectRoute, updateProfileNameController);
router.delete("/remove-profile-pic", protectRoute, removeProfilePicController);
router.delete("/delete-profile/:id", protectRoute, deleteProfileController);
router.get("/me", protectRoute, authenticatedUser);

export default router;
