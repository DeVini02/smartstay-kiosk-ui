import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useT } from "@/lib/i18n";

const Row = ({ left, right }: { left: string; right: string }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-body text-text-secondary">{left}</span>
    <span className="text-body text-text-primary" style={{ fontWeight: 500 }}>
      {right}
    </span>
  </div>
);

const CheckoutSummary = () => {
  const navigate = useNavigate();
  const t = useT();
  return (
    <ScreenShell step={{ total: 4, current: 2 }}>
      <h1 className="text-display text-text-primary mt-2">{t("cs.title")}</h1>
      <p className="text-body text-text-secondary mt-1">{t("cs.subtitle")}</p>

      <div className="flex flex-col gap-3 mt-5">
        <GlassCard>
          <span className="text-label text-text-secondary">{t("cs.nights")}</span>
          <div className="mt-2">
            <Row left="R$ 380 × 4" right="R$ 1.520,00" />
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-label text-text-secondary">{t("cs.consumption")}</span>
          <div className="mt-2">
            <Row left="Frigobar · 30/04" right="R$ 42,00" />
            <Row left="Restaurante · 01/05" right="R$ 128,00" />
          </div>
          <button
            className="mt-2 text-small"
            style={{ color: "#60A5FA" }}
            onClick={() => {}}
          >
            {t("cs.dispute")}
          </button>
        </GlassCard>

        <GlassCard accent="teal">
          <div className="flex items-center justify-between">
            <span className="text-title text-text-primary">{t("cs.total")}</span>
            <span
              className="text-title"
              style={{ color: "#5EEAD4", fontWeight: 500 }}
            >
              R$ 1.690,00
            </span>
          </div>
          <p
            className="text-label mt-1"
            style={{ color: "rgba(94,234,212,0.75)" }}
          >
            {t("cs.paid")}
          </p>
        </GlassCard>
      </div>

      <div className="mt-auto pt-6">
        <PrimaryButton onClick={() => navigate("/checkout/confirm")}>
          {t("common.continue")}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};

export default CheckoutSummary;
