import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { TotemFrame } from "@/components/TotemFrame";
import { AmbientBackground } from "@/components/AmbientBackground";
import { AccessibilityFAB } from "@/components/AccessibilityFAB";
import { ScreenHeader } from "@/components/ScreenHeader";
import { screenTransition } from "@/lib/animations";

interface ScreenShellProps {
  children: ReactNode;
  showHeader?: boolean;
  step?: { total: number; current: number; accent?: "default" | "warn" | "danger" };
  status?: "ok" | "warn";
  contentClassName?: string;
}

export const ScreenShell = ({
  children,
  showHeader = true,
  step,
  status,
  contentClassName = "",
}: ScreenShellProps) => {
  return (
    <TotemFrame>
      <AmbientBackground />
      {!showHeader && <AccessibilityFAB />}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {showHeader && <ScreenHeader step={step} status={status} />}
        <motion.section
          variants={screenTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain touch-pan-y scrollbar-hidden px-6 pb-8 [-webkit-overflow-scrolling:touch] ${contentClassName}`}
        >
          {children}
        </motion.section>
      </div>
    </TotemFrame>
  );
};
