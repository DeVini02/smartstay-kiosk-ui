import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { useCheckIn, type Language } from "@/context/CheckInContext";
import { pulseRing } from "@/lib/animations";
import { useT } from "@/lib/i18n";

const Idle = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useCheckIn();
  const t = useT();

  const langs: { code: Language; label: string }[] = [
    { code: "pt", label: "PT" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
  ];

  return (
    <ScreenShell>
      <button
        onClick={() => navigate("/language-select")}
        aria-label={t("idle.aria")}
        className="flex-1 flex flex-col items-center justify-between w-full focus:outline-none"
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full">
          <div className="relative w-[78px] h-[78px] flex items-center justify-center">
            <motion.span
              variants={pulseRing}
              animate="animate"
              className="absolute inset-0 rounded-full border border-brand-primary/60"
              aria-hidden="true"
            />
            <motion.span
              variants={pulseRing}
              animate="animate"
              transition={{ delay: 0.6 }}
              className="absolute inset-0 rounded-full border border-brand-primary/40"
              aria-hidden="true"
            />
            <div className="w-[78px] h-[78px] rounded-full bg-brand-gradient flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(167,139,250,0.8)]">
              <Plus size={32} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-label text-brand-primary/85">{t("idle.welcome")}</span>
            <h1
              className="text-display"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(167,139,250,1) 50%, rgba(255,255,255,0.95) 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}
            >
              {t("idle.tap")}
            </h1>
            <p className="text-mono-tiny text-text-tertiary tracking-wider">
              {t("idle.subtitle")}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-3 pb-2">
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguage(l.code);
                }}
                className={`px-3 py-1.5 rounded-md text-small border transition-colors ${
                  language === l.code
                    ? "bg-glass-bg border-glass-border-strong text-text-primary"
                    : "bg-transparent border-white/10 text-text-secondary"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-text-tertiary" style={{ fontSize: "9px" }}>
            SmartStay AI · powered by FlexMedia
          </p>
        </div>
      </button>
    </ScreenShell>
  );
};

export default Idle;
