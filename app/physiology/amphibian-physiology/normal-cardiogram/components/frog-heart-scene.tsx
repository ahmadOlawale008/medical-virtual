"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CanvasTexture,
  CatmullRomCurve3,
  LinearFilter,
  RepeatWrapping,
  TubeGeometry,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import {
  CARDIOGRAM_DURATION_MS,
  getCardiacState,
  type CardiogramTemperature,
} from "../cardiogram-model";

export default function FrogHeartScene({
  temperature,
  recording,
  simulationTimeMs,
  drumSpeed,
  resetKey,
  forceOverride,
  traceOverride,
  traceTravel,
  showTapKey = false,
  stimulusActive = false,
}: {
  temperature: CardiogramTemperature;
  recording: boolean;
  simulationTimeMs: number;
  drumSpeed: number;
  resetKey: number;
  forceOverride?: number;
  traceOverride?: number;
  traceTravel?: number;
  showTapKey?: boolean;
  stimulusActive?: boolean;
}) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <div className="relative h-full min-h-[560px] w-full bg-[#dbe4eb]">
      <Canvas
        shadows
        camera={{ position: [-.5, 3.8, 12.4], fov: 49, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#dbe4eb"]} />
        <fog attach="fog" args={["#dbe4eb", 16, 29]} />
        <ambientLight intensity={1.45} />
        <directionalLight
          position={[7, 10, 8]}
          intensity={2.7}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 4, -5]} intensity={0.8} color="#b9d8e8" />
        <CardiogramApparatus
          temperature={temperature}
          recording={recording}
          simulationTimeMs={simulationTimeMs}
          drumSpeed={drumSpeed}
          resetKey={resetKey}
          forceOverride={forceOverride}
          traceOverride={traceOverride}
          traceTravel={traceTravel}
          showTapKey={showTapKey}
          stimulusActive={stimulusActive}
          onHoverChange={setHoveredPart}
        />
        <CameraController />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-black/10 bg-white/75 px-3 py-2 text-[10px] leading-4 text-[#41575a] backdrop-blur-sm">
        Drag to rotate · Scroll to zoom<br />Double-click to reset view
      </div>
      {hoveredPart && (
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-black/10 bg-[#10242b]/92 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          {hoveredPart}
        </div>
      )}
    </div>
  );
}

function CardiogramApparatus({
  temperature,
  recording,
  simulationTimeMs,
  drumSpeed,
  resetKey,
  forceOverride,
  traceOverride,
  traceTravel,
  showTapKey,
  stimulusActive,
  onHoverChange,
}: {
  temperature: CardiogramTemperature;
  recording: boolean;
  simulationTimeMs: number;
  drumSpeed: number;
  resetKey: number;
  forceOverride?: number;
  traceOverride?: number;
  traceTravel?: number;
  showTapKey: boolean;
  stimulusActive: boolean;
  onHoverChange: (label: string | null) => void;
}) {
  const heartRef = useRef<Group>(null);
  const ventricleRef = useRef<Mesh>(null);
  const leverRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const heartTimeMs = recording
      ? simulationTimeMs
      : clock.elapsedTime * 1000;
    const state = getCardiacState(heartTimeMs, temperature);
    const displayedForce = forceOverride ?? state.force;
    const contraction = Math.min(1, displayedForce / 3.9);

    if (heartRef.current) {
      heartRef.current.rotation.z = Math.sin(state.phase * Math.PI * 2) * 0.025;
    }
    if (ventricleRef.current) {
      ventricleRef.current.scale.set(
        0.5 * (1 + contraction * 0.13),
        0.72 * (1 - contraction * 0.1),
        0.5 * (1 + contraction * 0.13),
      );
    }
    if (leverRef.current) {
      // Keep the writing point against the drum while the ventricular pull
      // raises and lowers the long arm.
      leverRef.current.rotation.z = 0.045 + contraction * 0.035;
    }
  });

  return (
    <group position={[0, -0.35, 0]}>
      <MyographBoard onHoverChange={onHoverChange} />
      <PithedFrog onHoverChange={onHoverChange} />
      <ExposedHeart
        heartRef={heartRef}
        ventricleRef={ventricleRef}
        temperature={temperature}
        onHoverChange={onHoverChange}
      />
      <StarlingLever leverRef={leverRef} onHoverChange={onHoverChange} />
      <VentricleSuture onHoverChange={onHoverChange} />
      {showTapKey && (
        <TapKey active={stimulusActive} onHoverChange={onHoverChange} />
      )}
      <Kymograph
        temperature={temperature}
        recording={recording}
        simulationTimeMs={simulationTimeMs}
        drumSpeed={drumSpeed}
        resetKey={resetKey}
        forceOverride={forceOverride}
        traceOverride={traceOverride}
        traceTravel={traceTravel}
        onHoverChange={onHoverChange}
      />
    </group>
  );
}

