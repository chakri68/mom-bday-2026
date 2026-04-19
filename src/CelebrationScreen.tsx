import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { playSound } from "./audio/sounds";

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

    // popper first, cheer layered just behind
    playSound("popper");
    const cheerTimer = setTimeout(() => playSound("cheer"), 180);

    const t = setTimeout(onDone, 4200);
    return () => {
      clearTimeout(cheerTimer);
      clearTimeout(t);
    };
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
        className="font-school font-bold text-4xl sm:text-5xl md:text-6xl text-muted-red drop-shadow-sm text-center leading-tight tracking-tight"
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
