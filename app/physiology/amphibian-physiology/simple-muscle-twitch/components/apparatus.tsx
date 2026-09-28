"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  CanvasTexture,
  LinearFilter,
  TubeGeometry,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import {
  getStimulationParameters,
  normalizedTwitchAt,
  RECORDING_PLAYBACK_MS,
  SIMPLE_TWITCH_WINDOW_MS,
  type TwitchTrace,
} from "../twitch-model";

const DRUM_SAMPLE_COUNT = 240;

export default function Apparatus({
  trace,
  traces,
  temperature,
  showElectrodes = true,
  recordingWindowMs = SIMPLE_TWITCH_WINDOW_MS,
  stimulusOffsetMs = 20,
  forceAxisMax = 12,
  playbackMs = RECORDING_PLAYBACK_MS,
  simulationTimeMs,
  drumRevolutions = 0.267,
  wrapTraceAroundDrum = false,
  loadGrams,
  loadMode,
  recordingStyle = "curve",
  drumTraceRadius = 0.018,
  inductionCoilDistance,
  nerveStimulationPoint,
  onHoverChange,
}: {
  trace: TwitchTrace | null;
  traces?: TwitchTrace[];
  temperature?: number;
  showElectrodes?: boolean;
  recordingWindowMs?: number;
  stimulusOffsetMs?: number;
  forceAxisMax?: number;
  playbackMs?: number;
  simulationTimeMs?: number;
  drumRevolutions?: number;
  wrapTraceAroundDrum?: boolean;
  loadGrams?: number;
  loadMode?: "afterloaded" | "freeloaded";
  recordingStyle?: "curve" | "line" | "paired-lines";
  drumTraceRadius?: number;
  inductionCoilDistance?: number;
  nerveStimulationPoint?: "muscle" | "vertebral";
  onHoverChange?: (label: string | null) => void;
}) {
  const muscleRef = useRef<Mesh>(null);
  const leverRef = useRef<Group>(null);
  const drumRef = useRef<Group>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    if (trace) {
      startedAt.current = performance.now();
      if (drumRef.current) drumRef.current.rotation.y = 0;
    }
  }, [trace]);

  useFrame(() => {
    const elapsed = simulationTimeMs ?? performance.now() - startedAt.current;
    const maximumForce = trace
      ? trace.samples
        ? forceAxisMax
        : getStimulationParameters(trace.mode).maximumForce
      : 1;
    const forceScale = trace ? trace.peakForce / maximumForce : 0;
    const recordingTime = Math.min(
      recordingWindowMs,
      (elapsed / playbackMs) * recordingWindowMs,
    );
    const response = trace
      ? normalizedTwitchAt(
          Math.max(0, recordingTime - stimulusOffsetMs),
          trace,
        ) * forceScale
      : 0;
    if (muscleRef.current) {
      muscleRef.current.scale.set(1 - response * 0.095, 1 + response * 0.055, 1 + response * 0.055);
    }
    if (leverRef.current) leverRef.current.rotation.z = -response * 0.14;
    if (drumRef.current && trace) {
      drumRef.current.rotation.y =
        Math.min(1, elapsed / playbackMs) * Math.PI * 2 * drumRevolutions;
    }
  });

  return (
    <group position={[0, -0.35, 0]}>
      <InteractivePart label="Lucas chamber & muscle" onHoverChange={onHoverChange}>
        <TissueBath />
        <MusclePreparation muscleRef={muscleRef} />
      </InteractivePart>
      <InteractivePart label="Kymograph" onHoverChange={onHoverChange}>
        <SmokedDrum
          drumRef={drumRef}
          traces={traces ?? (trace ? [trace] : [])}
          recordingWindowMs={recordingWindowMs}
          stimulusOffsetMs={stimulusOffsetMs}
          forceAxisMax={forceAxisMax}
          playbackMs={playbackMs}
          simulationTimeMs={simulationTimeMs}
          drumRevolutions={drumRevolutions}
          wrapTraceAroundDrum={wrapTraceAroundDrum}
          recordingStyle={recordingStyle}
          drumTraceRadius={drumTraceRadius}
        />
      </InteractivePart>
      <InteractivePart label="Stand · upright post" onHoverChange={onHoverChange}>
        <SupportStand />
      </InteractivePart>
      {showElectrodes && (
        <InteractivePart label="Stimulating electrodes assembly" onHoverChange={onHoverChange}>
          <Electrodes />
        </InteractivePart>
      )}
      {loadGrams !== undefined && (
        <InteractivePart label="Applied load" onHoverChange={onHoverChange}>
          <AppliedLoad loadGrams={loadGrams} mode={loadMode ?? "afterloaded"} />
        </InteractivePart>
      )}
      {inductionCoilDistance !== undefined && (
        <InteractivePart
          label="Du Bois–Reymond induction coil"
          onHoverChange={onHoverChange}
        >
          <InductionCoil distance={inductionCoilDistance} />
        </InteractivePart>
      )}
      {temperature !== undefined && <Thermometer temperature={temperature} />}
      {nerveStimulationPoint && (
        <InteractivePart label="Sciatic nerve and stimulation points" onHoverChange={onHoverChange}>
          <SciaticNerve stimulationPoint={nerveStimulationPoint} />
        </InteractivePart>
      )}
      <InteractivePart label="Long arm · writing lever" onHoverChange={onHoverChange}>
        <WritingLever leverRef={leverRef} />
      </InteractivePart>
      <mesh position={[0, -0.68, 0]} receiveShadow>
        <boxGeometry args={[10.5, 0.18, 5.8]} />
        <meshStandardMaterial color="#aeb9c3" roughness={0.72} metalness={0.06} />
      </mesh>
    </group>
  );
}

