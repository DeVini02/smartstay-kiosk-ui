import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";

const Menu = () => {
  const navigate = useNavigate();
  return (
    <ScreenShell step={{ total: 6, current: 2 }}>
      <h1 className="text-display text-text-primary mt-2">
        Como podemos ajudar?
      </h1>

      <div className="flex flex-col gap-3 mt-8">
        <PrimaryButton onClick={() => navigate("/reservation")}>
          → Fazer check-in
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/checkout/identify")}>
          Fazer check-out
        </GhostButton>
        <GhostButton>Informações do hotel</GhostButton>
        <GhostButton>Chamar recepção</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Menu;
