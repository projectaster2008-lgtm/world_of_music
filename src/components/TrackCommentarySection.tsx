import React from 'react';
import { MusicTrack } from '../music/types';
import { getTrackCommentary } from '../music/commentary';
import { MessageSquareHeart, Quote } from 'lucide-react';

interface TrackCommentarySectionProps {
  track: MusicTrack;
  variant?: 'full' | 'compact';
  className?: string;
}

export function TrackCommentarySection({
  track,
  variant = 'full',
  className = '',
}: TrackCommentarySectionProps) {
  const commentary = getTrackCommentary(track);

  if (!track.description) return null;

  if (commentary.hasDialogue) {
    if (variant === 'compact') {
      return (
        <div
          className={`space-y-2 p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-sm backdrop-blur-md text-left ${className}`}
        >
          <div className="flex items-center gap-1.5 text-xs text-amber-900 font-serif mb-1 font-semibold">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="tracking-wide">Clint & Maica's Notes</span>
          </div>

          {commentary.clint && (
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] flex items-center justify-center">
                  C
                </span>
                <span className="text-[11px] font-bold text-amber-950">Clint</span>
              </div>
              <p className="text-xs text-stone-800 font-serif leading-relaxed line-clamp-3">
                {commentary.clint}
              </p>
            </div>
          )}

          {commentary.maica && (
            <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/90">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-4 h-4 rounded-full bg-rose-400 text-stone-950 font-bold text-[9px] flex items-center justify-center">
                  M
                </span>
                <span className="text-[11px] font-bold text-rose-950">Maica</span>
              </div>
              <p className="text-xs text-stone-800 font-serif leading-relaxed line-clamp-3">
                {commentary.maica}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Full variant for FullPlayerModal and detailed views
    return (
      <div
        className={`w-full max-w-xl mx-auto space-y-3.5 text-left ${className}`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-600/30" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-serif text-amber-900 font-semibold shadow-sm">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-700" />
            <span>Clint & Maica's Reflections</span>
          </div>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-600/30" />
        </div>

        {commentary.clint && (
          <div className="relative p-4 rounded-2xl bg-white/95 hover:bg-white border border-amber-200/90 shadow-sm backdrop-blur-md transition-all group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shadow-sm">
                  C
                </div>
                <span className="text-xs font-bold text-amber-950 tracking-wide font-serif">
                  Clint
                </span>
              </div>
              <Quote className="w-3.5 h-3.5 text-amber-600/40 group-hover:text-amber-600/70 transition-colors" />
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-serif leading-relaxed pl-8">
              "{commentary.clint}"
            </p>
          </div>
        )}

        {commentary.maica && (
          <div className="relative p-4 rounded-2xl bg-white/95 hover:bg-white border border-rose-200/90 shadow-sm backdrop-blur-md transition-all group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-400 text-stone-950 font-bold text-xs flex items-center justify-center shadow-sm">
                  M
                </div>
                <span className="text-xs font-bold text-rose-950 tracking-wide font-serif">
                  Maica
                </span>
              </div>
              <Quote className="w-3.5 h-3.5 text-rose-500/40 group-hover:text-rose-500/70 transition-colors" />
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-serif leading-relaxed pl-8">
              "{commentary.maica}"
            </p>
          </div>
        )}
      </div>
    );
  }

  // Non-dialogue fallback for unresolved seed tracks
  return (
    <div
      className={`p-3.5 rounded-2xl bg-white/80 border border-stone-200/90 text-center max-w-md mx-auto shadow-sm ${className}`}
    >
      <p className="text-xs sm:text-sm text-stone-700 font-serif italic leading-relaxed">
        "{commentary.rawDescription}"
      </p>
    </div>
  );
}
