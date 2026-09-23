export type GenreId =
  | 'pop'
  | 'soft-rock'
  | 'indie'
  | 'jazz'
  | 'cinematic'
  | 'opm'
  | 'emo';

export type AmbientPreset =
  | 'golden-pop'
  | 'vintage-rock'
  | 'twilight-indie'
  | 'rainy-cafe'
  | 'dream-theater'
  | 'home-opm'
  | 'midnight-emo'
  | 'night'
  | 'warm'
  | 'cinema'
  | 'rain'
  | 'cafe'
  | 'local'
  | 'morning';

export interface MusicTrack {
  id: string;
  youtubeId: string;
  fallbackYoutubeIds?: string[];
  title: string;
  artist?: string;
  coverImage?: string;
  description?: string;
  tags: string[];
  roomIds: string[];
  genre?: GenreId;
  weather?: string;
  year?: number;
  isFeatured?: boolean;
  addedAt?: string;
  metadataSource?: 'manual' | 'youtube' | 'unknown';
}

export interface MusicRoom {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  theme: string;
  icon?: string;
  ambientPreset: AmbientPreset;
  tags: string[];
  trackIds?: string[];
  order?: number;
  isVisible?: boolean;
}

export type PlaybackStatus =
  | 'unstarted'
  | 'ended'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'cued';

export type PlayerMode = 'all' | 'room' | 'shuffle' | 'night';

export interface MusicRepository {
  getAllTracks(): MusicTrack[];
  getTrack(id: string): MusicTrack | undefined;
  getTracksByRoom(roomId: string): MusicTrack[];
  searchTracks(query: string): MusicTrack[];
  getRooms(): MusicRoom[];
  getRoom(id: string): MusicRoom | undefined;
  getRecentTracks(limit?: number): MusicTrack[];
}