function SciaticNerve({
  stimulationPoint,
}: {
  stimulationPoint: "muscle" | "vertebral";
}) {
  const geometry = useMemo(
    () => new TubeGeometry(
      new CatmullRomCurve3([
        new Vector3(-1.3, 0.35, 0.44),
        new Vector3(-0.75, 0.42, 0.4),
        new Vector3(-0.1, 0.34, 0.3),
        new Vector3(0.55, 0.25, 0.16),
      ]),
      64,
      0.025,
      8,
      false,
    ),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#fff8d8" emissive="#d8e9ff" emissiveIntensity={0.18} roughness={0.42} />
      </mesh>
      <StimulationContact position={[-0.12, 0.35, 0.3]} active={stimulationPoint === "muscle"} />
      <StimulationContact position={[-1.12, 0.38, 0.43]} active={stimulationPoint === "vertebral"} />
    </group>
  );
}

function StimulationContact({
  position,
  active,
}: {
  position: [number, number, number];
  active: boolean;
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.018, 10, 24]} />
        <meshStandardMaterial
          color={active ? "#4e9cff" : "#8c98a5"}
          emissive={active ? "#2f7bea" : "#000000"}
          emissiveIntensity={active ? 1.1 : 0}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {active && (
        <mesh>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshBasicMaterial color="#d8eaff" />
        </mesh>
      )}
    </group>
  );
}

function InteractivePart({
  label,
  onHoverChange,
  children,
}: {
  label: string;
  onHoverChange?: (label: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <group
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHoverChange?.(label);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "default";
        onHoverChange?.(null);
      }}
    >
      {children}
    </group>
  );
}

