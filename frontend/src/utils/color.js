/**
 * Interpolate accent color based on temperature.
 * Cold (-10°C) → icy blue
 * Cool (10°C)  → soft teal
 * Mild (20°C)  → warm amber
 * Hot (35°C)   → deep orange
 */
export function getAccentForTemp(temp) {
  const stops = [
    { t: -10, r: 96,  g: 165, b: 250 }, // #60a5fa icy blue
    { t: 10,  r: 94,  g: 234, b: 212 }, // #5eead4 soft teal
    { t: 20,  r: 245, g: 158, b: 11  }, // #f59e0b amber
    { t: 35,  r: 234, g: 88,  b: 12  }, // #ea580c deep orange
  ];

  const clamped = Math.max(-10, Math.min(35, temp));

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];

    if (clamped >= a.t && clamped <= b.t) {
      const ratio = (clamped - a.t) / (b.t - a.t);
      const r = Math.round(a.r + (b.r - a.r) * ratio);
      const g = Math.round(a.g + (b.g - a.g) * ratio);
      const bl = Math.round(a.b + (b.b - a.b) * ratio);
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }

  return "rgb(245, 158, 11)";
}
