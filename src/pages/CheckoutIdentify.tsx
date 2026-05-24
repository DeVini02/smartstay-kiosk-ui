import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { GhostButton } from "@/components/GhostButton";
import { FaceNotRecognized } from "@/components/errors/FaceNotRecognized";
import { NoConnection } from "@/components/errors/NoConnection";
import { breathingDot, pulseRing } from "@/lib/animations";
import { useT } from "@/lib/i18n";
import { useCheckIn } from "@/context/CheckInContext";
import { DEMO_CHECKOUT_FACE_ID, isApiEnabled, isDemoMode } from "@/lib/api/config";
import { ApiError, checkoutIdentify } from "@/lib/api/client";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { useCameraPreview } from "@/hooks/useCameraPreview";

const CheckoutIdentify = () => {
  const navigate = useNavigate();
  const t = useT();
  const {
    videoRef,
    status: cameraStatus,
    isReady: cameraReady,
    retry: retryCamera,
    stopCamera,
  } = useCameraPreview();
  const [faceError, setFaceError] = useState(false);
  const [offline, setOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { reservation, setCheckoutSessionId, setCheckoutSummary } = useCheckIn();
  const { profile } = usePersonalization();
  const cameraUnavailable = cameraStatus === "unavailable";

  const identify = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setFaceError(false);
    setOffline(false);

    if (!isApiEnabled()) {
      stopCamera();
      navigate("/checkout/summary");
      return;
    }

    const faceEmbeddingId =
      reservation?.id ? undefined : isDemoMode() ? DEMO_CHECKOUT_FACE_ID : profile?.faceEmbeddingId;

    if (!reservation?.id && !faceEmbeddingId) {
      stopCamera();
      setFaceError(true);
      setSubmitting(false);
      return;
    }

    try {
      const summary = await checkoutIdentify({
        reservationId: reservation?.id,
        faceEmbeddingId,
      });
      setCheckoutSessionId(summary.session_id);
      setCheckoutSummary({
        sessionId: summary.session_id,
        guestName: summary.guest_name,
        room: summary.room,
        checkIn: summary.reservation.check_in,
        checkOut: summary.reservation.check_out,
        nights: summary.nights,
        extras: summary.extras,
        totalAmount: summary.total_amount,
      });
      stopCamera();
      navigate("/checkout/summary");
    } catch (e) {
      stopCamera();
      if (e instanceof ApiError && e.status === 404) {
        setFaceError(true);
      } else {
        setOffline(true);
      }
      setSubmitting(false);
    }
  }, [
    navigate,
    profile?.faceEmbeddingId,
    reservation?.id,
    setCheckoutSessionId,
    setCheckoutSummary,
    stopCamera,
    submitting,
  ]);

  useEffect(() => {
    if (!cameraReady || submitting) return;
    const tm = setTimeout(() => {
      void identify();
    }, 4000);
    return () => clearTimeout(tm);
  }, [cameraReady, identify, submitting]);

  if (offline) {
    return (
      <ScreenShell step={{ total: 4, current: 1, accent: "warn" }} status="warn">
        <NoConnection onReception={() => navigate("/menu")} />
      </ScreenShell>
    );
  }

  if (faceError) {
    return (
      <ScreenShell step={{ total: 4, current: 1, accent: "warn" }} status="warn">
        <FaceNotRecognized
          onUseCode={() => navigate("/reservation?flow=checkout")}
          onReception={() => navigate("/menu")}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell step={{ total: 4, current: 1 }}>
      <h1 className="text-display text-text-primary mt-2 leading-[1.15]">
        {t("ci.title_1")}
        <br />
        {t("ci.title_2")}
      </h1>
      <p className="text-body text-text-secondary mt-2">{t("ci.subtitle")}</p>

      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className="relative w-[170px] h-[170px] flex items-center justify-center"
          aria-live="polite"
          aria-label={cameraUnavailable ? t("cap.unavailable") : t("ci.identifying")}
        >
          <motion.span
            variants={pulseRing}
            animate="animate"
            className="absolute inset-0 rounded-full border border-brand-primary/50"
            aria-hidden="true"
          />
          <div
            className="relative w-[170px] h-[170px] rounded-full overflow-hidden border-[1.5px] border-brand-primary/70"
            style={{
              background:
                "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
            }}
          >
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                cameraReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transform: "scaleX(-1)" }}
            />
            {cameraUnavailable && (
              <div className="absolute inset-0 flex items-center justify-center text-small text-text-secondary px-4 text-center">
                {t("cap.unavailable")}
              </div>
            )}
            <User
              size={64}
              className={`absolute inset-0 m-auto text-white transition-opacity ${
                cameraReady ? "opacity-0" : "opacity-40"
              }`}
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 h-[2px] animate-scan-line pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #A78BFA, #5EEAD4, #A78BFA, transparent)",
                boxShadow: "0 0 12px rgba(167,139,250,0.8)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <GlassCard className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 0.3, 0.6].map((d, i) => (
                <motion.span
                  key={i}
                  variants={breathingDot}
                  animate="animate"
                  transition={{ delay: d }}
                  className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                />
              ))}
            </div>
            <span className="text-small text-text-primary">{t("ci.identifying")}</span>
          </div>
          <span className="text-mono-tiny text-text-tertiary">v1.0</span>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3">
        {cameraUnavailable && (
          <GhostButton onClick={() => void retryCamera()}>{t("common.try_again")}</GhostButton>
        )}
        <GhostButton
          onClick={() => {
            stopCamera();
            navigate("/reservation?flow=checkout");
          }}
        >
          {t("ci.use_code")}
        </GhostButton>
      </div>
    </ScreenShell>
  );
};

export default CheckoutIdentify;
