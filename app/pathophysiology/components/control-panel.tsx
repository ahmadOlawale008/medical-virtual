import type { HeartFailureModel } from "./model";

type Props = {
  model: HeartFailureModel;
  onChange: (key: keyof HeartFailureModel, value: number) => void;
  onReset: () => void;
};

const controls = [
  { key: "contractility", label: "LV contractility", min: 20, max: 100, step: 1, unit: "%" },
  { key: "heartRate", label: "Heart rate", min: 50, max: 125, step: 1, unit: "bpm" },
  { key: "resistance", label: "Systemic resistance", min: 650, max: 1800, step: 10, unit: "dyn·s/cm⁵" },
  { key: "volume", label: "Blood volume", min: 60, max: 130, step: 1, unit: "%" },
] as const;

export default function ControlPanel({ model, onChange, onReset }: Props) {
  return (
    <aside className="border-b border-white/15 bg-white/[.025] px-5 xl:border-b-0 xl:border-r">
      <div className="border-b border-white/10 py-4">
        <p className="text-[11px] font-semibold tracking-[.1em] text-[#8fd0c4]">
          PHYSIOLOGICAL CONTROLS
        </p>
        <p className="mt-1 text-xs text-white/45">
          Move one control and observe the circulation.
        </p>
      </div>

      {controls.map((control) => (
        <label
          key={control.key}
          className="block border-b border-white/10 py-3.5"
        >
          <span className="flex justify-between gap-3 text-sm">
            <span className="text-white/65">{control.label}</span>
            <strong className="font-accent">
              {model[control.key]} {control.unit}
            </strong>
          </span>
          <input
            className="lab-range mt-2.5 w-full cursor-pointer"
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={model[control.key]}
            onChange={(event) =>
              onChange(control.key, Number(event.target.value))
            }
          />
        </label>
      ))}

      <button
        type="button"
        onClick={onReset}
        className="mb-5 mt-4 min-h-11 w-full cursor-pointer rounded-md border border-white/20 text-sm font-semibold text-white/70 hover:bg-white/10"
      >
        Reset simulation
      </button>
    </aside>
  );
}
