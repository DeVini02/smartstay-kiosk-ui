import type { GuestProfile, IoTCommand } from "./types";

// TODO: replace with real IoT integration in production
// (MQTT broker, Home Assistant, KNX gateway, or vendor SDK)
export async function simulateIoTCommand(
  command: IoTCommand
): Promise<IoTCommand> {
  const delay = 1500 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const success = Math.random() > 0.05;
  return {
    ...command,
    status: success ? "completed" : "failed",
    timestamp: new Date().toISOString(),
  };
}

export function buildCommandsFromProfile(profile: GuestProfile): IoTCommand[] {
  const c = profile.preferences.comfort;
  return [
    {
      device: "thermostat",
      action: "setTemperature",
      value: c?.temperature ?? 22,
      status: "pending",
    },
    {
      device: "lighting",
      action: "setScene",
      value: {
        tone: c?.lightingTone ?? "warm",
        brightness: c?.lightingBrightness ?? 60,
      },
      status: "pending",
    },
    {
      device: "curtains",
      action: "setPosition",
      value: c?.curtainPosition ?? "partial",
      status: "pending",
    },
    {
      device: "tv",
      action: "setChannel",
      value: "default",
      status: "pending",
    },
  ];
}

export async function applyAllPreferences(
  profile: GuestProfile
): Promise<IoTCommand[]> {
  const commands = buildCommandsFromProfile(profile);
  return Promise.all(commands.map(simulateIoTCommand));
}
