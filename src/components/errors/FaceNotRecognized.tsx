import { Meh } from "lucide-react";
import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";

interface Props {
  attempt?: number;
  total?: number;
  onUseCode?: () => void;
  onReception?: () => void;
  errorCode?: string;
}

export const FaceNotRecognized = ({
  attempt = 3,
  total = 3,
  onUseCode,
  onReception,
  errorCode = "FACE-NOMATCH-3 · 14:32",
}: Props) => {
  const t = useT();
  return (
    <div className="flex-1 flex flex-col items-center text-center pt-6 px-2">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -6, 6, -4, 4, 0] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(251,191,36,0.12)",
          border: "1px solid rgba(251,191,36,0.4)",
        }}
      >
        <Meh size={44} className="text-warn" aria-hidden="true" />
      </motion.div>

      <span className="text-label mt-4" style={{ color: "#FBBF24" }}>
        {t("err.face.attempt", { n: attempt, total })}
      </span>
      <h1 className="text-display text-text-primary mt-2">{t("err.face.title")}</h1>
      <p className="text-body text-text-secondary mt-2 max-w-[300px]">
        {t("err.face.body")}
      </p>

      <div className="flex gap-2 mt-3">
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className="w-2 h-2 rounded-full bg-warn"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full mt-auto pt-6">
        <PrimaryButton onClick={onUseCode}>{t("err.face.use_code")}</PrimaryButton>
        <GhostButton onClick={onReception}>{t("common.talk_reception")}</GhostButton>
        <p className="text-mono-tiny text-text-tertiary text-center mt-1">{errorCode}</p>
      </div>
    </div>
  );
};
