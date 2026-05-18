import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { useCheckIn } from "@/context/CheckInContext";
import { isApiEnabled } from "@/lib/api/config";
import { completeCheckIn } from "@/lib/api/client";

const Processing = () => {
  const navigate = useNavigate();
  const t = useT();
  const { isReturningGuest, profile, applyPreferences } = usePersonalization();
  const { checkInSessionId, setQrPayload } = useCheckIn();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (isApiEnabled() && checkInSessionId) {
        try {
          const result = await completeCheckIn(checkInSessionId);
          if (!cancelled) setQrPayload(result.qr_payload);
          if (result.apply_personalization) {
            await applyPreferences();
          }
        } catch {
          // fallback: segue fluxo visual
        }
      }

      await new Promise((r) => setTimeout(r, 1500));
      if (cancelled) return;

      const hasConsent = !!profile && (profile.consents.comfort || profile.consents.stay);
      if (isReturningGuest && hasConsent) navigate("/welcome-back");
      else navigate("/key");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    navigate,
    isReturningGuest,
    profile,
    checkInSessionId,
    setQrPayload,
    applyPreferences,
  ]);

  return (
    <ScreenShell showHeader={false}>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <div
          className="w-[60px] h-[60px] rounded-full animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #A78BFA 360deg)",
            mask: "radial-gradient(circle, transparent 22px, black 23px)",
            WebkitMask: "radial-gradient(circle, transparent 22px, black 23px)",
          }}
          aria-label={t("common.loading")}
        />
        <h1 className="text-heading text-text-primary">{t("proc.title")}</h1>
        <p className="text-body text-text-secondary max-w-[260px]">{t("proc.subtitle")}</p>
      </div>
    </ScreenShell>
  );
};

export default Processing;
