import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { Switch } from "@/components/ui/switch";
import { useCheckIn } from "@/context/CheckInContext";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { isApiEnabled } from "@/lib/api/config";
import { postCheckInConsent } from "@/lib/api/client";

const LGPD = () => {
  const navigate = useNavigate();
  const t = useT();
  const { setConsentGiven, checkInSessionId } = useCheckIn();
  const { profile, setConsent } = usePersonalization();
  const [loading, setLoading] = useState(false);
  const personalizationOn = !!(profile && (profile.consents.comfort || profile.consents.stay));

  const togglePersonalization = (v: boolean) => {
    setConsent("comfort", v, "checkin");
    setConsent("stay", v, "checkin");
  };

  const items = [t("lgpd.item1"), t("lgpd.item2"), t("lgpd.item3"), t("lgpd.item4")];

  const accept = async () => {
    setLoading(true);
    try {
      if (isApiEnabled() && checkInSessionId && profile) {
        await postCheckInConsent(checkInSessionId, profile.consents);
      }
      setConsentGiven(true);
      navigate("/capture");
    } catch {
      setConsentGiven(true);
      navigate("/capture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell step={{ total: 6, current: 5 }}>
      <h1
        className="text-text-primary mt-2"
        style={{ fontSize: "20px", fontWeight: 500, letterSpacing: "-0.3px" }}
      >
        {t("lgpd.title")}
      </h1>

      <GlassCard accent="purple" className="mt-5 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          <p className="text-body text-text-primary mb-3">{t("lgpd.intro")}</p>
          <ul className="flex flex-col gap-2.5">
            {items.map((item) => (
              <li key={item} className="flex gap-2.5 items-start">
                <span className="mt-1 w-4 h-4 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-brand-primary" />
                </span>
                <span className="text-body text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-body text-text-secondary mt-4">{t("lgpd.note")}</p>
        </div>
      </GlassCard>

      <GlassCard className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-title text-text-primary">{t("p.lgpd.section")}</div>
            <p className="text-small text-text-secondary mt-1">{t("p.lgpd.section_desc")}</p>
          </div>
          <Switch
            checked={personalizationOn}
            onCheckedChange={togglePersonalization}
            aria-label={t("p.lgpd.section")}
            className="data-[state=checked]:bg-success mt-1"
          />
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3 mt-6">
        <PrimaryButton onClick={accept} disabled={loading}>
          {loading ? t("common.loading") : t("lgpd.accept")}
        </PrimaryButton>
        <GhostButton
          onClick={() => navigate("/menu")}
          className="!border-danger/40 !text-danger"
        >
          {t("lgpd.decline")}
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default LGPD;