function Thermometer({ temperature }: { temperature: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 640;
    const context = canvas.getContext("2d");

    if (!context) return null;

    context.fillStyle = "rgba(238, 241, 244, 0.97)";
    context.fillRect(16, 8, 224, 624);
    context.strokeStyle = "#87929d";
    context.lineWidth = 3;
    context.strokeRect(16, 8, 224, 624);
    context.fillStyle = "#34465c";
    context.font = "700 22px sans-serif";
    context.textAlign = "center";
    context.fillText("THERMOMETER", 128, 46);
    context.font = "700 25px sans-serif";
    context.fillText("°C", 75, 84);
    context.fillText("°F", 181, 84);

    const top = 112;
    const bottom = 560;
    const valueY = bottom - ((temperature - 5) / 40) * (bottom - top);

    context.strokeStyle = "#7d8995";
    context.fillStyle = "#46576b";
    context.font = "600 19px sans-serif";
    for (let celsius = 5; celsius <= 45; celsius += 5) {
      const tickY = bottom - ((celsius - 5) / 40) * (bottom - top);
      const longTick = celsius % 10 === 5;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(longTick ? 82 : 91, tickY);
      context.lineTo(111, tickY);
      context.stroke();
      context.beginPath();
      context.moveTo(145, tickY);
      context.lineTo(longTick ? 174 : 165, tickY);
      context.stroke();
      if (longTick) {
        context.textAlign = "right";
        context.fillText(String(celsius), 73, tickY + 7);
        context.textAlign = "left";
        context.fillText(String(Math.round((celsius * 9) / 5 + 32)), 182, tickY + 7);
      }
    }

    context.strokeStyle = "#d6dbe0";
    context.lineWidth = 18;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(128, top);
    context.lineTo(128, bottom);
    context.stroke();
    context.strokeStyle = temperature >= 35 ? "#f45f59" : temperature <= 15 ? "#3ba7e8" : "#ee5b58";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(128, bottom);
    context.lineTo(128, valueY);
    context.stroke();
    context.fillStyle = context.strokeStyle;
    context.beginPath();
    context.arc(128, bottom + 17, 19, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#172637";
    context.font = "700 25px sans-serif";
    context.textAlign = "center";
    context.fillText(`${temperature.toFixed(0)}°C`, 128, 615);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.minFilter = LinearFilter;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [temperature]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <sprite position={[-0.72, 1.1, -0.65]} scale={[0.62, 1.55, 1]}>
      <spriteMaterial map={texture} transparent depthTest />
    </sprite>
  );
}

function TissueBath() {
  const glass = { color: "#cfe1e8", transparent: true, opacity: 0.28, roughness: 0.08 };
  return (
    <group position={[0.8, 0, 0]}>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.12, 2.8]} />
        <meshPhysicalMaterial color="#d8edf1" transparent opacity={0.55} roughness={0.12} transmission={0.25} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[5.55, 0.08, 2.55]} />
        <meshPhysicalMaterial color="#a9d9df" transparent opacity={0.38} roughness={0.08} transmission={0.18} />
      </mesh>
      <mesh position={[0, 0.35, -1.38]}><boxGeometry args={[5.8, 1.15, 0.08]} /><meshPhysicalMaterial {...glass} /></mesh>
      <mesh position={[0, 0.35, 1.38]}><boxGeometry args={[5.8, 1.15, 0.08]} /><meshPhysicalMaterial {...glass} /></mesh>
      <mesh position={[-2.86, 0.35, 0]}><boxGeometry args={[0.08, 1.15, 2.8]} /><meshPhysicalMaterial {...glass} /></mesh>
      <mesh position={[2.86, 0.35, 0]}><boxGeometry args={[0.08, 1.15, 2.8]} /><meshPhysicalMaterial {...glass} /></mesh>
    </group>
  );
}

