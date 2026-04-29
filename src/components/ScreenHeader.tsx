import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { breathingDot } from "@/lib/animations";
import { StepProgress } from "./StepProgress";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  status?: "ok" | "warn";
  step?: { total: number; current: number; accent?: "default" | "warn" | "danger" };
  className?: string;
}

export const ScreenHeader = ({
  status = "ok",
  step,
  className,
}: ScreenHeaderProps) => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const dotColor = status === "warn" ? "bg-warn" : "bg-success";

  return (
    <header className={cn("w-full px-6 pt-6 pb-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            variants={breathingDot}
            animate="animate"
            className={cn("inline-block w-2 h-2 rounded-full", dotColor)}
            aria-hidden="true"
          />
          <span className="text-label text-text-secondary">SMARTSTAY</span>
        </div>
        <span className="text-mono-tiny text-text-secondary tracking-wider">
          {time}
        </span>
      </div>
      {step && (
        <div className="mt-3">
          <StepProgress {...step} />
        </div>
      )}
    </header>
  );
};

function formatTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
