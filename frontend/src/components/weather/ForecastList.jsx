import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ForecastCard from "./ForecastCard";

export default function ForecastList({ daily, unit }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  // Scroll state tracking
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

  // Auto-scroll to today's card on load
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !daily?.time?.length) return;

    // Today is index 0 — scroll to start
    // If we later want "scroll so today is leftmost", change to el.scrollTo({ left: 0 })
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ left: 0, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [daily]);

  // Keyboard arrows (only when forecast is in view and focusable region active)
  useEffect(() => {
    const onKey = (e) => {
      const el = scrollRef.current;
      if (!el) return;

      // Don't hijack typing in inputs
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Only respond if user isn't in command palette
      if (document.querySelector("[cmdk-root]")) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByDirection("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByDirection("right");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollByDirection = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Drag-to-scroll handlers
  const onPointerDown = (e) => {
    // Only for mouse/pen — touch already scrolls natively
    if (e.pointerType === "touch") return;

    const el = scrollRef.current;
    if (!el) return;

    dragState.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.active) return;

    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;

    el.scrollLeft = dragState.current.startScrollLeft - dx;
  };

  const onPointerUp = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.active = false;
    setIsDragging(false);
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Prevent click after drag (so clicking a card doesn't fire if user dragged)
  const onClickCapture = (e) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll forecast left"
            className="glass w-8 h-8 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection("right")}
            disabled={!canScrollRight}
            aria-label="Scroll forecast right"
            className="glass w-8 h-8 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left fade mask */}
        <div
          className="absolute left-0 top-0 bottom-3 w-10 z-10 pointer-events-none transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary), transparent)",
            opacity: canScrollLeft ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Right fade mask */}
        <div
          className="absolute right-0 top-0 bottom-3 w-10 z-10 pointer-events-none transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(to left, var(--bg-primary), transparent)",
            opacity: canScrollRight ? 1 : 0,
          }}
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          className={`flex gap-3 overflow-x-auto pb-3 scrollbar-hidden ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{
            scrollSnapType: isDragging ? "none" : "x proximity",
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
      </div>
    </section>
  );
}
