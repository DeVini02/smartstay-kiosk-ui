import { Search } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";

interface Props {
  onRetry?: () => void;
  onReception?: () => void;
}

export const ReservationNotFound = ({ onRetry, onReception }: Props) => (
  <div className="flex-1 flex flex-col items-center text-center pt-8 px-2">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{
        background: "rgba(251,113,133,0.12)",
        border: "1px solid rgba(251,113,133,0.4)",
      }}
    >
      <Search size={36} className="text-danger" aria-hidden="true" />
    </div>
    <h1 className="text-display text-text-primary mt-5">
      Não encontramos sua reserva
    </h1>
    <p className="text-body text-text-secondary mt-2 max-w-[300px]">
      Pode ser que o código tenha digitação diferente, ou a reserva esteja em
      outro nome.
    </p>
    <div className="flex flex-col gap-3 w-full mt-auto pt-8">
      <PrimaryButton onClick={onRetry}>Tentar novamente</PrimaryButton>
      <GhostButton onClick={onReception}>Falar com a recepção</GhostButton>
    </div>
  </div>
);