function SmokedDrum({
  drumRef,
  traces,
  recordingWindowMs,
  stimulusOffsetMs,
  forceAxisMax,
  playbackMs,
  simulationTimeMs,
  drumRevolutions,
  wrapTraceAroundDrum,
  recordingStyle,
  drumTraceRadius,
}: {
  drumRef: React.RefObject<Group | null>;
  traces: TwitchTrace[];
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
  drumRevolutions: number;
  wrapTraceAroundDrum: boolean;
  recordingStyle: "curve" | "line" | "paired-lines";
  drumTraceRadius: number;
}) {
  return (
    <group position={[-3.35, 1.05, 0]}>
      <group>
        <group ref={drumRef}>
          <mesh castShadow>
            <cylinderGeometry args={[1.34, 1.34, 2.9, 64]} />
            <meshStandardMaterial color="#101416" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0, 1.35]}>
            <boxGeometry args={[0.028, 2.72, 0.018]} />
            <meshBasicMaterial color="#31383a" />
          </mesh>
          <mesh position={[0, 1.48, 1.08]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#d7ddd8" roughness={0.55} />
          </mesh>
          {wrapTraceAroundDrum && (
            <DrumTraces
              traces={traces}
              recordingWindowMs={recordingWindowMs}
              stimulusOffsetMs={stimulusOffsetMs}
              forceAxisMax={forceAxisMax}
              playbackMs={playbackMs}
              simulationTimeMs={simulationTimeMs}
              drumRevolutions={drumRevolutions}
              wrapTraceAroundDrum
              recordingStyle={recordingStyle}
              drumTraceRadius={drumTraceRadius}
            />
          )}
        </group>
        {!wrapTraceAroundDrum && (
          <DrumTraces
            traces={traces}
            recordingWindowMs={recordingWindowMs}
            stimulusOffsetMs={stimulusOffsetMs}
            forceAxisMax={forceAxisMax}
            playbackMs={playbackMs}
            simulationTimeMs={simulationTimeMs}
            drumRevolutions={drumRevolutions}
            wrapTraceAroundDrum={false}
            recordingStyle={recordingStyle}
            drumTraceRadius={drumTraceRadius}
          />
        )}
      </group>
      <mesh position={[0, -1.8, 0]} castShadow>
        <boxGeometry args={[2.35, 0.7, 2.1]} />
        <meshStandardMaterial color="#151e35" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.82, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.75, 24]} />
        <meshStandardMaterial color="#27313c" metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  );
}

function DrumTraces({
  traces,
  recordingWindowMs,
  stimulusOffsetMs,
  forceAxisMax,
  playbackMs,
  simulationTimeMs,
  drumRevolutions,
  wrapTraceAroundDrum,
  recordingStyle,
  drumTraceRadius,
}: {
  traces: TwitchTrace[];
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
  drumRevolutions: number;
  wrapTraceAroundDrum: boolean;
  recordingStyle: "curve" | "line" | "paired-lines";
  drumTraceRadius: number;
}) {
  return (
    <>
      {traces.map((recording, index) =>
        recordingStyle === "paired-lines" ? (
          <RecordedPairedLines
            key={`paired-${recording.id}`}
            trace={recording}
            forceAxisMax={forceAxisMax}
            playbackMs={playbackMs}
            simulationTimeMs={simulationTimeMs}
            isActive={index === traces.length - 1}
          />
        ) : recordingStyle === "line" ? (
          <RecordedLoadLine
            key={`line-${recording.id}`}
            trace={recording}
            forceAxisMax={forceAxisMax}
            playbackMs={playbackMs}
            simulationTimeMs={simulationTimeMs}
            isActive={index === traces.length - 1}
          />
        ) : (
          <RecordedDrumTrace
            key={`curve-${recording.id}`}
            trace={recording}
            recordingWindowMs={recordingWindowMs}
            stimulusOffsetMs={stimulusOffsetMs}
            forceAxisMax={forceAxisMax}
            playbackMs={playbackMs}
            simulationTimeMs={simulationTimeMs}
            drumRevolutions={drumRevolutions}
            wrapTraceAroundDrum={wrapTraceAroundDrum}
            isActive={index === traces.length - 1}
            drumTraceRadius={drumTraceRadius}
          />
        ),
      )}
    </>
  );
}

