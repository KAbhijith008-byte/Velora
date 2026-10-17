import "dotenv/config"; 
import express from "express";
import cors from "cors";

import weatherRoutes from "./routes/weather.js";
import streamRoutes from "./routes/stream.js";
import historyRoutes from "./routes/history.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { startPoller } from "./services/poller.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://velora-henna-sigma.vercel.app", // ← replace with your real Vercel URL
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl, mobile, same-origin
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "velora-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/weather", apiLimiter, weatherRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/history", apiLimiter, historyRoutes);

// TEMPORARY DEBUG ROUTE
app.get("/debug-weather", async (req, res) => {
  try {
    console.log("Fetching Open-Meteo...");
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m");
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("DEBUG FETCH ERROR:", err);
    res.status(500).json({ 
      error: err.message, 
      cause: err.cause?.message || err.cause || "No cause" 
    });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Velora API running at http://localhost:${PORT}`);
  startPoller();
});
