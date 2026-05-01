import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useCheckIn } from "@/context/CheckInContext";
import { formatStayRange } from "@/lib/mockData";
import { useT } from "@/lib/i18n";

const Confirm = () => {
  const navigate = useNavigate();
  const t = useT();
  const { reservation, language } = useCheckIn();
  const r = reservation!;

  const rows = [
    { label: t("confirm.guest"), value: r.guestName },
    { label: t("confirm.room"), value: `${r.room} · ${r.roomType}` },
    { label: t("confirm.stay"), value: formatStayRange(r, language) },
  ];

  return (
    <ScreenShell step={{ total: 6, current: 4 }}>
      <h1 className="text-display text-text-primary mt-2">{t("confirm.title")}</h1>

      <div className="flex flex-col gap-3 mt-6">
        {rows.map((row) => (
          <GlassCard key={row.label}>
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-secondary">{row.label}</span>
              <span
                className="text-text-primary"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                {row.value}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={() => navigate("/lgpd")}>
          {t("confirm.ok")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/menu")}>
          {t("confirm.wrong")}
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Confirm;
