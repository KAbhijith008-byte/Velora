import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.js";
import streamRoutes from "./routes/stream.js";
import historyRoutes from "./routes/history.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { startPoller } from "./services/poller.js";

dotenv.config();

// 1. Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Routes
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "velora-api",
    timestamp: new Date().toISOString(),
  });
});

// Temporary Network Test Route
app.get("/ping-api", async (req, res) => {
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m");
    const text = await response.text();
    res.status(200).send(`SUCCESS! Open-Meteo says: ${text.substring(0, 100)}`);
  } catch (err) {
    res.status(500).send(`FAILED! Real error: ${err.name} - ${err.message} | Cause: ${err.cause || 'none'}`);
  }
});

app.use("/api/weather", apiLimiter, weatherRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/history", apiLimiter, historyRoutes);

// 4. Error Handler (must be last)
app.use(errorHandler);

// 5. Start Server
app.listen(PORT, () => {
  console.log(`✅ Velora API running at http://localhost:${PORT}`);
  startPoller();
});