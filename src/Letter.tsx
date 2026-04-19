import { motion } from "motion/react";
import PolaroidPhotos from "./PolaroidPhotos";
import content from "./content";

type Props = {
  onOpenScrapbook?: () => void;
};

export default function Letter({ onOpenScrapbook }: Props) {
  const { letter, credits, scrapbook, features } = content;
  const showScrapbookButton = features.showScrapbook && !!onOpenScrapbook;
  return (
    <motion.article
      initial={{ y: 80, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      className="paper-grain relative mx-auto w-full max-w-2xl rounded-sm bg-paper px-8 py-12 sm:px-14 sm:py-16 shadow-[0_30px_60px_-30px_rgba(80,50,30,0.45),inset_0_0_0_1px_rgba(139,111,94,0.15)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 34px, rgba(139,111,94,0.06) 34px 35px)",
      }}
    >
      {/* torn tape at top */}
      <div className="absolute -top-3 left-10 h-6 w-24 rotate-[-4deg] bg-pastel-pink/60 shadow-sm" />
      <div className="absolute -top-3 right-12 h-6 w-20 rotate-[5deg] bg-beige/80 shadow-sm" />

      <motion.div
        className="font-mynerve text-lg sm:text-xl leading-relaxed text-soft-brown"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.25, delayChildren: 0.5 } },
        }}
      >
        {letter.lines.map((line, i) => (
          <motion.p
            key={i}
            className={i === 0 ? "mb-4" : "mb-3"}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          className="mt-8"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
          }}
        >
          <p className="font-mynerve text-lg">{letter.closing}</p>
          <p className="font-mynerve text-2xl sm:text-3xl text-muted-red">
            {letter.signature}
          </p>
        </motion.div>
      </motion.div>

      {/* Polaroid section */}
      <PolaroidPhotos />

      {/* Scrapbook CTA */}
      {showScrapbookButton && (
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
        >
          <motion.button
            type="button"
            onClick={onOpenScrapbook}
            className="rounded-full bg-muted-red/90 px-6 py-3 font-school text-sm uppercase tracking-[0.2em] text-warm-white shadow-[0_10px_30px_-10px_rgba(201,107,107,0.6)] transition hover:bg-muted-red"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {scrapbook.button}
          </motion.button>
        </motion.div>
      )}

      {/* Credits */}
      <motion.div
        className="mt-12 flex flex-col items-center gap-1 font-school text-soft-brown/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
      >
        <p className="text-xs uppercase tracking-[0.25em]">
          {credits.withLove}
        </p>
        <p className="font-mynerve text-xl text-muted-red">
          {credits.writtenBy}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-soft-brown/60">
          {credits.directedBy}
        </p>
      </motion.div>
    </motion.article>
  );
}
