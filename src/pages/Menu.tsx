import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";

const Menu = () => {
  const navigate = useNavigate();
  const t = useT();
  return (
    <ScreenShell step={{ total: 6, current: 2 }}>
      <h1 className="text-display text-text-primary mt-2">{t("menu.title")}</h1>

      <div className="flex flex-col gap-3 mt-8">
        <PrimaryButton onClick={() => navigate("/reservation")}>
          {t("menu.checkin")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/checkout/identify")}>
          {t("menu.checkout")}
        </GhostButton>
        <GhostButton>{t("menu.info")}</GhostButton>
        <GhostButton>{t("menu.reception")}</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Menu;
