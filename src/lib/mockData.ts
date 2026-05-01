import { translate } from "@/lib/i18n";
import type { Language } from "@/context/CheckInContext";

export const mockReservation = {
  guestName: "V. da Silva",
  room: "412",
  roomType: "Standard duplo",
  checkIn: "2026-04-28",
  checkOut: "2026-05-02",
  floor: 4,
  wing: "leste",
};

export type Reservation = typeof mockReservation;

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
