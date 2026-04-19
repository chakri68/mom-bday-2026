import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { preloadAll } from "./preload";
import { unlockAudio } from "./audio/sounds";
import content from "./content";

type Props = {
  onReady: () => void;
};

/**
 * Warms the cache for every audio + image asset, shows a soft progress bar,
 * and waits for a single user gesture ("Begin") so the AudioContext can be
 * unlocked before any sound is triggered.
 */
export default function LoadingScreen({ onReady }: Props) {
  const t = content.loading;
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    preloadAll((p) => {
      if (!cancelled) setProgress(p);
    }).then(() => {
      if (!cancelled) setDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBegin = async () => {
    await unlockAudio();
    onReady();
  };

  return (
    <motion.section
      className="relative z-10 flex min-h-screen items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <p className="font-school text-base text-soft-brown italic">
          {done ? t.readyText : t.loadingText}
        </p>

        <AnimatePresence initial={false}>
          {!done && (
            <motion.div
              key="progress"
              className="flex w-full flex-col items-center gap-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="h-2 w-full overflow-hidden rounded-full bg-beige/80 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-muted-red/80"
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              <p className="font-school text-xs text-soft-brown/60 tracking-wide">
                {Math.round(progress * 100)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleBegin}
          disabled={!done}
          className="mt-4 rounded-full bg-muted-red/90 px-8 py-3 font-school text-sm tracking-wider uppercase text-warm-white shadow-[0_10px_30px_-10px_rgba(201,107,107,0.6)] enabled:hover:bg-muted-red disabled:cursor-not-allowed disabled:opacity-40"
          whileHover={done ? { scale: 1.04 } : undefined}
          whileTap={done ? { scale: 0.96 } : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          {done ? t.buttonReady : t.buttonLoading}
        </motion.button>

        <p className="max-w-[20rem] text-xs text-soft-brown/50">{t.footer}</p>
      </div>
    </motion.section>
  );
}
