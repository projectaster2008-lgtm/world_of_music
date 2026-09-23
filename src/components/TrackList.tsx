import { MusicTrack } from '../music/types';
import { TrackCard } from './TrackCard';
import { useMusic } from '../context/MusicContext';
import { Play, Shuffle, Music, Sparkles } from 'lucide-react';

interface TrackListProps {
  tracks: MusicTrack[];
  title?: string;
  subtitle?: string;
}

export function TrackList({ tracks, title, subtitle }: TrackListProps) {
  const { selectTrack, toggleShuffle, openRoulette, theme } = useMusic();

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      selectTrack(tracks[0], tracks, true);
    }
  };

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      selectTrack(tracks[randomIndex], tracks, true);
      toggleShuffle();
    }
  };

  if (tracks.length === 0) {
    return (
      <div className={`w-full py-16 text-center rounded-3xl border p-8 shadow-sm transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
        <Music className={`w-10 h-10 ${theme.textSecondary} opacity-60 mx-auto mb-3 stroke-[1.5]`} />
        <h3 className={`text-base font-serif font-semibold mb-1 ${theme.textPrimary}`}>
          This room is quiet for now.
        </h3>
        <p className={`text-xs max-w-sm mx-auto mb-6 ${theme.textSecondary}`}>
          No songs currently match this filter. As the music sanctuary grows, new records will be placed here.
        </p>
        <button
          onClick={openRoulette}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Let the Universe Choose</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 select-none">
      {/* List Header & Quick Actions */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b ${theme.cardBorder}`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-sm sm:text-base font-serif font-bold ${theme.textPrimary}`}>
              {title || 'Current Selection'}
            </h2>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-semibold border ${theme.badgeStyle}`}>
              {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
            </span>
          </div>
          {subtitle && (
            <p className={`text-xs mt-0.5 ${theme.textSecondary}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950" />
            <span>Play All</span>
          </button>

          <button
            onClick={handleShuffleAll}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shadow-sm transition-colors ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Track Cards */}
      <div className="grid grid-cols-1 gap-2">
        {tracks.map((track, idx) => (
          <TrackCard
            key={track.id}
            track={track}
            index={idx}
            playlistContext={tracks}
          />
        ))}
      </div>
    </div>
  );
}
