import { Volume2, VolumeX, Volume } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoundToggle({ enabled, onToggle, unavailable }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="glass px-3 py-2 flex items-center justify-center hover:brightness-125 transition"
        aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
        title={
          unavailable
            ? "Sound files not available yet"
            : enabled
            ? "Mute ambient sound"
            : "Enable ambient sound"
        }
      >
        {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <AnimatePresence>
        {unavailable && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full right-0 mt-2 glass px-3 py-1.5 text-xs whitespace-nowrap z-50"
            style={{ color: "var(--text-secondary)" }}
          >
            Sound coming soon
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}