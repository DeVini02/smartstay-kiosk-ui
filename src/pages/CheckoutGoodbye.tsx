import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hand } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { useCheckIn } from "@/context/CheckInContext";

const CheckoutGoodbye = () => {
  const navigate = useNavigate();
  const { reservation, reset } = useCheckIn();
  const firstName =
    reservation?.guestName.split(" ")[0].replace(".", "") ?? "";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const id = setInterval(
      () => setCountdown((c) => Math.max(0, c - 1)),
      1000
    );
    const t = setTimeout(() => {
      reset();
      navigate("/");
    }, 5000);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [navigate, reset]);

  return (
    <ScreenShell showHeader={false}>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-4">
        <Hand size={64} className="text-text-primary" aria-hidden="true" />
        <h1 className="text-heading text-text-primary">
          Boa viagem, {firstName}!
        </h1>
        <p className="text-body text-text-secondary max-w-[280px]">
          Comprovante enviado pro seu e-mail. Volte sempre.
        </p>
        <span className="text-mono-tiny text-text-tertiary mt-4">
          Voltando à tela inicial em {countdown}s
        </span>
      </div>
    </ScreenShell>
  );
};

export default CheckoutGoodbye;
