import type { Reservation } from "@/lib/mockData";
import type { GuestProfile } from "@/lib/personalization/types";
import type { ApiGuestProfile, ApiReservation } from "./types";

export const mapReservation = (r: ApiReservation): Reservation & { id: string; guestId: string } => ({
  id: r.id,
  guestId: r.guest_id,
  guestName: r.guest_name,
  room: r.room,
  roomType: r.room_type,
  checkIn: r.check_in,
  checkOut: r.check_out,
  floor: r.floor,
  wing: r.wing,
});

export const mapGuestProfile = (p: ApiGuestProfile): GuestProfile => {
  const c = p.preferences?.comfort;
  const s = p.preferences?.stay as GuestProfile["preferences"]["stay"] | undefined;
  return {
    guestId: p.guest_id,
    faceEmbeddingId: p.face_embedding_id ?? "",
    memberSince: p.member_since,
    totalStays: p.total_stays,
    averageRating: p.average_rating,
    consents: { ...p.consents },
    preferences: {
      comfort: c
        ? {
            temperature: c.temperature,
            acIntensity: c.ac_intensity as "low" | "medium" | "high",
            lightingTone: c.lighting_tone as "warm" | "neutral" | "cool",
            lightingBrightness: c.lighting_brightness,
            curtainPosition: c.curtain_position as "open" | "closed" | "partial",
          }
        : undefined,
      stay: s,
    },
  };
};
