import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "success" | "warn" | "danger" | "neutral";

interface StatusBadgeProps {
  variant?: Variant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  success:
    "bg-success/[0.12] border-success/40 text-success",
  warn: "bg-warn/[0.12] border-warn/40 text-warn",
  danger: "bg-danger/[0.12] border-danger/40 text-danger",
  neutral:
    "bg-white/[0.06] border-white/20 text-white/85",
};

export const StatusBadge = ({
  variant = "neutral",
  icon: Icon,
  children,
  className,
}: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "border text-small",
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  );
};
