import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GenericError } from "@/components/errors/GenericError";
import { useT } from "@/lib/i18n";
import { useCheckIn } from "@/context/CheckInContext";
import { isDemoMode } from "@/lib/api/config";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (iso?: string) => {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

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
  const { checkoutSummary } = useCheckIn();

  if (!checkoutSummary && !isDemoMode()) {
    return (
      <ScreenShell step={{ total: 4, current: 2, accent: "warn" }} status="warn">
        <GenericError
          errorCode="CHECKOUT-SUMMARY"
          onHome={() => navigate("/checkout/identify")}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  const nights = checkoutSummary?.nights ?? 4;
  const extras = checkoutSummary?.extras ?? [
    { label: "Frigobar · 30/04", amount: 42 },
    { label: "Restaurante · 01/05", amount: 128 },
  ];
  const total = checkoutSummary?.totalAmount ?? 1690;
  const roomTotal = total - extras.reduce((s, e) => s + e.amount, 0);
  const summaryLine =
    checkoutSummary?.guestName && checkoutSummary?.room
      ? `${checkoutSummary.guestName}, quarto ${checkoutSummary.room} · ${fmtDate(
          checkoutSummary.checkIn
        )} a ${fmtDate(checkoutSummary.checkOut)}`
      : t("cs.subtitle");

  return (
    <ScreenShell step={{ total: 4, current: 2 }}>
      <h1 className="text-display text-text-primary mt-2">{t("cs.title")}</h1>
      <p className="text-body text-text-secondary mt-1">{summaryLine}</p>

      <div className="flex flex-col gap-3 mt-5">
        <GlassCard>
          <span className="text-label text-text-secondary">{t("cs.nights")}</span>
          <div className="mt-2">
            <Row
              left={`R$ ${Math.round(roomTotal / Math.max(nights, 1))} × ${nights}`}
              right={fmt(roomTotal)}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-label text-text-secondary">{t("cs.consumption")}</span>
          <div className="mt-2">
            {extras.map((e) => (
              <Row key={e.label} left={e.label} right={fmt(e.amount)} />
            ))}
          </div>
          <button className="mt-2 text-small" style={{ color: "#60A5FA" }} type="button">
            {t("cs.dispute")}
          </button>
        </GlassCard>

        <GlassCard accent="teal">
          <div className="flex items-center justify-between">
            <span className="text-title text-text-primary">{t("cs.total")}</span>
            <span className="text-title" style={{ color: "#5EEAD4", fontWeight: 500 }}>
              {fmt(total)}
            </span>
          </div>
          <p className="text-label mt-1" style={{ color: "rgba(94,234,212,0.75)" }}>
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
