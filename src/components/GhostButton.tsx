import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type GhostButtonProps = HTMLMotionProps<"button">;

export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "w-full min-h-[56px] px-6 py-[14px] rounded-lg text-button",
          "bg-glass-bg border border-white/[0.12] text-white/85",
          "transition-colors hover:bg-white/[0.08] hover:border-white/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
GhostButton.displayName = "GhostButton";
