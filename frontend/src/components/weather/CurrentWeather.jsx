import { motion } from "framer-motion";
import { getWeather } from "../../utils/weatherMap";
import { formatTemp } from "../../utils/temperature";

export default function CurrentWeather({ data, unit }) {
  const { location, current } = data;
  const weather = getWeather(current.weather_code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass px-8 py-8 mb-6 text-center"
    >
      <p
        className="text-sm uppercase tracking-widest mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {location.city}
        {location.country ? `, ${location.country}` : ""}
      </p>

      <div className="text-6xl mb-2" aria-hidden="true">
        {weather.icon}
      </div>

      <p
        className="text-8xl font-light tracking-tight leading-none"
        style={{ fontWeight: 200 }}
      >
        {formatTemp(current.temperature_2m, unit)}
      </p>

      <p
        className="text-lg mt-3"
        style={{ color: "var(--text-secondary)" }}
      >
        {weather.label}
      </p>

      <p
        className="text-sm mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        Feels like {formatTemp(current.apparent_temperature, unit)}
      </p>
    </motion.div>
  );
}