function TapKey({
  active,
  onHoverChange,
}: {
  active: boolean;
  onHoverChange: (label: string | null) => void;
}) {
  const lever = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!lever.current) return;
    const target = active ? 0.035 : 0.2;
    lever.current.rotation.z += (target - lever.current.rotation.z) * Math.min(1, delta * 18);
  });

  return (
    <InteractivePart label="Tap key (stimulus)" onHoverChange={onHoverChange}>
      <group position={[4.9, -0.72, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.15, 0.72]} />
          <meshStandardMaterial color="#151a1d" metalness={0.25} roughness={0.42} />
        </mesh>
        {[-0.5, 0.5].map((x) => (
          <group key={x} position={[x, 0.14, 0.22]}>
            <mesh><cylinderGeometry args={[0.11, 0.11, 0.04, 20]} /><meshStandardMaterial color="#bd8430" metalness={0.76} roughness={0.2} /></mesh>
            <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.065, 0.085, 0.22, 18]} /><meshStandardMaterial color="#24292c" roughness={0.34} /></mesh>
            <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.095, 0.095, 0.07, 18]} /><meshStandardMaterial color="#c48c37" metalness={0.76} roughness={0.2} /></mesh>
          </group>
        ))}
        <group position={[-0.48, 0.18, -0.1]}>
          <mesh><boxGeometry args={[0.25, 0.025, 0.32]} /><meshStandardMaterial color="#bcc4c9" metalness={0.8} roughness={0.18} /></mesh>
          <group ref={lever} rotation={[0, 0, 0.2]}>
            <mesh position={[0.5, 0.08, 0]} castShadow><boxGeometry args={[1.08, 0.035, 0.13]} /><meshStandardMaterial color="#d3d8da" metalness={0.84} roughness={0.16} /></mesh>
            <mesh position={[1.02, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.16, 18]} /><meshStandardMaterial color="#252b2e" roughness={0.3} /></mesh>
            <mesh position={[1.02, 0.02, 0]}><cylinderGeometry args={[0.035, 0.035, 0.16, 14]} /><meshStandardMaterial color="#c18a35" metalness={0.72} roughness={0.2} /></mesh>
          </group>
        </group>
        <group position={[0.58, 0.18, -0.1]}>
          <mesh><cylinderGeometry args={[0.11, 0.11, 0.12, 18]} /><meshStandardMaterial color="#c48b32" metalness={0.76} roughness={0.2} /></mesh>
          <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.055, 0.055, 0.14, 16]} /><meshStandardMaterial color="#d9dcdd" metalness={0.84} roughness={0.16} /></mesh>
        </group>
      </group>
    </InteractivePart>
  );
}

function InteractivePart({
  label,
  onHoverChange,
  children,
}: {
  label: string;
  onHoverChange: (label: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <group
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHoverChange(label);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        onHoverChange(null);
      }}
    >
      {children}
    </group>
  );
}

