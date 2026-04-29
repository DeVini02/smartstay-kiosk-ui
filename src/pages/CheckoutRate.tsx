import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { StatusBadge } from "@/components/StatusBadge";

const CheckoutRate = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <ScreenShell>
      <StatusBadge variant="success" icon={Check} className="self-start mt-1">
        CHECK-OUT CONCLUÍDO
      </StatusBadge>

      <h1 className="text-display text-text-primary mt-3">
        Como foi sua estadia?
      </h1>
      <p className="text-body text-text-secondary mt-1">
        Opcional · leva 10 segundos
      </p>

      <GlassCard className="mt-5 flex flex-col items-center !py-5">
        <span className="text-small text-text-secondary">Toque nas estrelas</span>
        <div
          className="flex gap-2 mt-3"
          role="radiogroup"
          aria-label="Avaliação por estrelas"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= rating;
            return (
              <motion.button
                key={n}
                whileTap={{ scale: 0.85 }}
                onClick={() => setRating(n)}
                aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={filled}
                className="p-1"
              >
                <Star
                  size={32}
                  strokeWidth={filled ? 0 : 1.5}
                  fill={filled ? "#FBBF24" : "transparent"}
                  color={filled ? "#FBBF24" : "rgba(255,255,255,0.4)"}
                  className="transition-all"
                />
              </motion.button>
            );
          })}
        </div>
        <div className="flex justify-between w-full mt-2 px-1">
          <span className="text-mono-tiny text-text-tertiary">Ruim</span>
          <span className="text-mono-tiny text-text-tertiary">Excelente</span>
        </div>
      </GlassCard>

      <GlassCard className="mt-3">
        <span className="text-label text-text-secondary">
          Comentário (opcional)
        </span>
        <div
          className="mt-2 h-[60px] rounded-md bg-white/[0.03] border border-white/10"
          role="textbox"
          aria-label="Comentário opcional"
        />
      </GlassCard>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={() => navigate("/checkout/goodbye")}>
          Enviar avaliação
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/checkout/goodbye")}>
          Pular · finalizar
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default CheckoutRate;
