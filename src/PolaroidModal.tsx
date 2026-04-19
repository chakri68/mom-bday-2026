import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { PolaroidImage } from "./assets/images";

type Props = {
  photo: PolaroidImage | null;
  onClose: () => void;
};

export default function PolaroidModal({ photo, onClose }: Props) {
  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [photo, onClose]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* soft paper-like backdrop */}
          <div className="absolute inset-0 bg-soft-brown/50 backdrop-blur-sm" />

          <motion.div
            className="relative"
            initial={{ scale: 0.85, rotate: -6, opacity: 0, y: 20 }}
            animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, rotate: 4, opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* polaroid frame — scaled-up version of the card */}
            <div className="bg-warm-white p-4 pb-16 shadow-[0_30px_60px_-20px_rgba(80,50,30,0.6)]">
              <div
                className="overflow-hidden bg-beige"
                style={{ filter: "sepia(0.12) saturate(0.95)" }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="block max-h-[70vh] max-w-[80vw] sm:max-w-[520px] object-contain"
                />
              </div>
              <p className="mt-4 text-center font-caveat text-3xl text-soft-brown">
                {photo.caption}
              </p>
            </div>

            {/* little washi tape on top, same vibe as the letter */}
            <div className="pointer-events-none absolute -top-3 left-8 h-6 w-24 rotate-[-4deg] bg-pastel-pink/70 shadow-sm" />
            <div className="pointer-events-none absolute -top-3 right-10 h-6 w-20 rotate-[5deg] bg-beige/90 shadow-sm" />

            {/* close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-4 -right-4 grid h-10 w-10 place-items-center rounded-full bg-muted-red text-warm-white shadow-lg transition hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
