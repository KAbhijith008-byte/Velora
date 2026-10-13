import { useRef, useState } from "react";
import { Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { downloadShareCard } from "../../services/shareImage";
import { getWeather } from "../../utils/weatherMap";
import { formatTemp } from "../../utils/temperature";

export default function ShareCard({ current, location, unit }) {
  const cardRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const weather = getWeather(current.weather_code);

  const handleShare = async () => {
    try {
      setStatus("sharing");
      await downloadShareCard(cardRef.current, location.city);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Couldn't generate the share image. Try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={status === "sharing"}
        className="glass px-4 py-2 flex items-center gap-2 text-sm hover:brightness-125 transition disabled:opacity-50"
        aria-label="Share weather as image"
      >
        {status === "done" ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : (
          <>
            <Share2 size={16} /> Share
          </>
        )}
      </button>

      {/* Hidden capture card — off-screen but rendered */}
      <div
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1920,
            background:
              "linear-gradient(160deg, #0b1020 0%, #131a2e 55%, #0b1020 100%)",
            color: "#f1f5f9",
            padding: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 32,
                letterSpacing: "0.3em",
                color: "rgba(241,245,249,0.55)",
                textTransform: "uppercase",
              }}
            >
              Velora
            </p>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 600,
                marginTop: 40,
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}
            >
              {location.city}
            </h1>
            <p
              style={{
                fontSize: 40,
                color: "rgba(241,245,249,0.65)",
              }}
            >
              {location.country || ""}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 220, lineHeight: 1, marginBottom: 20 }}>
              {weather.icon}
            </div>
            <p
              style={{
                fontSize: 280,
                fontWeight: 200,
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              {formatTemp(current.temperature_2m, unit)}
            </p>
            <p
              style={{
                fontSize: 56,
                marginTop: 30,
                color: "rgba(241,245,249,0.8)",
              }}
            >
              {weather.label}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 32,
              color: "rgba(241,245,249,0.55)",
            }}
          >
            <span>{new Date().toLocaleDateString()}</span>
            <span>velora.weather</span>
          </div>
        </div>
      </div>
    </>
  );
}
