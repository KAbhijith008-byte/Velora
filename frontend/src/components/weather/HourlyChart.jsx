import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatHour, formatTemp } from "../../utils/temperature";

export default function HourlyChart({ hourly, unit }) {
  if (!hourly?.time?.length) return null;

  // Next 24 hours = first 24 entries
  const data = hourly.time.slice(0, 24).map((iso, i) => ({
    time: formatHour(iso),
    temp: hourly.temperature_2m[i],
    precip: hourly.precipitation_probability?.[i] ?? 0,
  }));

  const temps = data.map((d) => d.temp);
  const minTemp = Math.floor(Math.min(...temps) - 2);
  const maxTemp = Math.ceil(Math.max(...temps) + 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass px-5 py-6 mb-8"
      aria-labelledby="hourly-heading"
    >
      <h2
        id="hourly-heading"
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Next 24 Hours
      </h2>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              domain={[minTemp, maxTemp]}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatTemp(v, unit)}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(11, 16, 32, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "var(--text-primary)",
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (name === "temp") return [formatTemp(value, unit), "Temp"];
                if (name === "precip") return [`${value}%`, "Rain"];
                return [value, name];
              }}
              labelStyle={{ color: "var(--text-secondary)" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "var(--accent)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
