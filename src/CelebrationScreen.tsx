import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { happyBirthdayLoop, playSound } from "./audio/sounds";
import content from "./content";

type Props = { onDone: () => void };

export default function CelebrationScreen({ onDone }: Props) {
  const [showHint, setShowHint] = useState(false);
  const [exiting, setExiting] = useState(false);

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

    // happy birthday piano fades in under the cheer
    const songTimer = setTimeout(() => {
      happyBirthdayLoop.fadeIn(0.45, 1800);
    }, 700);

    // show the "click to continue" hint after the cheer has had its moment
    // (popper ~180ms + cheer clip ~3.4s → ~3.6s)
    const hintTimer = setTimeout(() => setShowHint(true), 3800);

    return () => {
      clearTimeout(cheerTimer);
      clearTimeout(songTimer);
      clearTimeout(hintTimer);
    };
  }, []);

  const handleContinue = () => {
    if (exiting) return;
    setExiting(true);
    happyBirthdayLoop.fadeOut(900);
    // let the fade breathe before unmounting the screen
    setTimeout(onDone, 350);
  };

  return (
    <motion.section
      onClick={handleContinue}
      className="relative z-10 flex min-h-screen cursor-pointer items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-8 text-center relative">
        <motion.h1
          className="font-school font-bold text-4xl sm:text-5xl md:text-6xl text-muted-red drop-shadow-sm leading-tight tracking-tight"
          initial={{ scale: 0.6, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
        >
          {content.celebration.line1}
          <br />
          <span className="text-seal-dark">{content.celebration.line2}</span>
          <span className="ml-2">{content.celebration.emoji}</span>
        </motion.h1>

        <AnimatePresence>
          {showHint && (
            <motion.p
              key="hint"
              className="font-school text-xs uppercase tracking-[0.3em] text-soft-brown/70 absolute top-[120%]"
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: [0.2, 1, 0.2],
                y: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: {
                  duration: 2.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
                y: { duration: 0.5, ease: "easeOut" },
              }}
            >
              {content.celebration.continueHint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
