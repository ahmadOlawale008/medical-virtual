import Image from "next/image";
import type { CSSProperties } from "react";
import type { LungModel, LungResults } from "./model";
import { clamp } from "./model";

type Props = {
  model: LungModel;
  results: LungResults;
  stage: string;
  status: string;
};

export default function LungVisual({ model, results, stage, status }: Props) {
  const trapped = clamp((results.residualVolume - 1.2) / 3.2, 0, 1);
  const inflammation = clamp(
    (model.airwayNarrowing * 0.65 + model.mucusLoad * 0.55) / 100,
    0,
    1,
  );
  const emphysema = model.elasticRecoilLoss / 100;
  const bronchitis = model.mucusLoad / 100;
  const breathStyle = {
    "--lung-expansion": 1.015 + trapped * 0.035,
  } as CSSProperties;
  const normalPoints = "65,255 100,170 145,112 200,80 260,64 320,62 380,72 440,94 500,130 560,184 620,258";
  const currentPoints = `65,255 100,${210 - results.peakFlow * 0.08} 145,${190 - results.peakFlow * 0.09} 200,${175 - results.peakFlow * 0.08} 260,${170 - results.peakFlow * 0.065} 320,${176 - results.peakFlow * 0.05} 380,${190 - results.peakFlow * 0.035} 440,${208 - results.peakFlow * 0.02} 500,225 560,242 620,258`;

  return (
    <div className="relative flex min-h-[640px] flex-col overflow-hidden border-b border-white/15 xl:border-b-0 xl:border-r">
      <div className="medical-grid absolute inset-0 opacity-20" />
      <div className="relative z-20 flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] text-white/40">CURRENT RESPIRATORY STATE</p>
          <h2 className="mt-1 text-xl font-semibold">{status}</h2>
        </div>
        <span className="rounded-md border border-white/15 px-3 py-2 font-accent text-xs text-[#8fd0c4]" aria-live="polite">{stage}</span>
      </div>

      <div className="relative z-10 grid flex-1 gap-3 px-4 pb-4 lg:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[500px] overflow-hidden rounded-lg border border-white/10 bg-[#f7efec] p-3 text-[#4c2e29]">
          <div className="flex justify-between gap-2 text-[10px] font-semibold text-[#75544c]"><span>ANATOMICAL RESPONSE</span><span>Airways · alveoli · hyperinflation</span></div>

          <div className="absolute left-[4%] top-[9%] h-[49%] w-[55%] transition-transform duration-300" style={{ transform: `scale(${1 + trapped * 0.14})` }}>
            <div className="lung-breath relative size-full" style={breathStyle}>
              <Image src="/assets/medical/obstructive-lung-disease/lungs.png" alt="Medical illustration of the lungs and trachea" fill priority sizes="300px" className="object-contain drop-shadow-[0_14px_18px_rgba(83,34,28,.16)]" />
            </div>
          </div>

          <div className="absolute right-[3%] top-[10%] w-[38%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2"><p className="text-[9px] font-semibold text-[#75544c]">BRONCHIAL LUMEN</p><span className={`text-[8px] font-semibold ${inflammation > 0.45 ? "text-secondary" : "text-primary"}`}>{inflammation > 0.45 ? "NARROWED" : "OPEN"}</span></div>
            <div className="relative mt-1 aspect-square w-full">
              <Image src="/assets/medical/obstructive-lung-disease/healthy-bronchus.png" alt="Healthy bronchus cross-section" fill sizes="190px" className="object-contain transition-opacity duration-300" style={{ opacity: 1 - inflammation }} />
              <Image src="/assets/medical/obstructive-lung-disease/inflamed-bronchus.png" alt="Inflamed and mucus-obstructed bronchus cross-section" fill sizes="190px" className="object-contain transition-opacity duration-300" style={{ opacity: inflammation }} />
            </div>
            <p className="mt-1 text-[9px] leading-4 text-[#806c66]">Airway resistance rises as wall inflammation and mucus reduce lumen radius.</p>
          </div>

          <div className="absolute bottom-[4%] left-[3%] w-[46%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2"><p className="text-[9px] font-semibold text-[#75544c]">ELASTIC RECOIL</p><span className={`text-[8px] font-semibold ${emphysema > 0.45 ? "text-secondary" : "text-primary"}`}>{emphysema > 0.45 ? "ALVEOLAR LOSS" : "PRESERVED"}</span></div>
            <div className="relative mx-auto mt-1 h-32 w-full"><Image src="/assets/medical/obstructive-lung-disease/emphysema.png" alt="Emphysematous destruction of alveolar walls" fill sizes="220px" className="object-contain transition-opacity duration-300" style={{ opacity: 0.2 + emphysema * 0.8 }} /></div>
          </div>

          <div className="absolute bottom-[4%] right-[3%] w-[44%] rounded-lg border border-[#d8bdb3] bg-white/92 p-2 shadow-sm">
            <div className="flex justify-between gap-2"><p className="text-[9px] font-semibold text-[#75544c]">CHRONIC BRONCHITIS</p><span className={`text-[8px] font-semibold ${bronchitis > 0.45 ? "text-secondary" : "text-primary"}`}>{bronchitis > 0.45 ? "MUCUS PRESENT" : "MINIMAL"}</span></div>
            <div className="relative mx-auto mt-1 h-32 w-full"><Image src="/assets/medical/obstructive-lung-disease/chronic-bronchitis.png" alt="Chronic bronchitis with mucus in small airways" fill sizes="220px" className="object-contain transition-opacity duration-300" style={{ opacity: 0.18 + bronchitis * 0.82 }} /></div>
          </div>

          <div className="absolute bottom-[36%] left-[5%] rounded-md border border-[#d8bdb3] bg-white/92 px-3 py-2"><p className="text-[8px] text-[#806c66]">RESIDUAL VOLUME</p><strong className="font-accent text-sm">{results.residualVolume.toFixed(1)} L</strong></div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/10 p-3">
          <div className="flex justify-between gap-3"><p className="text-[10px] font-semibold text-white/45">EXPIRATORY FLOW–VOLUME LOOP</p><span className="text-[10px] text-white/35">Flow / Volume</span></div>
          <svg className="mt-3 h-[390px] w-full" viewBox="0 0 680 320" role="img" aria-label="Flow volume curve comparing normal and current expiration">
            {[60, 120, 180, 240].map((y) => <line key={y} x1="60" y1={y} x2="640" y2={y} stroke="rgba(255,255,255,.08)" />)}
            {[160, 260, 360, 460, 560].map((x) => <line key={x} x1={x} y1="35" x2={x} y2="265" stroke="rgba(255,255,255,.08)" />)}
            <path d="M60 265H645M60 275V30" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" />
            <polyline points={normalPoints} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="3" strokeDasharray="7 7" />
            <polyline points={currentPoints} fill="none" stroke="#ef9866" strokeWidth="5" strokeLinejoin="round" />
            <text x="75" y="48" fill="#ef9866" fontSize="11">CURRENT</text><text x="75" y="65" fill="rgba(255,255,255,.4)" fontSize="11">- - NORMAL REFERENCE</text>
            <text x="292" y="300" fill="rgba(255,255,255,.45)" fontSize="11">EXHALED VOLUME</text>
            <g transform="translate(75 205)"><rect width="210" height="50" rx="6" fill="#0d302d" stroke="rgba(255,255,255,.15)" /><text x="12" y="19" fill="rgba(255,255,255,.5)" fontSize="10">FEV₁ / FVC</text><text x="12" y="39" fill="white" fontSize="18" fontWeight="700">{results.ratio.toFixed(0)}%</text><text x="72" y="38" fill={results.ratio < 70 ? "#ef9866" : "#8ad0c3"} fontSize="10">{results.ratio < 70 ? "OBSTRUCTIVE PATTERN" : "PRESERVED"}</text></g>
          </svg>
          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center"><div><p className="text-[10px] text-white/40">PEAK FLOW</p><strong className="mt-1 block font-accent text-sm">{results.peakFlow.toFixed(0)}</strong></div><div><p className="text-[10px] text-white/40">RESIDUAL VOLUME</p><strong className="mt-1 block font-accent text-sm">{results.residualVolume.toFixed(1)} L</strong></div><div><p className="text-[10px] text-white/40">SpO₂</p><strong className="mt-1 block font-accent text-sm">{results.oxygenSaturation.toFixed(0)}%</strong></div></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-3 text-[11px] text-white/45"><span>Anatomy and spirometry respond together as pathology changes.</span><span>Illustrations adapted from Servier Medical Art · CC BY 4.0</span></div>
    </div>
  );
}
