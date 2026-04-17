import { motion } from "motion/react";

/**
 * Decorative background for the Letter view.
 * Balloons, confetti strips, little hearts and stars — all in the
 * soft pastel / washi-tape palette already used in the letter.
 * Positioned absolutely around (not over) the letter paper.
 */
export default function LetterBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      {/* ---------- Balloons ---------- */}
      <Balloon
        className="left-[4%] top-[6%] hidden md:block"
        color="var(--color-pastel-pink)"
        stringColor="rgba(139,111,94,0.45)"
        delay={0}
        drift={8}
        size={74}
        angle={-6}
      />
      <Balloon
        className="left-[10%] top-[22%] hidden lg:block"
        color="var(--color-beige)"
        stringColor="rgba(139,111,94,0.45)"
        delay={0.6}
        drift={10}
        size={58}
        angle={10}
      />
      <Balloon
        className="right-[5%] top-[4%] hidden md:block"
        color="var(--color-muted-red)"
        stringColor="rgba(139,111,94,0.5)"
        delay={0.3}
        drift={12}
        size={82}
        angle={4}
      />
      <Balloon
        className="right-[9%] top-[26%] hidden lg:block"
        color="var(--color-pastel-pink)"
        stringColor="rgba(139,111,94,0.45)"
        delay={0.9}
        drift={7}
        size={52}
        angle={-8}
      />
      <Balloon
        className="left-[6%] bottom-[18%] hidden md:block"
        color="var(--color-beige)"
        stringColor="rgba(139,111,94,0.45)"
        delay={1.1}
        drift={9}
        size={64}
        angle={-12}
      />
      <Balloon
        className="right-[6%] bottom-[22%] hidden md:block"
        color="var(--color-pastel-pink)"
        stringColor="rgba(139,111,94,0.45)"
        delay={0.4}
        drift={11}
        size={70}
        angle={14}
      />

      {/* ---------- Washi tape scraps ---------- */}
      <TapeScrap
        className="left-[3%] top-[48%] hidden md:block"
        color="bg-pastel-pink/70"
        rotate={-18}
        width={90}
      />
      <TapeScrap
        className="right-[4%] top-[52%] hidden md:block"
        color="bg-beige/80"
        rotate={22}
        width={110}
      />
      <TapeScrap
        className="left-[8%] bottom-[8%] hidden lg:block"
        color="bg-muted-red/40"
        rotate={8}
        width={80}
      />

      {/* ---------- Little hearts ---------- */}
      <FloatIcon
        className="left-[14%] top-[40%] hidden md:block text-muted-red/60"
        delay={0}
        drift={6}
      >
        <HeartSvg size={22} />
      </FloatIcon>
      <FloatIcon
        className="right-[14%] top-[36%] hidden md:block text-muted-red/50"
        delay={0.8}
        drift={8}
      >
        <HeartSvg size={18} />
      </FloatIcon>
      <FloatIcon
        className="right-[18%] bottom-[34%] hidden lg:block text-muted-red/60"
        delay={1.4}
        drift={7}
      >
        <HeartSvg size={16} />
      </FloatIcon>

      {/* ---------- Tiny stars / sparkles ---------- */}
      <FloatIcon
        className="left-[20%] top-[14%] hidden md:block text-soft-brown/50"
        delay={0.2}
        drift={5}
      >
        <StarSvg size={14} />
      </FloatIcon>
      <FloatIcon
        className="right-[22%] top-[18%] hidden md:block text-soft-brown/50"
        delay={1.1}
        drift={5}
      >
        <StarSvg size={12} />
      </FloatIcon>
      <FloatIcon
        className="left-[12%] bottom-[40%] hidden md:block text-soft-brown/40"
        delay={0.7}
        drift={6}
      >
        <StarSvg size={16} />
      </FloatIcon>
      <FloatIcon
        className="right-[10%] bottom-[12%] hidden md:block text-soft-brown/50"
        delay={0.5}
        drift={6}
      >
        <StarSvg size={14} />
      </FloatIcon>

      {/* ---------- Confetti strips ---------- */}
      <ConfettiStrip
        className="left-[18%] top-[8%] hidden md:block bg-muted-red/50"
        rotate={-30}
      />
      <ConfettiStrip
        className="right-[20%] top-[12%] hidden md:block bg-pastel-pink"
        rotate={25}
      />
      <ConfettiStrip
        className="left-[22%] bottom-[22%] hidden md:block bg-beige"
        rotate={12}
      />
      <ConfettiStrip
        className="right-[24%] bottom-[28%] hidden md:block bg-muted-red/40"
        rotate={-18}
      />
    </div>
  );
}

/* ---------------- components ---------------- */

function Balloon({
  className = "",
  color,
  stringColor,
  delay,
  drift,
  angle,
  size,
}: {
  className?: string;
  color: string;
  stringColor: string;
  delay: number;
  drift: number;
  angle: number;
  size: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -drift, 0],
      }}
      transition={{
        opacity: { duration: 1.2, delay },
        y: {
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      style={{ width: size, rotate: `${angle}deg` }}
    >
      <svg
        viewBox="0 0 80 110"
        width={size}
        height={(size * 110) / 80}
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient
            id={`balloonShine-${size}-${delay}`}
            cx="35%"
            cy="30%"
            r="65%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* body */}
        <ellipse
          cx="40"
          cy="40"
          rx="30"
          ry="36"
          fill={color}
          stroke="rgba(80,50,30,0.15)"
          strokeWidth="1"
        />
        {/* shine */}
        <ellipse
          cx="40"
          cy="40"
          rx="30"
          ry="36"
          fill={`url(#balloonShine-${size}-${delay})`}
        />
        {/* tie */}
        <polygon
          points="36,74 44,74 40,80"
          fill={color}
          stroke="rgba(80,50,30,0.2)"
          strokeWidth="0.8"
        />
        {/* string */}
        <path
          d="M40 80 Q 46 92, 38 100 T 42 110"
          fill="none"
          stroke={stringColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

function TapeScrap({
  className = "",
  color,
  rotate,
  width,
}: {
  className?: string;
  color: string;
  rotate: number;
  width: number;
}) {
  return (
    <motion.div
      className={`absolute h-5 ${color} shadow-sm ${className}`}
      style={{ width, rotate: `${rotate}deg` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    />
  );
}

function FloatIcon({
  className = "",
  delay,
  drift,
  children,
}: {
  className?: string;
  delay: number;
  drift: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -drift, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        y: {
          duration: 4 + drift * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function ConfettiStrip({
  className = "",
  rotate,
}: {
  className?: string;
  rotate: number;
}) {
  return (
    <motion.div
      className={`absolute h-1.5 w-8 rounded-full ${className}`}
      style={{ rotate: `${rotate}deg` }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6 }}
    />
  );
}

function HeartSvg({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
    </svg>
  );
}

function StarSvg({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.4 6.4H21l-5.2 3.9 2 6.7L12 15.8 6.2 19l2-6.7L3 8.4h6.6z" />
    </svg>
  );
}
