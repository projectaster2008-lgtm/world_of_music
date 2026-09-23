import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { MusicTrack, MusicRoom, PlaybackStatus } from '../music/types';
import { musicRepository } from '../music/repository';
import { useYouTubePlayer } from '../player/useYouTubePlayer';
import { useBeatDynamics, BeatDynamicsState } from '../music/beatDynamics';
import { useGenreAtmosphere, GenreAtmosphereState } from '../environment/genreAtmosphereEngine';
import { GenreUiTheme, ResolvedGenreUiTheme } from '../music/genres';
import { mobileBackgroundAudio } from '../player/mobileBackgroundAudio';

const STORAGE_KEYS = {
  VOLUME: 'ating_music_volume',
  MUTED: 'ating_music_muted',
  SHUFFLE: 'ating_music_shuffle',
  FAVORITES: 'ating_music_favorites',
  ACTIVE_ROOM: 'ating_music_room',
  LAST_TRACK: 'ating_music_last_track',
  PLAY_HISTORY: 'ating_music_history',
};

interface MusicContextType {
  // Track & Playlist State
  currentTrack: MusicTrack;
  currentPlaylist: MusicTrack[];
  queue: MusicTrack[];
  history: MusicTrack[];
  favorites: string[];
  activeRoomId: string;
  activeRoom: MusicRoom;
  rooms: MusicRoom[];
  allTracks: MusicTrack[];

  // Player state
  isPlaying: boolean;
  playbackStatus: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  turntableTransitioning: boolean;
  hasEnteredSanctuary: boolean;
  lastError: number | null;

  // Theme & Beat Dynamics & Atmosphere
  beatDynamics: BeatDynamicsState;
  genreAtmosphere: GenreAtmosphereState;
  theme: ResolvedGenreUiTheme;

  // UI Modals & Views
  isFullPlayerOpen: boolean;
  isQueueOpen: boolean;
  isRouletteOpen: boolean;
  isRestModeActive: boolean;

  // YouTube container id
  youtubeContainerId: string;

