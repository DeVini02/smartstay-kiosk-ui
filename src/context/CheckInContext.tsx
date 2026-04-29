import { createContext, useContext, useState, type ReactNode } from "react";
import { mockReservation, type Reservation } from "@/lib/mockData";

export type Language = "pt" | "en" | "es";

interface CheckInState {
  language: Language;
  setLanguage: (l: Language) => void;
  reservation: Reservation | null;
  setReservation: (r: Reservation | null) => void;
  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;
  faceCaptureCompleted: boolean;
  setFaceCaptureCompleted: (v: boolean) => void;
  reset: () => void;
}

const CheckInContext = createContext<CheckInState | null>(null);

export const CheckInProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("pt");
  const [reservation, setReservation] = useState<Reservation | null>(mockReservation);
  const [consentGiven, setConsentGiven] = useState(false);
  const [faceCaptureCompleted, setFaceCaptureCompleted] = useState(false);

  const reset = () => {
    setLanguage("pt");
    setReservation(mockReservation);
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
