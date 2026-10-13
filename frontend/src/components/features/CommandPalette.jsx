import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Thermometer,
  Trash2,
  Share2,
  Compass,
  Command as CommandIcon,
} from "lucide-react";

export default function CommandPalette({
  open,
  setOpen,
  history,
  onSearchCity,
  onToggleUnit,
  onClearHistory,
  onUseLocation,
}) {
  const run = (fn) => {
    setOpen(false);
    setTimeout(fn, 50);
  };

  const popularCities = ["Mumbai", "London", "Tokyo", "New York", "Paris"];
  const cities = Array.from(new Set([...history, ...popularCities]));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Command
              label="Command Palette"
              className="glass overflow-hidden"
              style={{ background: "rgba(11, 16, 32, 0.95)" }}
            >
              <Command.Input
                placeholder="Search cities or type a command..."
                className="w-full px-5 py-4 bg-transparent outline-none text-base border-b"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              />

              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty
                  className="px-4 py-6 text-center text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Cities"
                  className="text-xs uppercase tracking-widest px-3 py-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cities.map((city) => (
                    <Command.Item
                      key={city}
                      onSelect={() => run(() => onSearchCity(city))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <MapPin size={15} style={{ color: "var(--accent)" }} />
                      {city}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Actions"
                  className="text-xs uppercase tracking-widest px-3 py-2 mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Command.Item
                    onSelect={() => run(onToggleUnit)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Thermometer size={15} style={{ color: "var(--accent)" }} />
                    Toggle temperature unit
                  </Command.Item>

                  <Command.Item
                    onSelect={() => run(onUseLocation)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Compass size={15} style={{ color: "var(--accent)" }} />
                    Use my location
                  </Command.Item>

                  <Command.Item
                    onSelect={() => run(onClearHistory)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Trash2 size={15} style={{ color: "var(--accent)" }} />
                    Clear search history
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div
                className="flex items-center justify-between px-4 py-2 text-xs border-t"
                style={{
                  color: "var(--text-muted)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <span>↑↓ navigate · ⏎ select · esc close</span>
                <span className="flex items-center gap-1">
                  <CommandIcon size={12} /> K
                </span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
