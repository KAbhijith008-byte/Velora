import { useEffect, useRef } from "react";
import { codeToCondition } from "../../utils/weatherMap";

export default function WeatherBackground({ weatherCode }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const conditionRef = useRef("Clear");

  useEffect(() => {
    const condition = weatherCode !== undefined
      ? codeToCondition(weatherCode)
      : "Clear";
    conditionRef.current = condition;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      spawnParticles();
    };

    const spawnParticles = () => {
      const w = canvas.width;
      const h = canvas.height;
      const condition = conditionRef.current;

      if (["Rain", "Drizzle", "Thunderstorm"].includes(condition)) {
        particlesRef.current = Array.from({ length: 140 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 10 + Math.random() * 15,
          speed: 4 + Math.random() * 5,
          opacity: 0.15 + Math.random() * 0.25,
        }));
      } else if (condition === "Snow") {
        particlesRef.current = Array.from({ length: 100 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.5,
          speed: 0.5 + Math.random() * 1.2,
          drift: (Math.random() - 0.5) * 0.6,
          opacity: 0.4 + Math.random() * 0.4,
        }));
      } else if (condition === "Clouds" || condition === "Mist") {
        particlesRef.current = Array.from({ length: 6 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          r: 100 + Math.random() * 140,
          speed: 0.15 + Math.random() * 0.35,
          opacity: 0.04 + Math.random() * 0.06,
        }));
      } else {
        particlesRef.current = [];
      }
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const condition = conditionRef.current;

      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        ctx.globalAlpha = p.opacity;

        if (["Rain", "Drizzle", "Thunderstorm"].includes(condition)) {
          ctx.strokeStyle = "#a5c9ff";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1, p.y + p.len);
          ctx.stroke();
          p.y += p.speed;
          p.x -= 0.3;
          if (p.y > h) {
            p.y = -p.len;
            p.x = Math.random() * w;
          }
        } else if (condition === "Snow") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += p.drift;
          if (p.y > h) p.y = -5;
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;
        } else if (condition === "Clouds" || condition === "Mist") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.speed;
          if (p.x - p.r > w) p.x = -p.r;
        }
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else draw();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [weatherCode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
