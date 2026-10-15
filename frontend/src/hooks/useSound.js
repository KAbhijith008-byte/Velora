import { useEffect, useRef, useCallback, useState } from "react";
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

const TARGET_VOLUME = 0.22;

export function useSound(condition) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [enabled, setEnabled] = useLocalStorage("velora:sound", false);
  const [unavailable, setUnavailable] = useState(false);

  // Init audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "none";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  const fadeTo = useCallback((target, duration = 800) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) clearInterval(fadeRef.current);

    const steps = 30;
    const stepTime = duration / steps;
    const startVol = audio.volume;
    const delta = target - startVol;
    let step = 0;

    fadeRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(0, Math.min(1, startVol + delta * (step / steps)));
      if (step >= steps) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, stepTime);
  }, []);

  // Check if sound file exists (HEAD request, cheap)
  const checkAudioAvailable = useCallback(async (src) => {
    try {
      const res = await fetch(src, { method: "HEAD" });
      if (!res.ok) return false;
      const type = res.headers.get("content-type") || "";
      return type.startsWith("audio");
    } catch {
      return false;
    }
  }, []);

  // React to condition changes while enabled
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;

    const src = SOUND_MAP[condition] || SOUND_MAP.Clear;
    const fullSrc = window.location.origin + src;

    if (audio.src !== fullSrc) {
      audio.src = src;
      audio.load();
    }

    audio.play().then(() => fadeTo(TARGET_VOLUME)).catch((err) => {
      console.warn("Sound play failed:", err.message);
    });
  }, [condition, enabled, fadeTo]);

  // Toggle — play() runs inside click handler for autoplay allowance
  const toggleSound = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      fadeTo(0, 400);
      setTimeout(() => audio.pause(), 420);
      setEnabled(false);
      return;
    }

    const src = SOUND_MAP[condition] || SOUND_MAP.Clear;

    // Check if file exists
    const available = await checkAudioAvailable(src);
    if (!available) {
      setUnavailable(true);
      setTimeout(() => setUnavailable(false), 4000);
      return;
    }

    audio.src = src;
    audio.load();

    try {
      await audio.play();
      fadeTo(TARGET_VOLUME);
      setEnabled(true);
    } catch (err) {
      console.warn("Autoplay blocked:", err.message);
    }
  }, [condition, enabled, fadeTo, setEnabled, checkAudioAvailable]);

  return { soundEnabled: enabled, toggleSound, soundUnavailable: unavailable };
}
