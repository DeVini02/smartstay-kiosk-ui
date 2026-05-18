import { createContext, useContext, useState, type ReactNode } from "react";
import { mockReservation, type CheckoutSummaryData, type Reservation } from "@/lib/mockData";

export type Language = "pt" | "en" | "es";

interface CheckInState {
  language: Language;
  setLanguage: (l: Language) => void;
  reservation: Reservation | null;
  setReservation: (r: Reservation | null) => void;
  checkInSessionId: string | null;
  setCheckInSessionId: (id: string | null) => void;
  checkoutSessionId: string | null;
  setCheckoutSessionId: (id: string | null) => void;
  qrPayload: string | null;
  setQrPayload: (v: string | null) => void;
  checkoutSummary: CheckoutSummaryData | null;
  setCheckoutSummary: (s: CheckoutSummaryData | null) => void;
  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;
  faceCaptureCompleted: boolean;
  setFaceCaptureCompleted: (v: boolean) => void;
  reset: () => void;
}

const CheckInContext = createContext<CheckInState | null>(null);

export const CheckInProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("pt");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [checkInSessionId, setCheckInSessionId] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummaryData | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [faceCaptureCompleted, setFaceCaptureCompleted] = useState(false);

  const reset = () => {
    setLanguage("pt");
    setReservation(null);
    setCheckInSessionId(null);
    setCheckoutSessionId(null);
    setQrPayload(null);
    setCheckoutSummary(null);
    setConsentGiven(false);
    setFaceCaptureCompleted(false);
  };

  return (
    <CheckInContext.Provider
      value={{
        language,
        setLanguage,
        reservation,
        setReservation,
        checkInSessionId,
        setCheckInSessionId,
        checkoutSessionId,
        setCheckoutSessionId,
        qrPayload,
        setQrPayload,
        checkoutSummary,
        setCheckoutSummary,
        consentGiven,
        setConsentGiven,
        faceCaptureCompleted,
        setFaceCaptureCompleted,
        reset,
      }}
    >
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => {
  const ctx = useContext(CheckInContext);
  if (!ctx) throw new Error("useCheckIn must be used inside CheckInProvider");
  return ctx;
};

/** Reserva demo para telas de teste / admin */
export const getDemoReservation = () => mockReservation;
