import { ScreenShell } from "@/components/ScreenShell";
import { GhostButton } from "@/components/GhostButton";
import { useNavigate } from "react-router-dom";

const CheckoutIdentify = () => {
  const navigate = useNavigate();
  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
        <span className="text-label text-text-tertiary">EM BREVE</span>
        <h1 className="text-display text-text-primary">Check-out</h1>
        <p className="text-body text-text-secondary max-w-[260px]">
          Esta etapa será disponibilizada em uma próxima atualização.
        </p>
      </div>
      <GhostButton onClick={() => navigate("/menu")}>← Voltar</GhostButton>
    </ScreenShell>
  );
};

export default CheckoutIdentify;