function MyographBoard({
  onHoverChange,
}: {
  onHoverChange: (label: string | null) => void;
}) {
  return (
    <InteractivePart label="Myograph board" onHoverChange={onHoverChange}>
      <group position={[3.1, -1.1, -1.1]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.1, 0.24, 4.1]} />
          <meshStandardMaterial color="#b69362" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.14, 0]} receiveShadow>
          <boxGeometry args={[5.7, 0.08, 3.72]} />
          <meshStandardMaterial color="#eee0bd" roughness={0.82} />
        </mesh>
        {[[-2.5, -1.7], [2.5, -1.7], [-2.5, 1.7], [2.5, 1.7]].map(
          ([x, z]) => (
            <mesh key={`${x}-${z}`} position={[x, -0.25, z]}>
              <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
              <meshStandardMaterial color="#6c4b2a" roughness={0.7} />
            </mesh>
          ),
        )}
      </group>
    </InteractivePart>
  );
}

function PithedFrog({
  onHoverChange,
}: {
  onHoverChange: (label: string | null) => void;
}) {
  return (
    <InteractivePart label="Frog (pithed)" onHoverChange={onHoverChange}>
      <group position={[3.2, -.7, -1.15]} rotation={[0, 0.04, 0]}>
        <mesh position={[0, 0.12, 0]} scale={[1.5, 0.48, 1.25]} castShadow>
          <sphereGeometry args={[0.78, 36, 28]} />
          <meshStandardMaterial color="#738d4c" roughness={0.67} />
        </mesh>
        <mesh position={[1.23, 0.14, 0]} scale={[0.78, 0.42, 0.88]} castShadow>
          <sphereGeometry args={[0.7, 32, 24]} />
          <meshStandardMaterial color="#7f9855" roughness={0.64} />
        </mesh>
        <FrogLimbs />
        <mesh position={[1.46, 0.39, 0.27]}>
          <sphereGeometry args={[0.08, 18, 18]} />
          <meshStandardMaterial color="#121516" roughness={0.28} />
        </mesh>
        <mesh position={[1.46, 0.39, -0.27]}>
          <sphereGeometry args={[0.08, 18, 18]} />
          <meshStandardMaterial color="#121516" roughness={0.28} />
        </mesh>
        <OpenChest />
        <FixationPins />
      </group>
    </InteractivePart>
  );
}

function FrogLimbs() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={`hind-${side}`}>
          <mesh
            position={[-0.72, -0.02, side * 1.02]}
            rotation={[0, side * 0.65, Math.PI / 2]}
            castShadow
          >
            <capsuleGeometry args={[0.19, 1.05, 8, 20]} />
            <meshStandardMaterial color="#698244" roughness={0.72} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`front-${side}`}>
          <mesh
            position={[0.72, 0.02, side * 0.73]}
            rotation={[0, side * 0.98, Math.PI / 2]}
            castShadow
          >
            <capsuleGeometry args={[0.12, 1.58, 8, 18]} />
            <meshStandardMaterial color="#76914e" roughness={0.7} />
          </mesh>
          {/* <mesh
            position={[0.96, 0, side * 1.14]}
            rotation={[0, side * 1.05, Math.PI / 2]}
            castShadow
          >
            <capsuleGeometry args={[0.1, 0.46, 8, 18]} />
            <meshStandardMaterial color="#7f9855" roughness={0.68} />
          </mesh> */}
        </group>
      ))}
    </group>
  );
}

function OpenChest() {
  return (
    <group position={[0.18, 0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.72, 1]}>
        <circleGeometry args={[0.62, 40]} />
        <meshStandardMaterial color="#5f242a" roughness={0.8} side={2} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, 0.035, side * 0.48]}
          rotation={[0, side * 0.22, side * 0.1]}
        >
          <boxGeometry args={[1.05, 0.055, 0.26]} />
          <meshStandardMaterial color="#7d984f" roughness={0.74} />
        </mesh>
      ))}
    </group>
  );
}

