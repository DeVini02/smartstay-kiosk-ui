import { useNavigate } from "react-router-dom";
import { Check, Thermometer, Sun, Compass, Clock } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";
import { useCheckIn } from "@/context/CheckInContext";
import { usePersonalization } from "@/contexts/PersonalizationContext";

const accentBg: Record<string, string> = {
  teal: "bg-success/15 text-success",
  amber: "bg-warn/15 text-warn",
  purple: "bg-brand-primary/15 text-brand-primary",
};

const PrefRow = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: keyof typeof accentBg;
}) => (
  <GlassCard accent={accent === "teal" ? "teal" : accent === "amber" ? "amber" : "purple"}>
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center ${accentBg[accent]}`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-label text-text-secondary">{label}</div>
        <div className="text-small text-text-primary truncate" style={{ fontWeight: 500 }}>
          {value}
        </div>
      </div>
      <Check size={16} className="text-success font-mono" aria-hidden="true" />
    </div>
  </GlassCard>
);

const WelcomeBack = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation } = useCheckIn();
  const { profile } = usePersonalization();

  const firstName = (reservation?.guestName ?? "").split(" ")[0].replace(".", "");
  const memberYear = profile?.memberSince.split("-")[0] ?? "2024";
  const totalStays = profile?.totalStays ?? 1;
  const c = profile?.preferences.comfort;
  const stayPref = profile?.preferences.stay;

  const tone = c ? t(`p.tone.${c.lightingTone}`) : "—";

  return (
    <ScreenShell>
      <div className="mt-2 inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/40">
        <span className="text-label text-brand-primary">
          {t("p.welcome.badge", { year: memberYear, n: totalStays })}
        </span>
      </div>

      <h1 className="text-heading text-text-primary mt-3 leading-tight">
        {t("p.welcome.title", { name: firstName })}
      </h1>
      <p className="text-body text-text-secondary mt-2">{t("p.welcome.subtitle")}</p>

      <div className="flex flex-col gap-3 mt-5">
        {profile?.consents.comfort && c && (
          <>
            <PrefRow
              icon={<Thermometer size={16} />}
              label={t("p.welcome.climate")}
              value={`${c.temperature}°C · ar ${c.acIntensity === "low" ? "baixo" : c.acIntensity === "high" ? "alto" : "médio"}`}
              accent="teal"
            />
            <PrefRow
              icon={<Sun size={16} />}
              label={t("p.welcome.lighting")}
              value={`Luz ${tone} · ${c.lightingBrightness}%`}
              accent="amber"
            />
          </>
        )}
        {profile?.consents.stay && stayPref && (
          <PrefRow
            icon={<Compass size={16} />}
            label={t("p.welcome.view")}
            value={`Quarto ${reservation?.room ?? "—"} · vista p/ ${stayPref.preferredView}`}
            accent="purple"
          />
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 text-small text-text-secondary">
        <Clock size={14} aria-hidden="true" />
        <span>{t("p.welcome.ready")}</span>
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-3">
        <PrimaryButton onClick={() => navigate("/room-preparing")}>
          {t("p.welcome.continue")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/my-profile")}>
          {t("p.welcome.adjust")}
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default WelcomeBack;
