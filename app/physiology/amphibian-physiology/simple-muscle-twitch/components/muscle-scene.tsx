"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Apparatus from "./apparatus";
import type { TwitchTrace } from "../twitch-model";

export default function MuscleScene({
  trace,
  traces,
  temperature,
  showElectrodes,
  recordingWindowMs,
  stimulusOffsetMs,
  forceAxisMax,
  playbackMs,
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
  return (
    <div className="relative h-full min-h-[520px] w-full bg-[#dbe4eb]">
      <Canvas
        shadows
        camera={{ position: [8.2, 5.8, 9.4], fov: 39, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#dbe4eb"]} />
        <fog attach="fog" args={["#dbe4eb", 15, 27]} />
        <ambientLight intensity={1.35} />
        <directionalLight
          position={[6, 10, 7]}
          intensity={2.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 4, -4]} intensity={0.85} color="#b8d8e9" />
        <Apparatus
          trace={trace}
          traces={traces}
          temperature={temperature}
          showElectrodes={showElectrodes}
          recordingWindowMs={recordingWindowMs}
          stimulusOffsetMs={stimulusOffsetMs}
          forceAxisMax={forceAxisMax}
          playbackMs={playbackMs}
          simulationTimeMs={simulationTimeMs}
        />
        <CameraController />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-black/10 bg-white/75 px-3 py-2 text-[10px] leading-4 text-[#41575a] backdrop-blur-sm">
        Drag to rotate · Scroll to zoom<br />Double-click to reset view
      </div>
    </div>
  );
}

function CameraController() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controlsRef.current = controls;
    controls.target.set(0.2, 0.6, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 6.5;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2.03;
    controls.update();

    const reset = () => {
      camera.position.set(8.2, 5.8, 9.4);
      controls.target.set(0.2, 0.6, 0);
      controls.update();
    };
    gl.domElement.addEventListener("dblclick", reset);
    return () => {
      gl.domElement.removeEventListener("dblclick", reset);
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });
  return null;
}
