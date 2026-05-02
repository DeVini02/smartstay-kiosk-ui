import type { PreferenceCategory } from "./types";

export interface ConsentRecord {
  guestId: string;
  category: PreferenceCategory;
  consented: boolean;
  timestamp: string;
  source: "checkin" | "profile_edit" | "onboarding";
}

const KEY = "smartstay_consent_log";

export function logConsent(record: ConsentRecord): void {
  try {
    const raw = localStorage.getItem(KEY);
    const list: ConsentRecord[] = raw ? JSON.parse(raw) : [];
    list.push(record);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore localStorage errors (private mode etc.)
  }
}

export function getConsentHistory(guestId: string): ConsentRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list: ConsentRecord[] = JSON.parse(raw);
    return list.filter((r) => r.guestId === guestId);
  } catch {
    return [];
  }
}

export function clearConsentHistory(guestId: string): void {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const list: ConsentRecord[] = JSON.parse(raw);
    const remaining = list.filter((r) => r.guestId !== guestId);
    localStorage.setItem(KEY, JSON.stringify(remaining));
  } catch {
    // ignore
  }
}