function RecordedPairedLines({
  trace,
  forceAxisMax,
  playbackMs,
  simulationTimeMs,
  isActive,
}: {
  trace: TwitchTrace;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
  isActive: boolean;
}) {
  const makeRef = useRef<Mesh>(null);
  const breakRef = useRef<Mesh>(null);
  const startedAt = useRef(0);
  const makeForce = "makeForce" in trace && typeof trace.makeForce === "number"
    ? trace.makeForce
    : trace.peakForce;
  const breakForce = "breakForce" in trace && typeof trace.breakForce === "number"
    ? trace.breakForce
    : trace.peakForce;
  const positionIndex = "positionIndex" in trace && typeof trace.positionIndex === "number"
    ? trace.positionIndex
    : trace.id - 1;
  const centerX = -1.12 + (Math.min(positionIndex, 10) / 10) * 2.24;

  useEffect(() => {
    startedAt.current = performance.now();
  }, [trace.id]);

  useFrame(() => {
    const elapsed = isActive
      ? simulationTimeMs ?? performance.now() - startedAt.current
      : playbackMs;
    const makeProgress = Math.min(1, elapsed / 200);
    const breakProgress = Math.min(1, Math.max(0, (elapsed - 500) / 200));
    updateComparisonLine(
      makeRef.current,
      makeForce,
      makeProgress,
      forceAxisMax,
    );
    updateComparisonLine(
      breakRef.current,
      breakForce,
      breakProgress,
      forceAxisMax,
    );
  });

  return (
    <>
      <ComparisonLineMesh
        meshRef={makeRef}
        x={centerX - 0.035}
        color="#f5f7e9"
      />
      <ComparisonLineMesh
        meshRef={breakRef}
        x={centerX + 0.035}
        color="#d9ded8"
      />
    </>
  );
}

function ComparisonLineMesh({
  meshRef,
  x,
  color,
}: {
  meshRef: React.RefObject<Mesh | null>;
  x: number;
  color: string;
}) {
  const surfaceZ = Math.sqrt(Math.max(0, 1.355 ** 2 - x ** 2));

  return (
    <mesh
      ref={meshRef}
      position={[x, 0.4, surfaceZ + 0.04]}
      renderOrder={6}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.014, 0.014, 1, 8]} />
      <meshBasicMaterial color={color} depthTest={false} />
    </mesh>
  );
}

function updateComparisonLine(
  mesh: Mesh | null,
  force: number,
  progress: number,
  forceAxisMax: number,
) {
  if (!mesh) return;
  const finalHeight = Math.max(
    0.002,
    Math.min(0.68, (force / forceAxisMax) * 0.68),
  );
  const visibleHeight = Math.max(0.002, finalHeight * progress);
  mesh.position.y = 0.4 + visibleHeight / 2;
  mesh.scale.y = visibleHeight;
  mesh.visible = force > 0 && progress > 0;
}

function RecordedLoadLine({
  trace,
  forceAxisMax,
  playbackMs,
  simulationTimeMs,
  isActive,
}: {
  trace: TwitchTrace;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
  isActive: boolean;
}) {
  const lineRef = useRef<Mesh>(null);
  const startedAt = useRef(0);
  const load = "load" in trace && typeof trace.load === "number"
    ? trace.load
    : 50;
  const xPosition = -1.12 + (load / 100) * 2.24;
  const surfaceZ = Math.sqrt(
    Math.max(0, 1.355 ** 2 - xPosition ** 2),
  );
  const finalHeight = Math.max(
    0.08,
    Math.min(0.62, (trace.peakForce / forceAxisMax) * 0.68),
  );

  useEffect(() => {
    startedAt.current = performance.now();
  }, [trace.id]);

  useFrame(() => {
    const elapsed = isActive
      ? simulationTimeMs ?? performance.now() - startedAt.current
      : playbackMs;
    const progress = Math.min(1, elapsed / playbackMs);
    const visibleHeight = Math.max(0.002, finalHeight * progress);

    if (lineRef.current) {
      lineRef.current.position.y = 0.4 + visibleHeight / 2;
      lineRef.current.scale.y = visibleHeight;
    }
  });

  return (
    <mesh
      ref={lineRef}
      position={[xPosition, 0.4, surfaceZ + 0.04]}
      renderOrder={6}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.022, 0.022, 1, 10]} />
      <meshBasicMaterial color="#f5f7e9" depthTest={false} />
    </mesh>
  );
}

