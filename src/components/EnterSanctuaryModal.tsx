import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { ATING_PORTAL_URL, handlePortalHomeClick } from '../utils/portalNavigation';
import { Disc3, Sparkles, Home } from 'lucide-react';

export function EnterSanctuaryModal() {
  const { hasEnteredSanctuary, enterSanctuary, currentTrack, allTracks } = useMusic();

  if (hasEnteredSanctuary) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        id="enter-sanctuary-modal"
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 bg-[#050609]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none"
      >
        <div className="max-w-md w-full rounded-3xl bg-gradient-to-b from-[#131620] to-[#090b10] border border-amber-500/30 p-6 sm:p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden">
          {/* Subtle warm glow halo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Central Vinyl Emblem */}
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-full bg-stone-950 border border-amber-500/40 p-2 shadow-2xl flex items-center justify-center group">
            <div className="w-full h-full rounded-full border border-dashed border-amber-500/20 animate-[spin_10s_linear_infinite] flex items-center justify-center">
              <Disc3 className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 mb-3 tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>ATING UNIVERSE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight mb-2">
            MUSIC WORLD
          </h1>

          <p className="text-sm font-serif italic text-amber-200/80 mb-6">
            Stay awhile.
          </p>

          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed mb-8">
            A living personal music sanctuary where {allTracks.length} timeless melodies and curated listening rooms reside.
          </p>

          {/* Enter & Listen button */}
          <button
            onClick={enterSanctuary}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98] cursor-pointer"
          >
            ENTER & LISTEN
          </button>

          <p className="text-[11px] text-stone-500 font-mono mt-4">
            Starting with "{currentTrack.title}"
          </p>

          {/* Return to Portal Home Link */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href={ATING_PORTAL_URL}
              target="_parent"
              onClick={handlePortalHomeClick}
              title="✦ Return to Ating Universe Portal (replaces parent)"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors font-mono tracking-wide cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>← Back to Ating Universe Portal</span>
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
