import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GhostButton } from "@/components/GhostButton";
import { useCheckIn, type Language } from "@/context/CheckInContext";

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { setLanguage } = useCheckIn();

  const choose = (l: Language) => {
    setLanguage(l);
    navigate("/menu");
  };

  return (
    <ScreenShell step={{ total: 6, current: 1 }}>
      <div className="flex flex-col gap-2 mt-2">
        <h1 className="text-display text-text-primary">Selecione o idioma</h1>
        <p className="text-body text-text-secondary">Select language</p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <GhostButton onClick={() => choose("pt")} className="!min-h-[64px] text-left justify-start">
          🇧🇷  Português
        </GhostButton>
        <GhostButton onClick={() => choose("en")} className="!min-h-[64px] text-left justify-start">
          🇺🇸  English
        </GhostButton>
        <GhostButton onClick={() => choose("es")} className="!min-h-[64px] text-left justify-start">
          🇪🇸  Español
        </GhostButton>
      </div>

      <div className="mt-auto pt-6 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="text-small text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Voltar
        </button>
      </div>
    </ScreenShell>
  );
};

export default LanguageSelect;
