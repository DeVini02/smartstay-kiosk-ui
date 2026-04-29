import { cn } from "@/lib/utils";

interface StepProgressProps {
  total: number;
  current: number; // 1-indexed
  accent?: "default" | "warn" | "danger";
}

export const StepProgress = ({
  total,
  current,
  accent = "default",
}: StepProgressProps) => {
  const accentClass = {
    default: "bg-brand-primary",
    warn: "bg-warn",
    danger: "bg-danger",
  }[accent];

  return (
    <div
      className="flex gap-1 w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const filled = idx < current;
        const isCurrent = idx === current;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 h-[3px] rounded-[2px] transition-colors",
              filled && "bg-brand-primary",
              isCurrent && accentClass,
              !filled && !isCurrent && "bg-white/15"
            )}
          />
        );
      })}
    </div>
  );
};
