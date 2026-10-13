import express from "express";
import { cacheMiddleware } from "../middleware/cache.js";
import {
  getCurrent,
  getForecast,
  getByCoords,
} from "../controllers/weatherController.js";

const router = express.Router();

router.get("/current/:city", cacheMiddleware, getCurrent);
router.get("/forecast/:city", cacheMiddleware, getForecast);
router.get("/coords", cacheMiddleware, getByCoords);

export default router;
