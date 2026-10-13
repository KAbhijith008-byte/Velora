import { useEffect, useRef, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const SOUND_MAP = {
  Rain: "/sounds/rain.mp3",
  Drizzle: "/sounds/rain.mp3",
  Thunderstorm: "/sounds/thunder.mp3",
  Clear: "/sounds/birds.mp3",
  Snow: "/sounds/wind.mp3",
  Clouds: "/sounds/wind.mp3",
  Mist: "/sounds/wind.mp3",
};

export function useSound(condition) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [enabled, setEnabled] = useLocalStorage("velora:sound", false);

  const fadeTo = useCallback((targetVolume, duration = 800) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) clearInterval(fadeRef.current);

    const steps = 30;
    const stepTime = duration / steps;
    const startVol = audio.volume;
    const delta = targetVolume - startVol;
    let step = 0;

    fadeRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(
        0,
        Math.min(1, startVol + delta * (step / steps))
      );
      if (step >= steps) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, stepTime);
  }, []);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  // React to condition + enabled changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!enabled) {
      fadeTo(0, 400);
      setTimeout(() => audio.pause(), 450);
      return;
    }

    const src = SOUND_MAP[condition] || SOUND_MAP.Clear;

    if (audio.src !== window.location.origin + src) {
      audio.src = src;
      audio.currentTime = 0;
    }

    audio.play().then(() => fadeTo(0.22, 900)).catch(() => {
      // Autoplay blocked — user will need to click toggle again
      setEnabled(false);
    });
  }, [condition, enabled, fadeTo, setEnabled]);

  const toggle = () => setEnabled((e) => !e);

  return { soundEnabled: enabled, toggleSound: toggle };
}
