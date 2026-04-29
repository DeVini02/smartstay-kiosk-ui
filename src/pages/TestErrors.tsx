import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { GhostButton } from "@/components/GhostButton";
import { ReservationNotFound } from "@/components/errors/ReservationNotFound";
import { FaceNotRecognized } from "@/components/errors/FaceNotRecognized";
import { NoConnection } from "@/components/errors/NoConnection";
import { GenericError } from "@/components/errors/GenericError";

type ErrKey = "reservation" | "face" | "network" | "generic";

const labels: Record<ErrKey, string> = {
  reservation: "ReservationNotFound",
  face: "FaceNotRecognized",
  network: "NoConnection",
  generic: "GenericError",
};

const TestErrors = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<ErrKey>("reservation");

  return (
    <ScreenShell
      step={
        active === "face"
          ? { total: 6, current: 6, accent: "warn" }
          : undefined
      }
      status={active === "network" || active === "generic" ? "warn" : "ok"}
    >
      <div className="flex gap-1 mt-2 flex-wrap">
        {(Object.keys(labels) as ErrKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`px-2 py-1 rounded-sm text-mono-tiny border ${
              active === k
                ? "bg-glass-bg border-brand-primary text-brand-primary"
                : "bg-transparent border-white/10 text-text-secondary"
            }`}
          >
            {labels[k]}
          </button>
        ))}
      </div>

      {active === "reservation" && <ReservationNotFound />}
      {active === "face" && <FaceNotRecognized />}
      {active === "network" && <NoConnection />}
      {active === "generic" && <GenericError />}

      <GhostButton onClick={() => navigate("/")} className="mt-3">
        ← Sair do modo teste
      </GhostButton>
    </ScreenShell>
  );
};

export default TestErrors;