function FixationPins() {
  return (
    <group>
      {[
        [-1.02, 1.35],
        [-1.02, -1.35],
        [0.32, 1.35],
        [0.32, -1.35],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0.02, z]}>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.34, 10]} />
            <meshStandardMaterial color="#aab3bb" metalness={0.7} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#263748" metalness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ExposedHeart({
  heartRef,
  ventricleRef,
  temperature,
  onHoverChange,
}: {
  heartRef: React.RefObject<Group | null>;
  ventricleRef: React.RefObject<Mesh | null>;
  temperature: CardiogramTemperature;
  onHoverChange: (label: string | null) => void;
}) {
  const heartColor = temperature === 15
    ? "#8d1730"
    : temperature === 35
      ? "#f04352"
      : "#c51f45";

  return (
    <group ref={heartRef} position={[3.38, -0.15, -1.15]}>
      <InteractivePart label="Sinus venosus (posterior)" onHoverChange={onHoverChange}>
        <mesh position={[-0.3, -0.08, 0]} scale={[0.78, 0.26, 0.68]}>
          <sphereGeometry args={[0.42, 28, 22]} />
          <meshPhysicalMaterial color="#55364f" roughness={0.5} clearcoat={0.2} />
        </mesh>
      </InteractivePart>
      <InteractivePart label="Right and left atria" onHoverChange={onHoverChange}>
        <mesh position={[-0.03, 0.02, 0.17]} scale={[0.45, 0.48, 0.55]}>
          <sphereGeometry args={[0.42, 28, 24]} />
          <meshPhysicalMaterial color="#922b45" roughness={0.42} clearcoat={0.3} />
        </mesh>
        <mesh position={[-0.13, 0.02, -0.17]} scale={[0.55, 0.48, 0.65]}>
          <sphereGeometry args={[0.42, 28, 24]} />
          <meshPhysicalMaterial color="#a6364d" roughness={0.42} clearcoat={0.3} />
        </mesh>
      </InteractivePart>
      <InteractivePart label="Ventricle on frog" onHoverChange={onHoverChange}>
        <mesh
          ref={ventricleRef}
          position={[0.04, 0.29, 0]}
          scale={[0.5, 0.72, 0.5]}
          castShadow
        >
          <sphereGeometry args={[0.72, 36, 30]} />
          <meshPhysicalMaterial color={heartColor} roughness={0.35} clearcoat={0.55} />
        </mesh>
        <mesh position={[0.04, 0.73, 0]}>
          <coneGeometry args={[0.18, 0.38, 32]} />
          <meshPhysicalMaterial color={heartColor} roughness={0.36} clearcoat={0.5} />
        </mesh>
      </InteractivePart>
    </group>
  );
}

function StarlingLever({
  leverRef,
  onHoverChange,
}: {
  leverRef: React.RefObject<Group | null>;
  onHoverChange: (label: string | null) => void;
}) {
  return (
    <group position={[4.1, 0, -1.42]}>
      <InteractivePart label="Upright support post" onHoverChange={onHoverChange}>
        <mesh position={[2.35, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.085, 4.1, 28]} />
          <meshStandardMaterial color="#aeb6bb" metalness={0.86} roughness={0.17} />
        </mesh>
        <mesh position={[2.35, -0.92, 0]} castShadow>
          <boxGeometry args={[1, 0.12, 0.82]} />
          <meshStandardMaterial color="#75501f" metalness={0.38} roughness={0.38} />
        </mesh>
        <mesh position={[2.35, -0.83, 0]} castShadow>
          <boxGeometry args={[0.72, 0.08, 0.58]} />
          <meshStandardMaterial color="#b38a43" metalness={0.5} roughness={0.28} />
        </mesh>
      </InteractivePart>

      <InteractivePart label="Starling lever mounting clamp" onHoverChange={onHoverChange}>
        <mesh position={[1.73, 1.45, 0]} castShadow>
          <boxGeometry args={[1.25, 0.18, 0.4]} />
          <meshStandardMaterial color="#dce1e3" metalness={0.78} roughness={0.17} />
        </mesh>
        <mesh position={[2.35, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.055, 12, 24]} />
          <meshStandardMaterial color="#c8ced1" metalness={0.82} roughness={0.17} />
        </mesh>
        <mesh position={[2.02, 1.45, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.34, 18]} />
          <meshStandardMaterial color="#31445a" metalness={0.45} />
        </mesh>
        <mesh position={[2.02, 1.45, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.12, 12]} />
          <meshStandardMaterial color="#26384b" metalness={0.48} roughness={0.3} />
        </mesh>
        <mesh position={[1.1, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.54, 20]} />
          <meshStandardMaterial color="#526273" metalness={0.72} roughness={0.22} />
        </mesh>
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[1.13, 1.29, z]} castShadow>
            <boxGeometry args={[0.2, 0.42, 0.075]} />
            <meshStandardMaterial color="#cfd5d8" metalness={0.75} roughness={0.18} />
          </mesh>
        ))}
      </InteractivePart>

      <InteractivePart label="Tension adjuster" onHoverChange={onHoverChange}>
        <group position={[1.55, 1.83, 0]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
            <meshStandardMaterial color="#cbd3d8" metalness={0.74} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.12, 20]} />
            <meshStandardMaterial color="#465768" metalness={0.65} roughness={0.27} />
          </mesh>
          <mesh position={[0, -0.39, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 20]} />
            <meshStandardMaterial color="#465768" metalness={0.65} roughness={0.27} />
          </mesh>
        </group>
      </InteractivePart>

      <InteractivePart label="Starling lever arm and writing stylus" onHoverChange={onHoverChange}>
        <group ref={leverRef} position={[1.1, 1.54, 0]}>
          <mesh position={[-1.72, 0, 0]} castShadow>
            <boxGeometry args={[3.45, 0.12, 0.2]} />
            <meshStandardMaterial color="#e8eaeb" metalness={0.52} roughness={0.3} />
          </mesh>
          <mesh position={[-5.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.016, 3.55, 12]} />
            <meshStandardMaterial color="#17191b" roughness={0.5} />
          </mesh>
          <mesh position={[-6.99, 0, 0]}>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshStandardMaterial color="#0d0f10" roughness={0.45} />
          </mesh>
          {[-2.6, -2.25, -1.9, -1.55, -1.2, -0.85].map((x) => (
            <mesh key={x} position={[x, 0.075, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#1d2937" />
            </mesh>
          ))}
        </group>
      </InteractivePart>
      <Spring />
    </group>
  );
}

