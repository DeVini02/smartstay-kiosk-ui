import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { useT } from "@/lib/i18n";
import { useCheckIn } from "@/context/CheckInContext";
import { usePersonalization } from "@/contexts/PersonalizationContext";

const RoomPreparing = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation } = useCheckIn();
  const { profile, commands, applyPreferences } = usePersonalization();
  const [announce, setAnnounce] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    applyPreferences();
    const tm = setTimeout(() => navigate("/key"), 8000);
    return () => clearTimeout(tm);
  }, [applyPreferences, navigate]);

  // Announce completions
  useEffect(() => {
    const lastDone = [...commands].reverse().find((c) => c.status === "completed");
    if (lastDone) {
      setAnnounce(t("p.prep.live_done", { device: t(`p.device.${lastDone.device}`) }));
    }
  }, [commands, t]);

  const c = profile?.preferences.comfort;
  const tone = c ? t(`p.tone.${c.lightingTone}`) : "—";
  const pos = c ? t(`p.curtain.${c.curtainPosition}`) : "—";

  const labels = useMemo(
    () => ({
      thermostat: t("p.prep.thermostat", { temp: c?.temperature ?? 22 }),
      lighting: t("p.prep.lighting", {
        tone,
        brightness: c?.lightingBrightness ?? 60,
      }),
      curtains: t("p.prep.curtains", { pos }),
      tv: t("p.prep.tv"),
    }),
    [c, pos, t, tone],
  );

  const done = commands.filter((c) => c.status === "completed").length;
  const total = commands.length || 4;

  return (
    <ScreenShell>
      <span className="text-label text-brand-primary mt-2">{t("p.prep.label")}</span>
      <h1 className="text-heading text-text-primary mt-1 leading-tight">
        {t("p.prep.title")}
      </h1>

      <GlassCard accent="purple" className="mt-5">
        <div className="text-mono-tiny text-text-tertiary tracking-wider">
          {t("p.prep.room", { room: reservation?.room ?? "412" })}
        </div>
        <div
          className="relative mt-2 w-full rounded-md overflow-hidden border border-white/10"
          style={{
            aspectRatio: "16 / 10",
            background:
              "linear-gradient(165deg, #0c1020 0%, #161c33 60%, #0a0e1a 100%)",
          }}
          aria-hidden="true"
        >
          {/* Ambient inner glow that grows with completed devices */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 + done * 0.08 }}
            transition={{ duration: 0.8 }}
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(251,191,36,0.18), transparent 70%)",
            }}
          />

          {/* Lights (top) */}
          {[0.32, 0.62].map((x, i) => (
            <motion.span
              key={i}
              className="absolute"
              style={{
                top: "12%",
                left: `${x * 100}%`,
                width: 14,
                height: 14,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, #FBBF24 0%, rgba(251,191,36,0.4) 60%, transparent 100%)",
              }}
              initial={{ opacity: 0.3, boxShadow: "0 0 0px rgba(251,191,36,0)" }}
              animate={{
                opacity: 1,
                boxShadow: "0 0 14px rgba(251,191,36,0.85)",
              }}
              transition={{ duration: 1.2, delay: 0 + i * 0.2 }}
            />
          ))}

          {/* AC unit (top-center) */}
          <motion.div
            className="absolute"
            style={{
              top: "6%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "30%",
              height: 6,
              borderRadius: 4,
              background: "linear-gradient(180deg, #2dd4bf, #0f766e)",
            }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          {/* Air streams */}
          <motion.div
            className="absolute"
            style={{
              top: "9%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "26%",
              height: "30%",
              background:
                "linear-gradient(180deg, rgba(94,234,212,0.45), transparent)",
              filter: "blur(2px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{
              duration: 2.2,
              delay: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Bed (bottom-left) */}
          <div
            className="absolute"
            style={{
              bottom: "12%",
              left: "10%",
              width: "35%",
              height: "28%",
              borderRadius: 6,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          />

          {/* Window with curtain (right) */}
          <div
            className="absolute"
            style={{
              top: "30%",
              right: "6%",
              width: 8,
              height: "40%",
              borderRadius: 2,
              background:
                "linear-gradient(180deg, rgba(167,139,250,0.4), rgba(94,234,212,0.3))",
            }}
          />
          <motion.div
            className="absolute"
            style={{
              top: "30%",
              right: "6%",
              width: 8,
              height: "40%",
              borderRadius: 2,
              background: "rgba(255,255,255,0.25)",
              transformOrigin: "top",
            }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0.4 }}
            transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
          />
          <span
            className="absolute font-mono text-text-tertiary"
            style={{ top: "24%", right: "6%", fontSize: 9 }}
          >
            {t("p.prep.east")}
          </span>
        </div>
      </GlassCard>

      {/* Command log */}
      <div className="flex flex-col gap-2 mt-4" aria-live="polite" aria-atomic="false">
        <div className="sr-only">{announce}</div>
        {[
          { key: "thermostat", label: labels.thermostat },
          { key: "lighting", label: labels.lighting },
          { key: "curtains", label: labels.curtains },
          { key: "tv", label: labels.tv },
        ].map((row, idx) => {
          const cmd = commands[idx];
          const status = cmd?.status ?? "pending";
          return (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white/[0.04] border border-white/10"
            >
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                {status === "completed" ? (
                  <span className="w-4 h-4 rounded-full bg-success/20 border border-success/60 flex items-center justify-center">
                    <Check size={10} className="text-success" />
                  </span>
                ) : status === "in_progress" ? (
                  <Loader2 size={14} className="text-brand-primary animate-spin" />
                ) : status === "failed" ? (
                  <span className="w-4 h-4 rounded-full bg-danger/20 border border-danger/60" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-white/20" />
                )}
              </span>
              <span className="flex-1 text-small text-text-primary truncate">
                {row.label}
              </span>
              <span className="text-mono-tiny text-text-tertiary">
                {status === "completed"
                  ? t("p.prep.ok")
                  : status === "in_progress"
                  ? t("p.prep.running")
                  : status === "failed"
                  ? t("p.prep.failed")
                  : t("p.prep.wait")}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <div
          className="h-1 rounded-full overflow-hidden bg-white/10"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[linear-gradient(90deg,transparent,#A78BFA,transparent)] bg-[length:200%_100%] animate-shimmer"
            style={{ width: `${(done / total) * 100}%`, transition: "width 0.6s ease" }}
          />
        </div>
        <div className="text-mono-tiny text-text-tertiary mt-2 text-center">
          {t("p.prep.summary", { done, total })}
        </div>
      </div>
    </ScreenShell>
  );
};

export default RoomPreparing;
