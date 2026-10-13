export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Logo mark */}
      <div className="mb-8 flex items-center gap-4">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          aria-hidden="true"
        >
          {/* Sun arc */}
          <path
            d="M50 26 A22 22 0 1 0 40 50"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cloud */}
          <path
            d="M28 48 Q20 48 20 42 Q20 36 27 36 Q28 30 35 30 Q42 30 43 36 Q50 36 50 42 Q50 48 42 48 Z"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Raindrops */}
          <circle cx="32" cy="55" r="1.5" fill="#60a5fa" />
          <circle cx="38" cy="58" r="1.5" fill="#60a5fa" />
          <circle cx="44" cy="55" r="1.5" fill="#60a5fa" />
        </svg>

        <div>
          <h1 className="text-4xl font-semibold tracking-wide">VELORA</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Weather, with a feeling.
          </p>
        </div>
      </div>

      {/* Hero text */}
      <p
        className="max-w-xl text-center mb-10 text-lg"
        style={{ color: "var(--text-secondary)" }}
      >
        A cinematic weather dashboard that adapts to the sky.
      </p>

      {/* Placeholder card */}
      <div className="glass px-8 py-6 text-center max-w-md w-full">
        <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Coming Soon
        </p>
        <p style={{ color: "var(--text-secondary)" }}>
          Frontend scaffold ready. Search + weather UI lands next.
        </p>
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-6 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Built with care 🌤️
      </p>
    </div>
  );
}
