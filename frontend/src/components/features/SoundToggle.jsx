import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="glass px-3 py-2 flex items-center justify-center hover:brightness-125 transition"
      aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
      title={enabled ? "Mute ambient sound" : "Enable ambient sound"}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
