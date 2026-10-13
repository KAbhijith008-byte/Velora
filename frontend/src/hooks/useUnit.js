import { useLocalStorage } from "./useLocalStorage";

export function useUnit() {
  const [unit, setUnit] = useLocalStorage("velora:unit", "C");

  const toggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));

  return { unit, setUnit, toggleUnit };
}
