import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { ScreenShell } from "@/components/ScreenShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";

const Menu = () => {
  const navigate = useNavigate();
  const t = useT();
  const { isReturningGuest } = usePersonalization();
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
        <GhostButton
          onClick={() =>
            toast(t("menu.info_soon"), { description: t("a11y.todo_desc") })
          }
        >
          {t("menu.info")}
        </GhostButton>
        <GhostButton
          onClick={() =>
            toast(t("menu.reception_called"), {
              description: t("menu.reception_desc"),
            })
          }
        >
          {t("menu.reception")}
        </GhostButton>
        {isReturningGuest && (
          <GhostButton onClick={() => navigate("/my-profile")}>
            <span className="inline-flex items-center gap-2 justify-center">
              <Star size={14} className="text-brand-primary" aria-hidden="true" />
              {t("p.menu.profile")}
            </span>
          </GhostButton>
        )}
      </div>
    </ScreenShell>
  );
};

export default Menu;
