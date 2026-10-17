const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = process.env.OPENWEATHER_API_KEY;

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
  if (!API_KEY) throw new Error("OPENWEATHER_API_KEY is missing");

  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;

  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`Geocoding returned ${res.status}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      throw Object.assign(new Error(`City "${city}" not found`), { status: 404 });
    }

    const { lat, lon, name, country, state } = data[0];
    return { latitude: lat, longitude: lon, city: name, country, countryCode: country, region: state || null };
  } catch (err) {
    console.error("🚨 GEOCODE ERROR:", err.message);
    throw Object.assign(new Error("Geocoding service unavailable"), { status: 502 });
  }
}

export async function fetchWeather(lat, lon) {
  if (!API_KEY) throw new Error("OPENWEATHER_API_KEY is missing");

  const currentUrl = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const forecastUrl = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetchWithTimeout(currentUrl),
      fetchWithTimeout(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`Weather API returned ${currentRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Map OpenWeatherMap data to the format your frontend expects
    const weather = {
      current: {
        temperature_2m: currentData.main.temp,
        relative_humidity_2m: currentData.main.humidity,
        apparent_temperature: currentData.main.feels_like,
        precipitation: currentData.rain?.["1h"] || 0,
        weather_code: currentData.weather[0].id,
        cloud_cover: currentData.clouds.all,
        pressure_msl: currentData.main.pressure,
        wind_speed_10m: currentData.wind.speed * 3.6, // Convert m/s to km/h
        wind_direction_10m: currentData.wind.deg,
      },
      hourly: {
        time: forecastData.list.slice(0, 24).map(item => item.dt_txt),
        temperature_2m: forecastData.list.slice(0, 24).map(item => item.main.temp),
        precipitation_probability: forecastData.list.slice(0, 24).map(item => item.pop * 100),
        weather_code: forecastData.list.slice(0, 24).map(item => item.weather[0].id),
      },
      daily: {
        time: [],
        weather_code: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
      }
    };

    // Group 3-hour forecast into 7 days
    const dailyMap = {};
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { max: -999, min: 999, code: item.weather[0].id };
      }
      dailyMap[date].max = Math.max(dailyMap[date].max, item.main.temp_max);
      dailyMap[date].min = Math.min(dailyMap[date].min, item.main.temp_min);
    });

    Object.keys(dailyMap).forEach(date => {
      weather.daily.time.push(date);
      weather.daily.weather_code.push(dailyMap[date].code);
      weather.daily.temperature_2m_max.push(dailyMap[date].max);
      weather.daily.temperature_2m_min.push(dailyMap[date].min);
    });

    return weather;
  } catch (err) {
    console.error("🚨 WEATHER ERROR:", err.message);
    throw Object.assign(new Error("Weather service unavailable"), { status: 502 });
  }
}