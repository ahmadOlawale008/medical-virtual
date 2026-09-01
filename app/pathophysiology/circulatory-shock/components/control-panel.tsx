import type { ShockModel } from "./model";

type Props = {
  model: ShockModel;
  onChange: (key: keyof ShockModel, value: number) => void;
  onReset: () => void;
};

const controls = [
  ["volumeLoss", "Circulating volume loss"],
  ["pumpFailure", "Pump dysfunction"],
  ["vasodilation", "Systemic vasodilation"],
  ["obstruction", "Flow obstruction"],
] as const;

export default function ControlPanel({ model, onChange, onReset }: Props) {
  return (
    <aside className="border-b border-white/15 bg-white/[.025] px-5 xl:border-b-0 xl:border-r">
      <div className="border-b border-white/10 py-4">
        <p className="text-[11px] font-semibold tracking-[.1em] text-[#a4d9d0]">
          CIRCULATORY CONTROLS
        </p>
        <p className="mt-1 text-xs leading-5 text-white/45">
          Alter preload, pump function, vascular tone, and outflow.
        </p>
      </div>

      {controls.map(([key, label]) => (
        <label key={key} className="block border-b border-white/10 py-4">
          <span className="flex justify-between gap-3 text-sm">
            <span className="text-white/65">{label}</span>
            <strong className="font-accent">{model[key]}%</strong>
          </span>
          <input
            className="lab-range mt-3 w-full cursor-pointer"
            type="range"
            min="0"
            max="100"
            value={model[key]}
            onChange={(event) => onChange(key, Number(event.target.value))}
          />
        </label>
      ))}

      <button
        type="button"
        onClick={onReset}
        className="mb-5 mt-5 min-h-11 w-full cursor-pointer rounded-md border border-white/20 text-sm font-semibold text-white/70 hover:bg-white/10"
      >
        Reset simulation
      </button>
    </aside>
  );
}
