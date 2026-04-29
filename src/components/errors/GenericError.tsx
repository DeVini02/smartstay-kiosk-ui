import { Settings } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";

interface Props {
  onHome?: () => void;
  onReception?: () => void;
  errorCode?: string;
}

export const GenericError = ({
  onHome,
  onReception,
  errorCode = "SYS-500 · 14:32",
}: Props) => (
  <div className="flex-1 flex flex-col items-center text-center pt-8 px-2">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Settings
        size={36}
        className="text-text-secondary animate-spin-slow"
        aria-hidden="true"
      />
    </div>
    <h1 className="text-display text-text-primary mt-5">Algo deu errado</h1>
    <p className="text-body text-text-secondary mt-2 max-w-[300px]">
      Tivemos um problema inesperado. A recepção já foi notificada.
    </p>

    <span
      className="mt-5 px-3 py-1.5 rounded-md text-mono-tiny"
      style={{
        background: "rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.65)",
      }}
    >
      Código do erro: {errorCode}
    </span>

    <div className="flex flex-col gap-3 w-full mt-auto pt-8">
      <PrimaryButton onClick={onHome}>Voltar ao início</PrimaryButton>
      <GhostButton onClick={onReception}>Falar com a recepção</GhostButton>
    </div>
  </div>
);
