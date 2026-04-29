import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";

const Processing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/key"), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <ScreenShell showHeader={false}>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <div
          className="w-[60px] h-[60px] rounded-full animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #A78BFA 360deg)",
            mask: "radial-gradient(circle, transparent 22px, black 23px)",
            WebkitMask:
              "radial-gradient(circle, transparent 22px, black 23px)",
          }}
          aria-label="Carregando"
        />
        <h1 className="text-heading text-text-primary">Processando</h1>
        <p className="text-body text-text-secondary max-w-[260px]">
          Validando identidade e gerando sua chave digital
        </p>
      </div>
    </ScreenShell>
  );
};

export default Processing;
