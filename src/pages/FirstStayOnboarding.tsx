import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "@/components/ScreenShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";

type Step = 0 | 1 | 2 | 3;

const FirstStayOnboarding = () => {
  const navigate = useNavigate();
  const t = useT();
  const { updatePreference, setConsent } = usePersonalization();
  const [step, setStep] = useState<Step>(0);

  const next = () => setStep((s) => ((s + 1) as Step));

  const pickClimate = (temp: number) => {
    updatePreference("comfort", { temperature: temp });
    next();
  };
  const pickLighting = (tone: "warm" | "neutral" | "cool") => {
    updatePreference("comfort", { lightingTone: tone });
    next();
  };
  const pickView = (view: "east" | "west" | "north" | "any") => {
    updatePreference("stay", { preferredView: view });
    next();
  };

  const activate = () => {
    setConsent("comfort", true, "onboarding");
    setConsent("stay", true, "onboarding");
    navigate("/goodbye");
  };

  const skipAll = () => navigate("/goodbye");

  return (
    <ScreenShell step={{ total: 4, current: (step + 1) as number }}>
      {step === 0 && (
        <>
          <h1 className="text-heading text-text-primary mt-3">{t("p.onb.q1")}</h1>
          <div className="flex flex-col gap-3 mt-6">
            <GhostButton onClick={() => pickClimate(20)}>{t("p.onb.q1.cold")}</GhostButton>
            <GhostButton onClick={() => pickClimate(22)}>{t("p.onb.q1.mid")}</GhostButton>
            <GhostButton onClick={() => pickClimate(24)}>{t("p.onb.q1.warm")}</GhostButton>
          </div>
          <button onClick={next} className="text-small text-text-secondary mt-4 self-center">
            {t("p.onb.skip_q")}
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="text-heading text-text-primary mt-3">{t("p.onb.q2")}</h1>
          <div className="flex flex-col gap-3 mt-6">
            {([
              ["cool", "p.onb.q2.cool", "#7dd3fc"],
              ["neutral", "p.onb.q2.neutral", "#e2e8f0"],
              ["warm", "p.onb.q2.warm", "#fbbf24"],
            ] as const).map(([tone, key, color]) => (
              <GhostButton key={tone} onClick={() => pickLighting(tone)}>
                <span className="inline-flex items-center gap-3 justify-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    aria-hidden="true"
                  />
                  {t(key)}
                </span>
              </GhostButton>
            ))}
          </div>
          <button onClick={next} className="text-small text-text-secondary mt-4 self-center">
            {t("p.onb.skip_q")}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-heading text-text-primary mt-3">{t("p.onb.q3")}</h1>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <GhostButton onClick={() => pickView("east")}>{t("p.onb.q3.east")}</GhostButton>
            <GhostButton onClick={() => pickView("west")}>{t("p.onb.q3.west")}</GhostButton>
            <GhostButton onClick={() => pickView("north")}>{t("p.onb.q3.north")}</GhostButton>
            <GhostButton onClick={() => pickView("any")}>{t("p.onb.q3.any")}</GhostButton>
          </div>
          <button onClick={next} className="text-small text-text-secondary mt-4 self-center">
            {t("p.onb.skip_q")}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-heading text-text-primary mt-3">{t("p.onb.final.title")}</h1>
          <p className="text-body text-text-secondary mt-2">
            {t("p.onb.final.subtitle")}
          </p>
          <div className="mt-auto pt-6 flex flex-col gap-3">
            <PrimaryButton onClick={activate}>{t("p.onb.activate")}</PrimaryButton>
            <GhostButton onClick={skipAll}>{t("p.onb.skip")}</GhostButton>
          </div>
        </>
      )}
    </ScreenShell>
  );
};

export default FirstStayOnboarding;
