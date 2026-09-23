import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { getTrackMoods } from '../music/moods';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';
import { Disc3, Volume2, Sparkles, Activity } from 'lucide-react';

interface TurntableVisualizerProps {
  size?: 'compact' | 'standard' | 'large';
  showControlsOverlay?: boolean;
}

export function TurntableVisualizer({
  size = 'standard',
  showControlsOverlay = true,
}: TurntableVisualizerProps) {
  const {
    currentTrack,
    isPlaying,
    turntableTransitioning,
    togglePlay,
    activeRoom,
    beatDynamics,
  } = useMusic();

  const isPlayingActive = isPlaying && !turntableTransitioning;
  const { emotionTheme, beatPulse, bpm } = beatDynamics;

  // Derive primary mood tag color and pulse dynamics
  const trackMoods = getTrackMoods(currentTrack);
  const primaryMood = trackMoods[0] || {
    id: 'calm',
    label: 'Calm',
    style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 font-medium',
    primaryHue: 158,
    secondaryHue: 180,
    glowColor: 'hsla(158, 85%, 60%, 0.45)',
    pulseIntensity: 0.85,
    platterRgb: '16, 185, 129',
  };

  const primaryHue = primaryMood.primaryHue ?? emotionTheme.primaryHue;
  const secondaryHue = primaryMood.secondaryHue ?? emotionTheme.secondaryHue;
  const moodPulseIntensity = primaryMood.pulseIntensity ?? 1.0;

  // Determine dimension styling based on size
  const containerClasses = {
    compact: 'w-48 h-48 sm:w-56 sm:h-56',
    standard: 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96',
    large: 'w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px]',
  }[size];

  // Derive label gradient and aesthetic accents based on room theme with calm, cream, and bright palette
  const getThemePalette = () => {
    switch (activeRoom.ambientPreset) {
      case 'cinema':
        return {
          chassis: 'from-[#fffdfb] via-[#f7f2ea] to-[#eee5d8]',
          ring: 'border-rose-300/30',
          labelBg: 'from-amber-100 via-[#fffdfa] to-rose-100/80',
          accent: 'text-stone-700',
          needle: 'bg-rose-400',
        };
      case 'rain':
        return {
          chassis: 'from-[#fafdff] via-[#f3f7fa] to-[#e6eef5]',
          ring: 'border-sky-300/30',
          labelBg: 'from-sky-50 via-[#fcfdfe] to-slate-100',
          accent: 'text-stone-700',
          needle: 'bg-sky-400',
        };
      case 'cafe':
        return {
          chassis: 'from-[#fffefc] via-[#f9f4ec] to-[#eee3d3]',
          ring: 'border-amber-400/30',
          labelBg: 'from-amber-100 via-[#fffdfa] to-amber-200/60',
          accent: 'text-stone-700',
          needle: 'bg-amber-400',
        };
      case 'local':
        return {
          chassis: 'from-[#fffdfa] via-[#f8f3ea] to-[#eee2d0]',
          ring: 'border-orange-300/30',
          labelBg: 'from-orange-50 via-[#fffefc] to-amber-100',
          accent: 'text-stone-700',
          needle: 'bg-orange-400',
        };
      case 'warm':
      default:
        return {
          chassis: 'from-[#fffdfa] via-[#f8f3ea] to-[#ede3d4]',
          ring: 'border-amber-300/30',
          labelBg: 'from-amber-100 via-[#fffefb] to-amber-200/70',
          accent: 'text-stone-700',
          needle: 'bg-amber-400',
        };
    }
  };

  const palette = getThemePalette();

  return (
    <div
      className={`relative ${containerClasses} mx-auto flex items-center justify-center select-none group`}
      id="turntable-chassis"
    >
      {/* Plinth Emotional Beat Aura (Outer back-glow) radiating primary mood color */}
      <div
        className="absolute -inset-3 rounded-[32px] pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle, hsla(${primaryHue}, 85%, 60%, 0.45) 0%, transparent 75%)`,
          opacity: isPlayingActive ? (0.35 + beatPulse * 0.45) * moodPulseIntensity : 0.1,
          filter: 'blur(18px)',
          transform: `scale(${1 + (isPlayingActive ? beatPulse * 0.04 : 0)})`,
          transition: 'background 1.2s ease, opacity 0.25s ease',
        }}
      />

      {/* Turntable Plinth / Base Plate with Calm Cream & Maple Art Direction */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${palette.chassis} border border-stone-300/80 shadow-[0_18px_45px_rgba(150,130,110,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] overflow-hidden`}
      >
        {/* Subtle woodgrain / brushed texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a89f91_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Corner brass screws with warm metallic sheen */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-600/50 shadow-inner" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-600/50 shadow-inner" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-600/50 shadow-inner" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-600/50 shadow-inner" />

        {/* Turntable Brand & Mood Engraving */}
        <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-700 shadow-sm"
            style={{
              backgroundColor: `hsla(${primaryHue}, 90%, 55%, 0.95)`,
              boxShadow: `0 0 6px hsla(${primaryHue}, 90%, 55%, 0.8)`,
            }}
          />
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-stone-700/90 font-semibold">
            ATING HI-FI • {primaryMood.label.toUpperCase()}
          </span>
        </div>

        {/* Speed switch & Tempo (BPM) indicator */}
        <div className="absolute bottom-3 right-4 flex items-center gap-2 text-[9px] tracking-wider text-stone-600 font-mono">
          <span className={isPlayingActive ? 'text-amber-700 font-bold' : ''}>
            33⅓ RPM
          </span>
          <span className="text-stone-400">|</span>
          <span
            className={`transition-colors duration-150 ${
              isPlayingActive ? 'text-amber-800 font-semibold' : 'text-stone-500'
            }`}
          >
            {bpm} BPM
          </span>
        </div>
      </div>

      {/* Turntable Platter: Dynamically transitions color and glow intensity based on primary mood tag */}
      <div
        className="relative w-[84%] h-[84%] rounded-full p-1.5 flex items-center justify-center transition-all duration-1000"
        style={{
          backgroundColor: `hsla(${primaryHue}, 35%, 15%, 0.96)`,
          borderColor: `hsla(${primaryHue}, 85%, 65%, ${isPlayingActive ? 0.7 : 0.25})`,
          borderWidth: '1.5px',
          borderStyle: 'solid',
          boxShadow: isPlayingActive
            ? `0 12px 35px rgba(0,0,0,0.35), 0 0 ${16 + beatPulse * 28 * moodPulseIntensity}px hsla(${primaryHue}, 90%, 55%, ${0.4 + beatPulse * 0.45 * moodPulseIntensity}), inset 0 0 ${22 + beatPulse * 22}px hsla(${primaryHue}, 80%, 48%, 0.4)`
            : `0 8px 24px rgba(0,0,0,0.2), 0 0 12px hsla(${primaryHue}, 65%, 50%, 0.18), inset 0 0 14px hsla(${primaryHue}, 60%, 40%, 0.2)`,
          transition:
            'background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 1.2s ease, box-shadow 0.6s ease',
        }}
      >
        {/* Platter outer stroboscopic rim dots glowing with primary mood hue */}
        <div
          className="absolute inset-0.5 rounded-full border border-dashed pointer-events-none transition-colors duration-1000"
          style={{
            borderColor: `hsla(${primaryHue}, 80%, 65%, ${isPlayingActive ? 0.6 : 0.2})`,
          }}
        />

        {/* Platter Inner Beat Glow: expands and pulses with track mood dynamics */}
        <div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsla(${primaryHue}, 90%, 60%, ${
              isPlayingActive ? 0.38 + beatPulse * 0.45 * moodPulseIntensity : 0.08
            }) 0%, hsla(${secondaryHue}, 75%, 48%, ${
              isPlayingActive ? 0.22 + beatPulse * 0.3 : 0.04
            }) 52%, transparent 72%)`,
            transform: `scale(${1 + (isPlayingActive ? beatPulse * 0.045 * moodPulseIntensity : 0)})`,
            transition:
              'background 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease-out',
          }}
        />

        {/* The Vinyl Disc itself */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.88, opacity: 0, rotate: -35 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              scale: 0.85,
              opacity: 0,
              rotate: 45,
              transition: { duration: 0.4, ease: 'easeIn' },
            }}
            onClick={togglePlay}
            className="relative w-full h-full rounded-full cursor-pointer overflow-hidden shadow-2xl flex items-center justify-center bg-[#0a0a0c]"
          >
            {/* Spinning vinyl element */}
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${
                isPlayingActive ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
              style={{
                animationPlayState: isPlayingActive ? 'running' : 'paused',
                transition: 'filter 0.5s ease',
              }}
            >
              {/* Vinyl grooves / sheen texture */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, transparent 28%, rgba(255,255,255,0.03) 29%, rgba(0,0,0,0.85) 30%, transparent 32%, rgba(255,255,255,0.02) 34%, rgba(0,0,0,0.9) 35%, transparent 37%, rgba(255,255,255,0.03) 48%, rgba(0,0,0,0.8) 50%, transparent 60%, rgba(255,255,255,0.02) 72%, rgba(0,0,0,0.9) 75%, transparent 88%)',
                }}
              />

              {/* Dynamic reflection highlights */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
                style={{
                  background:
                    'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.12) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.12) 225deg, transparent 270deg)',
                }}
              />

              {/* Center Record Label with Song Thumbnail & Vintage Ivory Tint */}
              <div
                className={`relative w-[44%] h-[44%] rounded-full bg-gradient-to-br ${palette.labelBg} border border-amber-600/40 p-1.5 flex flex-col items-center justify-center text-center shadow-lg overflow-hidden`}
              >
                {/* Embedded Song Thumbnail Background */}
                <img
                  src={getTrackThumbnailUrl(currentTrack, 'mq')}
                  alt={currentTrack.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-full opacity-35 filter blur-[0.5px] scale-110"
                />

                {/* Soft Warm Vignette & Tint Overlay for Typography Contrast */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#fffefc]/85 via-[#fef3c7]/75 to-[#fde68a]/90 pointer-events-none" />

                {/* Decorative record rings */}
                <div className="absolute inset-1 rounded-full border border-amber-700/30 pointer-events-none" />

                {/* Beat Harmonic Resonance Ring on vinyl label tracking primary mood hue */}
                <div
                  className="absolute inset-2 rounded-full pointer-events-none transition-all duration-150"
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: `hsla(${primaryHue}, 85%, 65%, ${
                      isPlayingActive ? 0.45 + beatPulse * 0.5 : 0.2
                    })`,
                    transform: `scale(${1 + (isPlayingActive ? beatPulse * 0.08 : 0)})`,
                  }}
                />

                {/* Track details inside label in warm espresso typography */}
                <span className="relative z-10 text-[8px] sm:text-[9px] uppercase tracking-widest text-amber-950 font-mono font-bold leading-tight line-clamp-1 px-1 drop-shadow-sm">
                  {currentTrack.artist || 'Ating Universe'}
                </span>
                <span className="relative z-10 text-[9px] sm:text-[11px] font-serif font-extrabold text-stone-950 leading-tight line-clamp-2 px-1 my-0.5 drop-shadow-sm">
                  {currentTrack.title}
                </span>
                <span className="relative z-10 text-[7px] text-stone-700 font-mono tracking-tighter">
                  SIDE A • {currentTrack.year || 'STEREO'}
                </span>

                {/* Center Spindle Hole */}
                <div className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] border-2 border-stone-800 shadow-inner flex items-center justify-center z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111317]" />
                </div>
              </div>
            </div>

            {/* Hover overlay hint */}
            {showControlsOverlay && (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="px-3 py-1 rounded-full bg-stone-900/80 text-amber-200 text-xs font-sans tracking-wide border border-amber-500/20 shadow-lg">
                  {isPlayingActive ? 'Click to pause' : 'Click to drop needle'}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tonearm Assembly (Pivot, Counterweight, Arm & Stylus) */}
      <div
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-10"
        id="tonearm-assembly"
      >
        {/* Tonearm Gimbal / Base Pivot */}
        <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-stone-200 via-stone-400 to-stone-600 border border-stone-300/80 shadow-md flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-stone-800 border border-stone-400/50" />
        </div>

        {/* Animated Tonearm Stem */}
        <motion.div
          animate={{
            rotate: isPlayingActive ? 23 : turntableTransitioning ? -12 : -8,
            y: turntableTransitioning ? -4 : 0,
            transition: {
              duration: turntableTransitioning ? 0.4 : 0.7,
              ease: [0.25, 1, 0.5, 1],
            },
          }}
          style={{ transformOrigin: 'calc(100% - 16px) 16px' }}
          className="absolute top-2 right-2 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none"
        >
          {/* Chrome / Brass Metallic Arm */}
          <div className="absolute top-3.5 right-4 w-1 sm:w-1.5 h-20 sm:h-24 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-400 rounded-full shadow-md origin-top rotate-[-22deg]" />

          {/* Headshell & Stylus Cartridge */}
          <div className="absolute top-20 sm:top-24 right-11 sm:right-14 w-3.5 h-5 sm:w-4 sm:h-6 bg-stone-900 border border-amber-400/50 rounded-sm shadow-md rotate-[-45deg] flex flex-col items-center justify-between py-0.5">
            <div className="w-2 h-1 bg-amber-400/80 rounded-full" />
            {/* Stylus light glow pulsing with primary mood hue */}
            <div
              className={`w-1 h-1 rounded-full transition-all duration-150 ${
                isPlayingActive ? 'bg-amber-300' : 'bg-stone-500'
              }`}
              style={{
                boxShadow: isPlayingActive
                  ? `0 0 ${4 + beatPulse * 10}px hsla(${primaryHue}, 95%, 60%, ${
                      0.7 + beatPulse * 0.3
                    })`
                  : 'none',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating Status Badge with Mood & Beat Pulse */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/95 border border-stone-200/90 backdrop-blur-md shadow-[0_4px_16px_rgba(160,140,120,0.18)] flex items-center gap-2 text-[11px] text-stone-800 whitespace-nowrap">
        <span
          className="w-2 h-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: isPlayingActive
              ? `hsla(${primaryHue}, 90%, 55%, ${0.8 + beatPulse * 0.2})`
              : 'rgba(217, 119, 6, 0.4)',
            boxShadow: isPlayingActive
              ? `0 0 6px hsla(${primaryHue}, 90%, 55%, 0.8)`
              : 'none',
            transform: `scale(${isPlayingActive ? 1 + beatPulse * 0.35 : 1})`,
          }}
        />
        <span className="font-serif font-medium text-stone-800">
          {isPlayingActive
            ? `${primaryMood.label} Mood • ${bpm} BPM`
            : turntableTransitioning
            ? 'Replacing Record...'
            : 'Turntable Resting'}
        </span>
      </div>
    </div>
  );
}
