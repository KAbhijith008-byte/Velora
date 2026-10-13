import { geocodeCity, fetchWeather } from "./weatherService.js";
import { broadcastToCity, clients } from "../routes/stream.js";

const POLL_INTERVAL = 60 * 1000; // every 60 seconds

async function pollOnce() {
  const cities = Array.from(clients.keys());
  if (!cities.length) return;

  for (const city of cities) {
    try {
      const loc = await geocodeCity(city);
      const data = await fetchWeather(loc.latitude, loc.longitude);
      broadcastToCity(city, {
        location: loc,
        current: data.current,
      });
    } catch (err) {
      console.error(`SSE poll failed for ${city}:`, err.message);
    }
  }
}

export function startPoller() {
  setInterval(pollOnce, POLL_INTERVAL);
  console.log("🔄 SSE poller started (60s interval)");
}
