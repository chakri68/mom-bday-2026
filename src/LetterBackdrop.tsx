import { motion } from "motion/react";
import { useMemo } from "react";

/**
 * Decorative background for the Letter view.
 *
 * Continuous, infinite shower of:
 *  - balloons rising from below the viewport and drifting up past it
 *  - tiny hearts, stars, and confetti strips floating upward at varying speeds
 *
 * Everything lives behind the letter, pointer-events disabled, using the
 * same pastel / muted-red / beige palette as the rest of the page.
 */

const BALLOON_COUNT = 10;
const HEART_COUNT = 8;
const STAR_COUNT = 10;
const CONFETTI_COUNT = 14;

const BALLOON_COLORS = [
  "var(--color-pastel-pink)",
  "var(--color-beige)",
  "var(--color-muted-red)",
  "var(--color-warm-white)",
];

const CONFETTI_COLORS = [
  "bg-muted-red/50",
  "bg-pastel-pink",
  "bg-beige",
  "bg-muted-red/40",
  "bg-soft-brown/40",
];

/** Deterministic pseudo-random so each particle gets stable-looking values. */
function rand(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const f = x - Math.floor(x);
  return min + f * (max - min);
}

export default function LetterBackdrop() {
  const balloons = useMemo(
    () =>
      Array.from({ length: BALLOON_COUNT }, (_, i) => ({
        id: i,
        left: rand(i + 1, 2, 96),
        size: Math.round(rand(i + 11, 42, 82)),
        duration: rand(i + 21, 18, 32),
        delay: rand(i + 31, -20, 2),
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        angle: rand(i + 41, -14, 14),
        sway: rand(i + 51, 10, 30),
      })),
    [],
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: HEART_COUNT }, (_, i) => ({
        id: i,
        left: rand(i + 101, 3, 97),
        size: Math.round(rand(i + 111, 12, 22)),
        duration: rand(i + 121, 14, 24),
        delay: rand(i + 131, -20, 4),
        sway: rand(i + 141, 8, 22),
      })),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        left: rand(i + 201, 2, 98),
        size: Math.round(rand(i + 211, 10, 18)),
        duration: rand(i + 221, 12, 22),
        delay: rand(i + 231, -18, 2),
        sway: rand(i + 241, 6, 18),
      })),
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        left: rand(i + 301, 1, 99),
        duration: rand(i + 311, 10, 20),
        delay: rand(i + 321, -18, 2),
        rotate: rand(i + 331, -40, 40),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        sway: rand(i + 341, 6, 20),
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
    >
      {balloons.map((b) => (
        <Riser
          key={`b${b.id}`}
          left={b.left}
          duration={b.duration}
          delay={b.delay}
          sway={b.sway}
        >
          <Balloon color={b.color} size={b.size} angle={b.angle} seed={b.id} />
        </Riser>
      ))}

      {hearts.map((h) => (
        <Riser
          key={`h${h.id}`}
          left={h.left}
          duration={h.duration}
          delay={h.delay}
          sway={h.sway}
        >
          <HeartSvg size={h.size} className="text-muted-red/55" />
        </Riser>
      ))}

      {stars.map((s) => (
        <Riser
          key={`s${s.id}`}
          left={s.left}
          duration={s.duration}
          delay={s.delay}
          sway={s.sway}
        >
          <StarSvg size={s.size} className="text-soft-brown/45" />
        </Riser>
      ))}

      {confetti.map((c) => (
        <Riser
          key={`c${c.id}`}
          left={c.left}
          duration={c.duration}
          delay={c.delay}
          sway={c.sway}
        >
          <div
            className={`h-1.5 w-6 rounded-full ${c.color}`}
            style={{ rotate: `${c.rotate}deg` }}
          />
        </Riser>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */

/**
 * Wraps a child in a vertical rising animation that loops forever.
 * Two nested motion divs keep horizontal sway independent of the vertical
 * rise so the trajectory feels natural rather than straight-line.
 */
function Riser({
  left,
  duration,
  delay,
  sway,
  children,
}: {
  left: number;
  duration: number;
  delay: number;
  sway: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${left}%` }}
      initial={{ y: "10vh", opacity: 0 }}
      animate={{ y: "-115vh", opacity: [0, 1, 1, 0] }}
      transition={{
        y: { duration, repeat: Infinity, ease: "linear", delay },
        opacity: {
          duration,
          repeat: Infinity,
          ease: "linear",
          delay,
          times: [0, 0.08, 0.9, 1],
        },
      }}
    >
      <motion.div
        animate={{ x: [-sway / 2, sway / 2, -sway / 2] }}
        transition={{
          duration: duration / 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Balloon({
  color,
  size,
  angle,
  seed,
}: {
  color: string;
  size: number;
  angle: number;
  seed: number;
}) {
  const gradId = `balloonShine-${seed}`;
  return (
    <div style={{ rotate: `${angle}deg` }}>
      <svg
        viewBox="0 0 80 110"
        width={size}
        height={(size * 110) / 80}
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id={gradId} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <ellipse
          cx="40"
          cy="40"
          rx="30"
          ry="36"
          fill={color}
          stroke="rgba(80,50,30,0.15)"
          strokeWidth="1"
        />
        <ellipse cx="40" cy="40" rx="30" ry="36" fill={`url(#${gradId})`} />
        <polygon
          points="36,74 44,74 40,80"
          fill={color}
          stroke="rgba(80,50,30,0.2)"
          strokeWidth="0.8"
        />
        <path
          d="M40 80 Q 46 92, 38 100 T 42 110"
          fill="none"
          stroke="rgba(139,111,94,0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function HeartSvg({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
    </svg>
  );
}

function StarSvg({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2l2.4 6.4H21l-5.2 3.9 2 6.7L12 15.8 6.2 19l2-6.7L3 8.4h6.6z" />
    </svg>
  );
}
