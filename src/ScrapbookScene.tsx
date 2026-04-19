import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import content from "./content";
import type { PolaroidImage, ScrapbookPhoto } from "./content";
import PolaroidModal from "./PolaroidModal";
import { playSound } from "./audio/sounds";

type Props = {
  onBack: () => void;
};

export default function ScrapbookScene({ onBack }: Props) {
  const t = content.scrapbook;
  const pages = t.pages;
  const [opened, setOpened] = useState(false);
  const [spread, setSpread] = useState(0); // index of the left page
  const [direction, setDirection] = useState<1 | -1>(1);
  const [active, setActive] = useState<PolaroidImage | null>(null);

  // Group pages into spreads (left + right). Last page may be solo.
  const spreads = useMemo(() => {
    const groups: Array<[ScrapbookPhoto[], ScrapbookPhoto[] | null]> = [];
    for (let i = 0; i < pages.length; i += 2) {
      groups.push([pages[i], pages[i + 1] ?? null]);
    }
    return groups;
  }, [pages]);

  const canPrev = spread > 0;
  const canNext = spread < spreads.length - 1;

  const openCover = () => {
    setOpened(true);
    try {
      playSound("paperSlide");
    } catch {
      /* audio may not be ready */
    }
  };

  const flip = (dir: 1 | -1) => {
    const target = spread + dir;
    if (target < 0 || target >= spreads.length) return;
    setDirection(dir);
    setSpread(target);
    try {
      playSound("paperTurn");
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <button
        onClick={onBack}
        className="mb-4 self-start rounded-full bg-warm-white/70 px-4 py-2 font-school text-xs uppercase tracking-[0.2em] text-soft-brown shadow-sm backdrop-blur-sm transition hover:bg-warm-white sm:self-auto sm:mb-6"
      >
        {t.backButton}
      </button>

      <div className="relative w-full max-w-5xl" style={{ perspective: 2000 }}>
        <AnimatePresence mode="wait">
          {!opened ? (
            <BookCover key="cover" onOpen={openCover} />
          ) : (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mx-auto"
            >
              <Book
                spread={spreads[spread]}
                spreadIndex={spread}
                direction={direction}
                onPhoto={setActive}
              />

              <div className="mt-6 flex items-center justify-center gap-6 font-school text-sm uppercase tracking-[0.2em] text-soft-brown">
                <button
                  onClick={() => flip(-1)}
                  disabled={!canPrev}
                  className="rounded-full bg-warm-white/80 px-4 py-2 shadow-sm transition enabled:hover:bg-warm-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← {t.prev}
                </button>
                <span className="font-mynerve text-base text-soft-brown/70">
                  {spread + 1} / {spreads.length}
                </span>
                <button
                  onClick={() => flip(1)}
                  disabled={!canNext}
                  className="rounded-full bg-warm-white/80 px-4 py-2 shadow-sm transition enabled:hover:bg-warm-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {t.next} →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PolaroidModal photo={active} onClose={() => setActive(null)} />
    </motion.section>
  );
}

/* ---------- Book cover ---------- */

function BookCover({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="group relative mx-auto block aspect-[3/4] w-[min(80vw,360px)] cursor-pointer overflow-hidden rounded-r-md shadow-[0_30px_60px_-20px_rgba(80,50,30,0.6)]"
      style={{
        background:
          "linear-gradient(135deg, #8a2020 0%, #b33a3a 55%, #7a1c1c 100%)",
      }}
      initial={{ rotateY: -18, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -120, opacity: 0, transformOrigin: "left center" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ rotateY: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* spine band */}
      <div className="absolute left-0 top-0 h-full w-3 bg-seal-dark/70" />
      {/* decorative border */}
      <div className="absolute inset-4 rounded-sm border border-warm-white/40" />
      {/* title */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-warm-white">
        <span className="font-school text-[11px] uppercase tracking-[0.35em] text-warm-white/70">
          Scrapbook
        </span>
        <h2 className="font-mynerve text-3xl sm:text-4xl leading-tight">
          {content.scrapbook.coverTitle}
        </h2>
        <span className="mt-4 font-school text-xs italic text-warm-white/70">
          {content.scrapbook.coverSubtitle}
        </span>
      </div>
      {/* corner flourishes */}
      <CornerOrnament className="absolute left-3 top-3 opacity-70" />
      <CornerOrnament className="absolute right-3 top-3 rotate-90 opacity-70" />
      <CornerOrnament className="absolute left-3 bottom-3 -rotate-90 opacity-70" />
      <CornerOrnament className="absolute right-3 bottom-3 rotate-180 opacity-70" />
    </motion.button>
  );
}

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 2 L10 2 M2 2 L2 10 M2 2 Q 8 4 10 10"
        stroke="rgba(255,245,225,0.7)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

/* ---------- Book spread ---------- */

function Book({
  spread,
  spreadIndex,
  direction,
  onPhoto,
}: {
  spread: [ScrapbookPhoto[], ScrapbookPhoto[] | null];
  spreadIndex: number;
  direction: 1 | -1;
  onPhoto: (p: PolaroidImage) => void;
}) {
  const [leftPage, rightPage] = spread;

  return (
    <div className="relative mx-auto">
      {/* soft book shadow */}
      <div className="pointer-events-none absolute inset-x-6 -bottom-6 h-8 rounded-full bg-soft-brown/30 blur-2xl" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-md bg-[#3b2518] p-3 shadow-[0_30px_70px_-30px_rgba(40,20,10,0.7)] sm:flex-row sm:gap-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={spreadIndex}
            initial={{ rotateY: direction === 1 ? 75 : -75, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: direction === 1 ? -75 : 75, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="flex w-full flex-col sm:flex-row"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Page photos={leftPage} onPhoto={onPhoto} side="left" />
            <div className="hidden w-px bg-black/30 sm:block" />
            {rightPage ? (
              <Page photos={rightPage} onPhoto={onPhoto} side="right" />
            ) : (
              <div className="hidden w-full sm:block" aria-hidden="true">
                <div className="h-full min-h-[22rem] bg-paper" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Page({
  photos,
  onPhoto,
  side,
}: {
  photos: ScrapbookPhoto[];
  onPhoto: (p: PolaroidImage) => void;
  side: "left" | "right";
}) {
  return (
    <div
      className="paper-grain relative flex w-full min-h-[22rem] flex-col items-center justify-around gap-8 bg-paper p-6 sm:p-8"
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 28px, rgba(139,111,94,0.06) 28px 29px)",
        boxShadow:
          side === "left"
            ? "inset -10px 0 20px -10px rgba(80,50,30,0.35)"
            : "inset 10px 0 20px -10px rgba(80,50,30,0.35)",
      }}
    >
      {photos.map((p, i) => (
        <ScrapbookPolaroid
          key={`${p.src}-${i}`}
          photo={p}
          onClick={() => onPhoto(p)}
        />
      ))}
    </div>
  );
}

/* ---------- Polaroid on a scrapbook page ---------- */

function ScrapbookPolaroid({
  photo,
  onClick,
}: {
  photo: ScrapbookPhoto;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Open photo: ${photo.caption}`}
      className="relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-muted-red/60"
      style={{ rotate: `${photo.rotate}deg` }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
    >
      {photo.attach === "clip" ? (
        <PaperClip className="absolute -top-4 left-6 z-10" />
      ) : (
        <>
          <div className="pointer-events-none absolute -top-3 left-6 h-5 w-16 -rotate-6 bg-pastel-pink/70 shadow-sm" />
          <div className="pointer-events-none absolute -top-3 right-6 h-5 w-14 rotate-6 bg-beige/80 shadow-sm" />
        </>
      )}

      <div className="bg-warm-white p-3 pb-10 shadow-[0_14px_28px_-14px_rgba(80,50,30,0.55)]">
        <div
          className="h-44 w-40 sm:h-48 sm:w-44 overflow-hidden bg-beige"
          style={{ filter: "sepia(0.15) saturate(0.95)" }}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-center font-mynerve text-sm text-soft-brown">
          {photo.caption}
        </p>
      </div>
    </motion.button>
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
