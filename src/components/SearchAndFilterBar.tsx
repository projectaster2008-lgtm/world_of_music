import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { musicTags } from '../music/tags';

export type SortOption = 'default' | 'title' | 'artist' | 'year' | 'recent';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  filterFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}: SearchAndFilterBarProps) {
  const { theme } = useMusic();

  return (
    <div className="w-full space-y-3 select-none mb-6">
      {/* Search Input & Sort row */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textSecondary} pointer-events-none opacity-60`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tracks, artists, memories, or tags (e.g. Stephen Sanchez, Laufey, OPM)..."
            className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all font-sans shadow-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${theme.inputFocus}`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Favorites filter toggle */}
        <button
          onClick={onToggleFavoritesOnly}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors shrink-0 shadow-sm ${
            filterFavoritesOnly
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold'
              : `${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${theme.badgeStyle}`}>
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Sort selector */}
        <div className="relative shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs shadow-sm ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary}`}>
            <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`bg-transparent text-xs focus:outline-none cursor-pointer pr-1 font-medium ${theme.textPrimary}`}
            >
              <option value="default" className="bg-stone-900 text-stone-100">
                Curated
              </option>
              <option value="recent" className="bg-stone-900 text-stone-100">
                Recently Added
              </option>
              <option value="title" className="bg-stone-900 text-stone-100">
                Title (A-Z)
              </option>
              <option value="artist" className="bg-stone-900 text-stone-100">
                Artist (A-Z)
              </option>
              <option value="year" className="bg-stone-900 text-stone-100">
                Year
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tag Chips */}
      <div data-lenis-prevent="true" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-[11px] font-semibold shrink-0 mr-1 flex items-center gap-1 ${theme.textSecondary}`}>
          <SlidersHorizontal className="w-3 h-3" />
          Tags:
        </span>
        {musicTags.map((tag) => {
          const isSelected = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => onTagChange(tag.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 border shadow-sm ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : `${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
