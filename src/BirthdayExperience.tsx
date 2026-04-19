import { useState } from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "./LoadingScreen";
import StartScreen from "./StartScreen";
import CelebrationScreen from "./CelebrationScreen";
import EnvelopeScene from "./EnvelopeScene";
import MuteToggle from "./MuteToggle";

export type Step = "loading" | "start" | "celebrate" | "envelope" | "open";

export default function BirthdayExperience() {
  const [step, setStep] = useState<Step>("loading");

  return (
    <div className="relative min-h-screen w-full vignette overflow-hidden">
      <FloatingParticles />
      {step !== "loading" && <MuteToggle />}
      <AnimatePresence mode="wait">
        {step === "loading" && (
          <LoadingScreen key="loading" onReady={() => setStep("start")} />
        )}
        {step === "start" && (
          <StartScreen key="start" onStart={() => setStep("celebrate")} />
        )}
        {step === "celebrate" && (
          <CelebrationScreen
            key="celebrate"
            onDone={() => setStep("envelope")}
          />
        )}
        {(step === "envelope" || step === "open") && (
          <EnvelopeScene
            key="envelope"
            opened={step === "open"}
            onOpen={() => setStep("open")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingParticles() {
  // tiny, very subtle floating dots for atmosphere
  const dots = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {dots.map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        const size = 2 + ((i * 7) % 4);
        const delay = (i % 6) * 0.8;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-pastel-pink/60 blur-[1px]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animation: `floaty 9s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floaty {
          from { transform: translateY(0) translateX(0); opacity: .35; }
          to { transform: translateY(-18px) translateX(6px); opacity: .85; }
        }
      `}</style>
    </div>
  );
}
