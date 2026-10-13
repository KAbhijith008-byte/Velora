import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass max-w-md mx-auto px-6 py-8 text-center">
      <AlertCircle
        size={32}
        className="mx-auto mb-3"
        style={{ color: "#f87171" }}
      />

      <p className="text-base mb-1">Something went wrong</p>

      <p
        className="text-sm mb-5"
        style={{ color: "var(--text-secondary)" }}
      >
        {message || "Please try again."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-sm"
          style={{
            background: "var(--accent)",
            color: "#0b1020",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
