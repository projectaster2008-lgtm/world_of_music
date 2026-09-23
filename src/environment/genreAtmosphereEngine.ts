import { useState, useEffect, useMemo, useRef } from 'react';
import { MusicTrack } from '../music/types';
import {
  GenreId,
  GenreDefinition,
  GenreUiTheme,
  ResolvedGenreUiTheme,
  GENRE_DEFINITIONS,
  getTrackGenre,
} from '../music/genres';
import { BeatDynamicsState } from '../music/beatDynamics';

export interface GenreInfluenceWeights {
  current: number; // 0.60
  previous: number; // 0.25
  previousTwo: number; // 0.15
}

export type TransitionStage =
  | 'initiating' // 0s
  | 'fading' // 1-3s
  | 'weather-emerging' // 3-5s
  | 'lighting-shift' // 5-7s
  | 'reflections-appear' // 7-9s
  | 'established'; // 9s+

export interface GenreAtmosphereState {
  currentGenre: GenreDefinition;
  previousGenre: GenreDefinition;
  dominantGenre: GenreDefinition;
  dominantGenreId: GenreId;
  theme: ResolvedGenreUiTheme;
  stage: TransitionStage;
  transitionProgress: number; // 0.0 to 1.0 (smooth 4-6s ramp)
  stageLabel: string;
  genreWeights: Record<GenreId, number>;
  // Environmental visual properties derived from weights & beat dynamics
  primaryHue: number;
  secondaryHue: number;
  accentRgb: string;
  weatherIntensity: number; // 0.0 to 2.0
  rainStrength: number; // 0.0 to 1.0
  goldenDustStrength: number; // 0.0 to 1.0
  steamStrength: number; // 0.0 to 1.0
  firefliesStrength: number; // 0.0 to 1.0
  projectorStarsStrength: number; // 0.0 to 1.0
  cityGlowStrength: number; // 0.0 to 1.0
  lightningFlash: boolean;
  handwrittenQuotes: string[];
}

const DEFAULT_WEIGHTS: GenreInfluenceWeights = {
  current: 0.7,
  previous: 0.2,
  previousTwo: 0.1,
};

