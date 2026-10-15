import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../services/api";

const CACHE_KEY = "velora:history-cache";
const MAX_HISTORY = 8;

/**
 * History synced with the backend (Neon).
 * Optimistic UI: updates immediately, syncs in background.
 * Falls back to localStorage if the API fails.
 */
export function useHistory() {
  // Load from localStorage cache immediately for instant paint
  const [history, setHistory] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [synced, setSynced] = useState(false);
  const syncingRef = useRef(false);

  // Fetch from backend on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getHistory(MAX_HISTORY);
        if (cancelled) return;
        const cities = data.history.map((h) => h.city);
        setHistory(cities);
        setSynced(true);
      } catch (err) {
        console.warn("History sync failed, using localStorage:", err.message);
        setSynced(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist to localStorage whenever history changes (cache for offline)
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(history));
    } catch {
      // ignore quota errors
    }
  }, [history]);

  const addToHistory = useCallback(async (city) => {
    if (!city) return;
    const trimmed = city.trim();
    if (!trimmed) return;

    // Optimistic update — happens instantly
    setHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...filtered].slice(0, MAX_HISTORY);
    });

    // Sync in background
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      await api.addHistory(trimmed);
    } catch (err) {
      console.warn("Failed to sync history to backend:", err.message);
    } finally {
      syncingRef.current = false;
    }
  }, []);

  const clearHistory = useCallback(async () => {
    // Optimistic clear
    setHistory([]);
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}

    try {
      await api.clearHistory();
    } catch (err) {
      console.warn("Failed to clear backend history:", err.message);
    }
  }, []);

  return { history, addToHistory, clearHistory, synced };
}