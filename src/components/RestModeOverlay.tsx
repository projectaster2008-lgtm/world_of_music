import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { TurntableVisualizer } from '../player/TurntableVisualizer';
import { Moon, Sparkles, Volume2 } from 'lucide-react';

export function RestModeOverlay() {
  const { isRestModeActive, wakeFromRestMode, currentTrack, isPlaying, activeRoom } =
    useMusic();

  if (!isRestModeActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        onClick={wakeFromRestMode}
        id="rest-mode-overlay"
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md cursor-pointer flex flex-col justify-between items-center p-6 sm:p-12 select-none"
      >
        {/* Top subtle indicator */}
        <div className="flex items-center gap-2 text-stone-400/60 text-xs font-mono tracking-widest uppercase">
          <Moon className="w-3.5 h-3.5 text-amber-300/60" />
          <span>Rest Mode Active • {activeRoom.name}</span>
        </div>

        {/* Centerpiece: Floating, softly spinning turntable */}
        <div className="flex flex-col items-center">
          <TurntableVisualizer size="standard" showControlsOverlay={false} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-center max-w-md"
            >
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-200 tracking-tight">
                {currentTrack.title}
              </h2>
              <p className="text-xs sm:text-sm text-amber-300/80 font-sans mt-1">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom whisper instructions */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans tracking-wide">
          <Sparkles className="w-3 h-3 text-amber-400/40" />
          <span>Move cursor or touch anywhere to awaken sanctuary controls</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
