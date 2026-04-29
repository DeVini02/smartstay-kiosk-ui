import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "purple" | "teal" | "amber" | "coral";

interface GlassCardProps {
  children: ReactNode;
  accent?: Accent;
  className?: string;
}

const accentGlow: Record<Accent, string> = {
  purple:
    "radial-gradient(circle at top right, rgba(167,139,250,0.25) 0%, transparent 60%)",
  teal: "radial-gradient(circle at top right, rgba(94,234,212,0.22) 0%, transparent 60%)",
  amber:
    "radial-gradient(circle at top right, rgba(251,191,36,0.22) 0%, transparent 60%)",
  coral:
    "radial-gradient(circle at top right, rgba(251,113,133,0.22) 0%, transparent 60%)",
};

export const GlassCard = ({ children, accent, className }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-[14px]",
        "bg-glass-bg border border-glass-border backdrop-blur-[10px]",
        className
      )}
    >
      {accent && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: accentGlow[accent] }}
          aria-hidden="true"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
};