function RecordedDrumTrace({
  trace,
  recordingWindowMs,
  stimulusOffsetMs,
  forceAxisMax,
  playbackMs,
  simulationTimeMs,
  drumRevolutions,
  wrapTraceAroundDrum,
  isActive,
  drumTraceRadius,
}: {
  trace: TwitchTrace;
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
  drumRevolutions: number;
  wrapTraceAroundDrum: boolean;
  isActive: boolean;
  drumTraceRadius: number;
}) {
  const startedAt = useRef(0);
  const lastVisible = useRef(0);
  const chalkRef = useRef<Mesh>(null);

  useEffect(() => {
    startedAt.current = performance.now();
    lastVisible.current = 0;
  }, [trace.id]);

  useEffect(() => () => {
    chalkRef.current?.geometry.dispose();
  }, []);

  useFrame(() => {
    const elapsed = isActive
      ? simulationTimeMs ?? performance.now() - startedAt.current
      : playbackMs;
    const progress = Math.min(1, elapsed / playbackMs);
    const visible = Math.max(
      1,
      Math.floor(progress * (DRUM_SAMPLE_COUNT - 1)) + 1,
    );
    if (visible === lastVisible.current) return;
    lastVisible.current = visible;
    const amplitude = Math.min(
      0.62,
      (trace.peakForce / forceAxisMax) * 0.68,
    );
    const points: Vector3[] = [];

    for (let index = 0; index < visible; index += 1) {
      const sampleProgress = index / (DRUM_SAMPLE_COUNT - 1);
      const response = normalizedTwitchAt(
        Math.max(
          0,
          sampleProgress * recordingWindowMs - stimulusOffsetMs,
        ),
        trace,
      );
      if (wrapTraceAroundDrum) {
        const stylusAngle = 1.45;
        const angle =
          stylusAngle - sampleProgress * Math.PI * 2 * drumRevolutions;
        const radius = 1.375;
        points.push(
          new Vector3(
            Math.sin(angle) * radius,
            0.4 + response * amplitude,
            Math.cos(angle) * radius,
          ),
        );
      } else {
        const xPosition = -0.26 + sampleProgress * 2.505;
        const surfaceZ = Math.sqrt(
          Math.max(0, 1.355 ** 2 - xPosition ** 2),
        );
        points.push(
          new Vector3(
            xPosition,
            0.4 + response * amplitude,
            surfaceZ + 0.035,
          ),
        );
      }
    }
    if (points.length === 1) points.push(points[0].clone().addScalar(0.0001));

    const nextGeometry = new TubeGeometry(
      new CatmullRomCurve3(points),
      Math.max(8, points.length * 2),
      drumTraceRadius,
      6,
      false,
    );
    const mesh = chalkRef.current;
    if (!mesh) {
      nextGeometry.dispose();
      return;
    }
    const previousGeometry = mesh.geometry;
    mesh.geometry = nextGeometry;
    previousGeometry.dispose();
  });

  return (
    <mesh ref={chalkRef} renderOrder={5} frustumCulled={false}>
      <meshBasicMaterial
        color="#f5f7e9"
        depthTest={wrapTraceAroundDrum}
      />
    </mesh>
  );
}

