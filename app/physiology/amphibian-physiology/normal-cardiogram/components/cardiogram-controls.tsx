import {
  getTemperatureProfile,
  temperatureProfiles,
  type CardiogramTemperature,
} from "../cardiogram-model";

export default function CardiogramControls({
  temperature,
  drumSpeed,
  recording,
  hasRecording,
  soundEnabled,
  onTemperatureChange,
  onDrumSpeedChange,
  onToggleRecording,
  onReset,
  onToggleSound,
}: {
  temperature: CardiogramTemperature;
  drumSpeed: number;
  recording: boolean;
  hasRecording: boolean;
  soundEnabled: boolean;
  onTemperatureChange: (temperature: CardiogramTemperature) => void;
  onDrumSpeedChange: (speed: number) => void;
  onToggleRecording: () => void;
  onReset: () => void;
  onToggleSound: () => void;
}) {
  const profile = getTemperatureProfile(temperature);

  return (
    <div className="grid gap-4">
      <section>
        <p className="mb-2 text-[10px] font-semibold tracking-[.12em] text-white/45">
          RINGER&apos;S SOLUTION TEMPERATURE
        </p>
        <div className="grid grid-cols-3 gap-2">
          {temperatureProfiles.map((option) => (
            <button
              key={option.temperature}
              type="button"
              onClick={() => onTemperatureChange(option.temperature)}
              className={`cursor-pointer rounded-md border px-2 py-3 text-center transition ${
                temperature === option.temperature
                  ? "border-transparent text-white shadow-sm"
                  : "border-white/10 bg-white/[.06] text-white/55 hover:bg-white/10 hover:text-white"
              }`}
              style={
                temperature === option.temperature
                  ? { backgroundColor: option.color }
                  : undefined
              }
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="mt-0.5 block text-[10px]">{option.state}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: profile.color }} />
            <span className="text-sm text-white/70">Heart rate</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-accent text-xl font-semibold" style={{ color: profile.color }}>
              {profile.heartRate} bpm
            </span>
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mute heartbeat" : "Play heartbeat"}
              title={soundEnabled ? "Mute heartbeat" : "Play heartbeat"}
              className={`cursor-pointer rounded-md border px-2.5 py-2 text-sm transition ${
                soundEnabled
                  ? "border-[#ef4b50]/50 bg-[#ef4b50]/15 text-[#ff777b]"
                  : "border-white/10 bg-white/[.05] text-white/45 hover:text-white"
              }`}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
        <div className="flex items-center justify-between">
          <label htmlFor="drum-speed" className="text-[10px] font-semibold tracking-[.12em] text-white/45">
            DRUM SPEED
          </label>
          <span className="font-accent text-sm text-[#55ddea]">{drumSpeed.toFixed(1)} mm/s</span>
        </div>
        <input
          id="drum-speed"
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={drumSpeed}
          onChange={(event) => onDrumSpeedChange(Number(event.target.value))}
          className="mt-3 w-full cursor-pointer accent-[#2dc5d0]"
        />
        <div className="mt-1 flex justify-between text-[10px] text-white/35">
          <span>1 mm/s</span>
          <span>10 mm/s</span>
        </div>
      </section>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={onToggleRecording}
          className={`cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-white transition ${
            recording
              ? "bg-[#59636f] hover:bg-[#687480]"
              : "bg-[#e52b31] hover:bg-[#f0373d]"
          }`}
        >
          {recording ? "■ Stop recording" : "▷ Start recording"}
        </button>
        <button
          type="button"
          disabled={!hasRecording}
          onClick={onReset}
          className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/70 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
