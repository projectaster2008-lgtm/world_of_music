import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { TurntableVisualizer } from './TurntableVisualizer';
import { getTrackMoods } from '../music/moods';
import { TrackCommentarySection } from '../components/TrackCommentarySection';
import { ATING_PORTAL_URL, handlePortalHomeClick } from '../utils/portalNavigation';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Sparkles,
  ExternalLink,
  Activity,
  Home,
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function FullPlayerModal() {
  const {
    isFullPlayerOpen,
    closeFullPlayer,
    currentTrack,
    isPlaying,
    playbackStatus,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    favorites,
    turntableTransitioning,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    toggleMute,
    seekTo,
    toggleFavorite,
    openQueue,
    openRoulette,
    activeRoom,
    beatDynamics,
  } = useMusic();

  if (!isFullPlayerOpen) return null;

  const isFav = favorites.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const moods = getTrackMoods(currentTrack);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        id="full-player-modal"
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 bg-[#07090d]/95 backdrop-blur-2xl text-stone-200 overflow-y-auto flex flex-col justify-between p-4 sm:p-8"
      >
        {/* Top Header Bar */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-white/10 shrink-0">
          <button
            onClick={closeFullPlayer}
            className="p-2 -ml-2 text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ChevronDown className="w-5 h-5" />
            <span>Minimize</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-mono font-medium">
              PLAYING IN {activeRoom.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="full-player-portal-home-btn"
              href={ATING_PORTAL_URL}
              target="_parent"
              onClick={handlePortalHomeClick}
              title="✦ Portal Home • Return to Ating Universe (replaces parent)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-mono border border-amber-500/30 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Portal Home</span>
            </a>
            <button
              onClick={openRoulette}
              title="✦ Let the Universe Choose"
              className="p-2 text-amber-300/80 hover:text-amber-200 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                closeFullPlayer();
                openQueue();
              }}
              title="Open Queue"
              className="p-2 text-stone-400 hover:text-white transition-colors"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Large Turntable & Track Details */}
        <div className="max-w-3xl w-full mx-auto my-auto py-6 sm:py-8 flex flex-col items-center relative">
          {/* Emotional Theme Halo behind Turntable */}
          <div
            className="absolute top-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full pointer-events-none transition-all duration-300"
            style={{
              background: beatDynamics.emotionTheme.radialGradient,
              opacity: isPlaying ? 0.6 + beatDynamics.beatPulse * 0.4 : 0.25,
              transform: `translateX(-50%) scale(${1 + (isPlaying ? beatDynamics.beatPulse * 0.05 : 0)})`,
              filter: 'blur(32px)',
            }}
          />

          {/* Visual Record Turntable */}
          <div className="w-full flex justify-center mb-6 sm:mb-8 relative z-10">
            <TurntableVisualizer size="large" />
          </div>

          {/* Track Meta Card */}
          <div className="w-full max-w-lg text-center px-4 relative z-10">
            {/* Dynamic Emotion Aura & Tempo Header */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif shadow-sm border"
                style={{
                  backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 60%, 15%, 0.7)`,
                  borderColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 80%, 60%, 0.4)`,
                  color: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 75%, 1)`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 60%, 1)`,
                    transform: `scale(${isPlaying ? 1 + beatDynamics.beatPulse * 0.4 : 1})`,
                  }}
                />
                ✦ {beatDynamics.emotionTheme.auraLabel}
              </span>

              <button
                onClick={beatDynamics.cycleDynamicsMode}
                title="Click to cycle Beat & Emotion theme dynamics (Vibrant / Subtle / Ambient)"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-stone-300 transition-colors"
              >
                <Activity className="w-3 h-3 text-amber-400" />
                <span className="capitalize">{beatDynamics.dynamicsMode}</span>
                <span className="text-stone-500">•</span>
                <span>{beatDynamics.bpm} BPM</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight leading-snug">
                {currentTrack.title}
              </h1>
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  isFav
                    ? 'text-rose-400 hover:text-rose-300'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-400' : ''}`} />
              </button>
            </div>

            <p className="text-sm sm:text-base font-medium text-amber-300/90 mb-3">
              {currentTrack.artist || 'Ating Universe'}
            </p>

            {/* Clint & Maica's Reflections / Track Liner Notes */}
            <TrackCommentarySection
              track={currentTrack}
              variant="full"
              className="my-5"
            />

            {/* Mood Badges & Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
              {moods.map((mood) => (
                <span
                  key={mood.id}
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium shadow-sm flex items-center gap-1 ${mood.style}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  {mood.label}
                </span>
              ))}
              {currentTrack.year && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
                  {currentTrack.year}
                </span>
              )}
            </div>

            {/* Scrub Progress Bar */}
            <div className="w-full mb-2">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  seekTo(ratio * duration);
                }}
                className="w-full h-2 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer relative overflow-hidden transition-colors"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-stone-400 mt-1.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Full Transport Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl transition-colors ${
                  isShuffle
                    ? 'text-amber-400 bg-amber-500/15'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={previous}
                className="p-3 text-stone-200 hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center transition-transform active:scale-95"
              >
                {turntableTransitioning || (isPlaying && playbackStatus === 'buffering') ? (
                  <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-stone-950" />
                ) : (
                  <Play className="w-6 h-6 fill-stone-950 translate-x-0.5" />
                )}
              </button>

              <button
                onClick={next}
                className="p-3 text-stone-200 hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={cycleRepeat}
                className={`p-2.5 rounded-xl transition-colors ${
                  repeatMode !== 'off'
                    ? 'text-amber-400 bg-amber-500/15'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Volume Slider in Full Player */}
            <div className="flex items-center justify-center gap-3 mt-4 max-w-xs mx-auto">
              <button
                onClick={toggleMute}
                className="p-2 text-stone-400 hover:text-stone-200"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-xs font-mono text-stone-400 w-8 text-right">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-white/5 shrink-0">
          <span className="font-mono">ID: {currentTrack.youtubeId}</span>
          <a
            href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            Source on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
