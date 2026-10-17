const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Helper to prevent the fetch from hanging forever
async function fetchWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function geocodeCity(city) {
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  try {
    const res = await fetchWithTimeout(url);
    
    if (!res.ok) {
      throw Object.assign(new Error("Geocoding service unavailable"), { status: 502 });
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw Object.assign(new Error(`City "${city}" not found`), { status: 404 });
    }

    const { latitude, longitude, name, country, country_code, admin1 } = data.results[0];

    return { latitude, longitude, city: name, country, countryCode: country_code, region: admin1 || null };
  } catch (err) {
    console.error("Geocode Error:", err.name, err.message);
    throw Object.assign(new Error("Geocoding service unavailable"), { status: 502 });
  }
}

export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: ["temperature_2m","relative_humidity_2m","apparent_temperature","is_day","precipitation","weather_code","cloud_cover","pressure_msl","wind_speed_10m","wind_direction_10m"].join(","),
    hourly: ["temperature_2m","precipitation_probability","weather_code"].join(","),
    daily: ["weather_code","temperature_2m_max","temperature_2m_min","sunrise","sunset","precipitation_probability_max"].join(","),
    timezone: "auto",
    forecast_days: 7,
  });

  const url = `${WEATHER_URL}?${params}`;

  try {
    const res = await fetchWithTimeout(url);
    
    if (!res.ok) {
      throw Object.assign(new Error("Weather service unavailable"), { status: 502 });
    }
    
    return res.json();
  } catch (err) {
    console.error("Weather Fetch Error:", err.name, err.message);
    throw Object.assign(new Error("Weather service unavailable"), { status: 502 });
  }
}

export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || null,
      country: data.countryName || "",
      countryCode: data.countryCode || "",
      region: data.principalSubdivision || null,
    };
  } catch (err) {
    console.error("Reverse Geocode Error:", err.name, err.message);
    return null;
  }
}
