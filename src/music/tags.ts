export interface MusicTag {
  id: string;
  name: string;
  color?: string;
}

export const musicTags: MusicTag[] = [
  { id: 'all', name: 'All Melodies' },
  { id: 'romantic', name: 'Romantic' },
  { id: 'nostalgic', name: 'Nostalgic' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'acoustic', name: 'Acoustic' },
  { id: 'opm', name: 'OPM Classics' },
  { id: 'jazz', name: 'Jazz & Bossa' },
  { id: 'piano', name: 'Piano & Strings' },
  { id: 'indie', name: 'Indie & Soul' },
  { id: 'late-night', name: 'Late Night' },
];
