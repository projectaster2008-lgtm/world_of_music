import React from 'react';
import { MusicTrack } from '../music/types';
import { useMusic } from '../context/MusicContext';
import { getTrackGenre, GENRE_DEFINITIONS } from '../music/genres';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';
import {
  Play,
  Pause,
  Heart,
  Plus,
  Radio,
  Sparkles,
  MessageSquareHeart,
} from 'lucide-react';

interface TrackCardProps {
  track: MusicTrack;
  index: number;
  playlistContext: MusicTrack[];
}

export function TrackCard({ track, index, playlistContext }: TrackCardProps) {
  const {
    currentTrack,
    isPlaying,
    turntableTransitioning,
    favorites,
    selectTrack,
    togglePlay,
    addToQueue,
    toggleFavorite,
    theme,
  } = useMusic();

  const isCurrent = currentTrack.id === track.id;
  const isCurrentlyPlaying = isCurrent && isPlaying && !turntableTransitioning;
  const isFav = favorites.includes(track.id);

  const genreId = getTrackGenre(track);
  const genreDef = GENRE_DEFINITIONS[genreId];
  const uiTheme = genreDef.uiTheme;

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      selectTrack(track, playlistContext, true);
    }
  };

  return (
    <div
      id={`track-card-${track.id}`}
      onClick={handleCardClick}
      className={`group relative flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isCurrent
          ? uiTheme.cardActiveClass
          : `${theme.cardBg} ${theme.cardBorder} hover:bg-white/[0.08] hover:border-white/20 shadow-sm hover:shadow-md`
      }`}
    >
      {/* Left: Song Thumbnail & Title */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        {/* Track Thumbnail with Play/Equalizer Overlay */}
        <div
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 shadow-sm bg-stone-900 ${
            isCurrent
              ? 'border-amber-400/80 ring-1 ring-amber-400/40 shadow-amber-500/10'
              : 'border-white/10 group-hover:border-amber-400/30'
          }`}
        >
          <img
            src={getTrackThumbnailUrl(track, 'mq')}
            alt={track.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to max or generic image if error
              (e.currentTarget as HTMLElement).style.opacity = '0.7';
            }}
          />

          {/* Dark Glass Overlay on Active/Hover */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 flex items-center justify-center ${
              isCurrent
                ? 'bg-black/45'
                : 'bg-black/25 opacity-0 group-hover:opacity-100'
            }`}
          >
            {isCurrent ? (
              isCurrentlyPlaying ? (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className={`w-1 rounded-full animate-[bounce_0.8s_infinite] ${uiTheme.equalizerBarColor}`} />
                  <span className={`w-1 rounded-full animate-[bounce_1.1s_infinite_0.2s] ${uiTheme.equalizerBarColor}`} />
                  <span className={`w-1 rounded-full animate-[bounce_0.9s_infinite_0.4s] ${uiTheme.equalizerBarColor}`} />
                </div>
              ) : (
                <Radio className={`w-4 h-4 ${uiTheme.accentTextColor} drop-shadow`} />
              )
            ) : (
              <Play className="w-4 h-4 text-white fill-white translate-x-0.5 drop-shadow-md" />
            )}
          </div>

          {/* Track Number Badge on bottom corner */}
          {!isCurrent && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-2 pb-0.5 px-1 flex justify-start group-hover:opacity-0 transition-opacity">
              <span className="text-[9px] font-mono font-bold text-white/80 leading-none">
                {(index + 1).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Track Metadata */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                isCurrent
                  ? uiTheme.accentTextColor
                  : `${theme.textPrimary} group-hover:text-amber-500`
              }`}
            >
              {track.title}
            </h3>

            {/* Genre Badge */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-medium tracking-wide ${genreDef.badgeStyle}`}
            >
              {genreDef.shortName}
            </span>

            {track.isFeatured && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Featured
              </span>
            )}
            {track.description && track.description.includes('Clint:') && (
              <span
                className="hidden md:inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-serif font-medium"
                title="Includes Clint & Maica's personal reflections"
              >
                <MessageSquareHeart className="w-2.5 h-2.5 text-rose-400" /> Notes
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs mt-0.5">
            <span className={`truncate font-medium ${isCurrent ? 'opacity-90' : theme.textSecondary}`}>
              {track.artist || 'Ating Universe'}
            </span>
            {track.year && (
              <>
                <span className="opacity-40">•</span>
                <span className={`font-mono text-[11px] ${isCurrent ? 'opacity-80' : theme.textSecondary}`}>
                  {track.year}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Tags & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tags pills (hidden on very small mobile) */}
        <div className="hidden lg:flex items-center gap-1.5 max-w-xs overflow-hidden">
          {track.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-[10px] px-2 py-0.5 rounded-full font-sans tracking-wide ${theme.badgeStyle}`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1">
          {/* Add to Queue */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToQueue(track);
            }}
            title="Add to queue"
            className={`p-1.5 rounded-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track.id);
            }}
            title={isFav ? 'Remove favorite' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors ${
              isFav
                ? 'text-rose-500 hover:text-rose-400'
                : 'text-stone-400 hover:text-rose-500 opacity-80 sm:opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Direct Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isCurrent
                ? `${uiTheme.accentBgColor} text-white font-bold shadow-sm`
                : 'bg-stone-500/20 group-hover:bg-amber-400 text-stone-300 group-hover:text-stone-950 shadow-sm'
            }`}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
