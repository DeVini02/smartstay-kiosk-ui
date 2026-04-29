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

export const formatStayRange = (r: Reservation) => {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}`;
  };
  const year = r.checkOut.split("-")[0];
  return `${fmt(r.checkIn)} a ${fmt(r.checkOut)}/${year}`;
};
