import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function usePrefetch(cities) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!cities?.length) return;

    // Respect data saver / slow connections
    const conn = navigator.connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|slow-2g/.test(conn.effectiveType)) return;

    const run = () => {
      cities.slice(0, 3).forEach((city) => {
        queryClient.prefetchQuery({
          queryKey: ["weather", "current", city],
          queryFn: () => api.getCurrent(city),
          staleTime: 5 * 60 * 1000,
        });
        queryClient.prefetchQuery({
          queryKey: ["weather", "forecast", city],
          queryFn: () => api.getForecast(city),
          staleTime: 5 * 60 * 1000,
        });
      });
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(run, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 2000);
    return () => clearTimeout(t);
  }, [cities.join(","), queryClient]);
}
