import { useEffect, useRef } from 'react';
import { AmbientPreset } from '../music/types';
import { BeatDynamicsState } from '../music/beatDynamics';
import { GenreAtmosphereState } from './genreAtmosphereEngine';

interface AtmosphericCanvasProps {
  preset: AmbientPreset;
  isPlaying: boolean;
  beatDynamics?: BeatDynamicsState;
  genreAtmosphere?: GenreAtmosphereState;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  hue: number;
  targetHue: number;
  length?: number;
  type?: 'rain' | 'firefly' | 'dust' | 'steam' | 'star' | 'dandelion';
  pulseOffset?: number;
}

export function AtmosphericCanvas({
  preset,
  isPlaying,
  beatDynamics,
  genreAtmosphere,
}: AtmosphericCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dynamicsRef = useRef(beatDynamics);
  dynamicsRef.current = beatDynamics;

  const atmosphereRef = useRef(genreAtmosphere);
  atmosphereRef.current = genreAtmosphere;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 85;

    const particles: Particle[] = [];

    const dominantGenre = atmosphereRef.current?.dominantGenreId || 'pop';
    const primaryHue = atmosphereRef.current?.primaryHue ?? 40;

    // Initialize particles according to dominant genre identity & preset
    for (let i = 0; i < particleCount; i++) {
      const isAlt = i % 2 === 0;

      if (dominantGenre === 'emo' || preset === 'rain' || preset === 'midnight-emo') {
        // Emo Midnight Rain + Sodium streetlight reflection
        const isRainStreak = i < particleCount * 0.75;
        if (isRainStreak) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: -0.8 + Math.random() * 0.3,
            vy: 7.5 + Math.random() * 8,
            size: 1.2 + Math.random() * 1.6,
            length: 16 + Math.random() * 22,
            alpha: 0.18 + Math.random() * 0.3,
            baseAlpha: 0.25,
            hue: isAlt ? 228 : 240, // Midnight indigo / wet asphalt
            targetHue: 232,
            type: 'rain',
          });
        } else {
          // Warm streetlight bokeh droplets
          particles.push({
            x: Math.random() * width,
            y: height * 0.6 + Math.random() * (height * 0.4),
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: 3.5 + Math.random() * 5.0,
            alpha: 0.1 + Math.random() * 0.25,
            baseAlpha: 0.15,
            hue: 38, // Warm sodium amber reflections on wet glass
            targetHue: 38,
            type: 'dust',
          });
        }
      } else if (dominantGenre === 'indie' || preset === 'twilight-indie') {
        // Twilight Garden Fireflies
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.5,
          size: 2.0 + Math.random() * 2.8,
          alpha: 0.2 + Math.random() * 0.4,
          baseAlpha: 0.35,
          hue: isAlt ? 152 : 175, // Emerald & Seafoam
          targetHue: 155,
          type: 'firefly',
          pulseOffset: Math.random() * Math.PI * 2,
        });
      } else if (dominantGenre === 'jazz' || preset === 'cafe' || preset === 'rainy-cafe') {
        // Café Steam + Window Drops
        const isSteam = i < particleCount * 0.65;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: isSteam ? -0.4 - Math.random() * 0.6 : 3.0 + Math.random() * 4.0,
          size: isSteam ? 2.5 + Math.random() * 3.5 : 1.4 + Math.random() * 1.5,
          alpha: 0.12 + Math.random() * 0.25,
          baseAlpha: 0.22,
          hue: isSteam ? 36 : 210, // Warm Espresso & Rain
          targetHue: 36,
          type: isSteam ? 'steam' : 'rain',
        });
      } else if (dominantGenre === 'cinematic' || preset === 'cinema' || preset === 'dream-theater') {
        // Projector Light Dust Motes & Starlight
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 1.6 + Math.random() * 2.8,
          alpha: 0.15 + Math.random() * 0.35,
          baseAlpha: 0.25,
          hue: isAlt ? 285 : 45, // Velvet Violet & Gold Starlight
          targetHue: 285,
          type: 'star',
        });
      } else {
        // Golden Hour Pop & Soft Rock Dust & Dandelion Seeds
        const isDandelion = i % 4 === 0;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.45) * 0.4,
          vy: -0.2 - Math.random() * 0.4,
          size: isDandelion ? 2.8 + Math.random() * 2.0 : 1.4 + Math.random() * 2.2,
          alpha: 0.15 + Math.random() * 0.35,
          baseAlpha: 0.25,
          hue: isAlt ? 44 : 32, // Golden honey & amber
          targetHue: 44,
          type: isDandelion ? 'dandelion' : 'dust',
        });
      }
    }

    let time = 0;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 50; // Cap at 50 FPS (in the 45-60 FPS range)

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Enforce 45-60 FPS cap
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now - ((now - lastTime) % FRAME_INTERVAL);

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const dyn = dynamicsRef.current;
      const pulse = dyn?.beatPulse ?? 0;
      const measure = dyn?.measurePulse ?? 0;

      const atmos = atmosphereRef.current;
      const activePrimaryHue = atmos?.primaryHue ?? primaryHue;

      // Pulse multiplies particle vitality smoothly
      const speedBoost = isPlaying ? 1.0 + pulse * 0.45 : 0.4;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smoothly steer particle hue towards emotional theme
        if (i % 2 === 0) {
          p.hue += (activePrimaryHue - p.hue) * 0.02;
        }

        if (p.type === 'rain') {
          p.y += p.vy * speedBoost;
          p.x += p.vx * speedBoost;
          if (p.y > height) {
            p.y = -25;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;

          const rainPulseAlpha = Math.min(0.75, p.alpha + pulse * 0.2);
          const streakLength = (p.length ?? 16) * (1 + pulse * 0.3);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3.5, p.y + streakLength);
          ctx.strokeStyle = `hsla(${p.hue}, 70%, 70%, ${rainPulseAlpha})`;
          ctx.lineWidth = p.size;
          ctx.stroke();
        } else if (p.type === 'firefly') {
          // Bioluminescent pulsating fireflies
          p.x += (p.vx + Math.sin(time * 2 + i) * 0.4) * speedBoost;
          p.y += (p.vy + Math.cos(time * 1.5 + i) * 0.4) * speedBoost;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const fireflyPulse = Math.sin(time * 3 + (p.pulseOffset || 0)) * 0.35;
          const currentAlpha = Math.max(0.08, Math.min(0.95, p.baseAlpha + fireflyPulse + pulse * 0.25));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + pulse * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 68%, ${currentAlpha})`;
          ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, 0.6)`;
          ctx.shadowBlur = 10 + pulse * 8;
          ctx.fill();
        } else if (p.type === 'dandelion') {
          // Floating dandelion seeds
          p.x += (p.vx + Math.sin(time + i) * 0.25) * speedBoost;
          p.y += p.vy * speedBoost;

          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          const currentAlpha = Math.max(0.1, Math.min(0.85, p.baseAlpha + Math.sin(time + i) * 0.15));

          // Draw dandelion seed head with subtle stem
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${currentAlpha})`;
          ctx.shadowColor = `hsla(${p.hue}, 80%, 65%, 0.3)`;
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y + 6);
          ctx.strokeStyle = `hsla(${p.hue}, 60%, 80%, ${currentAlpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          // General floating motes (dust, steam, stars)
          p.x += p.vx * speedBoost;
          p.y += p.vy * speedBoost;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const baseTwinkle = Math.sin(time + i) * 0.15;
          const currentAlpha = Math.max(
            0.05,
            Math.min(0.85, p.baseAlpha + baseTwinkle + pulse * 0.25)
          );

          const dynamicSize = p.size * (1 + pulse * 0.35 + measure * 0.15);

          ctx.beginPath();
          ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${currentAlpha})`;
          ctx.shadowColor = `hsla(${p.hue}, 85%, 60%, ${0.25 + pulse * 0.4})`;
          ctx.shadowBlur = 6 + pulse * 6;
          ctx.fill();
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [preset, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
