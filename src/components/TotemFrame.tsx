import { useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      setIsPortraitDevice(portrait && touch);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isPortraitDevice) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg-deep">
      <main
        className={cn(
          "relative overflow-hidden rounded-xl",
          "w-full max-w-[420px]",
          "border-[10px] border-black",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        )}
        style={{ aspectRatio: "9 / 16" }}
      >
        {children}
      </main>
    </div>
  );
};
