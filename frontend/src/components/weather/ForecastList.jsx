import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ForecastCard from "./ForecastCard";

export default function ForecastList({ daily, unit }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [daily, updateScrollState]);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!daily?.time?.length) return null;

  return (
    <section aria-labelledby="forecast-heading" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="forecast-heading"
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          7-Day Forecast
        </h2>

        {/* Scroll buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll forecast left"
            className="glass w-8 h-8 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            aria-label="Scroll forecast right"
            className="glass w-8 h-8 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 scroll-smooth scrollbar-hidden"
        
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.15) transparent",
        }}
      >
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
