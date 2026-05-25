import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { Check, Wifi } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { GenericError } from "@/components/errors/GenericError";
import { useCheckIn } from "@/context/CheckInContext";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { isDemoMode } from "@/lib/api/config";

const Key = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation, qrPayload } = useCheckIn();
  const { isReturningGuest } = usePersonalization();
  if (!reservation) {
    return (
      <ScreenShell>
        <GenericError
          errorCode="KEY-NO-RESERVATION"
          onHome={() => navigate("/reservation")}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  if (!qrPayload && !isDemoMode()) {
    return (
      <ScreenShell>
        <GenericError
          errorCode="KEY-MISSING"
          onHome={() => navigate("/processing")}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  const r = reservation;
  const firstName = r.guestName.split(" ")[0].replace(".", "");
  const finishTo = isReturningGuest ? "/goodbye" : "/first-stay-onboarding";

  return (
    <ScreenShell>
      <StatusBadge variant="success" icon={Check} className="self-start mt-1">
        {t("key.done")}
      </StatusBadge>

      <h1 className="text-heading text-text-primary mt-3 leading-tight">
        {t("key.welcome")}
        <br />
        {firstName}!
      </h1>

      <div className="flex flex-1 flex-col justify-center gap-3 mt-4 min-h-0">
        <GlassCard accent="purple" className="!p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-label text-brand-primary/85">{t("key.your_room")}</span>
              <div
                className="mt-1"
                style={{
                  fontSize: "38px",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {r.room}
              </div>
            </div>
            <span className="text-small text-text-secondary text-right pb-1">
              {t("key.floor", { floor: r.floor, wing: r.wing })}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center text-center !py-5">
          <span className="text-label text-text-secondary">{t("key.digital_key")}</span>
          <div className="mt-3 flex h-[152px] w-full items-center justify-center overflow-hidden rounded-xl">
            <div className="relative flex h-[136px] w-[220px] items-center justify-center rounded-xl">
              <span
                className="absolute inset-0 rounded-xl border border-success/45 animate-success-ring"
                aria-hidden="true"
              />
              <span
                className="absolute inset-0 rounded-xl border border-success/45 animate-success-ring"
                style={{ animationDelay: "0.6s" }}
                aria-hidden="true"
              />
              <div className="relative z-10 bg-white p-2 rounded-lg shadow-[0_16px_34px_-20px_rgba(0,0,0,0.65)]">
                <QRCode
                  value={qrPayload ?? `smartstay://room/${r.room}/checkin/demo`}
                  size={112}
                />
              </div>
            </div>
          </div>
          <span className="text-small text-text-secondary mt-2">{t("key.tap_door")}</span>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Wifi size={16} className="text-success" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-label text-text-secondary">{t("key.wifi")}</span>
              <span className="text-small text-text-primary">{t("key.wifi_msg")}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-auto pt-5">
        <PrimaryButton onClick={() => navigate(finishTo)}>
          {t("key.finish")}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};

export default Key;
