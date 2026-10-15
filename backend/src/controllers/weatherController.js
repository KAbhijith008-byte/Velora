import { geocodeCity, fetchWeather, reverseGeocode } from "../services/weatherService.js";/**
 * GET /api/weather/current/:city
 */
export async function getCurrent(req, res, next) {
  try {
    const { city } = req.params;
    const location = await geocodeCity(city);
    const weather = await fetchWeather(location.latitude, location.longitude);

    res.json({
      location,
      current: weather.current,
      units: weather.current_units,
      timezone: weather.timezone,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/weather/forecast/:city
 */
export async function getForecast(req, res, next) {
  try {
    const { city } = req.params;
    const location = await geocodeCity(city);
    const weather = await fetchWeather(location.latitude, location.longitude);

    res.json({
      location,
      daily: weather.daily,
      dailyUnits: weather.daily_units,
      hourly: weather.hourly,
      hourlyUnits: weather.hourly_units,
      timezone: weather.timezone,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/weather/coords?lat=..&lon=..
 */
export async function getByCoords(req, res, next) {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      throw Object.assign(new Error("Missing lat or lon"), { status: 400 });
    }

    const weather = await fetchWeather(lat, lon);
    const place = await reverseGeocode(lat, lon);

    res.json({
      location: {
        latitude: Number(lat),
        longitude: Number(lon),
        city: place?.city || "Your location",
        country: place?.country || "",
        countryCode: place?.countryCode || "",
        region: place?.region || null,
      },
      current: weather.current,
      units: weather.current_units,
      timezone: weather.timezone,
    });
  } catch (err) {
    next(err);
  }
}
