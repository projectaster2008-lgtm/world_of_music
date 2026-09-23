import React from 'react';
import { useMusic } from '../context/MusicContext';
import { musicRepository } from '../music/repository';
import { GENRE_DEFINITIONS, GenreId } from '../music/genres';
import {
  Disc3,
  Radio,
  Film,
  Coffee,
  HeartHandshake,
  Sparkles,
  Sun,
  Flame,
  CloudRain,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Disc3: <Disc3 className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  CloudRain: <CloudRain className="w-4 h-4" />,
};

export function RoomSelector() {
  const { rooms, activeRoomId, selectRoom, theme } = useMusic();

  return (
    <div data-lenis-prevent="true" className="w-full py-4 overflow-x-auto scrollbar-none select-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max px-2">
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;
          const trackCount = musicRepository.getTracksByRoom(room.id).length;
          const icon = (room.icon && iconMap[room.icon]) || <Sparkles className="w-4 h-4" />;
          const genreDef = GENRE_DEFINITIONS[room.id as GenreId];
          const roomTheme = genreDef?.uiTheme;

          let buttonClass = '';
          if (isActive) {
            buttonClass = roomTheme
              ? `${roomTheme.roomTabActiveClass} font-semibold shadow-md`
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md font-semibold';
          } else {
            buttonClass = `${theme.cardBg} ${theme.textSecondary} ${theme.cardBorder} hover:bg-white/[0.08] hover:border-white/20 hover:${theme.textPrimary} shadow-sm font-medium`;
          }

          return (
            <button
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className={`group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm transition-all duration-300 border ${buttonClass}`}
            >
              {/* Room Icon */}
              <span
                className={`transition-colors ${
                  isActive
                    ? roomTheme?.accentTextColor || 'text-amber-400'
                    : `${theme.textSecondary} group-hover:${theme.textPrimary}`
                }`}
              >
                {icon}
              </span>

              {/* Room Name */}
              <span className="font-serif tracking-wide">{room.name}</span>

              {/* Track Count Pill */}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? roomTheme?.badgeStyle || 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : `${theme.badgeStyle}`
                }`}
              >
                {trackCount}
              </span>

              {/* Active ambient dot indicator */}
              {isActive && (
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    roomTheme?.pulseDotClass || 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