function SupportStand() {
  return (
    <group position={[3.58, 0.65, -0.35]}>
      {/* Weighted brass foot and steel upright, matching the real laboratory stand. */}
      <mesh position={[0, -0.62, 0]} castShadow>
        <boxGeometry args={[1.18, 0.12, 1.28]} />
        <meshStandardMaterial color="#72501f" metalness={0.32} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.52, 0]} castShadow>
        <boxGeometry args={[0.88, 0.12, 0.92]} />
        <meshStandardMaterial color="#b18a43" metalness={0.46} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.095, 4.1, 32]} />
        <meshStandardMaterial color="#aeb5ba" metalness={0.86} roughness={0.18} />
      </mesh>
      <mesh position={[0, 3.52, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.22, 24]} />
        <meshStandardMaterial color="#6c7378" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[-0.72, 1.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 1.45, 24]} />
        <meshStandardMaterial color="#c0c6ca" metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.28, 24]} />
        <meshStandardMaterial color="#707980" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.18, 1.35, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.32, 16]} />
        <meshStandardMaterial color="#31383d" metalness={0.66} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ElectrodeRod({ z, tilt }: { z: number; tilt: number }) {
  return (
    <group position={[0, 0.22, z]} rotation={[0, 0, tilt]}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.038, 1.18, 18]} />
        <meshStandardMaterial color="#8c5415" metalness={0.7} roughness={0.24} />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.34, 20]} />
        <meshStandardMaterial color="#eee9df" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.03, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.018, 0.25, 14]} />
        <meshStandardMaterial color="#d6dade" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.115, 20, 16]} />
        <meshStandardMaterial color="#a56d21" metalness={0.72} roughness={0.24} />
      </mesh>
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]} castShadow>
          <boxGeometry args={[0.055, 0.42, 0.12]} />
          <meshStandardMaterial color="#744510" metalness={0.55} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.36, 16]} />
        <meshStandardMaterial color="#c38a35" metalness={0.75} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Electrodes() {
  return (
    <group position={[-0.75, 0.55, 0.05]}>
      <mesh position={[0, -0.13, 0]} castShadow>
        <boxGeometry args={[1.22, 0.25, 1.06]} />
        <meshStandardMaterial color="#15191c" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[1.08, 0.13, 0.88]} />
        <meshStandardMaterial color="#a66a1c" metalness={0.68} roughness={0.27} />
      </mesh>
      {[-0.42, 0.42].map((z, index) => (
        <ElectrodeRod key={z} z={z} tilt={index === 0 ? -0.12 : 0.12} />
      ))}
      {[-0.43, 0.43].map((z, index) => (
        <group key={z} position={[-0.45, 0.2, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.24, 18]} />
            <meshStandardMaterial color={index ? "#16191c" : "#b52d29"} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 18]} />
            <meshStandardMaterial color="#c58a32" metalness={0.74} roughness={0.22} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.69, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.35, 18]} />
        <meshStandardMaterial color="#171b1e" roughness={0.42} />
      </mesh>
      <mesh position={[0.86, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.22, 16]} />
        <meshStandardMaterial color="#b47a27" metalness={0.72} roughness={0.22} />
      </mesh>
    </group>
  );
}

function MusclePreparation({ muscleRef }: { muscleRef: React.RefObject<Mesh | null> }) {
  return (
    <group position={[0.75, 0.15, 0]}>
      <mesh ref={muscleRef} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.38, 1.85, 12, 32]} />
        <meshPhysicalMaterial color="#d84b70" roughness={0.48} clearcoat={0.22} />
      </mesh>
      <mesh position={[-1.48, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.92, 16]} />
        <meshStandardMaterial color="#efe3c8" roughness={0.7} />
      </mesh>
      <mesh position={[1.48, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
        <meshStandardMaterial color="#efe3c8" roughness={0.7} />
      </mesh>
      <mesh position={[-1.85, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.75, 12]} />
        <meshStandardMaterial color="#d8d2bd" roughness={0.75} />
      </mesh>
    </group>
  );
}

function InductionCoil({ distance }: { distance: number }) {
  return (
    <group position={[3.1, -0.12, 1.72]} rotation={[0, -0.2, 0]}>
      <mesh position={[0.15, -0.42, 0]} castShadow>
        <boxGeometry args={[3.25, 0.16, 1.05]} />
        <meshStandardMaterial color="#3b2022" roughness={0.64} />
      </mesh>
      {[-0.3, 0.3].map((z) => (
        <mesh key={z} position={[0.15, -0.31, z]} castShadow>
          <boxGeometry args={[2.85, 0.08, 0.11]} />
          <meshStandardMaterial color="#b8a46a" metalness={0.58} roughness={0.3} />
        </mesh>
      ))}
      <CoilAssembly position={-0.82} color="#8b4d2c" />
      <MovableSecondaryCoil distance={distance} />
      <mesh position={[-1.3, -0.22, 0]}>
        <boxGeometry args={[0.16, 0.26, 0.72]} />
        <meshStandardMaterial color="#191d21" roughness={0.55} />
      </mesh>
      <mesh position={[1.58, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 20]} />
        <meshStandardMaterial color="#7e858c" metalness={0.72} roughness={0.25} />
      </mesh>
      <mesh position={[1.58, -1.28, 0]} castShadow>
        <boxGeometry args={[0.85, 0.14, 0.72]} />
        <meshStandardMaterial color="#8d682f" roughness={0.5} />
      </mesh>
    </group>
  );
}