  // Controls & Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  selectTrack: (track: MusicTrack, customPlaylist?: MusicTrack[], autoPlay?: boolean) => void;
  addToQueue: (track: MusicTrack) => void;
  playNext: (track: MusicTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  seekTo: (sec: number) => void;
  toggleFavorite: (trackId: string) => void;
  selectRoom: (roomId: string) => void;
  enterSanctuary: () => void;

  // UI triggers
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  toggleFullPlayer: () => void;
  openQueue: () => void;
  closeQueue: () => void;
  toggleQueue: () => void;
  openRoulette: () => void;
  closeRoulette: () => void;
  triggerRestMode: () => void;
  wakeFromRestMode: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const allTracks = useMemo(() => musicRepository.getAllTracks(), []);
  const rooms = useMemo(() => musicRepository.getRooms(), []);

  // Initialize stored settings
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeRoomId, setActiveRoomId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM);
      if (saved && rooms.some((r) => r.id === saved)) return saved;
    } catch {
      // fallback
    }
    return 'listening-lounge';
  });

  const [initialTrack] = useState<MusicTrack>(() => {
    try {
      const lastId = localStorage.getItem(STORAGE_KEYS.LAST_TRACK);
      if (lastId) {
        const found = musicRepository.getTrack(lastId);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    // Default to Stephen Sanchez "Until I Found You" or first track
    const untilIFoundYou = musicRepository.getTrack('track-003');
    return untilIFoundYou || allTracks[0];
  });

  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(initialTrack);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicTrack[]>(() => {
    return musicRepository.getTracksByRoom(activeRoomId);
  });
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [history, setHistory] = useState<MusicTrack[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SHUFFLE) === 'true';
    } catch {
      return false;
    }
  });
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [turntableTransitioning, setTurntableTransitioning] = useState(false);
  const [hasEnteredSanctuary, setHasEnteredSanctuary] = useState(false);

  // UI state
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isRestModeActive, setIsRestModeActive] = useState(false);

  const activeRoom = useMemo(() => {
    return (
      rooms.find((r) => r.id === activeRoomId) ||
      rooms[0] || {
        id: 'listening-lounge',
        name: 'The Listening Lounge',
        theme: 'ambient-gold',
        ambientPreset: 'warm',
        tags: ['sanctuary'],
      }
    );
  }, [rooms, activeRoomId]);

  // Handle Track Completion
  const onTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      yt.seekTo(0);
      yt.play();
      return;
    }

    // If there is an item in the user manual queue, play it next
    if (queue.length > 0) {
      const [nextTrack, ...restQueue] = queue;
      setQueue(restQueue);
      performTrackTransition(nextTrack, true);
      return;
    }

    // Normal playlist advance
    const currentList = currentPlaylist.length > 0 ? currentPlaylist : allTracks;
    const currentIndex = currentList.findIndex((t) => t.id === currentTrack.id);

    if (isShuffle) {
      const candidates = currentList.filter((t) => t.id !== currentTrack.id);
      if (candidates.length > 0) {
        const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
        performTrackTransition(randomTrack, true);
        return;
      }
    }

    if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
      performTrackTransition(currentList[currentIndex + 1], true);
    } else if (repeatMode === 'all' && currentList.length > 0) {
      performTrackTransition(currentList[0], true);
    }
  }, [repeatMode, queue, currentPlaylist, allTracks, currentTrack, isShuffle]);

  // Initial YouTube player hook
  const yt = useYouTubePlayer({
    initialVideoId: currentTrack?.youtubeId,
    onTrackEnd,
    onError: (code: number) => {
      console.warn(`[MusicContext] Stream error ${code} on track "${currentTrack.title}". Attempting seamless playlist advance...`);
      // When a track encounters an unrecoverable failure (e.g. video blocked or severe CDN error),
      // smoothly advance to the next track after a brief 1.2s delay so the sanctuary never falls silent.
      setTimeout(() => {
        if (queue.length > 0) {
          const [nextTrack, ...restQueue] = queue;
          setQueue(restQueue);
          performTrackTransition(nextTrack, true);
        } else {
          const currentList = currentPlaylist.length > 0 ? currentPlaylist : allTracks;
          const currentIndex = currentList.findIndex((t) => t.id === currentTrack.id);
          if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
            performTrackTransition(currentList[currentIndex + 1], true);
          } else if (currentList.length > 0) {
            performTrackTransition(currentList[0], true);
          }
        }
      }, 1200);
    },
    initialVolume: (() => {
      try {
        const v = localStorage.getItem(STORAGE_KEYS.VOLUME);
        return v ? Number(v) : 80;
      } catch {
        return 80;
      }
    })(),
    initialMuted: (() => {
      try {
        return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
      } catch {
        return false;
      }
    })(),
  });

  // Emotional theme and organic beat pulse dynamics
  const beatDynamics = useBeatDynamics(currentTrack, yt.isPlaying, yt.currentTime);

  // Global Genre Atmosphere Engine (calculates blended weights, dominant genre, and UI theme)
  const genreAtmosphere = useGenreAtmosphere(
    currentTrack,
    history,
    beatDynamics,
    yt.isPlaying,
    activeRoomId
  );

  // Smooth cinematic turntable needle lift & disc change
  const performTrackTransition = useCallback(
    (nextTrack: MusicTrack, autoPlay: boolean = true) => {
      setTurntableTransitioning(true);

      // Step 1: pause current needle without triggering user manual pause state
      yt.pause(false);

      setTimeout(() => {
        // Step 2: switch track metadata and load video with fallbacks
        setCurrentTrack(nextTrack);
        setHistory((prev) => [currentTrack, ...prev.slice(0, 19)]);
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_TRACK, nextTrack.id);
        } catch {
          // ignore
        }

        yt.loadTrack(nextTrack.youtubeId, autoPlay, nextTrack.fallbackYoutubeIds);

        // Step 3: needle moves to groove & record spins up
        setTimeout(() => {
          setTurntableTransitioning(false);
          if (autoPlay) {
            yt.play();
          }
        }, 600);
      }, 400);
    },
    [currentTrack, yt]
  );

  const selectTrack = useCallback(
    (track: MusicTrack, customPlaylist?: MusicTrack[], autoPlay: boolean = true) => {
      mobileBackgroundAudio.unlockAudioSession();
      setHasEnteredSanctuary(true);
      if (customPlaylist) {
        setCurrentPlaylist(customPlaylist);
      }
      performTrackTransition(track, autoPlay);
    },
    [performTrackTransition]
  );

  const play = useCallback(() => {
    mobileBackgroundAudio.unlockAudioSession();
    setHasEnteredSanctuary(true);
    yt.play();
  }, [yt]);

  const pause = useCallback(() => {
    yt.pause();
  }, [yt]);

  const togglePlay = useCallback(() => {
    mobileBackgroundAudio.unlockAudioSession();
    setHasEnteredSanctuary(true);
    if (yt.isPlaying) {
      yt.pause();
    } else {
      yt.play();
    }
  }, [yt]);

  const next = useCallback(() => {
    setHasEnteredSanctuary(true);
    if (queue.length > 0) {
      const [nextTrack, ...restQueue] = queue;
      setQueue(restQueue);
      performTrackTransition(nextTrack, true);
      return;
    }

    const currentList = currentPlaylist.length > 0 ? currentPlaylist : allTracks;
    const currentIndex = currentList.findIndex((t) => t.id === currentTrack.id);

    if (isShuffle) {
      const pool = currentList.filter((t) => t.id !== currentTrack.id);
      if (pool.length > 0) {
        const randomTrack = pool[Math.floor(Math.random() * pool.length)];
        performTrackTransition(randomTrack, true);
        return;
      }
    }

    if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
      performTrackTransition(currentList[currentIndex + 1], true);
    } else if (currentList.length > 0) {
      performTrackTransition(currentList[0], true);
    }
  }, [queue, currentPlaylist, allTracks, currentTrack, isShuffle, performTrackTransition]);

  const previous = useCallback(() => {
    setHasEnteredSanctuary(true);
    // If we've played for more than 3 seconds, seek back to start
    if (yt.currentTime > 3) {
      yt.seekTo(0);
      return;
    }

    const currentList = currentPlaylist.length > 0 ? currentPlaylist : allTracks;
    const currentIndex = currentList.findIndex((t) => t.id === currentTrack.id);

    if (currentIndex > 0) {
      performTrackTransition(currentList[currentIndex - 1], true);
    } else if (currentList.length > 0) {
      performTrackTransition(currentList[currentList.length - 1], true);
    }
  }, [yt, currentPlaylist, allTracks, currentTrack, performTrackTransition]);

  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const playNext = useCallback((track: MusicTrack) => {
    setQueue((prev) => [track, ...prev]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const nextVal = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, String(nextVal));
      } catch {
        // ignore
      }
      return nextVal;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setVolume = useCallback(
    (level: number) => {
      yt.setVolume(level);
      try {
        localStorage.setItem(STORAGE_KEYS.VOLUME, String(level));
      } catch {
        // ignore
      }
    },
    [yt]
  );

  const toggleMute = useCallback(() => {
    yt.toggleMute();
    try {
      localStorage.setItem(STORAGE_KEYS.MUTED, String(!yt.isMuted));
    } catch {
      // ignore
    }
  }, [yt]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const selectRoom = useCallback(
    (roomId: string) => {
      setActiveRoomId(roomId);
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ROOM, roomId);
      } catch {
        // ignore
      }
      const roomTracks = musicRepository.getTracksByRoom(roomId);
      setCurrentPlaylist(roomTracks);
    },
    []
  );

  const enterSanctuary = useCallback(() => {
    mobileBackgroundAudio.unlockAudioSession();
    setHasEnteredSanctuary(true);
    yt.play();
  }, [yt]);

  // Sync Mobile & Background Audio: Update metadata & MediaSession
  useEffect(() => {
    mobileBackgroundAudio.updateMetadata(currentTrack, activeRoom?.name, yt.isPlaying);
  }, [currentTrack, activeRoom?.name, yt.isPlaying]);

  // Sync playback time & duration with OS lock screen / notification tray
  useEffect(() => {
    mobileBackgroundAudio.updatePlaybackState(yt.isPlaying, yt.currentTime, yt.duration);
  }, [yt.isPlaying, yt.currentTime, yt.duration]);

  // Activate audio keepalive session while music is playing so mobile background/tab remains active
  useEffect(() => {
    if (yt.isPlaying) {
      mobileBackgroundAudio.startKeepalive();
    } else {
      mobileBackgroundAudio.stopKeepalive();
    }
  }, [yt.isPlaying]);

  // Register native media control callbacks (play/pause/next/prev from lock screen or headphone buttons)
  useEffect(() => {
    mobileBackgroundAudio.setCallbacks({
      onPlay: () => {
        mobileBackgroundAudio.unlockAudioSession();
        yt.play();
      },
      onPause: () => yt.pause(),
      onNext: () => next(),
      onPrevious: () => previous(),
      onSeekTo: (time) => yt.seekTo(time),
    });
  }, [yt, next, previous]);

  // Idle / Rest Mode listener: After 45 seconds of no user interaction when music is playing, activate rest mode
  useEffect(() => {
    let timer: any = null;

    const resetTimer = () => {
      if (isRestModeActive) {
        setIsRestModeActive(false);
      }
      clearTimeout(timer);
      if (yt.isPlaying) {
        timer = setTimeout(() => {
          setIsRestModeActive(true);
        }, 45000);
      }
    };

    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('keydown', resetTimer, { passive: true });
    window.addEventListener('touchstart', resetTimer, { passive: true });

    if (yt.isPlaying && !isRestModeActive) {
      timer = setTimeout(() => {
        setIsRestModeActive(true);
      }, 45000);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [yt.isPlaying, isRestModeActive]);

  const value: MusicContextType = {
    currentTrack,
    currentPlaylist,
    queue,
    history,
    favorites,
    activeRoomId,
    activeRoom,
    rooms,
    allTracks,

    isPlaying: yt.isPlaying,
    playbackStatus: yt.playbackStatus,
    currentTime: yt.currentTime,
    duration: yt.duration,
    volume: yt.volume,
    isMuted: yt.isMuted,
    isShuffle,
    repeatMode,
    turntableTransitioning,
    hasEnteredSanctuary,
    lastError: yt.lastError,

    beatDynamics,
    genreAtmosphere,
    theme: genreAtmosphere.theme,

    isFullPlayerOpen,
    isQueueOpen,
    isRouletteOpen,
    isRestModeActive,

    youtubeContainerId: yt.containerId,

    play,
    pause,
    togglePlay,
    next,
    previous,
    selectTrack,
    addToQueue,
    playNext,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    toggleMute,
    seekTo: yt.seekTo,
    toggleFavorite,
    selectRoom,
    enterSanctuary,

    openFullPlayer: () => setIsFullPlayerOpen(true),
    closeFullPlayer: () => setIsFullPlayerOpen(false),
    toggleFullPlayer: () => setIsFullPlayerOpen((p) => !p),
    openQueue: () => setIsQueueOpen(true),
    closeQueue: () => setIsQueueOpen(false),
    toggleQueue: () => setIsQueueOpen((q) => !q),
    openRoulette: () => setIsRouletteOpen(true),
    closeRoulette: () => setIsRouletteOpen(false),
    triggerRestMode: () => setIsRestModeActive(true),
    wakeFromRestMode: () => setIsRestModeActive(false),
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return ctx;
}
