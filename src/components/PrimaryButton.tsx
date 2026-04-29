import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = HTMLMotionProps<"button">;

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "w-full min-h-[56px] px-6 py-[14px] rounded-lg",
          "bg-brand-gradient text-white text-button",
          "shadow-[0_8px_24px_-8px_rgba(139,92,246,0.6)]",
          "transition-shadow hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.8)]",
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
PrimaryButton.displayName = "PrimaryButton";
