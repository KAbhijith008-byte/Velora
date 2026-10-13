import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useCurrentWeather(city) {
  return useQuery({
    queryKey: ["weather", "current", city],
    queryFn: () => api.getCurrent(city),
    enabled: !!city,
  });
}

export function useForecast(city) {
  return useQuery({
    queryKey: ["weather", "forecast", city],
    queryFn: () => api.getForecast(city),
    enabled: !!city,
  });
}

export function codeToCondition(code) {
  if (code === 0 || code === 1) return "Clear";
  if (code === 2 || code === 3) return "Clouds";
  if (code === 45 || code === 48) return "Mist";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Clear";
}
