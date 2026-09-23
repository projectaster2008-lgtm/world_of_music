import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';
import {
  X,
  Trash2,
  Play,
  ListMusic,
  Disc3,
  Sparkles,
} from 'lucide-react';

export function QueueDrawer() {
  const {
    isQueueOpen,
    closeQueue,
    currentTrack,
    queue,
    currentPlaylist,
    removeFromQueue,
    clearQueue,
    selectTrack,
    isPlaying,
  } = useMusic();

  if (!isQueueOpen) return null;

  // Find upcoming tracks from the current room playlist
  const currentTrackIndex = currentPlaylist.findIndex((t) => t.id === currentTrack.id);
  const upcomingPlaylist =
    currentTrackIndex >= 0 ? currentPlaylist.slice(currentTrackIndex + 1) : currentPlaylist;

  return (
    <AnimatePresence>
      <div
        id="queue-drawer-overlay"
        onClick={closeQueue}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          className="w-full max-w-md h-full bg-[#0d0f15] border-l border-white/10 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between select-none"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-serif font-bold text-stone-100">
                  Listening Queue
                </h2>
              </div>
              <button
                onClick={closeQueue}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Now Playing section */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 font-bold block mb-2">
                NOW REVOLVING ON TURNTABLE
              </span>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-900 border border-amber-400/50 shrink-0 shadow-sm">
                  <img
                    src={getTrackThumbnailUrl(currentTrack, 'mq')}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <Disc3
                      className={`w-5 h-5 text-amber-300 drop-shadow ${
                        isPlaying ? 'animate-spin' : ''
                      }`}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-amber-200 truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-amber-300/70 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>
            </div>

            {/* Manual User Queue */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">
                  MANUAL QUEUE ({queue.length})
                </span>
                {queue.length > 0 && (
                  <button
                    onClick={clearQueue}
                    className="text-[10px] text-rose-400/80 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {queue.length === 0 ? (
                <div className="py-4 text-center border border-dashed border-white/10 rounded-xl text-xs text-stone-500 font-sans">
                  Your queue is empty. Click "+" on any record to queue it next.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {queue.map((track, i) => (
                    <div
                      key={`${track.id}-${i}`}
                      className="group flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                    >
                      <div
                        onClick={() => selectTrack(track, undefined, true)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2"
                      >
                        <img
                          src={getTrackThumbnailUrl(track, 'mq')}
                          alt={track.title}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-stone-200 truncate group-hover:text-amber-300">
                            {track.title}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromQueue(i)}
                        title="Remove from queue"
                        className="p-1 text-stone-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming from current room */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold block mb-2">
                NEXT IN ROOM ({upcomingPlaylist.length})
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {upcomingPlaylist.slice(0, 10).map((track, idx) => (
                  <div
                    key={track.id}
                    onClick={() => selectTrack(track, currentPlaylist, true)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-stone-500 text-[10px] w-4 shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <img
                        src={getTrackThumbnailUrl(track, 'mq')}
                        alt={track.title}
                        className="w-7 h-7 rounded-md object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-stone-300 truncate font-medium">
                          {track.title}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <Play className="w-3 h-3 text-stone-500 hover:text-amber-300 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/5 text-[11px] text-stone-500 text-center font-sans">
            Ating Universe • Endless Living Archive
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
