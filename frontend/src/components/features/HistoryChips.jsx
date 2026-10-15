import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function HistoryChips({ history, onSelect, onClear }) {
  if (!history.length) return null;

  return (
    <div className="w-full max-w-xl mx-auto mb-6 flex items-center gap-2 flex-wrap">
      <span
        className="text-xs uppercase tracking-widest mr-1"
        style={{ color: "var(--text-muted)" }}
      >
        Recent
      </span>

      <AnimatePresence mode="popLayout">
        {history.map((city) => (
          <motion.button
            key={city}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(city)}
className="glass chip px-3 py-1 text-sm"          >
            {city}
          </motion.button>
        ))}
      </AnimatePresence>

      <button
        onClick={onClear}
        className="ml-1 opacity-50 hover:opacity-100 transition"
        aria-label="Clear history"
        title="Clear history"
      >
        <X size={14} />
      </button>
    </div>
  );
}
