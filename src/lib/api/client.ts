import { API_BASE, KIOSK_API_KEY, isDemoMode } from "./config";
import type {
  ApiCheckInComplete,
  ApiCheckoutSummary,
  ApiGuestProfile,
  ApiReservation,
} from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(KIOSK_API_KEY ? { "X-SmartStay-Key": KIOSK_API_KEY } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(typeof detail === "string" ? detail : JSON.stringify(detail), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const lookupReservation = (params: {
  code?: string;
  document?: string;
  flow?: "checkin" | "checkout";
}) => {
  const q = new URLSearchParams();
  if (params.code) q.set("code", params.code);
  if (params.document) q.set("document", params.document.replace(/\D/g, ""));
  if (params.flow) q.set("flow", params.flow);
  return request<ApiReservation>(`/reservations/lookup?${q}`);
};

export const startCheckIn = (reservationId: string, language: string) =>
  request<{ session_id: string; guest_profile: ApiGuestProfile | null; reservation: ApiReservation }>(
    "/check-in/start",
    {
      method: "POST",
      body: JSON.stringify({ reservation_id: reservationId, language }),
    }
  );

export const postCheckInConsent = (
  sessionId: string,
  consents: { comfort: boolean; stay: boolean; consumption: boolean }
) =>
  request<ApiGuestProfile>(`/check-in/${sessionId}/consent`, {
    method: "POST",
    body: JSON.stringify({ consents }),
  });

export const postCheckInFace = (sessionId: string, faceEmbeddingId?: string | null) =>
  request<{ verified: boolean; is_returning_guest: boolean }>(`/check-in/${sessionId}/face`, {
    method: "POST",
    body: JSON.stringify(
      isDemoMode()
        ? { simulate_match: true }
        : faceEmbeddingId
          ? { face_embedding_id: faceEmbeddingId }
          : { simulate_match: false }
    ),
  });

export const completeCheckIn = (sessionId: string) =>
  request<ApiCheckInComplete>(`/check-in/${sessionId}/complete`, { method: "POST" });

export const checkoutIdentify = (params: {
  reservationId?: string;
  faceEmbeddingId?: string;
  vectorHash?: string;
}) =>
  request<ApiCheckoutSummary>("/checkout/identify", {
    method: "POST",
    body: JSON.stringify({
      reservation_id: params.reservationId,
      face_embedding_id: params.faceEmbeddingId,
      vector_hash: params.vectorHash,
    }),
  });

export const confirmCheckout = (sessionId: string) =>
  request<{ session_id: string; status: string }>(`/checkout/${sessionId}/confirm`, {
    method: "POST",
  });

export const rateCheckout = (sessionId: string, rating: number, comment?: string) =>
  request<{ session_id: string }>(`/checkout/${sessionId}/rate`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const base = API_BASE.replace(/\/api\/v1$/, "");
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
};

export const resetDemoData = () =>
  request<{ message: string; checkin_code: string; checkout_code: string }>("/demo/reset", {
    method: "POST",
  });
