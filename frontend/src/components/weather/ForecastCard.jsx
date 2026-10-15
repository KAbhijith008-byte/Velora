import { motion } from "framer-motion";
import { getWeather } from "../../utils/weatherMap";
import { formatTemp, formatDay, formatDate } from "../../utils/temperature";

export default function ForecastCard({ day, index, unit }) {
  const weather = getWeather(day.weather_code);
  const high = day.temperature_2m_max;
  const low = day.temperature_2m_min;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass px-4 py-5 text-center min-w-[120px]"
    >
      <p
        className="text-xs uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {formatDay(day.time, index)}
      </p>

      <p
        className="text-[10px] tracking-wide mb-2"
        style={{ color: "var(--text-muted)", opacity: 0.7 }}
      >
        {formatDate(day.time)}
      </p>

      <div className="text-3xl mb-3" aria-hidden="true">
        {weather.icon}
      </div>

      <p className="text-lg font-medium">{formatTemp(high, unit)}</p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {formatTemp(low, unit)}
      </p>
    </motion.div>
  );
}
