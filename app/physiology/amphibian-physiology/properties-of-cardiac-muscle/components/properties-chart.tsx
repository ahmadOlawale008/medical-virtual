import { type PropertySample } from "../cardiac-properties-model";

export default function PropertiesChart({ samples, drumSpeed }: { samples: PropertySample[]; drumSpeed: number }) {
  const width = 620;
  const height = 285;
  const left = 18;
  const top = 20;
  const plotWidth = width - 36;
  const plotHeight = height - 42;
  const windowMs = 24_000 * (2.5 / Math.max(0.5, drumSpeed));
  const latestTime = samples.at(-1)?.time ?? 0;
  const windowStart = Math.max(0, latestTime - windowMs);
  const windowEnd = Math.max(windowMs, latestTime + 200);
  const visible = samples.filter((sample) => sample.time >= windowStart - 500);
  const path = visible.map((sample, index) => {
    const x = left + ((sample.time - windowStart) / (windowEnd - windowStart)) * plotWidth;
    const y = top + plotHeight - ((sample.force + 2.5) / 6) * plotHeight;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#02070d] p-3">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[.13em] text-white/40">OSCILLOSCOPE</p>
          <h2 className="mt-1 text-sm font-semibold text-white/80">Cardiac muscle response</h2>
        </div>
        <p className="font-accent text-[10px] text-[#31d67b]">{(windowMs / 1000).toFixed(1)} s WINDOW</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label="Cardiac muscle experiment recording">
        {[0, .25, .5, .75, 1].map((fraction) => <line key={`h${fraction}`} x1={left} x2={width - left} y1={top + fraction * plotHeight} y2={top + fraction * plotHeight} stroke="#123129" />)}
        {Array.from({ length: 16 }, (_, index) => <line key={`v${index}`} x1={left + index / 15 * plotWidth} x2={left + index / 15 * plotWidth} y1={top} y2={top + plotHeight} stroke="#0d2822" />)}
        {path && <path d={path} fill="none" stroke="#31d67b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </section>
  );
}
