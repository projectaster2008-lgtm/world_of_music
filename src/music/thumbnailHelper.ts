import { MusicTrack } from './types';

/**
 * Derives a reliable thumbnail image URL for any track based on its YouTube link.
 * YouTube provides standard image endpoints for all video IDs:
 * - hqdefault.jpg: 480x360 (crisp, fast, universally supported)
 * - mqdefault.jpg: 320x180 (compact for cards and queue lists)
 * - maxresdefault.jpg: 1280x720 (ultra-high res when available)
 */
export function getTrackThumbnailUrl(
  track: MusicTrack | { youtubeId?: string; coverImage?: string },
  quality: 'mq' | 'hq' | 'max' = 'hq'
): string {
  if (track.coverImage && track.coverImage.trim().length > 0) {
    return track.coverImage;
  }

  const ytid = track.youtubeId;
  if (!ytid) {
    // Fallback aesthetic celestial vinyl placeholder
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23171312"/><circle cx="60" cy="60" r="48" fill="%23241e1c" stroke="%23f59e0b" stroke-width="2"/><circle cx="60" cy="60" r="18" fill="%23f59e0b"/><circle cx="60" cy="60" r="6" fill="%23171312"/></svg>';
  }

  const fileName =
    quality === 'max'
      ? 'maxresdefault.jpg'
      : quality === 'mq'
      ? 'mqdefault.jpg'
      : 'hqdefault.jpg';

  return `https://img.youtube.com/vi/${ytid}/${fileName}`;
}
