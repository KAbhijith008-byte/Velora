export function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemp(celsius, unit = "C") {
  if (celsius === null || celsius === undefined) return "--";
  const value = unit === "F" ? toFahrenheit(celsius) : Math.round(celsius);
  return `${value}°`;
}

export function windDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatDay(isoDate, index) {
  if (index === 0) return "Today";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatHour(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}
export function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
