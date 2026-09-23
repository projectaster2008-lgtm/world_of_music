import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { MusicTrack } from '../music/types';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';
import { TrackCommentarySection } from './TrackCommentarySection';
import { Sparkles, X, Disc3, Play } from 'lucide-react';

export function UniverseRouletteModal() {
  const {
    isRouletteOpen,
    closeRoulette,
    allTracks,
    selectTrack,
    currentPlaylist,
  } = useMusic();

  const [phase, setPhase] = useState<'intro' | 'spinning' | 'selected'>('intro');
  const [candidateTracks, setCandidateTracks] = useState<MusicTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [activeShuffleIndex, setActiveShuffleIndex] = useState(0);

  useEffect(() => {
    if (isRouletteOpen) {
      setPhase('intro');
      setSelectedTrack(null);

      // Pick 12 random candidates from the library for the spinning sequence
      const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
      setCandidateTracks(shuffled.slice(0, 14));
    }
  }, [isRouletteOpen, allTracks]);

  const startRoulette = () => {
    if (candidateTracks.length === 0) return;
    setPhase('spinning');

    let speed = 60; // ms per card
    let steps = 0;
    const maxSteps = 28;
    const finalWinner = candidateTracks[Math.floor(Math.random() * candidateTracks.length)];

    const tick = () => {
      steps++;
      setActiveShuffleIndex((prev) => (prev + 1) % candidateTracks.length);

      if (steps > maxSteps - 10) {
        speed += 35; // decelerate
      }

      if (steps < maxSteps) {
        setTimeout(tick, speed);
      } else {
        setSelectedTrack(finalWinner);
        setPhase('selected');
      }
    };

    setTimeout(tick, speed);
  };

  const confirmAndListen = () => {
    if (selectedTrack) {
      selectTrack(selectedTrack, currentPlaylist, true);
      closeRoulette();
    }
  };

  if (!isRouletteOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="universe-roulette-modal"
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
      >
        {/* Subtle celestial stars / dust glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-lg w-full rounded-3xl bg-[#0c0e14] border border-amber-500/30 p-6 sm:p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Close button */}
          <button
            onClick={closeRoulette}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Sparkle Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATING UNIVERSE • FATE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 mb-2">
            Let the Universe Choose
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto mb-6">
            Release control and allow the sanctuary to select a record from the archives for this exact moment.
          </p>

          {/* Phase 1: Intro State */}
          {phase === 'intro' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-6 shadow-lg animate-pulse">
                <Disc3 className="w-14 h-14 text-amber-300/80" />
              </div>
              <button
                onClick={startRoulette}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all active:scale-95"
              >
                Spin the Records
              </button>
            </div>
          )}

          {/* Phase 2: Spinning Carousel */}
          {phase === 'spinning' && (
            <div className="py-6 flex flex-col items-center">
              <div className="relative w-64 h-36 rounded-2xl bg-stone-900 border border-amber-500/40 p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                <Disc3 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                <p className="text-sm font-serif font-semibold text-stone-100 truncate w-full px-2">
                  {candidateTracks[activeShuffleIndex]?.title || 'Seeking melody...'}
                </p>
                <p className="text-xs text-amber-300/80 font-sans truncate w-full">
                  {candidateTracks[activeShuffleIndex]?.artist || 'Ating Archive'}
                </p>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-4 animate-pulse">
                Aligning vibrations...
              </p>
            </div>
          )}

          {/* Phase 3: Selection Revealed */}
          {phase === 'selected' && selectedTrack && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4 flex flex-col items-center"
            >
              {/* Selected Card */}
              <div className="w-full rounded-2xl bg-gradient-to-b from-amber-950/40 to-stone-900 border border-amber-400/50 p-5 mb-6 shadow-xl">
                <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg mb-3">
                  <img
                    src={getTrackThumbnailUrl(selectedTrack, 'hq')}
                    alt={selectedTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Disc3 className="w-7 h-7 text-amber-300 drop-shadow animate-spin" />
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400/80 font-mono">
                  THE UNIVERSE BESTOWS
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100 mt-1 mb-0.5">
                  {selectedTrack.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-200/90 font-medium mb-3">
                  {selectedTrack.artist}
                </p>
                <TrackCommentarySection
                  track={selectedTrack}
                  variant="compact"
                  className="mt-3 text-left"
                />
              </div>

              {/* Confirm action */}
              <div className="flex items-center gap-3 w-full justify-center">
                <button
                  onClick={startRoulette}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 text-xs font-medium border border-white/10 transition-colors"
                >
                  Spin Again
                </button>
                <button
                  onClick={confirmAndListen}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm tracking-wide transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Drop Needle & Listen</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
