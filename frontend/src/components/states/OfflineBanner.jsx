import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[200] glass px-4 py-2 text-sm flex items-center gap-2"
          style={{ background: "rgba(180, 83, 9, 0.85)" }}
        >
          <WifiOff size={14} />
          You're offline — showing last saved data
        </motion.div>
      )}
    </AnimatePresence>
  );
}
