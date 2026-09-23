import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import { MemoryBackgroundLayer } from './MemoryBackgroundLayer';

export function RoomBackground() {
  const { activeRoom, isPlaying, beatDynamics, genreAtmosphere, theme } = useMusic();
  const preset = activeRoom.ambientPreset;
  const pulse = beatDynamics.beatPulse;

  const {
    genreWeights,
    lightningFlash,
    handwrittenQuotes,
  } = genreAtmosphere;

  // Dynamic environmental colors calculated from blended genre weights
  const emoWeight = genreWeights['emo'] || 0;
  const popWeight = genreWeights['pop'] || 0;
  const softRockWeight = genreWeights['soft-rock'] || 0;
  const indieWeight = genreWeights['indie'] || 0;
  const jazzWeight = genreWeights['jazz'] || 0;
  const cinematicWeight = genreWeights['cinematic'] || 0;
  const opmWeight = genreWeights['opm'] || 0;

  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${theme.pageBackground} -z-10 overflow-hidden`}
    >
      {/* Clint & Maica's Personal Photo Memories Layer (Vivid Google Drive backgrounds with 6s auto-shuffle) */}
      <MemoryBackgroundLayer />

      {/* Frosted Glass & Slight Transparent Texture Grid Layer */}
      <div className="absolute inset-0 glass-texture-grid pointer-events-none opacity-30 mix-blend-overlay" />

      {/* Subtle Luminous Glass Sheen / Specular Horizon */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 255, 255, 0.12), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 120%, rgba(255, 255, 255, 0.05), transparent 70%)',
        }}
      />

      {/* World Atmosphere Layers based on blended Genre Weights */}

      {/* 1. POP / CONTEMPORARY: Golden Hour Sunburst & Open Sky */}
      {popWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: popWeight * (isPlaying ? 0.75 : 0.45),
            background:
              'radial-gradient(ellipse at 50% 12%, rgba(251, 191, 36, 0.28) 0%, rgba(254, 243, 199, 0.35) 45%, transparent 75%)',
          }}
        />
      )}

      {/* 2. SOFT ROCK: Vintage Room, Mahogany Wood Tone & Analog Lamp Glow */}
      {softRockWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: softRockWeight * (isPlaying ? 0.7 : 0.4),
            background:
              'radial-gradient(circle at 50% 22%, rgba(217, 119, 6, 0.25) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 80%)',
          }}
        />
      )}

      {/* 3. INDIE: Twilight Garden Botanical Mist & Moonlit Indigo */}
      {indieWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: indieWeight * (isPlaying ? 0.75 : 0.45),
            background:
              'radial-gradient(circle at 45% 20%, rgba(16, 185, 129, 0.22) 0%, rgba(14, 165, 233, 0.18) 50%, transparent 80%)',
          }}
        />
      )}

      {/* 4. JAZZ: Rainy Café Window Condensation & Espresso Warmth */}
      {jazzWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: jazzWeight * (isPlaying ? 0.8 : 0.45),
            background:
              'radial-gradient(circle at 55% 25%, rgba(180, 83, 9, 0.28) 0%, rgba(56, 189, 248, 0.15) 50%, transparent 80%)',
          }}
        />
      )}

      {/* 5. CINEMATIC: Dream Theater Projector Ray & Velvet Violet */}
      {cinematicWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: cinematicWeight * (isPlaying ? 0.8 : 0.5),
            background:
              'radial-gradient(circle at 50% 15%, rgba(147, 51, 234, 0.28) 0%, rgba(251, 191, 36, 0.18) 45%, transparent 75%)',
          }}
        >
          {/* Sweeping Projector Light Beam */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[550px] pointer-events-none"
            style={{
              background:
                'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(254, 243, 199, 0.18) 175deg, rgba(254, 240, 138, 0.35) 180deg, rgba(254, 243, 199, 0.18) 185deg, transparent 200deg)',
              filter: 'blur(16px)',
              opacity: isPlaying ? 0.8 : 0.4,
            }}
          />
        </div>
      )}

      {/* 6. FILIPINO / OPM: Balcony at Night & Sincere Amber Glow */}
      {opmWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: opmWeight * (isPlaying ? 0.75 : 0.5),
            background:
              'radial-gradient(circle at 50% 20%, rgba(234, 88, 12, 0.25) 0%, rgba(253, 230, 138, 0.2) 45%, transparent 80%)',
          }}
        />
      )}

      {/* 7. EMO / POP-PUNK: 🌧️ Midnight Room (2:00 AM Bedroom Window, Streetlights & Dim Desk Lamp) */}
      {emoWeight > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: emoWeight * (isPlaying ? 0.85 : 0.6),
          }}
        >
          {/* Deep moody indigo & charcoal bedroom atmospheric gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.25) 0%, rgba(30, 41, 59, 0.35) 50%, transparent 85%)',
            }}
          />

          {/* Dim Desk Lamp amber glow in top-left corner */}
          <div
            className="absolute -top-10 -left-10 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)',
              filter: 'blur(35px)',
            }}
          />

          {/* Wet Streetlights reflection on wet window/pavement in bottom-right */}
          <div
            className="absolute bottom-10 right-10 w-[500px] h-[320px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse, rgba(99, 102, 241, 0.2) 0%, rgba(245, 158, 11, 0.1) 40%, transparent 70%)',
              filter: 'blur(45px)',
            }}
          />

          {/* Drifting Handwritten Lyric Fragments (Diary Inner Monologue) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {handwrittenQuotes.slice(0, 4).map((quote, idx) => {
              const topPositions = ['18%', '38%', '62%', '78%'];
              const leftPositions = ['8%', '58%', '14%', '65%'];
              return (
                <motion.div
                  key={quote}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: [0.15, 0.5, 0.2, 0.5],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 9 + idx * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`absolute text-xs sm:text-sm font-serif italic tracking-wider pointer-events-none ${
                    theme.isDark ? 'text-indigo-200/50' : 'text-indigo-950/35'
                  }`}
                  style={{
                    top: topPositions[idx % topPositions.length],
                    left: leftPositions[idx % leftPositions.length],
                  }}
                >
                  “{quote}”
                </motion.div>
              );
            })}
          </div>

          {/* Beat Peak Lightning Flash (Climax flash during chorus) */}
          {lightningFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-indigo-100/30 pointer-events-none z-10"
            />
          )}
        </div>
      )}

      {/* Dynamic Emotion Radial Aura — breathes gently with the music's beat */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: beatDynamics.emotionTheme.radialGradient,
          opacity: isPlaying ? 0.45 + pulse * 0.25 : 0.25,
          transform: `scale(${1 + pulse * 0.03})`,
          transformOrigin: '50% 20%',
        }}
      />

      {/* Atmospheric Canvas Particles with Weather & Beat Dynamics */}
      <AtmosphericCanvas
        preset={preset}
        isPlaying={isPlaying}
        beatDynamics={beatDynamics}
        genreAtmosphere={genreAtmosphere}
      />

      {/* Bottom fade matching dynamic theme */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none transition-colors duration-1000"
        style={{
          background: theme.isDark
            ? 'linear-gradient(to top, rgba(15, 18, 28, 0.92) 0%, rgba(15, 18, 28, 0.4) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(250, 247, 242, 0.92) 0%, rgba(250, 247, 242, 0.4) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}
