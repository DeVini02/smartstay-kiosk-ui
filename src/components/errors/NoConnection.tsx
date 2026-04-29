import { WifiOff } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";

interface Props {
  onReception?: () => void;
  errorCode?: string;
}

export const NoConnection = ({
  onReception,
  errorCode = "NET-503 · 14:32",
}: Props) => (
  <div className="flex-1 flex flex-col items-center text-center pt-8 px-2">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{
        background: "rgba(251,113,133,0.12)",
        border: "1px solid rgba(251,113,133,0.4)",
      }}
    >
      <WifiOff size={36} className="text-danger" aria-hidden="true" />
    </div>
    <h1 className="text-display text-text-primary mt-5">
      Sem conexão no momento
    </h1>
    <p className="text-body text-text-secondary mt-2 max-w-[300px]">
      Não conseguimos falar com o sistema do hotel agora. Por favor, faça seu
      check-in na recepção.
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
      <PrimaryButton onClick={onReception}>Falar com a recepção</PrimaryButton>
    </div>
  </div>
);