export function useGenreAtmosphere(
  currentTrack?: MusicTrack,
  history: MusicTrack[] = [],
  beatDynamics?: BeatDynamicsState,
  isPlaying: boolean = false,
  activeRoomId?: string
): GenreAtmosphereState {
  // Target genre preference: current track genre, or selected genre room if lounging
  const effectiveCurrentGenreId = useMemo<GenreId>(() => {
    if (currentTrack) {
      return getTrackGenre(currentTrack);
    }
    if (activeRoomId && activeRoomId in GENRE_DEFINITIONS) {
      return activeRoomId as GenreId;
    }
    return 'pop';
  }, [currentTrack, activeRoomId]);

  const prevTrack = history[0];
  const prevTwoTrack = history[1];

  const prevGenreId = useMemo(() => {
    if (prevTrack) return getTrackGenre(prevTrack);
    return effectiveCurrentGenreId;
  }, [prevTrack, effectiveCurrentGenreId]);

  const prevTwoGenreId = useMemo(() => {
    if (prevTwoTrack) return getTrackGenre(prevTwoTrack);
    return prevGenreId;
  }, [prevTwoTrack, prevGenreId]);

  // Smooth transition timing: 4.5 seconds to fully establish a new world
  const [transitionElapsed, setTransitionElapsed] = useState<number>(5);
  const triggerTimestampRef = useRef<number>(Date.now() - 6000);
  const lastKeyRef = useRef<string>(`${currentTrack?.id || ''}_${activeRoomId || ''}`);

  useEffect(() => {
    const currentKey = `${currentTrack?.id || ''}_${activeRoomId || ''}`;
    if (currentKey !== lastKeyRef.current) {
      lastKeyRef.current = currentKey;
      triggerTimestampRef.current = Date.now();
      setTransitionElapsed(0);
    }
  }, [currentTrack?.id, activeRoomId]);

  useEffect(() => {
    let animId: number;
    let lastRenderTime = 0;
    const FRAME_INTERVAL = 1000 / 50; // Cap at 50 FPS (in 45-60 FPS range)

    const tick = (now: number) => {
      const elapsedSec = (Date.now() - triggerTimestampRef.current) / 1000;
      if (now - lastRenderTime >= FRAME_INTERVAL) {
        lastRenderTime = now - ((now - lastRenderTime) % FRAME_INTERVAL);
        setTransitionElapsed(elapsedSec);
      }
      if (elapsedSec < 5) {
        animId = requestAnimationFrame(tick);
      }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [currentTrack?.id, activeRoomId]);

  // Stage calculation based on 4.5-second progressive crossfade
  const { stage, stageLabel, progress } = useMemo(() => {
    const p = Math.min(1.0, Math.max(0.0, transitionElapsed / 4.5));
    if (transitionElapsed < 0.6) {
      return { stage: 'initiating' as const, stageLabel: 'Initiating Atmosphere Shift', progress: p };
    }
    if (transitionElapsed < 1.5) {
      return { stage: 'fading' as const, stageLabel: 'World Atmosphere Adapting', progress: p };
    }
    if (transitionElapsed < 2.5) {
      return { stage: 'weather-emerging' as const, stageLabel: 'Weather & Mood Particles Emerging', progress: p };
    }
    if (transitionElapsed < 3.5) {
      return { stage: 'lighting-shift' as const, stageLabel: 'Resonance Lighting Shifting', progress: p };
    }
    if (transitionElapsed < 4.5) {
      return { stage: 'reflections-appear' as const, stageLabel: 'Atmospheric Reflections Harmonizing', progress: p };
    }
    return { stage: 'established' as const, stageLabel: 'Atmosphere In Full Resonance', progress: 1.0 };
  }, [transitionElapsed]);

  // Blend influence weights: Current Genre + Previous Genres
  const genreWeights = useMemo(() => {
    const weights: Record<GenreId, number> = {
      pop: 0,
      'soft-rock': 0,
      indie: 0,
      jazz: 0,
      cinematic: 0,
      opm: 0,
      emo: 0,
    };

    // Smoothly ramp current genre influence based on transition progress
    const dynamicCurrentWeight = DEFAULT_WEIGHTS.current * progress + (1 - DEFAULT_WEIGHTS.current) * (progress > 0.8 ? 0.3 : 0);
    const clampedCurrent = Math.min(0.95, dynamicCurrentWeight);
    const remainingWeight = 1.0 - clampedCurrent;
    const prevProportion = DEFAULT_WEIGHTS.previous / (DEFAULT_WEIGHTS.previous + DEFAULT_WEIGHTS.previousTwo);
    const prevTwoProportion = DEFAULT_WEIGHTS.previousTwo / (DEFAULT_WEIGHTS.previous + DEFAULT_WEIGHTS.previousTwo);

    weights[effectiveCurrentGenreId] = (weights[effectiveCurrentGenreId] || 0) + clampedCurrent;
    weights[prevGenreId] = (weights[prevGenreId] || 0) + remainingWeight * prevProportion;
    weights[prevTwoGenreId] = (weights[prevTwoGenreId] || 0) + remainingWeight * prevTwoProportion;

    return weights;
  }, [effectiveCurrentGenreId, prevGenreId, prevTwoGenreId, progress]);

  // Determine dominant genre from current weights
  const dominantGenreId = useMemo(() => {
    let bestGenre: GenreId = effectiveCurrentGenreId;
    let maxWeight = -1;
    (Object.keys(genreWeights) as GenreId[]).forEach((g) => {
      if (genreWeights[g] > maxWeight) {
        maxWeight = genreWeights[g];
        bestGenre = g;
      }
    });
    return bestGenre;
  }, [genreWeights, effectiveCurrentGenreId]);

  const currentGenre = GENRE_DEFINITIONS[effectiveCurrentGenreId] || GENRE_DEFINITIONS['pop'];
  const previousGenre = GENRE_DEFINITIONS[prevGenreId] || GENRE_DEFINITIONS['pop'];
  const dominantGenre = GENRE_DEFINITIONS[dominantGenreId] || currentGenre;
  const theme: ResolvedGenreUiTheme = dominantGenre.uiTheme as ResolvedGenreUiTheme;

  // Interpolate Hue & Accent
  const { primaryHue, secondaryHue, accentRgb } = useMemo(() => {
    let sumHuePrimary = 0;
    let sumHueSecondary = 0;
    (Object.keys(genreWeights) as GenreId[]).forEach((g) => {
      const def = GENRE_DEFINITIONS[g];
      const w = genreWeights[g];
      sumHuePrimary += def.primaryHue * w;
      sumHueSecondary += def.secondaryHue * w;
    });

    return {
      primaryHue: Math.round(sumHuePrimary),
      secondaryHue: Math.round(sumHueSecondary),
      accentRgb: currentGenre.accentRgb,
    };
  }, [genreWeights, currentGenre]);

  // Weather & lighting intensities affected by beat dynamics
  const beatPulse = beatDynamics?.beatPulse ?? 0;
  const isChorusPeak = beatPulse > 0.85;

  const weatherIntensity = isPlaying ? 1.0 + beatPulse * 0.5 : 0.6;
  const rainStrength = genreWeights['emo'] * 1.0 + genreWeights['jazz'] * 0.45;
  const goldenDustStrength = genreWeights['pop'] * 1.0 + genreWeights['soft-rock'] * 0.4;
  const steamStrength = genreWeights['jazz'] * 1.0;
  const firefliesStrength = genreWeights['indie'] * 1.0;
  const projectorStarsStrength = genreWeights['cinematic'] * 1.0;
  const cityGlowStrength = genreWeights['opm'] * 1.0;

  // Lightning flashes only during peak beat pulses in Emo environments
  const lightningFlash = genreWeights['emo'] > 0.35 && isChorusPeak;

  return {
    currentGenre,
    previousGenre,
    dominantGenre,
    dominantGenreId,
    theme,
    stage,
    transitionProgress: progress,
    stageLabel,
    genreWeights,
    primaryHue,
    secondaryHue,
    accentRgb,
    weatherIntensity,
    rainStrength,
    goldenDustStrength,
    steamStrength,
    firefliesStrength,
    projectorStarsStrength,
    cityGlowStrength,
    lightningFlash,
    handwrittenQuotes: currentGenre.handwrittenQuotes || [],
  };
}
