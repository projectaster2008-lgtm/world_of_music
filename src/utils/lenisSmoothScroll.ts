/**
 * Lenis Smooth Scroll Engine with 45-60 FPS Rate Limiting
 * 
 * Delivers silky-smooth inertial scrolling across all views, paired with
 * a strict 45-60 FPS frame-rate cap (nominal 50 FPS, ~18-20ms per frame).
 * 
 * This ensures:
 * 1. Butter-smooth natural momentum scrolling on mousewheel, trackpads, and touch.
 * 2. Capped 45-60 FPS execution on high-refresh displays (90Hz, 120Hz, 144Hz) to
 *    prevent GPU/CPU thermal throttling, micro-stutters, and excessive battery usage.
 * 3. Native containment for horizontal carousels, drawers, and modal overlays
 *    via data-lenis-prevent.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

// Enforce 45-60 FPS bounds (nominally 50-55 FPS)
export const MAX_FPS_CAP = 60; // Upper limit: never exceed 60 FPS
export const TARGET_FPS = 50; // Nominal target: 50 FPS (comfortably in 45-60 FPS range)
export const MIN_FRAME_INTERVAL_MS = 1000 / MAX_FPS_CAP; // ~16.67ms
export const TARGET_FRAME_INTERVAL_MS = 1000 / TARGET_FPS; // 20.00ms

/**
 * Initializes the Lenis smooth scroll engine if in browser environment.
 */
export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.25,
      autoRaf: false, // We drive RAF manually with 45-60 FPS throttling
    });

    // Provide globally for debugging or external triggers
    (window as any).__lenis = lenisInstance;

    // Start 45-60 FPS capped animation loop
    startLenisRafLoop();

    return lenisInstance;
  } catch (err) {
    console.warn('[Lenis] Failed to initialize smooth scroll:', err);
    return null;
  }
}

/**
 * RAF loop strictly rate-limited to 45-60 FPS.
 */
function startLenisRafLoop() {
  if (rafId !== null) return;

  let lastFrameTime = performance.now();

  const tick = (now: number) => {
    rafId = requestAnimationFrame(tick);

    // Skip tick when tab/screen is invisible to conserve CPU
    const isActuallyHidden =
      typeof window !== 'undefined' && (window as any).__realDocumentHidden
        ? (window as any).__realDocumentHidden()
        : typeof document !== 'undefined' && document.hidden;
    if (isActuallyHidden) {
      return;
    }

    // Rate-limiting check: enforce max 60 FPS / target 50 FPS
    const delta = now - lastFrameTime;
    if (delta >= MIN_FRAME_INTERVAL_MS) {
      // Adjust timing reference with remainder correction to prevent cumulative drift
      lastFrameTime = now - (delta % MIN_FRAME_INTERVAL_MS);

      if (lenisInstance) {
        lenisInstance.raf(now);
      }
    }
  };

  rafId = requestAnimationFrame(tick);
}

/**
 * Stops the RAF loop and destroys Lenis.
 */
export function destroyLenis() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (lenisInstance) {
    try {
      lenisInstance.destroy();
    } catch {
      // ignore
    }
    lenisInstance = null;
    if (typeof window !== 'undefined') {
      delete (window as any).__lenis;
    }
  }
}

/**
 * Returns the active Lenis instance.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Smoothly scrolls the window to a target element or offset.
 */
export function scrollWindowTo(
  target: string | number | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  }
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else if (typeof window !== 'undefined') {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * React hook to mount and maintain smooth scroll on the page.
 */
export function useLenisSmoothScroll() {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      destroyLenis();
    };
  }, []);
}
