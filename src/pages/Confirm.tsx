import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useCheckIn } from "@/context/CheckInContext";
import { formatStayRange } from "@/lib/mockData";

const Confirm = () => {
  const navigate = useNavigate();
  const { reservation } = useCheckIn();
  const r = reservation!;

  const rows = [
    { label: "Hóspede", value: r.guestName },
    { label: "Quarto", value: `${r.room} · ${r.roomType}` },
    { label: "Estadia", value: formatStayRange(r) },
  ];

  return (
    <ScreenShell step={{ total: 6, current: 4 }}>
      <h1 className="text-display text-text-primary mt-2">
        Confirme seus dados
      </h1>

      <div className="flex flex-col gap-3 mt-6">
        {rows.map((row) => (
          <GlassCard key={row.label}>
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-secondary">
                {row.label}
              </span>
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
          Tudo certo · continuar
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/menu")}>
          Algo está errado
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Confirm;
