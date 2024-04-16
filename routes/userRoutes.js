import express from "express";
import {
  authUser,
  registerUser,
  verifyEmail,
  resetPassword,
  logoutUser,
  resetNewPassword,
  updateProfileUrl,
  updatePeriodStartDate,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/auth", authUser);
router.post("/reset-password", resetPassword);
router.post("/new-password", resetNewPassword);
router.post("/logout", logoutUser);
router.patch("/profile/url", protect, updateProfileUrl);
router.patch("/period-start-date/update", protect, updatePeriodStartDate);

export default router;
