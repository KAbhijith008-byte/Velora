import { useLocalStorage } from "./useLocalStorage";

const MAX_HISTORY = 5;

export function useHistory() {
  const [history, setHistory] = useLocalStorage("velora:history", []);

  const addToHistory = (city) => {
    if (!city) return;
    const normalized = city.trim();
    if (!normalized) return;

    setHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== normalized.toLowerCase()
      );
      return [normalized, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addToHistory, clearHistory };
}