function VentricleSuture({
  onHoverChange,
}: {
  onHoverChange: (label: string | null) => void;
}) {
  const geometry = useMemo(
    () => new TubeGeometry(
      new CatmullRomCurve3([
        new Vector3(3.42, 0.56, -1.15),
        new Vector3(3.42, 0.98, -1.27),
        new Vector3(3.42, 1.46, -1.42),
      ]),
      42,
      0.012,
      7,
      false,
    ),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <InteractivePart label="Heart hook and ventricular thread" onHoverChange={onHoverChange}>
      <group>
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#e7e2d8" roughness={0.55} />
        </mesh>
        <mesh position={[3.42, 0.53, -1.15]} rotation={[Math.PI / 2, 0, 0.35]}>
          <torusGeometry args={[0.105, 0.018, 8, 24, Math.PI * 1.45]} />
          <meshStandardMaterial color="#b9c3ca" metalness={0.7} roughness={0.22} />
        </mesh>
      </group>
    </InteractivePart>
  );
}

function Spring() {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 100 }, (_, index) => {
      const progress = index / 99;
      const angle = progress * Math.PI * 22;
      return new Vector3(
        0.12 * Math.cos(angle),
        progress * .59,
        0.14 * Math.sin(angle),
      );
    });
    return new TubeGeometry(
      new CatmullRomCurve3(points),
      180,
      0.015,
      8,
      false,
    );
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position={[1.2, 1.6, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#cbd3d8" metalness={0.88} roughness={10.24} />
      </mesh>
    </group>
  );
}

