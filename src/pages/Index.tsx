import { motion } from "framer-motion";
import { TotemFrame } from "@/components/TotemFrame";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AccessibilityFAB } from "@/components/AccessibilityFAB";
import { screenTransition } from "@/lib/animations";

const Index = () => {
  return (
    <TotemFrame>
      <AmbientBackground />
      <AccessibilityFAB />
      <div className="relative z-10 flex flex-col h-full">
        <ScreenHeader />
        <motion.section
          variants={screenTransition}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="text-label text-text-tertiary mb-3">FOUNDATION</span>
          <h1 className="text-display text-text-primary mb-2">
            Setup complete
          </h1>
          <p className="text-body text-text-secondary max-w-[260px]">
            Design system, components and ambient canvas are ready. Screens
            will land in the next prompt.
          </p>
        </motion.section>
      </div>
    </TotemFrame>
  );
};

export default Index;
