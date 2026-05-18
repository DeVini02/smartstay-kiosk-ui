export interface ApiReservation {
  id: string;
  code: string;
  guest_name: string;
  room: string;
  room_type: string;
  check_in: string;
  check_out: string;
  floor: number;
  wing: string;
  status: string;
  guest_id: string;
  is_returning_guest: boolean;
}

export interface ApiGuestProfile {
  guest_id: string;
  face_embedding_id: string | null;
  member_since: string;
  total_stays: number;
  average_rating: number;
  consents: { comfort: boolean; stay: boolean; consumption: boolean };
  preferences: {
    comfort?: {
      temperature: number;
      ac_intensity: string;
      lighting_tone: string;
      lighting_brightness: number;
      curtain_position: string;
    };
    stay?: Record<string, unknown>;
    consumption?: Record<string, unknown>;
  };
}

export interface ApiCheckInComplete {
  session_id: string;
  digital_key_token: string;
  qr_payload: string;
  room: string;
  guest_name: string;
  wifi_ssid: string;
  wifi_password: string;
  apply_personalization: boolean;
}

export interface ApiCheckoutSummary {
  session_id: string;
  reservation: ApiReservation;
  guest_name: string;
  room: string;
  nights: number;
  extras: { label: string; amount: number }[];
  total_amount: number;
}
