import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";

dotenv.config();

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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Velora API running at http://localhost:${PORT}`);
});
