const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path) {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getCurrent: (city) =>
    request(`/weather/current/${encodeURIComponent(city)}`),
  getForecast: (city) =>
    request(`/weather/forecast/${encodeURIComponent(city)}`),
  getByCoords: (lat, lon) => request(`/weather/coords?lat=${lat}&lon=${lon}`),
};
