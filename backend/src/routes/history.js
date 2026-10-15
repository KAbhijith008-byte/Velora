import express from "express";
import {
  getHistory,
  addHistory,
  clearHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getHistory);
router.post("/", addHistory);
router.delete("/", clearHistory);

export default router;
