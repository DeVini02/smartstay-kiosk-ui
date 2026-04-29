import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useCheckIn } from "@/context/CheckInContext";

const items = [
  "Capturar uma foto sua agora no totem",
  "Converter a foto em código numérico (vetor)",
  "Apagar a foto após gerar o código",
  "Apagar todos os dados em até 30 dias após o check-out",
];

const LGPD = () => {
  const navigate = useNavigate();
  const { setConsentGiven } = useCheckIn();

  const accept = () => {
    setConsentGiven(true);
    navigate("/capture");
  };

  return (
    <ScreenShell step={{ total: 6, current: 5 }}>
      <h1
        className="text-text-primary mt-2"
        style={{ fontSize: "20px", fontWeight: 500, letterSpacing: "-0.3px" }}
      >
        Uso da sua imagem
      </h1>

      <GlassCard accent="purple" className="mt-5 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          <p className="text-body text-text-primary mb-3">
            Para fazer o check-in por reconhecimento facial precisamos:
          </p>
          <ul className="flex flex-col gap-2.5">
            {items.map((item) => (
              <li key={item} className="flex gap-2.5 items-start">
                <span className="mt-1 w-4 h-4 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-brand-primary" />
                </span>
                <span className="text-body text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-body text-text-secondary mt-4">
            Você pode pedir exclusão a qualquer momento na recepção.
          </p>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3 mt-6">
        <PrimaryButton onClick={accept}>Aceito e continuar</PrimaryButton>
        <GhostButton
          onClick={() => navigate("/menu")}
          className="!border-danger/40 !text-danger"
        >
          Não aceito · check-in na recepção
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default LGPD;
