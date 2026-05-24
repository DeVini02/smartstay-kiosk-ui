import { translate } from "@/lib/i18n";
import type { Language } from "@/context/CheckInContext";
import type { GuestProfile } from "@/lib/personalization/types";

export const mockReturningGuest: GuestProfile = {
  guestId: "g_v_silva_001",
  faceEmbeddingId: "fe_a8b2c4",
  memberSince: "2024-03-15",
  totalStays: 7,
  averageRating: 4.8,
  consents: {
    comfort: true,
    stay: true,
    consumption: false,
  },
  preferences: {
    comfort: {
      temperature: 22,
      acIntensity: "low",
      lightingTone: "warm",
      lightingBrightness: 60,
      curtainPosition: "partial",
    },
    stay: {
      preferredFloor: "high",
      preferredView: "east",
      bedType: "double",
      smokingRoom: false,
    },
  },
};

export const mockReservation = {
  id: "res_demo_412",
  guestId: "g_v_silva_001",
  guestName: "V. da Silva",
  room: "412",
  roomType: "Standard duplo",
  checkIn: "2026-04-28",
  checkOut: "2026-05-02",
  floor: 4,
  wing: "leste",
};

export type Reservation = typeof mockReservation;

export type CheckoutSummaryData = {
  sessionId: string;
  guestName?: string;
  room?: string;
  checkIn?: string;
  checkOut?: string;
  nights: number;
  extras: { label: string; amount: number }[];
  totalAmount: number;
};

export const formatStayRange = (r: Reservation, lang: Language = "pt") => {
  const fmt = (iso: string) => {
    const [, m, d] = iso.split("-");
    return lang === "en" ? `${m}/${d}` : `${d}/${m}`;
  };
  const year = r.checkOut.split("-")[0];
  return translate(lang, "stay.range", {
    from: fmt(r.checkIn),
    to: fmt(r.checkOut),
    year,
  });
};
