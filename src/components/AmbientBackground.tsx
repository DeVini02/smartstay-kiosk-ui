import { motion } from "framer-motion";
import { floatBlob } from "@/lib/animations";

/**
 * Base ambient gradient + slow drifting colored blobs.
 * Lives behind every screen to give the kiosk an "alive" feel.
 */
export const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ambient-gradient pointer-events-none">
      <motion.div
        variants={floatBlob(0)}
        animate="animate"
        className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.25) 0%, rgba(167,139,250,0) 70%)",
        }}
      />
      <motion.div
        variants={floatBlob(2)}
        animate="animate"
        className="absolute top-1/3 -right-24 w-[280px] h-[280px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(94,234,212,0.18) 0%, rgba(94,234,212,0) 70%)",
        }}
      />
      <motion.div
        variants={floatBlob(4)}
        animate="animate"
        className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 70%)",
        }}
      />
    </div>
  );
};
