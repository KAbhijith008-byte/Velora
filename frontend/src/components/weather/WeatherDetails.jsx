import { motion } from "framer-motion";
import { Droplets, Wind, Gauge, Cloud } from "lucide-react";
import { windDirection } from "../../utils/temperature";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

function DetailCard({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="glass px-5 py-4 flex items-center gap-4"
    >
      <Icon size={22} style={{ color: "var(--accent)" }} />
      <div className="text-left">
        <p
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </motion.div>
  );
}

export default function WeatherDetails({ current }) {
  const details = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${Math.round(current.wind_speed_10m)} km/h ${windDirection(
        current.wind_direction_10m
      )}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${Math.round(current.pressure_msl)} hPa`,
    },
    {
      icon: Cloud,
      label: "Cloud cover",
      value: `${current.cloud_cover}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {details.map((d, i) => (
        <DetailCard key={d.label} {...d} index={i} />
      ))}
    </div>
  );
}
