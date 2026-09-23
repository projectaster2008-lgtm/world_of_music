/**
 * Frame-Rate Throttling Utility
 * 
 * Caps requestAnimationFrame and continuous update loops to the 45-60 FPS range
 * (nominally 50 FPS, ~20ms per frame). This ensures smooth animation performance
 * while preventing CPU/GPU waste, battery drain, and thermal throttling on
 * high refresh-rate displays (90Hz, 120Hz, 144Hz, 240Hz).
 */

export const TARGET_FPS = 50; // Perfectly centered in the 45-60 FPS range
export const TARGET_FRAME_MS = 1000 / TARGET_FPS; // 20ms

/**
 * Creates a frame throttler that only executes the callback when enough time
 * has elapsed for the target FPS (45-60 FPS).
 */
export function createFpsThrottler(fps: number = TARGET_FPS) {
  const minInterval = 1000 / fps;
  let lastTime = 0;

  return function shouldRun(now: number): boolean {
    if (now - lastTime >= minInterval) {
      lastTime = now - ((now - lastTime) % minInterval);
      return true;
    }
    return false;
  };
}
