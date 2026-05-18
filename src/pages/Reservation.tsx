import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { NumericKeypad } from "@/components/NumericKeypad";
import { ReservationNotFound } from "@/components/errors/ReservationNotFound";
import { NoConnection } from "@/components/errors/NoConnection";
import { useCheckIn, getDemoReservation } from "@/context/CheckInContext";
import { useT } from "@/lib/i18n";
import { isApiEnabled } from "@/lib/api/config";
import { ApiError, lookupReservation } from "@/lib/api/client";
import { mapReservation } from "@/lib/api/mappers";

type Field = "code" | "doc" | null;

const Reservation = () => {
  const navigate = useNavigate();
  const t = useT();
  const { setReservation } = useCheckIn();
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [active, setActive] = useState<Field>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [offline, setOffline] = useState(false);

  const onKey = (k: string) => {
    if (active === "code" && code.length < 4) setCode(code + k);
    if (active === "doc" && doc.length < 11) setDoc(doc + k);
  };
  const onBackspace = () => {
    if (active === "code") setCode(code.slice(0, -1));
    if (active === "doc") setDoc(doc.slice(0, -1));
  };

  const codeDisplay = `RES-2026-${(code + "____").slice(0, 4)}`;

  const handleSearch = async () => {
    setNotFound(false);
    setOffline(false);

    if (!isApiEnabled()) {
      setReservation(getDemoReservation());
      navigate("/confirm");
      return;
    }

    if (code.length < 4 && doc.length < 11) {
      setNotFound(true);
      return;
    }

    setLoading(true);
    try {
      const data = await lookupReservation({
        code: code.length === 4 ? code : undefined,
        document: doc.length >= 11 ? doc : undefined,
      });
      setReservation(mapReservation(data));
      navigate("/confirm");
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setNotFound(true);
      else setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  if (offline) {
    return (
      <ScreenShell>
        <NoConnection onReception={() => { setOffline(false); navigate("/menu"); }} />
      </ScreenShell>
    );
  }

  if (notFound) {
    return (
      <ScreenShell>
        <ReservationNotFound
          onRetry={() => setNotFound(false)}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell step={{ total: 6, current: 3 }}>
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-display text-text-primary">{t("res.title")}</h1>
        <p className="text-body text-text-secondary">{t("res.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <GlassCard accent={active === "code" ? "purple" : undefined}>
          <span className="text-label text-text-secondary">{t("res.code_label")}</span>
          <button
            type="button"
            onClick={() => setActive("code")}
            className={`w-full mt-2 text-left font-mono text-title tracking-[0.2em] py-2 border-b transition-colors ${
              active === "code" ? "border-brand-primary" : "border-white/15"
            }`}
          >
            {codeDisplay}
          </button>
        </GlassCard>

        <div className="text-center text-text-tertiary text-small">{t("common.or")}</div>

        <GlassCard accent={active === "doc" ? "purple" : undefined}>
          <span className="text-label text-text-secondary">{t("res.doc_label")}</span>
          <button
            type="button"
            onClick={() => setActive("doc")}
            className={`w-full mt-2 text-left font-mono text-title tracking-wider py-2 border-b transition-colors min-h-[36px] ${
              active === "doc" ? "border-brand-primary" : "border-white/15"
            }`}
          >
            {doc || <span className="text-text-tertiary">000.000.000-00</span>}
          </button>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6">
        <PrimaryButton onClick={handleSearch} disabled={loading}>
          {loading ? t("common.loading") : t("res.search")}
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/menu")}>{t("res.no_code")}</GhostButton>
      </div>

      <NumericKeypad
        open={active !== null}
        onKey={onKey}
        onBackspace={onBackspace}
        onConfirm={() => setActive(null)}
      />
    </ScreenShell>
  );
};

export default Reservation;
