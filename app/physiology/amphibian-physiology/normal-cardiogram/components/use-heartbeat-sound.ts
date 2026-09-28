"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useHeartbeatSound() {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);

  const playPulse = useCallback((delay: number, frequency: number, volume: number) => {
    const context = contextRef.current;
    if (!context || context.state !== "running") return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + 0.11);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.15);
  }, []);

  const playBeat = useCallback((accent: "primary" | "secondary" = "primary") => {
    if (!enabledRef.current) return;
    if (accent === "primary") {
      playPulse(0, 74, 0.16);
      return;
    }
    playPulse(0, 56, 0.12);
  }, [playPulse]);

  const enable = useCallback(async () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }
    await contextRef.current.resume();
    enabledRef.current = true;
    setEnabled(true);
  }, []);

  const toggle = useCallback(() => {
    if (!enabled) {
      void enable();
      return;
    }
    enabledRef.current = false;
    setEnabled(false);
  }, [enable, enabled]);

  useEffect(
    () => () => {
      void contextRef.current?.close();
    },
    [],
  );

  return { enabled, enable, toggle, playBeat };
}
