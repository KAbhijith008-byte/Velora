import "dotenv/config"; 
import express from "express";
import cors from "cors";

import weatherRoutes from "./routes/weather.js";
import streamRoutes from "./routes/stream.js";
import historyRoutes from "./routes/history.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { startPoller } from "./services/poller.js";

const app = express();
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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Velora API running at http://localhost:${PORT}`);
  startPoller();
});
