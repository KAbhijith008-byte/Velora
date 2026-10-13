// Open-Meteo WMO weather codes → human label + emoji fallback
export const WEATHER_CODES = {
  0:  { label: "Clear sky",       condition: "Clear",        icon: "☀️" },
  1:  { label: "Mainly clear",    condition: "Clear",        icon: "🌤️" },
  2:  { label: "Partly cloudy",   condition: "Clouds",       icon: "⛅" },
  3:  { label: "Overcast",        condition: "Clouds",       icon: "☁️" },
  45: { label: "Fog",             condition: "Mist",         icon: "🌫️" },
  48: { label: "Rime fog",        condition: "Mist",         icon: "🌫️" },
  51: { label: "Light drizzle",   condition: "Drizzle",      icon: "🌦️" },
  53: { label: "Drizzle",         condition: "Drizzle",      icon: "🌦️" },
  55: { label: "Dense drizzle",   condition: "Drizzle",      icon: "🌧️" },
  61: { label: "Light rain",      condition: "Rain",         icon: "🌧️" },
  63: { label: "Rain",            condition: "Rain",         icon: "🌧️" },
  65: { label: "Heavy rain",      condition: "Rain",         icon: "🌧️" },
  71: { label: "Light snow",      condition: "Snow",         icon: "🌨️" },
  73: { label: "Snow",            condition: "Snow",         icon: "❄️" },
  75: { label: "Heavy snow",      condition: "Snow",         icon: "❄️" },
  77: { label: "Snow grains",     condition: "Snow",         icon: "🌨️" },
  80: { label: "Rain showers",    condition: "Rain",         icon: "🌦️" },
  81: { label: "Rain showers",    condition: "Rain",         icon: "🌧️" },
  82: { label: "Violent showers", condition: "Rain",         icon: "⛈️" },
  85: { label: "Snow showers",    condition: "Snow",         icon: "🌨️" },
  86: { label: "Snow showers",    condition: "Snow",         icon: "❄️" },
  95: { label: "Thunderstorm",    condition: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm",    condition: "Thunderstorm", icon: "⛈️" },
  99: { label: "Thunderstorm",    condition: "Thunderstorm", icon: "⛈️" },
};

export function getWeather(code) {
  return (
    WEATHER_CODES[code] || {
      label: "Unknown",
      condition: "Clear",
      icon: "❔",
    }
  );
}

// Gradient map for dynamic background
export const CONDITION_GRADIENTS = {
  Clear:        "radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.35), transparent 60%)",
  Clouds:       "radial-gradient(circle at 50% 20%, rgba(148, 163, 184, 0.25), transparent 60%)",
  Mist:         "radial-gradient(circle at 50% 20%, rgba(148, 163, 184, 0.18), transparent 60%)",
  Drizzle:      "radial-gradient(circle at 50% 20%, rgba(96, 165, 250, 0.25), transparent 60%)",
  Rain:         "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.30), transparent 60%)",
  Snow:         "radial-gradient(circle at 50% 20%, rgba(226, 232, 240, 0.28), transparent 60%)",
  Thunderstorm: "radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.35), transparent 60%)",
};

export function getGradient(condition) {
  return CONDITION_GRADIENTS[condition] || CONDITION_GRADIENTS.Clear;
}

export function codeToCondition(code) {
  if (code === 0 || code === 1) return "Clear";
  if (code === 2 || code === 3) return "Clouds";
  if (code === 45 || code === 48) return "Mist";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Clear";
}
