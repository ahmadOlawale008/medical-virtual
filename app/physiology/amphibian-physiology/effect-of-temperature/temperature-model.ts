import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export type TemperatureBand = "cold" | "normal" | "warm";

export const TEMPERATURE_WINDOW_MS = 400;

export type TemperatureRecording = TwitchTrace & {
  temperature: number;
  band: TemperatureBand;
  color: string;
  isHeatRigor: boolean;
};

type TemperatureParameters = {
  latency: number;
  contraction: number;
  relaxation: number;
  amplitudeMultiplier: number;
  isHeatRigor: boolean;
};

const BAND_COLORS: Record<TemperatureBand, string> = {
  cold: "#55b9ff",
  normal: "#45df8a",
  warm: "#ff7f5a",
};

export function getTemperatureBand(temperature: number): TemperatureBand {
  if (temperature <= 10) return "cold";
  if (temperature >= 40) return "warm";
  return "normal";
}

export function getTemperatureParameters(
  temperature: number,
): TemperatureParameters {
  if (temperature <= 10) {
    return {
      latency: 75,
      contraction: 65,
      relaxation: 110,
      amplitudeMultiplier: 0.5,
      isHeatRigor: false,
    };
  }
  if (temperature < 20) {
    return {
      latency: 60,
      contraction: 62,
      relaxation: 100,
      amplitudeMultiplier: 0.7,
      isHeatRigor: false,
    };
  }
  if (temperature <= 30) {
    return {
      latency: 50,
      contraction: 60,
      relaxation: 90,
      amplitudeMultiplier: 0.85,
      isHeatRigor: false,
    };
  }
  if (temperature < 40) {
    return {
      latency: 35,
      contraction: 55,
      relaxation: 80,
      amplitudeMultiplier: 0.95,
      isHeatRigor: false,
    };
  }
  if (temperature <= 42) {
    return {
      latency: 25,
      contraction: 50,
      relaxation: 75,
      amplitudeMultiplier: 1.2,
      isHeatRigor: false,
    };
  }
  return {
    latency: 15,
    contraction: 50,
    relaxation: 0,
    amplitudeMultiplier: 1.3,
    isHeatRigor: true,
  };
}

export function createTemperatureRecording(
  id: number,
  temperature: number,
): TemperatureRecording {
  const band = getTemperatureBand(temperature);
  const parameters = getTemperatureParameters(temperature);

  return {
    id,
    temperature,
    band,
    color: BAND_COLORS[band],
    isHeatRigor: parameters.isHeatRigor,
    voltage: 4,
    mode: "indirect",
    peakForce: 6 * parameters.amplitudeMultiplier,
    latency: parameters.latency,
    contraction: parameters.contraction,
    relaxation: parameters.relaxation,
    riseProfile: "sine",
    sustained: parameters.isHeatRigor,
  };
}

export function describeTemperature(temperature: number) {
  if (temperature <= 10) {
    return "Cooling prolongs the twitch and reduces its peak force.";
  }
  if (temperature < 20) {
    return "The cooled preparation contracts and relaxes more slowly.";
  }
  if (temperature <= 30) {
    return "Near room temperature, the preparation produces its reference twitch.";
  }
  if (temperature < 40) {
    return "Warming shortens the latent period and increases twitch height.";
  }
  if (temperature <= 42) {
    return "The warm preparation produces a faster, stronger twitch.";
  }
  return "Heat rigor: the muscle develops a strong sustained contraction and does not relax.";
}
