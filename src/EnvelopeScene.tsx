import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Envelope from "./Envelope";
import Letter from "./Letter";
import LetterBackdrop from "./LetterBackdrop";
import { bgMusic, playSound } from "./audio/sounds";

type Props = {
  opened: boolean;
  onOpen: () => void;
  onOpenScrapbook?: () => void;
};

export default function EnvelopeScene({
  opened,
  onOpen,
  onOpenScrapbook,
}: Props) {
  // Fade in background music when the letter appears; play the letter-slide
  // sound at the same beat.
  useEffect(() => {
    if (!opened) return;
    playSound("paperSlide");
    bgMusic.fadeIn(0.22, 3500);
  }, [opened]);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start px-4 py-10 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="env"
            className="flex min-h-[80vh] items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Envelope onOpen={onOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <LetterBackdrop />
            <div className="relative z-10">
              <Letter onOpenScrapbook={onOpenScrapbook} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
