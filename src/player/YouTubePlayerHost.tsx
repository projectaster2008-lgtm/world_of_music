import { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { AlertCircle, ExternalLink, SkipForward, X } from 'lucide-react';

export function YouTubePlayerHost() {
  const { youtubeContainerId, lastError, currentTrack, next } = useMusic();
  const [dismissedTrackId, setDismissedTrackId] = useState<string | null>(null);

  // Reset dismissed banner when track changes
  useEffect(() => {
    setDismissedTrackId(null);
  }, [currentTrack.id]);

  const showBanner = Boolean(lastError && dismissedTrackId !== currentTrack.id);

  return (
    <div className="relative pointer-events-none select-none">
      {/* Container for YouTube API instance — kept in-viewport with standard video dimensions (288x192px),
          situated behind opaque page background at -z-50. This prevents Chrome & WebKit background video
          power-saving heuristics from pausing or throttling playback when switching tabs or exiting the tab. */}
      <div
        id="yt-player-host-wrapper"
        className="fixed bottom-4 right-4 w-72 h-48 pointer-events-none -z-50 overflow-hidden"
        aria-hidden="true"
      >
        <div id={youtubeContainerId} className="w-full h-full pointer-events-none" />
      </div>

      {/* Error notification banner if YouTube embed is restricted */}
      {showBanner && (
        <div
          id="playback-notice-banner"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-lg w-[94vw] bg-[#141217]/95 border border-amber-500/40 rounded-2xl p-3.5 text-sm text-amber-200 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs text-amber-300">Third-Party Embed Restriction</p>
              <p className="text-xs text-stone-300 truncate">
                "{currentTrack.title}" by {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-500/30 rounded-xl transition-colors flex items-center gap-1 shrink-0"
            >
              Watch <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={next}
              className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors flex items-center gap-1 shadow-sm shrink-0"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Next Track</span>
            </button>

            <button
              onClick={() => setDismissedTrackId(currentTrack.id)}
              aria-label="Dismiss notice"
              className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800/60 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
