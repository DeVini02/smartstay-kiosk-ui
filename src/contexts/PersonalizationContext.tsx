import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockReturningGuest } from "@/lib/mockData";
import type {
  GuestProfile,
  IoTCommand,
  PreferenceCategory,
} from "@/lib/personalization/types";
import {
  buildCommandsFromProfile,
  simulateIoTCommand,
} from "@/lib/personalization/iotSimulator";
import { logConsent, clearConsentHistory } from "@/lib/personalization/consent";

const PROFILE_KEY = "smartstay_profile";
const RETURNING_KEY = "smartstay_is_returning";

interface PersonalizationState {
  profile: GuestProfile | null;
  isReturningGuest: boolean;
  setIsReturningGuest: (v: boolean) => void;
  setProfile: (p: GuestProfile | null) => void;
  commands: IoTCommand[];
  applyPreferences: () => Promise<void>;
  resetCommands: () => void;
  updatePreference: <K extends PreferenceCategory>(
    cat: K,
    patch: Partial<NonNullable<GuestProfile["preferences"][K]>>
  ) => void;
  setConsent: (
    cat: PreferenceCategory,
    value: boolean,
    source: "checkin" | "profile_edit" | "onboarding"
  ) => void;
  downloadData: () => void;
  deleteAllData: () => void;
}

const Ctx = createContext<PersonalizationState | null>(null);

const loadProfile = (): GuestProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return mockReturningGuest;
};

const loadReturning = (): boolean => {
  try {
    const raw = localStorage.getItem(RETURNING_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
};

export const PersonalizationProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<GuestProfile | null>(loadProfile);
  const [isReturningGuest, setIsReturningGuestState] = useState<boolean>(loadReturning);
  const [commands, setCommands] = useState<IoTCommand[]>([]);

  useEffect(() => {
    try {
      if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(RETURNING_KEY, String(isReturningGuest));
    } catch {
      // ignore
    }
  }, [isReturningGuest]);

  const setProfile = useCallback((p: GuestProfile | null) => {
    setProfileState(p);
  }, []);

  const setIsReturningGuest = useCallback((v: boolean) => {
    setIsReturningGuestState(v);
  }, []);

  const resetCommands = useCallback(() => setCommands([]), []);

  const applyPreferences = useCallback(async () => {
    if (!profile) return;
    const initial = buildCommandsFromProfile(profile).map((c) => ({
      ...c,
      status: "pending" as const,
    }));
    setCommands(initial);

    initial.forEach((cmd, idx) => {
      setTimeout(() => {
        setCommands((prev) =>
          prev.map((c, i) =>
            i === idx ? { ...c, status: "in_progress" as const } : c
          )
        );
        simulateIoTCommand(cmd).then((done) => {
          setCommands((prev) => prev.map((c, i) => (i === idx ? done : c)));
        });
      }, idx * 800);
    });
  }, [profile]);

  const updatePreference: PersonalizationState["updatePreference"] = useCallback(
    (cat, patch) => {
      setProfileState((prev) => {
        if (!prev) return prev;
        const current = (prev.preferences[cat] ?? {}) as any;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [cat]: { ...current, ...patch },
          },
        };
      });
    },
    []
  );

  const setConsent = useCallback<PersonalizationState["setConsent"]>(
    (cat, value, source) => {
      setProfileState((prev) => {
        if (!prev) return prev;
        logConsent({
          guestId: prev.guestId,
          category: cat,
          consented: value,
          timestamp: new Date().toISOString(),
          source,
        });
        return {
          ...prev,
          consents: { ...prev.consents, [cat]: value },
        };
      });
    },
    []
  );

  const downloadData = useCallback(() => {
    if (!profile) return;
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smartstay-profile-${profile.guestId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [profile]);

  const deleteAllData = useCallback(() => {
    if (profile) clearConsentHistory(profile.guestId);
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(RETURNING_KEY);
    } catch {
      // ignore
    }
    setProfileState(null);
    setIsReturningGuestState(false);
    setCommands([]);
  }, [profile]);

  const value = useMemo<PersonalizationState>(
    () => ({
      profile,
      isReturningGuest,
      setIsReturningGuest,
      setProfile,
      commands,
      applyPreferences,
      resetCommands,
      updatePreference,
      setConsent,
      downloadData,
      deleteAllData,
    }),
    [
      profile,
      isReturningGuest,
      setIsReturningGuest,
      setProfile,
      commands,
      applyPreferences,
      resetCommands,
      updatePreference,
      setConsent,
      downloadData,
      deleteAllData,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const usePersonalization = () => {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("usePersonalization must be used inside PersonalizationProvider");
  return ctx;
};
