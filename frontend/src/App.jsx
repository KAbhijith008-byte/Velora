import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/weather/SearchBar";
import CurrentWeather from "./components/weather/CurrentWeather";
import WeatherDetails from "./components/weather/WeatherDetails";
import ForecastList from "./components/weather/ForecastList";
import HourlyChart from "./components/weather/HourlyChart";
import Skeleton from "./components/states/Skeleton";
import ErrorMessage from "./components/states/ErrorMessage";
import OfflineBanner from "./components/states/OfflineBanner";
import UnitToggle from "./components/features/UnitToggle";
import SoundToggle from "./components/features/SoundToggle";
import HistoryChips from "./components/features/HistoryChips";
import ShareCard from "./components/features/ShareCard";
import CommandPalette from "./components/features/CommandPalette";
import WeatherBackground from "./components/visuals/WeatherBackground";
import { useCurrentWeather, useForecast } from "./hooks/useWeather";
import { useUnit } from "./hooks/useUnit";
import { useHistory } from "./hooks/useHistory";
import { useCommandPalette } from "./hooks/useCommandPalette";
import { useSound } from "./hooks/useSound";
import { useStream } from "./hooks/useStream";
import { usePrefetch } from "./hooks/usePrefetch";
import { getGradient, codeToCondition } from "./utils/weatherMap";
import { getAccentForTemp } from "./utils/color";
import ErrorBoundary from "./components/ui/ErrorBoundary";


export default function App() {
  const [city, setCity] = useState("");
  const { unit, toggleUnit } = useUnit();
  const { history, addToHistory, clearHistory } = useHistory();
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  const currentQuery = useCurrentWeather(city);
  const forecastQuery = useForecast(city);

  const loading = currentQuery.isLoading || forecastQuery.isLoading;
  const error =
    currentQuery.error?.message || forecastQuery.error?.message || null;
  const hasData = currentQuery.data && forecastQuery.data;

  const condition = currentQuery.data
    ? codeToCondition(currentQuery.data.current.weather_code)
    : "Clear";

  const { soundEnabled, toggleSound, soundUnavailable } = useSound(condition);

  // Real-time SSE updates
  useStream(city, useCallback(() => {}, []));

  // Prefetch top 3 history cities on idle
  usePrefetch(history);

  // Dynamic accent color
  useEffect(() => {
    if (currentQuery.data?.current?.temperature_2m !== undefined) {
      const accent = getAccentForTemp(currentQuery.data.current.temperature_2m);
      document.documentElement.style.setProperty("--accent", accent);
    }
  }, [currentQuery.data]);

  const gradient = getGradient(condition);

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    addToHistory(searchedCity);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather/coords?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to fetch weather");
          }
          const data = await res.json();
          const detected = data.location.city || "Your location";
          handleSearch(detected);
        } catch (err) {
          alert(`Could not fetch weather: ${err.message}`);
        }
      },
      (err) => {
        const messages = {
          1: "Location permission denied. Enable it in browser settings.",
          2: "Location unavailable. Check your GPS or network.",
          3: "Location request timed out. Try again.",
        };
        alert(messages[err.code] || "Location error");
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-8 pb-16 relative overflow-hidden">
      <WeatherBackground
        weatherCode={currentQuery.data?.current?.weather_code}
      />

      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-all duration-700"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      <header className="w-full max-w-3xl flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <svg
            width="44"
            height="44"
            viewBox="0 0 72 72"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M50 26 A22 22 0 1 0 40 50"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M28 48 Q20 48 20 42 Q20 36 27 36 Q28 30 35 30 Q42 30 43 36 Q50 36 50 42 Q50 48 42 48 Z"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="32" cy="55" r="1.5" fill="#60a5fa" />
            <circle cx="38" cy="58" r="1.5" fill="#60a5fa" />
            <circle cx="44" cy="55" r="1.5" fill="#60a5fa" />
          </svg>
          <div>
            <h1 className="text-xl font-semibold tracking-wide">VELORA</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Weather, with a feeling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasData && (
            <ShareCard
              current={currentQuery.data.current}
              location={currentQuery.data.location}
              unit={unit}
            />
          )}
          <SoundToggle
            enabled={soundEnabled}
            onToggle={toggleSound}
            unavailable={soundUnavailable}
          />
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </div>
      </header>

      <div className="w-full max-w-3xl relative z-10">
        <SearchBar
          onSearch={handleSearch}
          onUseLocation={handleLocation}
          loading={loading}
        />

        <HistoryChips
          history={history}
          onSelect={handleSearch}
          onClear={clearHistory}
        />

        <main>
          {!city && (
            <div className="glass px-8 py-10 text-center max-w-md mx-auto">
              <p className="text-base mb-2">Search a city to begin</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Try Mumbai, London, Tokyo, or New York.
              </p>
              <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                Tip: press ⌘K / Ctrl+K for the command palette
              </p>
            </div>
          )}

          {city && loading && <Skeleton />}

          {city && error && !loading && (
            <ErrorMessage
              message={error}
              onRetry={() => {
                currentQuery.refetch();
                forecastQuery.refetch();
              }}
            />
          )}

          {city && hasData && !loading && !error && (
  <>
    <ErrorBoundary label="Current weather failed">
      <CurrentWeather data={currentQuery.data} unit={unit} />
    </ErrorBoundary>

    <ErrorBoundary label="Details failed">
      <WeatherDetails current={currentQuery.data.current} />
    </ErrorBoundary>

    <ErrorBoundary label="Hourly chart failed">
      <HourlyChart hourly={forecastQuery.data.hourly} unit={unit} />
    </ErrorBoundary>

    <ErrorBoundary label="Forecast failed">
      <ForecastList daily={forecastQuery.data.daily} unit={unit} />
    </ErrorBoundary>
  </>
)}

        </main>
      </div>

      <footer
        className="mt-16 text-xs relative z-10"
        style={{ color: "var(--text-muted)" }}
      >
        Velora · Weather, with a feeling.
      </footer>

    <ErrorBoundary label="Command palette failed">
      <CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        history={history}
        onSearchCity={handleSearch}
        onToggleUnit={toggleUnit}
        onClearHistory={clearHistory}
        onUseLocation={handleLocation}
      />
      </ErrorBoundary>
      

      <OfflineBanner />
    </div>
  );
}
