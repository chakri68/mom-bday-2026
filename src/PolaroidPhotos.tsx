import { motion } from "motion/react";
import { POLAROID_IMAGES } from "./assets/images";

export default function PolaroidPhotos() {
  return (
    <div className="relative mt-12 pt-6">
      <p className="mb-6 text-center font-caveat text-xl text-soft-brown/70">
        — a few of our favorite memories —
      </p>

      <motion.div
        className="flex flex-wrap items-start justify-center gap-6 sm:gap-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.2, delayChildren: 2.2 },
          },
        }}
      >
        {POLAROID_IMAGES.map((p, i) => (
          <motion.div
            key={i}
            className="relative"
            style={{ rotate: `${p.rotate}deg` }}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
            whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
          >
            {/* paperclip */}
            <PaperClip className="absolute -top-4 left-6 z-10" />

            {/* polaroid */}
            <div className="bg-warm-white p-3 pb-10 shadow-[0_14px_28px_-14px_rgba(80,50,30,0.55)]">
              <div
                className="h-44 w-40 sm:h-48 sm:w-44 overflow-hidden bg-beige"
                style={{ filter: "sepia(0.15) saturate(0.95)" }}
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center font-caveat text-lg text-soft-brown">
                {p.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function PaperClip({ className = "" }: { className?: string }) {
  return (
    <svg
      width="28"
      height="46"
      viewBox="0 0 28 46"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 4 C 7 4, 4 9, 4 15 L 4 34 C 4 40, 9 44, 14 44 C 19 44, 24 40, 24 34 L 24 14 C 24 10, 21 8, 18 8 C 15 8, 12 10, 12 14 L 12 32"
        fill="none"
        stroke="#9aa3ad"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
