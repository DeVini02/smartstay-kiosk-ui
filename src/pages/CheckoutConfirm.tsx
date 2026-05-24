import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertTriangle } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { GenericError } from "@/components/errors/GenericError";
import { NoConnection } from "@/components/errors/NoConnection";
import { useT } from "@/lib/i18n";
import { useCheckIn } from "@/context/CheckInContext";
import { isApiEnabled, isDemoMode } from "@/lib/api/config";
import { confirmCheckout } from "@/lib/api/client";

const CheckoutConfirm = () => {
  const navigate = useNavigate();
  const t = useT();
  const { checkoutSessionId } = useCheckIn();
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [missingSession, setMissingSession] = useState(false);
  const items = [t("cc.item1"), t("cc.item2"), t("cc.item3"), t("cc.item4")];

  const handleConfirm = async () => {
    setOffline(false);
    setMissingSession(false);

    if (isApiEnabled() && !checkoutSessionId && !isDemoMode()) {
      setMissingSession(true);
      return;
    }

    setLoading(true);
    try {
      if (isApiEnabled() && checkoutSessionId) {
        await confirmCheckout(checkoutSessionId);
      }
    } catch {
      if (!isDemoMode()) {
        setOffline(true);
        return;
      }
    } finally {
      setLoading(false);
    }
    navigate("/checkout/rate");
  };

  if (offline) {
    return (
      <ScreenShell step={{ total: 4, current: 3, accent: "warn" }} status="warn">
        <NoConnection onReception={() => navigate("/menu")} />
      </ScreenShell>
    );
  }

  if (missingSession) {
    return (
      <ScreenShell step={{ total: 4, current: 3, accent: "warn" }} status="warn">
        <GenericError
          errorCode="CHECKOUT-NO-SESSION"
          onHome={() => navigate("/checkout/identify")}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell step={{ total: 4, current: 3 }}>
      <h1 className="text-display text-text-primary mt-2">{t("cc.title")}</h1>

      <GlassCard className="mt-5">
        <p className="text-body text-text-primary mb-3">{t("cc.intro")}</p>
        <ul className="flex flex-col gap-2.5">
          {items.map((it) => (
            <li key={it} className="flex gap-2.5 items-start">
              <span className="mt-1 w-4 h-4 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-brand-primary" />
              </span>
              <span className="text-body text-text-primary">{it}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard accent="amber" className="mt-3">
        <div className="flex gap-2.5 items-start">
          <AlertTriangle size={16} className="text-warn flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-body text-text-primary">
            <span style={{ color: "#FBBF24", fontWeight: 500 }}>{t("cc.warn_label")}</span>{" "}
            {t("cc.warn")}
          </p>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={handleConfirm} disabled={loading}>
          {loading ? t("common.loading") : t("cc.confirm")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/checkout/summary")}>{t("common.back")}</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default CheckoutConfirm;
