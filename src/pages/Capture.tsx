import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { GhostButton } from "@/components/GhostButton";
import { breathingDot, pulseRing } from "@/lib/animations";
import { useCheckIn } from "@/context/CheckInContext";

const Capture = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOk, setCameraOk] = useState<boolean | null>(null);
  const { setFaceCaptureCompleted } = useCheckIn();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraOk(true);
      } catch {
        setCameraOk(false);
      }
    })();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (cameraOk !== true) return;
    const t = setTimeout(() => {
      setFaceCaptureCompleted(true);
      navigate("/processing");
    }, 4000);
    return () => clearTimeout(t);
  }, [cameraOk, navigate, setFaceCaptureCompleted]);

  return (
    <ScreenShell step={{ total: 6, current: 6 }}>
      <span className="text-label text-brand-primary/85 mt-2">
        PASSO 6 DE 6
      </span>
      <h1 className="text-display text-text-primary mt-1 leading-[1.15]">
        Olhe para
        <br />
        a câmera
      </h1>
      <p className="text-body text-text-secondary mt-2">
        Vamos validar sua identidade. Captura automática.
      </p>

      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative w-[170px] h-[170px] flex items-center justify-center">
          <motion.span
            variants={pulseRing}
            animate="animate"
            className="absolute inset-0 rounded-full border border-brand-primary/50"
            aria-hidden="true"
          />
          <motion.span
            variants={pulseRing}
            animate="animate"
            transition={{ delay: 1.2 }}
            className="absolute -inset-3 rounded-full border border-brand-primary/30"
            aria-hidden="true"
          />

          <div
            className="relative w-[170px] h-[170px] rounded-full overflow-hidden border-[1.5px] border-brand-primary/70"
            style={{
              background:
                "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
            }}
          >
            {cameraOk && (
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            )}
            {cameraOk === false && (
              <div className="absolute inset-0 flex items-center justify-center text-small text-text-secondary px-4 text-center">
                Câmera indisponível
              </div>
            )}

            <User
              size={64}
              className="absolute inset-0 m-auto text-white"
              style={{ opacity: 0.4 }}
              aria-hidden="true"
            />

            {/* scan line */}
            <div
              className="absolute inset-x-0 h-[2px] animate-scan-line pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #A78BFA, #5EEAD4, #A78BFA, transparent)",
                boxShadow: "0 0 12px rgba(167,139,250,0.8)",
              }}
              aria-hidden="true"
            />

            {/* facial keypoints */}
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-brand-primary"
              style={{ top: "28%", left: "50%", transform: "translateX(-50%)" }}
              aria-hidden="true"
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-success"
              style={{ top: "55%", left: "30%" }}
              aria-hidden="true"
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-success"
              style={{ top: "55%", right: "30%" }}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="text-small text-text-secondary text-center">
          Posicione seu rosto dentro do círculo
        </p>
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
            <span className="text-small text-text-primary">
              Detectando rosto
            </span>
          </div>
          <span className="text-mono-tiny text-text-tertiary">v1.0</span>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-3">
        <PrimaryButton
          onClick={() => {
            setFaceCaptureCompleted(true);
            navigate("/processing");
          }}
        >
          Capturar agora
        </PrimaryButton>
        <GhostButton onClick={() => navigate("/lgpd")}>Cancelar</GhostButton>
      </div>
    </ScreenShell>
  );
};

export default Capture;
