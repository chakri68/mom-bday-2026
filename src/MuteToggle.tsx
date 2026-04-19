import { useEffect, useState } from "react";
import { isMuted, setMuted } from "./audio/sounds";

/** Small floating speaker toggle in the corner. */
export default function MuteToggle() {
  const [muted, setLocalMuted] = useState(isMuted());

  useEffect(() => {
    setLocalMuted(isMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setLocalMuted(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-warm-white/80 text-soft-brown shadow-md backdrop-blur-sm transition hover:bg-warm-white"
    >
      {muted ? (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 10v4h4l5 5V5L7 10H3zm13.59 2l2.7-2.7a1 1 0 1 0-1.41-1.41L15.17 10.6l-2.7-2.7a1 1 0 1 0-1.41 1.41L13.76 12l-2.7 2.7a1 1 0 1 0 1.41 1.41l2.7-2.7 2.7 2.7a1 1 0 0 0 1.41-1.41L16.58 12z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  );
}
