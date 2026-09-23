import { useState, useEffect, useRef } from 'react';
import { MusicTrack } from './types';
import { getTrackEmotionTheme, EmotionTheme } from './moods';

export type DynamicsMode = 'vibrant' | 'subtle' | 'ambient';

export interface BeatDynamicsState {
  bpm: number;
  beatPulse: number; // 0..1 pulse wave with organic decay
  measurePulse: number; // 0..1 pulse on every 4th beat
  isPeak: boolean;
  emotionTheme: EmotionTheme;
  dynamicsMode: DynamicsMode;
  setDynamicsMode: (mode: DynamicsMode) => void;
  cycleDynamicsMode: () => void;
}

/**
 * Hook providing real-time rhythmic beat pulse and emotional theme resonance.
 * Uses the track's tempo (BPM) and playback state to create a smooth, breathing
 * harmonic pulse across canvas particles, radial room glows, and turntable elements.
 */
export function useBeatDynamics(
  currentTrack: MusicTrack,
  isPlaying: boolean,
  currentTime: number
): BeatDynamicsState {
  const emotionTheme = getTrackEmotionTheme(currentTrack);
  const [dynamicsMode, setDynamicsMode] = useState<DynamicsMode>(() => {
    try {
      const saved = localStorage.getItem('ating_dynamics_mode') as DynamicsMode;
      return saved && ['vibrant', 'subtle', 'ambient'].includes(saved)
        ? saved
        : 'vibrant';
    } catch {
      return 'vibrant';
    }
  });

  const [beatPulse, setBeatPulse] = useState(0);
  const [measurePulse, setMeasurePulse] = useState(0);
  const [isPeak, setIsPeak] = useState(false);

  const bpm = emotionTheme.bpm;
  const beatIntervalMs = (60 / bpm) * 1000;

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const phaseRef = useRef<number>(0);

  // Synchronize phase with playback currentTime whenever currentTime updates
  useEffect(() => {
    if (currentTime > 0) {
      const timeMs = currentTime * 1000;
      phaseRef.current = (timeMs % beatIntervalMs) / beatIntervalMs;
    }
  }, [currentTime, beatIntervalMs]);

  useEffect(() => {
    localStorage.setItem('ating_dynamics_mode', dynamicsMode);
  }, [dynamicsMode]);

  const cycleDynamicsMode = () => {
    setDynamicsMode((prev) => {
      if (prev === 'vibrant') return 'subtle';
      if (prev === 'subtle') return 'ambient';
      return 'vibrant';
    });
  };

  useEffect(() => {
    let active = true;
    let lastRenderTime = 0;
    const FRAME_INTERVAL = 1000 / 50; // Cap at 50 FPS (in 45-60 FPS range)

    const render = (now: number) => {
      if (!active) return;
      animFrameRef.current = requestAnimationFrame(render);

      // Enforce 45-60 FPS rate limit to prevent React state thrashing
      if (now - lastRenderTime < FRAME_INTERVAL) return;
      lastRenderTime = now - ((now - lastRenderTime) % FRAME_INTERVAL);

      const delta = Math.min(64, now - lastTimeRef.current);
      lastTimeRef.current = now;

      if (isPlaying) {
        // Advance beat phase according to tempo
        const phaseStep = delta / beatIntervalMs;
        phaseRef.current = (phaseRef.current + phaseStep) % 1;

        const currentPhase = phaseRef.current; // 0..1

        // Organic beat curve: sharp harmonic attack, smooth exponential decay
        // Math.pow(Math.sin(currentPhase * Math.PI), 3) gives a soft natural kick
        const rawPulse = Math.max(0, 1 - currentPhase * 1.5);
        const smoothPulse = Math.pow(rawPulse, 2.5);

        // Measure pulse: peaks every 4 beats
        const measurePhase = (currentPhase + Math.floor(now / beatIntervalMs) % 4) / 4;
        const rawMeasure = Math.max(0, Math.sin(measurePhase * Math.PI * 2));

        // Scale by dynamics mode multiplier
        const modeMultiplier =
          dynamicsMode === 'vibrant' ? 1.0 : dynamicsMode === 'subtle' ? 0.55 : 0.25;

        const finalBeatPulse = smoothPulse * modeMultiplier * emotionTheme.pulseIntensity;
        const finalMeasurePulse = rawMeasure * modeMultiplier;

        setBeatPulse(finalBeatPulse);
        setMeasurePulse(finalMeasurePulse);
        setIsPeak(currentPhase < 0.15 && isPlaying);
      } else {
        // When paused, maintain a very slow, calm resting breath (0.15 intensity)
        const restWave = (Math.sin(now * 0.0012) + 1) * 0.5;
        setBeatPulse(restWave * 0.15);
        setMeasurePulse(restWave * 0.1);
        setIsPeak(false);
      }
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, beatIntervalMs, dynamicsMode, emotionTheme.pulseIntensity]);

  return {
    bpm,
    beatPulse,
    measurePulse,
    isPeak,
    emotionTheme,
    dynamicsMode,
    setDynamicsMode,
    cycleDynamicsMode,
  };
}
