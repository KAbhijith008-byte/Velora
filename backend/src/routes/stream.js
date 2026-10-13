import express from "express";
import { geocodeCity, fetchWeather } from "../services/weatherService.js";

const router = express.Router();

const clients = new Map(); // city -> Set<res>

router.get("/", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "city required" });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  const key = city.toLowerCase();
  if (!clients.has(key)) clients.set(key, new Set());
  clients.get(key).add(res);

  // Initial push
  try {
    const loc = await geocodeCity(city);
    const data = await fetchWeather(loc.latitude, loc.longitude);
    res.write(
      `data: ${JSON.stringify({ location: loc, current: data.current })}\n\n`
    );
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
  }

  // Heartbeat — keeps proxies from killing the connection
  const heartbeat = setInterval(() => res.write(":\n\n"), 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    const subs = clients.get(key);
    if (subs) {
      subs.delete(res);
      if (subs.size === 0) clients.delete(key);
    }
  });
});

export function broadcastToCity(city, payload) {
  const subs = clients.get(city.toLowerCase());
  if (!subs) return;
  const msg = `data: ${JSON.stringify(payload)}\n\n`;
  subs.forEach((res) => res.write(msg));
}

export { clients };
export default router;
