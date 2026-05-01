import { Search } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";

interface Props {
  onRetry?: () => void;
  onReception?: () => void;
}

export const ReservationNotFound = ({ onRetry, onReception }: Props) => {
  const t = useT();
  return (
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
      <h1 className="text-display text-text-primary mt-5">{t("err.res.title")}</h1>
      <p className="text-body text-text-secondary mt-2 max-w-[300px]">
        {t("err.res.body")}
      </p>
      <div className="flex flex-col gap-3 w-full mt-auto pt-8">
        <PrimaryButton onClick={onRetry}>{t("common.try_again")}</PrimaryButton>
        <GhostButton onClick={onReception}>{t("common.talk_reception")}</GhostButton>
      </div>
    </div>
  );
};
