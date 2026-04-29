import { useEffect, useState } from "react";

export type FontScaleLevel = 0 | 1 | 2;
const FONT_SCALES = [1, 1.15, 1.3];

interface AccessibilityPrefs {
  fontScale: FontScaleLevel;
  highContrast: boolean;
}

const KEY = "smartstay.a11y";

const load = (): AccessibilityPrefs => {
  if (typeof window === "undefined")
    return { fontScale: 1, highContrast: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { fontScale: 1, highContrast: false };
    return JSON.parse(raw);
  } catch {
    return { fontScale: 1, highContrast: false };
  }
};

export const useAccessibility = () => {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(load);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      String(FONT_SCALES[prefs.fontScale])
    );
    document.body.classList.toggle("high-contrast", prefs.highContrast);
    localStorage.setItem(KEY, JSON.stringify(prefs));
  }, [prefs]);

  return {
    ...prefs,
    setFontScale: (lvl: FontScaleLevel) =>
      setPrefs((p) => ({ ...p, fontScale: lvl })),
    setHighContrast: (v: boolean) =>
      setPrefs((p) => ({ ...p, highContrast: v })),
  };
};
