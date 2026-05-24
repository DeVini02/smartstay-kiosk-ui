export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api/v1";

export const isApiEnabled = () => import.meta.env.VITE_USE_API !== "false";

export const isDemoMode = () => import.meta.env.VITE_DEMO_MODE === "true";

export const areDebugRoutesEnabled = () =>
  import.meta.env.VITE_ENABLE_DEBUG_ROUTES === "true";

export const KIOSK_API_KEY = import.meta.env.VITE_KIOSK_API_KEY || "";

export const DEMO_CHECKOUT_FACE_ID =
  import.meta.env.VITE_DEMO_CHECKOUT_FACE_ID || "fe_g7h8i9";
