import { MusicTrack, MusicRoom, MusicRepository } from './types';
import { musicLibrary } from './musicLibrary';
import { musicRooms } from './rooms';

export class LocalMusicRepository implements MusicRepository {
  private tracks: MusicTrack[];
  private rooms: MusicRoom[];

  constructor(customTracks: MusicTrack[] = musicLibrary, customRooms: MusicRoom[] = musicRooms) {
    this.tracks = [...customTracks];
    this.rooms = [...customRooms];
  }

  getAllTracks(): MusicTrack[] {
    return [...this.tracks];
  }

  getTrack(id: string): MusicTrack | undefined {
    return this.tracks.find(t => t.id === id || t.youtubeId === id);
  }

  getTracksByRoom(roomId: string): MusicTrack[] {
    if (roomId === 'listening-lounge' || roomId === 'all') {
      return [...this.tracks];
    }
    return this.tracks.filter(t => t.roomIds.includes(roomId));
  }

  searchTracks(query: string): MusicTrack[] {
    const q = query.trim().toLowerCase();
    if (!q) return [...this.tracks];

    return this.tracks.filter(t => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchArtist = t.artist?.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      const matchYear = t.year?.toString().includes(q);
      return matchTitle || matchArtist || matchTags || matchYear;
    });
  }

  getRooms(): MusicRoom[] {
    return [...this.rooms].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  getRoom(id: string): MusicRoom | undefined {
    return this.rooms.find(r => r.id === id);
  }

  getRecentTracks(limit: number = 8): MusicTrack[] {
    return [...this.tracks]
      .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))
      .slice(0, limit);
  }
}

// Singleton repository instance for the application
export const musicRepository = new LocalMusicRepository();
