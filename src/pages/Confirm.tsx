import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { NoConnection } from "@/components/errors/NoConnection";
import { useCheckIn } from "@/context/CheckInContext";
import { formatStayRange } from "@/lib/mockData";
import { useT } from "@/lib/i18n";
import { isApiEnabled } from "@/lib/api/config";
import { startCheckIn } from "@/lib/api/client";
import { mapGuestProfile } from "@/lib/api/mappers";
import { usePersonalization } from "@/contexts/PersonalizationContext";

const Confirm = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation, language, setCheckInSessionId } = useCheckIn();
  const { setProfile, setIsReturningGuest } = usePersonalization();
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  if (!reservation) {
    return <Navigate to="/reservation" replace />;
  }

  const r = reservation;
  const rows = [
    { label: t("confirm.guest"), value: r.guestName },
    { label: t("confirm.room"), value: `${r.room} · ${r.roomType}` },
    { label: t("confirm.stay"), value: formatStayRange(r, language) },
  ];

  const handleOk = async () => {
    if (!isApiEnabled() || !r.id) {
      navigate("/lgpd");
      return;
    }
    setLoading(true);
    setOffline(false);
    try {
      const data = await startCheckIn(r.id, language);
      setCheckInSessionId(data.session_id);
      if (data.guest_profile) {
        setProfile(mapGuestProfile(data.guest_profile));
        setIsReturningGuest(data.guest_profile.total_stays > 1);
      }
      navigate("/lgpd");
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  if (offline) {
    return (
      <ScreenShell>
        <NoConnection onReception={() => { setOffline(false); navigate("/menu"); }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell step={{ total: 6, current: 4 }}>
      <h1 className="text-display text-text-primary mt-2">{t("confirm.title")}</h1>

      <div className="flex flex-col gap-3 mt-6">
        {rows.map((row) => (
          <GlassCard key={row.label}>
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-secondary">{row.label}</span>
              <span className="text-text-primary" style={{ fontSize: "16px", fontWeight: 500 }}>
                {row.value}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={handleOk} disabled={loading}>
          {loading ? t("common.loading") : t("confirm.ok")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/menu")}>{t("confirm.wrong")}</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Confirm;
