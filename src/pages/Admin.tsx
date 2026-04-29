import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { GhostButton } from "@/components/GhostButton";
import { Switch } from "@/components/ui/switch";
import { useCheckIn } from "@/context/CheckInContext";

const Admin = () => {
  const navigate = useNavigate();
  const { reservation, setReservation } = useCheckIn();
  const [forceFaceFail, setForceFaceFail] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);

  return (
    <ScreenShell>
      <h1 className="text-display text-text-primary mt-2">Admin · debug</h1>
      <p className="text-body text-text-secondary mt-1">
        Easter egg · simulação de fluxos
      </p>

      <div className="flex flex-col gap-3 mt-5">
        <GlassCard accent="purple">
          <div className="flex items-center justify-between">
            <span className="text-title text-text-primary">
              Forçar falha facial
            </span>
            <Switch
              checked={forceFaceFail}
              onCheckedChange={setForceFaceFail}
            />
          </div>
        </GlassCard>

        <GlassCard accent="amber">
          <div className="flex items-center justify-between">
            <span className="text-title text-text-primary">Modo offline</span>
            <Switch checked={forceOffline} onCheckedChange={setForceOffline} />
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-label text-text-secondary">Reserva ativa</span>
          <p className="text-body text-text-primary mt-1">
            {reservation?.guestName ?? "—"} · quarto {reservation?.room ?? "—"}
          </p>
          <button
            onClick={() => setReservation(null)}
            className="text-small mt-2"
            style={{ color: "#FB7185" }}
          >
            Limpar reserva
          </button>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-2 mt-auto pt-6">
        <GhostButton onClick={() => navigate("/test/all-screens")}>
          QA · ver todas as telas
        </GhostButton>
        <GhostButton onClick={() => navigate("/test/errors")}>
          QA · testar erros
        </GhostButton>
        <GhostButton onClick={() => navigate("/")}>← Sair</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Admin;
