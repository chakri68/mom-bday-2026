import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

type Props = { onDone: () => void };

export default function CelebrationScreen({ onDone }: Props) {
  useEffect(() => {
    // confetti bursts
    const defaults = {
      spread: 70,
      ticks: 200,
      gravity: 0.9,
      decay: 0.94,
      startVelocity: 35,
      colors: ["#c96b6b", "#f8e0e6", "#f5ead6", "#b33a3a", "#fdf6ec"],
    };

    const fire = (ratio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * ratio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // optional celebratory sound via WebAudio (no asset needed)
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = freq;
        const start = ctx.currentTime + i * 0.12;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.15, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        o.connect(g).connect(ctx.destination);
        o.start(start);
        o.stop(start + 0.4);
      });
      setTimeout(() => ctx.close(), 2000);
    } catch {
      // audio optional
    }

    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="font-caveat text-6xl sm:text-7xl md:text-8xl text-muted-red drop-shadow-sm text-center leading-tight"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        Happy Birthday
        <br />
        <span className="text-seal-dark">Mom</span>
        <span className="ml-2">🎉</span>
      </motion.h1>
    </motion.section>
  );
}
