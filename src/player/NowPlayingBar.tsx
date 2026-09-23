import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { getTrackGenre, GENRE_DEFINITIONS } from '../music/genres';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  ListMusic,
  Heart,
  Sparkles,
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function NowPlayingBar() {
  const {
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
    openFullPlayer,
    toggleQueue,
    queue,
    openRoulette,
    beatDynamics,
    theme,
  } = useMusic();

  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const isFav = favorites.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(ratio * duration);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  return (
    <div
      id="now-playing-bar"
      className={`fixed bottom-0 left-0 right-0 z-40 ${theme.playerBarBg} border-t ${theme.playerBarBorder} backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.3)] px-3 sm:px-6 py-2.5 transition-colors duration-700 select-none`}
    >
      {/* Scrubbable Progress Bar at very top edge */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        onMouseEnter={() => setIsHoveringProgress(true)}
        onMouseLeave={() => {
          setIsHoveringProgress(false);
          setHoverSeekTime(null);
        }}
        onMouseMove={handleProgressMouseMove}
        className="absolute -top-1.5 left-0 right-0 h-2.5 cursor-pointer group flex items-center"
      >
        <div className="w-full h-1 group-hover:h-2 transition-all bg-stone-500/20 overflow-hidden relative rounded-full">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hover thumb tooltip */}
        {isHoveringProgress && hoverSeekTime !== null && (
          <div
            className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-amber-200 pointer-events-none shadow-sm"
            style={{
              left: `${(hoverSeekTime / (duration || 1)) * 100}%`,
            }}
          >
            {formatTime(hoverSeekTime)}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Track Information & Vinyl Thumbnail with Smooth Cross-Fade */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[44%] sm:max-w-[34%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(3px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.94, filter: 'blur(3px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1"
            >
              {/* Mini Rotating Record with Song Thumbnail & Beat Pulse Glow */}
              <button
                onClick={openFullPlayer}
                title="Expand vinyl player"
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shrink-0 overflow-hidden bg-stone-950 border border-amber-500/40 shadow-md group cursor-pointer transition-all duration-150"
                style={{
                  boxShadow: isPlaying && !turntableTransitioning
                    ? `0 0 ${4 + beatDynamics.beatPulse * 12}px ${beatDynamics.emotionTheme.glowColor}`
                    : 'none',
                  transform: `scale(${isPlaying && !turntableTransitioning ? 1 + beatDynamics.beatPulse * 0.04 : 1})`,
                }}
              >
                <div
                  className={`w-full h-full flex items-center justify-center relative ${
                    isPlaying && !turntableTransitioning ? 'animate-[spin_4s_linear_infinite]' : ''
                  }`}
                >
                  {/* Vinyl grooves */}
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_38%,rgba(255,255,255,0.06)_40%,rgba(0,0,0,0.85)_42%,transparent_56%)] z-10 pointer-events-none" />
                  
                  {/* Center Track Thumbnail */}
                  <img
                    src={getTrackThumbnailUrl(currentTrack, 'mq')}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-full"
                  />

                  {/* Center Record Spindle Hole */}
                  <div className="absolute w-3 h-3 rounded-full bg-stone-950 border border-amber-400/60 z-20 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-30">
                  <Maximize2 className="w-4 h-4 text-amber-300" />
                </div>
              </button>

              {/* Titles */}
              <div
                onClick={openFullPlayer}
                className="min-w-0 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs sm:text-sm font-bold truncate transition-colors ${theme.textPrimary} group-hover:text-amber-400`}>
                    {currentTrack.title}
                  </span>
                  {currentTrack.year && (
                    <span className={`hidden md:inline-block text-[10px] font-mono opacity-60 ${theme.textSecondary}`}>
                      ({currentTrack.year})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-[11px] sm:text-xs truncate font-medium ${theme.textSecondary}`}>
                    {currentTrack.artist || 'Ating Universe'}
                  </p>
                  {/* World State & Genre Badge */}
                  {(() => {
                    const genreId = getTrackGenre(currentTrack);
                    const def = GENRE_DEFINITIONS[genreId];
                    return (
                      <span
                        className={`hidden lg:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border font-mono tracking-wide ${def.badgeStyle}`}
                        title={`Atmospheric World: ${def.worldState} (${def.weatherType})`}
                      >
                        <span>{def.icon}</span>
                        <span>{def.shortName}</span>
                      </span>
                    );
                  })()}
                  {/* Subtle beat pulse heartbeat dot */}
                  {isPlaying && (
                    <span
                      className="hidden sm:inline-block w-1.5 h-1.5 rounded-full transition-transform duration-150"
                      style={{
                        backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 55%, 0.95)`,
                        transform: `scale(${1 + beatDynamics.beatPulse * 0.6})`,
                      }}
                      title={`${beatDynamics.emotionTheme.auraLabel} • ${beatDynamics.bpm} BPM`}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentTrack.id);
            }}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              isFav
                ? 'text-rose-500 hover:text-rose-400'
                : 'text-stone-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Transport Controls */}
        <div className="flex flex-col items-center gap-1 max-w-[48%] sm:max-w-md w-full">
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isShuffle
                  ? 'text-amber-300 bg-amber-500/20 font-bold'
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={previous}
              title="Previous song"
              className={`p-1.5 sm:p-2 transition-colors ${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-[0_2px_12px_rgba(217,119,6,0.35)] flex items-center justify-center transition-transform active:scale-95"
            >
              {turntableTransitioning || (isPlaying && playbackStatus === 'buffering') ? (
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950 translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={next}
              title="Next song"
              className={`p-1.5 sm:p-2 transition-colors ${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              title={`Repeat: ${repeatMode}`}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                repeatMode !== 'off'
                  ? 'text-amber-300 bg-amber-500/20 font-bold'
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>

          {/* Time indicator */}
          <div className={`hidden sm:flex items-center gap-2 text-[10px] font-mono font-medium ${theme.textSecondary}`}>
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Actions, Queue, Roulette & Volume */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          {/* Universe Roulette shortcut */}
          <button
            onClick={openRoulette}
            title="✦ Let the Universe Choose"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Roulette</span>
          </button>

          {/* Queue Button */}
          <button
            onClick={toggleQueue}
            title="Music Queue"
            className={`relative p-2 transition-colors rounded-lg ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            <ListMusic className="w-4 h-4 sm:w-5 sm:h-5" />
            {queue.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                {queue.length}
              </span>
            )}
          </button>

          {/* Volume control */}
          <div className="hidden md:flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-1.5 transition-colors ${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume level"
              className="w-16 lg:w-20 h-1 bg-stone-700/60 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Expand Full Player button */}
          <button
            onClick={openFullPlayer}
            title="Expand Full Player"
            className={`p-2 transition-colors rounded-lg ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
