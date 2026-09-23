import { useMusic } from '../context/MusicContext';
import { ATING_PORTAL_URL, handlePortalHomeClick } from '../utils/portalNavigation';
import {
  Sparkles,
  Moon,
  ListMusic,
  Disc3,
  Camera,
  Home,
} from 'lucide-react';

export function AtingHeader() {
  const {
    activeRoom,
    openRoulette,
    triggerRestMode,
    toggleQueue,
    queue,
    allTracks,
    isPlaying,
    beatDynamics,
    theme,
  } = useMusic();

  return (
    <header
      id="ating-header"
      className={`w-full select-none py-3.5 px-3 sm:px-6 flex items-center justify-between border-b transition-colors duration-700 ${theme.headerBg} ${theme.headerBorder} backdrop-blur-md relative z-30 shadow-sm`}
    >
      {/* Brand & Room Breadcrumb */}
      <div className="flex items-center gap-3">
        <a
          href={ATING_PORTAL_URL}
          target="_parent"
          onClick={handlePortalHomeClick}
          title="✦ Portal Home • Return to Ating Universe (replaces parent)"
          className="relative w-8 h-8 shrink-0 group block cursor-pointer"
        >
          <img
            src="/favicon.svg"
            alt="Ating Universe Music World"
            className="w-8 h-8 rounded-full shadow-[0_2px_10px_rgba(217,119,6,0.4)] shrink-0 border border-amber-400/50 group-hover:scale-105 group-hover:border-amber-300 transition-all"
          />
          <div className="absolute inset-0 rounded-full bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <div>
          <div className="flex items-center gap-1.5">
            <a
              href={ATING_PORTAL_URL}
              target="_parent"
              onClick={handlePortalHomeClick}
              title="✦ Portal Home • Return to Ating Universe (replaces parent)"
              className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono font-bold transition-colors hover:text-amber-400 cursor-pointer ${theme.textSecondary}`}
            >
              ATING UNIVERSE
            </a>
            <span className="opacity-40">•</span>
            <span className="text-[10px] sm:text-xs tracking-wider uppercase font-mono text-amber-500 font-bold">
              MUSIC WORLD
            </span>
          </div>
          <p className={`text-xs sm:text-sm font-serif font-semibold transition-colors ${theme.textPrimary}`}>
            {activeRoom.name}
          </p>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Portal Home to Ating Universe */}
        <a
          id="portal-home-nav-btn"
          href={ATING_PORTAL_URL}
          target="_parent"
          onClick={handlePortalHomeClick}
          title="✦ Portal Home • Return to Ating Universe (replaces parent)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 active:scale-[0.98] text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/40 hover:border-amber-400 transition-all shadow-sm group cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="font-mono text-xs tracking-wide">Portal Home</span>
        </a>
        {/* Dynamic Emotional Resonance Aura & Dynamics Mode */}
        <button
          onClick={beatDynamics.cycleDynamicsMode}
          title={`Theme Dynamics: ${beatDynamics.dynamicsMode.toUpperCase()} • Click to cycle (Vibrant / Subtle / Ambient)`}
          className={`hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs shadow-sm transition-all ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
        >
          <span
            className="w-2 h-2 rounded-full transition-all duration-150"
            style={{
              backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 55%, 0.95)`,
              transform: `scale(${isPlaying ? 1 + beatDynamics.beatPulse * 0.4 : 1})`,
              boxShadow: isPlaying
                ? `0 0 6px hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 55%, 0.7)`
                : 'none',
            }}
          />
          <span className="font-serif font-medium">
            {beatDynamics.emotionTheme.auraLabel}
          </span>
          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase">
            {beatDynamics.dynamicsMode}
          </span>
        </button>

        {/* Shuffle Photo Memories */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('ating:shuffle-memory'))}
          title="✦ Shuffle Random Photo Memory (39 Drive Memories • 6s Auto-cycle)"
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border shadow-sm transition-all ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Memories</span>
        </button>

        {/* Let the Universe Choose */}
        <button
          onClick={openRoulette}
          title="✦ Let the Universe Choose"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Universe Fate</span>
        </button>

        {/* Rest Mode button */}
        <button
          onClick={triggerRestMode}
          title="Enter Rest Mode"
          className={`p-2 rounded-xl border shadow-sm transition-all ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Queue quick button */}
        <button
          onClick={toggleQueue}
          title="Open Queue"
          className={`relative p-2 rounded-xl border shadow-sm transition-all ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
        >
          <ListMusic className="w-4 h-4" />
          {queue.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] flex items-center justify-center shadow-sm">
              {queue.length}
            </span>
          )}
        </button>

        {/* Total records count pill */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono shadow-sm ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary}`}>
          <Disc3 className="w-3.5 h-3.5 text-amber-500" />
          <span>{allTracks.length} Records</span>
        </div>
      </div>
    </header>
  );
}
