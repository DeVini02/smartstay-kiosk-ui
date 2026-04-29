import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TotemFrameProps {
  children: ReactNode;
}

/**
 * Simulates a 9:16 totem screen on desktop preview, goes fullscreen
 * on real touch devices (portrait viewport).
 */
export const TotemFrame = ({ children }: TotemFrameProps) => {
  const [isPortraitDevice, setIsPortraitDevice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      setIsPortraitDevice(portrait && touch);
      setIsFullscreen(!!document.fullscreenElement);
    };
    check();
    window.addEventListener("resize", check);
    document.addEventListener("fullscreenchange", check);
    return () => {
      window.removeEventListener("resize", check);
      document.removeEventListener("fullscreenchange", check);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* ignored */
    }
  };

  if (isPortraitDevice) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        {/* Kiosk lock indicator */}
        <KioskIndicator active={isFullscreen} />
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-bg-deep gap-3">
      <main
        className={cn(
          "relative overflow-hidden rounded-xl",
          "w-full max-w-[420px]",
          "border-[10px] border-black",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        )}
        style={{ aspectRatio: "9 / 16" }}
      >
        <KioskIndicator active={isFullscreen} />
        {children}
      </main>
      {!isFullscreen && (
        <button
          onClick={enterFullscreen}
          className="text-mono-tiny text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Click to enter kiosk mode
        </button>
      )}
    </div>
  );
};

const KioskIndicator = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 left-0 right-0 h-[1px] z-50 pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent, #A78BFA 30%, #5EEAD4 70%, transparent)",
      }}
      aria-hidden="true"
    />
  );
};
