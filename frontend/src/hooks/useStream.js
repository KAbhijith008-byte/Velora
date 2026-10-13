import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export function useStream(city, onUpdate) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!city) return;

    const url = `${API_URL}/stream?city=${encodeURIComponent(city)}`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onUpdate?.(data);
        queryClient.setQueryData(["weather", "current", city], (old) => {
          if (!old) return old;
          return { ...old, current: data.current };
        });
      } catch {
        // ignore malformed
      }
    };

    es.onerror = () => {
      // Browser auto-reconnects; close after a while to avoid zombie connections
      es.close();
    };

    return () => es.close();
  }, [city, onUpdate, queryClient]);
}
