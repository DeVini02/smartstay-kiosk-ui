import { useState } from "react";
import { Accessibility, Hand, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { GhostButton } from "@/components/GhostButton";
import {
  useAccessibility,
  type FontScaleLevel,
} from "@/hooks/useAccessibility";
import { useT } from "@/lib/i18n";

export const AccessibilityFAB = () => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const { fontScale, setFontScale, highContrast, setHighContrast } =
    useAccessibility();

  const notImplemented = () =>
    toast(t("a11y.todo"), {
      description: t("a11y.todo_desc"),
    });

  const fontLabels: { lvl: FontScaleLevel; size: string; label: string }[] = [
    { lvl: 0, size: "13px", label: t("a11y.font_small") },
    { lvl: 1, size: "16px", label: t("a11y.font_default") },
    { lvl: 2, size: "20px", label: t("a11y.font_large") },
  ];

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        aria-label={t("a11y.open")}
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-white/85 hover:text-white"
      >
        <Accessibility size={20} aria-hidden="true" />
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-bg-surface border-glass-border text-text-primary max-w-[360px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-heading text-white">
              {t("a11y.title")}
            </DialogTitle>
            <DialogDescription className="text-text-secondary text-body">
              {t("a11y.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-2">
            <Section title={t("a11y.font")}>
              <div className="flex gap-2">
                {fontLabels.map((f) => (
                  <button
                    key={f.lvl}
                    onClick={() => setFontScale(f.lvl)}
                    aria-label={t("a11y.font_aria", { label: f.label })}
                    aria-pressed={fontScale === f.lvl}
                    className={`flex-1 h-14 rounded-md border transition-colors flex flex-col items-center justify-center ${
                      fontScale === f.lvl
                        ? "bg-brand-gradient border-transparent text-white"
                        : "bg-glass-bg border-glass-border text-text-secondary"
                    }`}
                  >
                    <span
                      style={{ fontSize: f.size, fontWeight: 500 }}
                      aria-hidden="true"
                    >
                      A
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title={t("a11y.contrast")}>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label={t("a11y.contrast")}
              />
            </Section>

            <Section title={t("a11y.libras")} badge="Beta">
              <button
                onClick={() => {
                  notImplemented();
                }}
                className="flex items-center gap-2 text-small text-brand-primary"
              >
                <Hand size={16} />
                {t("a11y.libras_btn")}
              </button>
            </Section>

            <Section title={t("a11y.audio")} badge="Roadmap">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-text-secondary" />
                <Switch
                  onCheckedChange={(v) => v && notImplemented()}
                  aria-label={t("a11y.audio_aria")}
                />
              </div>
            </Section>

            <GhostButton onClick={() => setOpen(false)}>{t("common.close")}</GhostButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Section = ({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-title text-text-primary">{title}</h3>
        {badge && (
          <span
            className="px-1.5 py-0.5 rounded-sm text-mono-tiny"
            style={{
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.4)",
              color: "#A78BFA",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center justify-between gap-3">{children}</div>
  </section>
);
