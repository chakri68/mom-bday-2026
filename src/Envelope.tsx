import { motion } from "motion/react";
import { useState } from "react";
import { playSound } from "./audio/sounds";

type Props = { onOpen: () => void };

export default function Envelope({ onOpen }: Props) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (pressed) return;
    setPressed(true);

    // seal snap immediately, paper turn a beat later as the flap opens
    playSound("snap");
    setTimeout(() => playSound("paperTurn"), 220);

    // let flap animate, then switch to letter view
    setTimeout(onOpen, 900);
  };

  return (
    <div className="relative">
      {/* soft shadow under envelope */}
      <div className="absolute -bottom-6 left-1/2 h-6 w-[85%] -translate-x-1/2 rounded-full bg-soft-brown/25 blur-xl" />

      <div
        className="relative"
        style={{ width: "min(90vw, 460px)", aspectRatio: "1.55 / 1" }}
      >
        {/* envelope body */}
        <div className="paper-grain absolute inset-0 overflow-hidden rounded-md bg-envelope-body shadow-[0_20px_40px_-20px_rgba(80,50,30,0.35),inset_0_0_0_1px_rgba(139,111,94,0.2)]">
          {/* bottom triangles (body seams) */}
          <div
            className="absolute inset-x-0 bottom-0 h-full"
            style={{
              background:
                "linear-gradient(135deg, transparent 0 49.5%, rgba(139,111,94,0.18) 49.5% 50.5%, transparent 50.5%)," +
                "linear-gradient(225deg, transparent 0 49.5%, rgba(139,111,94,0.18) 49.5% 50.5%, transparent 50.5%)",
            }}
          />
        </div>

        {/* inside (shows when flap opens) */}
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-envelope-inner/50" />
        </div>

        {/* flap */}
        <motion.div
          className="absolute left-0 top-0 w-full"
          style={{
            height: "62%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
          animate={pressed ? { rotateX: 175 } : { rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.6, 0.05, 0.2, 1] }}
        >
          <div
            className="paper-grain absolute inset-0 bg-envelope-flap"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              boxShadow:
                "inset 0 -2px 6px rgba(80,50,30,0.18), 0 6px 14px -8px rgba(80,50,30,0.35)",
            }}
          />
        </motion.div>

        {/* heart seal (on top, centered over flap tip) */}
        <motion.button
          onClick={handleClick}
          aria-label="Open the letter"
          className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
          whileHover={{ scale: 1.08, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          animate={
            pressed
              ? { scale: [1, 0.85, 1.05, 0], opacity: [1, 1, 1, 0] }
              : {
                  y: [0, -2, 0],
                  transition: { duration: 2, repeat: Infinity },
                }
          }
          transition={pressed ? { duration: 0.6 } : undefined}
        >
          <HeartSeal />
        </motion.button>
      </div>

      <p className="mt-8 text-center font-school text-xs italic tracking-wide text-soft-brown/70">
        click the heart to open ♡
      </p>
    </div>
  );
}

function HeartSeal() {
  return (
    <div className="relative">
      <svg
        width="90"
        height="82"
        viewBox="0 0 90 82"
        className="drop-shadow-[0_6px_10px_rgba(138,32,32,0.45)]"
      >
        <defs>
          <radialGradient id="sealGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d95858" />
            <stop offset="55%" stopColor="#b33a3a" />
            <stop offset="100%" stopColor="#7a1c1c" />
          </radialGradient>
        </defs>
        <path
          d="M45 76 C 10 52, 2 28, 20 14 C 32 4, 42 10, 45 22 C 48 10, 58 4, 70 14 C 88 28, 80 52, 45 76 Z"
          fill="url(#sealGrad)"
          stroke="#6b1818"
          strokeWidth="1.2"
        />
        {/* embossed initial */}
        <text
          x="45"
          y="46"
          textAnchor="middle"
          fontFamily="Caveat, cursive"
          fontSize="28"
          fill="#f3cccc"
          opacity="0.85"
        >
          M
        </text>
        {/* wax drip highlights */}
        <ellipse cx="30" cy="22" rx="6" ry="3" fill="#ffffff" opacity="0.25" />
      </svg>
    </div>
  );
}
