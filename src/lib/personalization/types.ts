export type PreferenceCategory = "comfort" | "stay" | "consumption";

export interface ComfortPrefs {
  temperature: number;
  acIntensity: "low" | "medium" | "high";
  lightingTone: "warm" | "neutral" | "cool";
  lightingBrightness: number;
  curtainPosition: "open" | "closed" | "partial";
}

export interface StayPrefs {
  preferredFloor: "low" | "mid" | "high";
  preferredView: "east" | "west" | "north" | "south" | "any";
  bedType: "double" | "twin" | "king";
  smokingRoom: boolean;
}

export interface ConsumptionPrefs {
  favoriteFrigobar: string[];
  favoriteRestaurantItems: string[];
  preferredCheckOutTime: string;
}

export interface GuestProfile {
  guestId: string;
  faceEmbeddingId: string;
  memberSince: string;
  totalStays: number;
  averageRating: number;
  consents: Record<PreferenceCategory, boolean>;
  preferences: {
    comfort?: ComfortPrefs;
    stay?: StayPrefs;
    consumption?: ConsumptionPrefs;
  };
}

export interface IoTCommand {
  device: "thermostat" | "lighting" | "curtains" | "tv" | "music";
  action: string;
  value: unknown;
  status: "pending" | "in_progress" | "completed" | "failed";
  timestamp?: string;
}
