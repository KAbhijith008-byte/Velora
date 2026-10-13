import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function SearchBar({ onSearch, onUseLocation, loading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-xl mx-auto mb-8"
    >
      <div className="glass flex items-center flex-1 px-4 py-3 gap-3">
        <Search size={18} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search a city..."
          aria-label="Search for a city"
          className="flex-1 bg-transparent outline-none text-base placeholder:text-white/40"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="glass px-4 py-3 hover:brightness-125 transition disabled:opacity-50"
        aria-label="Search"
      >
        Go
      </button>

      <button
        type="button"
        onClick={onUseLocation}
        className="glass px-4 py-3 hover:brightness-125 transition"
        aria-label="Use my location"
        title="Use my location"
      >
        <MapPin size={18} />
      </button>
    </form>
  );
}
