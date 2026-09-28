export type CardiogramTemperature = 15 | 25 | 35;

export type CardiogramSample = {
  time: number;
  force: number;
  temperature: CardiogramTemperature;
};

export type TemperatureProfile = {
  temperature: CardiogramTemperature;
  label: string;
  state: string;
  heartRate: number;
  amplitude: number;
  color: string;
};

export const CARDIOGRAM_DURATION_MS = 15_000;
export const CARDIOGRAM_SAMPLE_INTERVAL_MS = 24;

export const temperatureProfiles: TemperatureProfile[] = [
  {
    temperature: 15,
    label: "15°C",
    state: "Cold",
    heartRate: 18,
    amplitude: 1.3,
    color: "#5aa7ff",
  },
  {
    temperature: 25,
    label: "25°C",
    state: "Normal",
    heartRate: 24,
    amplitude: 1,
    color: "#31d67b",
  },
  {
    temperature: 35,
    label: "35°C",
    state: "Warm",
    heartRate: 36,
    amplitude: 0.7,
    color: "#ff686d",
  },
];

export function getTemperatureProfile(temperature: CardiogramTemperature) {
  return temperatureProfiles.find(
    (profile) => profile.temperature === temperature,
  ) ?? temperatureProfiles[1];
}

export function getCardiacState(
  timeMs: number,
  temperature: CardiogramTemperature,
) {
  const profile = getTemperatureProfile(temperature);
  const periodMs = 60_000 / profile.heartRate;
  const phase = (timeMs % periodMs) / periodMs;
  const force = cardiacWaveform(phase) * profile.amplitude;

  return {
    ...profile,
    periodMs,
    phase,
    force,
  };
}

function cardiacWaveform(phase: number) {
  const ease = (value: number) => (1 - Math.cos(value * Math.PI)) / 2;

  if (phase < 0.16) return 3 - 2 * ease(phase / 0.16);
  if (phase < 0.32) return 1 + ease((phase - 0.16) / 0.16);
  if (phase < 0.4) return 2;
  if (phase < 0.56) return 2 - 2 * ease((phase - 0.4) / 0.16);
  return 3 * ease((phase - 0.56) / 0.44);
}
