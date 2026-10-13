import { useState } from "react";
import SearchBar from "./components/weather/SearchBar";
import CurrentWeather from "./components/weather/CurrentWeather";
import WeatherDetails from "./components/weather/WeatherDetails";
import ForecastList from "./components/weather/ForecastList";
import Skeleton from "./components/states/Skeleton";
import ErrorMessage from "./components/states/ErrorMessage";
import { useCurrentWeather, useForecast } from "./hooks/useWeather";
import { getGradient, codeToCondition } from "./utils/weatherMap";

export default function App() {
  const [city, setCity] = useState("");
  const [unit] = useState("C");

  const currentQuery = useCurrentWeather(city);
  const forecastQuery = useForecast(city);

  const loading = currentQuery.isLoading || forecastQuery.isLoading;
  const error =
    currentQuery.error?.message || forecastQuery.error?.message || null;
  const hasData = currentQuery.data && forecastQuery.data;

 const gradient = currentQuery.data
  ? getGradient(codeToCondition(currentQuery.data.current.weather_code))
  : getGradient("Clear");

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
          const data = await res.json();
          setCity(data.location.city || "Mumbai");
        } catch {
          alert("Could not fetch weather for your location");
        }
      },
      () => alert("Location permission denied")
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-12 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-all duration-700"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      <header className="flex items-center gap-4 mb-10">
        <svg
          width="52"
          height="52"
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
          <h1 className="text-2xl font-semibold tracking-wide">VELORA</h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Weather, with a feeling.
          </p>
        </div>
      </header>

      <SearchBar
        onSearch={setCity}
        onUseLocation={handleLocation}
        loading={loading}
      />

      <main className="w-full max-w-3xl">
        {!city && (
          <div className="glass px-8 py-10 text-center max-w-md mx-auto">
            <p className="text-base mb-2">Search a city to begin</p>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Try Mumbai, London, Tokyo, or New York.
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
            <CurrentWeather data={currentQuery.data} unit={unit} />
            <WeatherDetails current={currentQuery.data.current} />
            <ForecastList daily={forecastQuery.data.daily} unit={unit} />
          </>
        )}
      </main>

      <footer
        className="mt-16 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Velora · Weather, with a feeling.
      </footer>
    </div>
  );
}
