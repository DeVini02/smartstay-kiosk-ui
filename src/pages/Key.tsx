import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { Check, Wifi } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useCheckIn } from "@/context/CheckInContext";
import { useT } from "@/lib/i18n";

const Key = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation } = useCheckIn();
  const r = reservation!;
  const firstName = r.guestName.split(" ")[0].replace(".", "");

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

      <div className="flex flex-col gap-3 mt-5">
        <GlassCard accent="purple" className="!p-5">
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
          <span className="text-small text-text-secondary">
            {t("key.floor", { floor: r.floor, wing: r.wing })}
          </span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center !py-4">
          <span className="text-label text-text-secondary">{t("key.digital_key")}</span>
          <div className="relative mt-3 mb-2">
            <span
              className="absolute inset-0 rounded-md border border-success/60 animate-success-ring"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 rounded-md border border-success/60 animate-success-ring"
              style={{ animationDelay: "0.6s" }}
              aria-hidden="true"
            />
            <div className="relative bg-white p-1.5 rounded-md">
              <QRCode
                value={`smartstay://room/${r.room}/checkin/abc123`}
                size={88}
              />
            </div>
          </div>
          <span className="text-small text-text-secondary mt-1">{t("key.tap_door")}</span>
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
        <PrimaryButton onClick={() => navigate("/goodbye")}>
          {t("key.finish")}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};

export default Key;
