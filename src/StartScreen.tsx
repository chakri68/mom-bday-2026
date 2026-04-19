import { motion } from "motion/react";

type Props = { onStart: () => void };

export default function StartScreen({ onStart }: Props) {
  return (
    <motion.section
      className="relative z-10 flex min-h-screen items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <motion.p
          className="font-school text-sm italic tracking-wide text-soft-brown/80"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          a little something for you, mom
        </motion.p>

        <motion.button
          onClick={onStart}
          className="group relative rounded-full bg-muted-red/90 px-8 py-3 font-school text-sm uppercase tracking-[0.2em] text-warm-white shadow-[0_10px_30px_-10px_rgba(201,107,107,0.6)] hover:bg-muted-red"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Click to start
          <span className="pointer-events-none absolute -inset-2 rounded-full ring-1 ring-muted-red/20 transition group-hover:ring-muted-red/40" />
        </motion.button>

        <motion.p
          className="max-w-xs text-sm text-soft-brown/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          (turn your sound on for the full feel)
        </motion.p>
      </div>
    </motion.section>
  );
}