function Kymograph({
  temperature,
  recording,
  simulationTimeMs,
  drumSpeed,
  resetKey,
  forceOverride,
  traceOverride,
  traceTravel,
  onHoverChange,
}: {
  temperature: CardiogramTemperature;
  recording: boolean;
  simulationTimeMs: number;
  drumSpeed: number;
  resetKey: number;
  forceOverride?: number;
  traceOverride?: number;
  traceTravel?: number;
  onHoverChange: (label: string | null) => void;
}) {
  const drumRef = useRef<Group>(null);
  const drawing = useRef({
    x: 0,
    previousX: 0,
    previousY: 256,
    hasPoint: false,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<CanvasTexture | null>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  useEffect(() => {
    const element = document.createElement("canvas");
    element.width = 2048;
    element.height = 512;
    canvasRef.current = element;
    const nextTexture = new CanvasTexture(element);
    nextTexture.wrapS = RepeatWrapping;
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    textureRef.current = nextTexture;
    if (materialRef.current) {
      materialRef.current.map = nextTexture;
      // Texture colors are multiplied by the material color. A black material
      // made the white chalk trace render almost black and appear missing.
      materialRef.current.color.set("#ffffff");
      materialRef.current.needsUpdate = true;
    }

    const context = element.getContext("2d");
    if (context) {
      context.fillStyle = "#080a0b";
      context.fillRect(0, 0, element.width, element.height);
      nextTexture.needsUpdate = true;
    }

    return () => nextTexture.dispose();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const texture = textureRef.current;
    if (!canvas || !texture) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#080a0b";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawing.current = {
      x: 0,
      previousX: 0,
      previousY: 256,
      hasPoint: false,
    };
    texture.needsUpdate = true;
  }, [resetKey]);

  useFrame(() => {
    if (!recording) return;
    const canvas = canvasRef.current;
    const texture = textureRef.current;
    if (!canvas || !texture) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const force = traceOverride ?? forceOverride ?? getCardiacState(simulationTimeMs, temperature).force;
    // The reference speed records one complete 15-second run in one drum
    // revolution. Deriving both the texture position and drum angle from the
    // same absolute clock prevents frame-rate drift and an unwanted second
    // pass over the trace at the end of the run.
    const recordingProgress = Math.min(
      1,
      Math.max(0, simulationTimeMs / CARDIOGRAM_DURATION_MS),
    );
    const revolutions = traceTravel ?? recordingProgress * (drumSpeed / 2.5) * .3;
    const turnProgress = revolutions - Math.floor(revolutions);
    const finishesExactlyOnSeam =
      recordingProgress === 1 && Math.abs(turnProgress) < 0.0001;
    const nextX =
      (finishesExactlyOnSeam ? 1 : turnProgress) * (canvas.width - 1);
    const nextY = 306 - force * 32;

    context.strokeStyle = "#f3f1e8";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    if (!drawing.current.hasPoint || nextX < drawing.current.previousX) {
      context.moveTo(nextX, nextY);
    } else {
      context.moveTo(drawing.current.previousX, drawing.current.previousY);
      context.lineTo(nextX, nextY);
    }
    context.stroke();

    drawing.current = {
      x: nextX,
      previousX: nextX,
      previousY: nextY,
      hasPoint: true,
    };
    texture.needsUpdate = true;

    if (drumRef.current) {
      drumRef.current.rotation.y = -revolutions * Math.PI * 2;
    }
  });

  return (
    <InteractivePart label="Kymograph drum" onHoverChange={onHoverChange}>
      <group position={[-3.05, 0.18, -0.9]}>
        <group ref={drumRef}>
          <mesh castShadow>
            <cylinderGeometry args={[1.32, 1.32, 2.7, 64]} />
            <meshStandardMaterial ref={materialRef} color="#ffffff" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.48, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.52, 20]} />
            <meshStandardMaterial color="#111827" roughness={0.5} />
          </mesh>
        </group>
        <mesh position={[0, -1.53, 0]} castShadow>
          <boxGeometry args={[2.45, 0.35, 2.25]} />
          <meshStandardMaterial color="#10172f" roughness={0.62} />
        </mesh>
      </group>
    </InteractivePart>
  );
}

function CameraController() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(0.1, 0.3, -0.1);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 7;
    controls.maxDistance = 19;
    controls.maxPolarAngle = Math.PI / 2.03;
    controls.update();

    const reset = () => {
      camera.position.set(8.6, 7.5, -10.8);
      controls.target.set(0.1, 0.3, -0.1);
      controls.update();
    };
    gl.domElement.addEventListener("dblclick", reset);

    return () => {
      gl.domElement.removeEventListener("dblclick", reset);
      controls.dispose();
    };
  }, [camera, gl]);

  useFrame(() => undefined);
  return null;
}
