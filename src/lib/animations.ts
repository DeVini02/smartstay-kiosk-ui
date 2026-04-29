import type { Variants, Transition } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const screenTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const pulseRing: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
};

export const breathingDot: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const floatBlob = (seed = 0): Variants => ({
  animate: {
    x: [0, 20, -15, 10, 0],
    y: [0, -18, 14, -8, 0],
    transition: {
      duration: 12 + seed,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

export const tapScale: Transition = { type: "spring", stiffness: 400, damping: 25 };