function MovableSecondaryCoil({ distance }: { distance: number }) {
  const coilRef = useRef<Group>(null);
  const targetX = -0.42 + (distance / 15) * 1.72;

  useFrame((_, delta) => {
    if (!coilRef.current) return;
    const easing = Math.min(1, delta * 7);
    coilRef.current.position.x +=
      (targetX - coilRef.current.position.x) * easing;
  });

  return (
    <group ref={coilRef} position={[targetX, 0, 0]}>
      <CoilBody color="#a76238" />
      <mesh position={[0, 0.47, 0]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color="#49d9e8" />
      </mesh>
    </group>
  );
}

function CoilAssembly({
  position,
  color,
}: {
  position: number;
  color: string;
}) {
  return (
    <group position={[position, 0, 0]}>
      <CoilBody color={color} />
    </group>
  );
}

function CoilBody({ color }: { color: string }) {
  return (
    <group position={[0, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
      {[-0.14, -0.07, 0, 0.07, 0.14].map((x) => (
        <mesh key={x} position={[0, 0, x]} castShadow>
          <torusGeometry args={[0.31, 0.045, 10, 28]} />
          <meshStandardMaterial color={color} metalness={0.42} roughness={0.35} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.48, 24]} />
        <meshStandardMaterial color="#34383c" metalness={0.58} roughness={0.32} />
      </mesh>
    </group>
  );
}

function AppliedLoad({
  loadGrams,
  mode,
}: {
  loadGrams: number;
  mode: "afterloaded" | "freeloaded";
}) {
  const height = 0.16 + (loadGrams / 100) * 0.4;
  const y = mode === "afterloaded" ? 0.55 - height / 2 : 0.78 - height / 2;

  return (
    <group position={[2.28, 0.12, -0.12]}>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.25, 12]} />
        <meshStandardMaterial color="#d8d2bd" roughness={0.7} />
      </mesh>
      <mesh position={[0, y + height / 2 + 0.05, 0]}>
        <torusGeometry args={[0.13, 0.026, 10, 20]} />
        <meshStandardMaterial color="#8894a1" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, y, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, height, 24]} />
        <meshStandardMaterial color="#456884" metalness={0.58} roughness={0.3} />
      </mesh>
      <mesh position={[0, y - height / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
        <meshStandardMaterial color="#2d465d" metalness={0.55} roughness={0.32} />
      </mesh>
    </group>
  );
}

function WritingLever({ leverRef }: { leverRef: React.RefObject<Group | null> }) {
  return (
    <group ref={leverRef} position={[1.95, 1.45, 0]}>
      <mesh position={[0, -0.72, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
        <meshStandardMaterial color="#d9d3c1" roughness={0.72} />
      </mesh>
      <mesh position={[0.72, 0, 0]} castShadow>
        <boxGeometry args={[2.85, 0.14, 0.22]} />
        <meshStandardMaterial color="#9b6a1c" metalness={0.18} roughness={0.45} />
      </mesh>
      <mesh position={[2.16, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.34, 0.44]} />
        <meshStandardMaterial color="#815317" metalness={0.22} roughness={0.42} />
      </mesh>
      <mesh position={[-1.98, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, 3.95, 12]} />
        <meshStandardMaterial color="#d6d9d5" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[-3.96, 0, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#f0eee4" roughness={0.5} />
      </mesh>
      {[0.15, 0.55, 0.95, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.075, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#151515" />
        </mesh>
      ))}
    </group>
  );
}
