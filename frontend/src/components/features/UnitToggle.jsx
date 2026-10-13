import { motion } from "framer-motion";

export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="glass px-1 py-1 flex items-center gap-1 text-sm relative"
      aria-label={`Switch to °${unit === "C" ? "F" : "C"}`}
      title="Toggle temperature unit"
    >
      {["C", "F"].map((u) => (
        <span
          key={u}
          className="relative px-3 py-1 rounded-md z-10"
          style={{
            color: unit === u ? "#0b1020" : "var(--text-secondary)",
            fontWeight: unit === u ? 600 : 400,
          }}
        >
          °{u}
        </span>
      ))}

      <motion.div
        layout
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md z-0"
        style={{
          background: "var(--accent)",
          left: unit === "C" ? "4px" : "calc(50% + 0px)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </button>
  );
}
