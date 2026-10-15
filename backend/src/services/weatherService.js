const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Convert a city name to coordinates using Open-Meteo Geocoding API.
 */
export async function geocodeCity(city) {
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw Object.assign(new Error("Geocoding service unavailable"), {
      status: 502,
    });
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw Object.assign(new Error(`City "${city}" not found`), {
      status: 404,
    });
  }

  const { latitude, longitude, name, country, country_code, admin1 } =
    data.results[0];

  return {
    latitude,
    longitude,
    city: name,
    country,
    countryCode: country_code,
    region: admin1 || null,
  };
}

/**
 * Fetch current weather + hourly + daily forecast by coordinates.
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_probability_max",
    ].join(","),
    timezone: "auto",
    forecast_days: 7,
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);

  if (!res.ok) {
    throw Object.assign(new Error("Weather service unavailable"), {
      status: 502,
    });
  }

  return res.json();
}
/**
 * Reverse geocode coordinates → city name.
 * Open-Meteo has a separate endpoint for reverse geocoding? No — we use BigDataCloud's free API.
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || null,
      country: data.countryName || "",
      countryCode: data.countryCode || "",
      region: data.principalSubdivision || null,
    };
  } catch {
    return null;
  }
}

