import React, { useEffect, useRef } from 'react';
import { EmotionTheme } from '../music/moods';
import { DynamicsMode } from '../music/beatDynamics';

interface PlaqueParticleCanvasProps {
  primaryHue: number;
  secondaryHue: number;
  isPlaying: boolean;
  beatPulse: number;
  measurePulse: number;
  dynamicsMode: DynamicsMode;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  hueOffset: number;
}

export function PlaqueParticleCanvas({
  primaryHue,
  secondaryHue,
  isPlaying,
  beatPulse,
  measurePulse,
  dynamicsMode,
  className = '',
}: PlaqueParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth hue interpolation refs so colors shift gracefully on track changes
  const currentHueRef = useRef<number>(primaryHue);
  const currentSecondaryHueRef = useRef<number>(secondaryHue);
  const animationFrameRef = useRef<number | null>(null);

  // Latest props refs to avoid re-binding loop
  const stateRef = useRef({
    primaryHue,
    secondaryHue,
    isPlaying,
    beatPulse,
    measurePulse,
    dynamicsMode,
  });

  useEffect(() => {
    stateRef.current = {
      primaryHue,
      secondaryHue,
      isPlaying,
      beatPulse,
      measurePulse,
      dynamicsMode,
    };
  }, [primaryHue, secondaryHue, isPlaying, beatPulse, measurePulse, dynamicsMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    // Initialize subtle floating particles
    const particleCount = Math.max(28, Math.min(55, Math.floor(width / 14)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35, // Gentle upward drifting embers
        radius: 1.2 + Math.random() * 2.4,
        baseAlpha: 0.12 + Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        hueOffset: (Math.random() - 0.5) * 24,
      });
    }

    // Resize observer to handle dynamic layout adjustments
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          const dpr = window.devicePixelRatio || 1;
          width = newWidth;
          height = newHeight;
          canvas.width = newWidth * dpr;
          canvas.height = newHeight * dpr;
          canvas.style.width = `${newWidth}px`;
          canvas.style.height = `${newHeight}px`;
          ctx.scale(dpr, dpr);
        }
      }
    });
    resizeObserver.observe(container);

    let lastTime = performance.now();
    let lastRenderTime = 0;
    const FRAME_INTERVAL = 1000 / 50; // 50 FPS cap (in 45-60 FPS range)

    const render = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(render);

      // Enforce 45-60 FPS cap
      if (time - lastRenderTime < FRAME_INTERVAL) return;
      lastRenderTime = time - ((time - lastRenderTime) % FRAME_INTERVAL);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const {
        primaryHue: targetHue,
        secondaryHue: targetSecHue,
        isPlaying: activePlay,
        beatPulse: pulse,
        measurePulse: mPulse,
        dynamicsMode: mode,
      } = stateRef.current;

      // Smoothly interpolate current hue towards target mood hue
      // Shortest path around 360 color wheel
      let diff = targetHue - currentHueRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      currentHueRef.current = (currentHueRef.current + diff * 0.06 + 360) % 360;

      let secDiff = targetSecHue - currentSecondaryHueRef.current;
      if (secDiff > 180) secDiff -= 360;
      if (secDiff < -180) secDiff += 360;
      currentSecondaryHueRef.current =
        (currentSecondaryHueRef.current + secDiff * 0.06 + 360) % 360;

      const hue = currentHueRef.current;
      const secHue = currentSecondaryHueRef.current;

      // Dynamics multiplier
      const dynMultiplier =
        mode === 'vibrant' ? 1.0 : mode === 'subtle' ? 0.55 : 0.25;

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient chromatic wash in the corner that breathes with the measure
      const auraGradient = ctx.createRadialGradient(
        width * 0.15,
        height * 0.8,
        0,
        width * 0.15,
        height * 0.8,
        width * 0.7
      );
      const auraAlpha = activePlay ? (0.07 + mPulse * 0.08) * dynMultiplier : 0.04;
      auraGradient.addColorStop(
        0,
        `hsla(${hue}, 85%, 60%, ${auraAlpha})`
      );
      auraGradient.addColorStop(
        0.5,
        `hsla(${secHue}, 80%, 55%, ${auraAlpha * 0.5})`
      );
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, width, height);

      // Connective filament lines between close particles
      const maxDistance = 65;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const lineAlpha =
              (1 - dist / maxDistance) *
              0.12 *
              (activePlay ? 1 + pulse * 0.6 : 0.6) *
              dynMultiplier;
            ctx.strokeStyle = `hsla(${hue}, 75%, 65%, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions with subtle floating sway
        p.phase += p.pulseSpeed;
        const sway = Math.sin(p.phase) * (activePlay ? 0.4 : 0.2);
        p.x += (p.vx + sway) * (activePlay ? 1 + pulse * 0.4 * dynMultiplier : 1);
        p.y += p.vy * (activePlay ? 1 + pulse * 0.3 * dynMultiplier : 0.85);

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.y > height + 10) p.y = -10;

        // Radii and alpha respond to beat pulse
        const pulseEffect = activePlay ? pulse * dynMultiplier : 0;
        const currentRadius = p.radius * (1 + pulseEffect * 0.45);
        const particleAlpha = Math.min(
          0.85,
          p.baseAlpha * (1 + pulseEffect * 0.65)
        );
        const particleHue = (hue + p.hueOffset + 360) % 360;

        // Draw soft glowing orb
        const glowRadius = currentRadius * (activePlay ? 3.2 : 2.0);
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          glowRadius
        );
        grad.addColorStop(
          0,
          `hsla(${particleHue}, 90%, 75%, ${particleAlpha})`
        );
        grad.addColorStop(
          0.4,
          `hsla(${particleHue}, 85%, 60%, ${particleAlpha * 0.45})`
        );
        grad.addColorStop(1, `hsla(${particleHue}, 80%, 50%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright delicate center speck
        ctx.fillStyle = `hsla(${particleHue}, 95%, 90%, ${particleAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, currentRadius * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 transition-opacity duration-500"
      />
    </div>
  );
}
