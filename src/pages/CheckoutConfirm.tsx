import { useNavigate } from "react-router-dom";
import { Check, AlertTriangle } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";

const items = [
  "Sua chave digital será desativada",
  "O quarto 412 será liberado para limpeza",
  "O comprovante será enviado por e-mail",
  "Seus dados biométricos serão apagados em 30 dias",
];

const CheckoutConfirm = () => {
  const navigate = useNavigate();
  return (
    <ScreenShell step={{ total: 4, current: 3 }}>
      <h1 className="text-display text-text-primary mt-2">Confirmar saída?</h1>

      <GlassCard className="mt-5">
        <p className="text-body text-text-primary mb-3">Ao confirmar:</p>
        <ul className="flex flex-col gap-2.5">
          {items.map((it) => (
            <li key={it} className="flex gap-2.5 items-start">
              <span className="mt-1 w-4 h-4 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-brand-primary" />
              </span>
              <span className="text-body text-text-primary">{it}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard accent="amber" className="mt-3">
        <div className="flex gap-2.5 items-start">
          <AlertTriangle
            size={16}
            className="text-warn flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-body text-text-primary">
            <span style={{ color: "#FBBF24", fontWeight: 500 }}>Atenção:</span>{" "}
            deixou algo no quarto? Procure a recepção antes de confirmar.
          </p>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={() => navigate("/checkout/rate")}>
          Confirmar saída
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/checkout/summary")}>
          ← Voltar
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default CheckoutConfirm;
