export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api/v1";

export const isApiEnabled = () => import.meta.env.VITE_USE_API !== "false";
