import ForecastCard from "./ForecastCard";

export default function ForecastList({ daily, unit }) {
  if (!daily?.time?.length) return null;

  return (
    <section aria-labelledby="forecast-heading" className="w-full">
      <h2
        id="forecast-heading"
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        7-Day Forecast
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {daily.time.map((date, i) => (
          <ForecastCard
            key={date}
            day={{
              time: date,
              weather_code: daily.weather_code[i],
              temperature_2m_max: daily.temperature_2m_max[i],
              temperature_2m_min: daily.temperature_2m_min[i],
            }}
            index={i}
            unit={unit}
          />
        ))}
      </div>
    </section>
  );
}
