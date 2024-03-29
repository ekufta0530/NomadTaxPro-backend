import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFavoriteCountry,
  removeFavoriteCountry,
  getFavoriteCountries,
  addUpdateStay,
  getStays,
  getRequestedCountry,
} from "../controllers/countryController.js";

const router = express.Router();

router.post("/favorite/add", protect, addFavoriteCountry);
router.post("/favorite/remove", protect, removeFavoriteCountry);
router.post("/favorite/get", protect, getFavoriteCountries);
router.post("/stay/add-update", protect, addUpdateStay);
router.post("/stay/get", protect, getStays);
router.post("/request-info", protect, getRequestedCountry);

export default router;
