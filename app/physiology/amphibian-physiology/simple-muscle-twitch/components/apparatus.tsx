"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  LinearFilter,
  type Group,
  type Mesh,
} from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import {
  getStimulationParameters,
  normalizedTwitchAt,
  RECORDING_PLAYBACK_MS,
  SIMPLE_TWITCH_WINDOW_MS,
  type TwitchTrace,
} from "../twitch-model";

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

  useFrame((_, delta) => {
    const elapsed = simulationTimeMs ?? performance.now() - startedAt.current;
    const maximumForce = trace
      ? getStimulationParameters(trace.mode).maximumForce
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
      drumRef.current.rotation.y = Math.min(1, elapsed / playbackMs) * 1.68;
    }
  });

  return (
    <group position={[0, -0.35, 0]}>
      <TissueBath />
      <SmokedDrum
        drumRef={drumRef}
        traces={traces ?? (trace ? [trace] : [])}
        recordingWindowMs={recordingWindowMs}
        stimulusOffsetMs={stimulusOffsetMs}
        forceAxisMax={forceAxisMax}
        playbackMs={playbackMs}
        simulationTimeMs={simulationTimeMs}
      />
      <SupportStand />
      {showElectrodes && <Electrodes />}
      {temperature !== undefined && <Thermometer temperature={temperature} />}
      <MusclePreparation muscleRef={muscleRef} />
      <WritingLever leverRef={leverRef} />
      <mesh position={[0, -0.68, 0]} receiveShadow>
        <boxGeometry args={[10.5, 0.18, 5.8]} />
        <meshStandardMaterial color="#aeb9c3" roughness={0.72} metalness={0.06} />
      </mesh>
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
}: {
  drumRef: React.RefObject<Group | null>;
  traces: TwitchTrace[];
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
}) {
  return (
    <group position={[-3.35, 1.05, 0]}>
      <group>
        <mesh ref={drumRef} castShadow>
          <cylinderGeometry args={[1.34, 1.34, 2.9, 64]} />
          <meshStandardMaterial color="#101416" roughness={0.88} />
        </mesh>
        <DrumTraces
          traces={traces}
          recordingWindowMs={recordingWindowMs}
          stimulusOffsetMs={stimulusOffsetMs}
          forceAxisMax={forceAxisMax}
          playbackMs={playbackMs}
          simulationTimeMs={simulationTimeMs}
        />
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
}: {
  traces: TwitchTrace[];
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
}) {
  return (
    <>
      {traces.map((recording) => (
        <RecordedDrumTrace
          key={recording.id}
          trace={recording}
          recordingWindowMs={recordingWindowMs}
          stimulusOffsetMs={stimulusOffsetMs}
          forceAxisMax={forceAxisMax}
        />
      ))}
    </>
  );
}

function RecordedDrumTrace({
  trace,
  recordingWindowMs,
  stimulusOffsetMs,
  forceAxisMax,
}: {
  trace: TwitchTrace;
  recordingWindowMs: number;
  stimulusOffsetMs: number;
  forceAxisMax: number;
  playbackMs: number;
  simulationTimeMs?: number;
}) {
  const startedAt = useRef(0);
  const { size } = useThree();
  const thickLine = useMemo(() => {
    const geometry = new LineGeometry();
    geometry.setPositions([0, 0, 0, 0, 0, 0]);
    const material = new LineMaterial({
      color: 0xf5f7e9,
      linewidth: 3.25,
    });
    const line = new Line2(geometry, material);
    line.frustumCulled = false;
    return line;
  }, []);

  useEffect(() => {
    startedAt.current = performance.now();
  }, [trace.id]);

  useEffect(() => {
    thickLine.material.resolution.set(size.width, size.height);
  }, [size.height, size.width, thickLine]);

  useEffect(() => () => {
    thickLine.geometry.dispose();
    thickLine.material.dispose();
  }, [thickLine]);

  useFrame(() => {
    const elapsed = simulationTimeMs ?? performance.now() - startedAt.current;
    const progress = Math.min(1, elapsed / playbackMs);
    const visible = Math.max(1, Math.floor(progress * 95) + 1);
    const amplitude = Math.min(0.52, (trace.peakForce / forceAxisMax) * 0.52);
    const positions: number[] = [];

    for (let index = 0; index < visible; index += 1) {
      const sampleProgress = index / 95;
      const age = progress - sampleProgress;
      const projectedAge = Math.pow(Math.max(0, age), 1.9);
      const xPosition = 1.345 - projectedAge * 1.55;
      const surfaceZ = Math.sqrt(
        Math.max(0, 1.355 ** 2 - xPosition ** 2),
      );
      const response = normalizedTwitchAt(
        Math.max(
          0,
          sampleProgress * recordingWindowMs - stimulusOffsetMs,
        ),
        trace,
      );
      positions.push(
        xPosition,
        0.4 + response * amplitude,
        surfaceZ + 0.01,
      );
    }
    if (positions.length === 3) positions.push(...positions);
    thickLine.geometry.setPositions(positions);
    thickLine.computeLineDistances();
  });

  return <primitive object={thickLine} />;
}

function SupportStand() {
  return (
    <group position={[3.58, 0.65, -0.35]}>
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 4.1, 32]} />
        <meshStandardMaterial color="#8f979f" metalness={0.72} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[1.15, 0.18, 1.25]} />
        <meshStandardMaterial color="#926b2e" roughness={0.55} />
      </mesh>
      <mesh position={[-0.72, 1.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 1.45, 24]} />
        <meshStandardMaterial color="#aab1b8" metalness={0.75} roughness={0.22} />
      </mesh>
    </group>
  );
}

function Electrodes() {
  return (
    <group position={[-0.75, 0.55, 0.05]}>
      {[-0.38, 0.38].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 1.1, 20]} />
            <meshStandardMaterial color="#8f5b12" metalness={0.45} roughness={0.34} />
          </mesh>
          <mesh position={[0, 1.03, 0]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial color="#f1f3f4" roughness={0.35} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.12, 0]} castShadow>
        <boxGeometry args={[1.15, 0.25, 1.15]} />
        <meshStandardMaterial color="#171b20" roughness={0.65} />
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
