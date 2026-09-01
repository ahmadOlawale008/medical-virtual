import { describeTemperature } from "../temperature-model";

export default function TemperatureControls({
  temperature,
  onTemperatureChange,
  onStimulate,
  onReset,
}: {
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  onStimulate: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[.07] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white/75">Ringer&apos;s solution temperature</h2>
        <strong className="font-accent text-xl text-[#55df9a]">
          {Math.round(temperature)}°C
        </strong>
      </div>
      <input
        type="range"
        min="5"
        max="45"
        step="0.1"
        value={temperature}
        onChange={(event) => onTemperatureChange(Number(event.target.value))}
        className="temperature-range mt-4 w-full cursor-pointer"
        aria-label="Ringer's solution temperature"
      />
      <div className="mt-1 flex justify-between text-[10px] text-white/38">
        <span>5°C</span>
        <span>25°C</span>
        <span>45°C</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onTemperatureChange(10)} className="cursor-pointer rounded-md border border-white/10 bg-white/[.07] px-3 py-2.5 text-xs font-semibold text-[#a9d7f5] transition hover:bg-white/10">
          Cold (10°C)
        </button>
        <button type="button" onClick={() => onTemperatureChange(40)} className="cursor-pointer rounded-md border border-white/10 bg-white/[.07] px-3 py-2.5 text-xs font-semibold text-[#ff9b7c] transition hover:bg-white/10">
          Warm (40°C)
        </button>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-white/48">{describeTemperature(temperature)}</p>
      {temperature >= 43 && (
        <div className="mt-3 rounded-md border border-[#ff755f]/35 bg-[#ff755f]/10 px-3 py-2 text-xs font-semibold text-[#ff9b87]">
          HEAT RIGOR · sustained contraction with no relaxation phase
        </div>
      )}
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={onStimulate} className="cursor-pointer rounded-md bg-[#16b266] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(22,178,102,.24)] transition hover:bg-[#19c470] active:translate-y-px">
          Stimulate
        </button>
        <button type="button" onClick={onReset} className="cursor-pointer rounded-md border border-white/12 bg-white/[.06] px-5 py-3 text-xs font-semibold text-white/65 transition hover:text-white">
          Reset
        </button>
      </div>
    </section>
  );
}
