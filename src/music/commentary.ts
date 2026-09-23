import { MusicTrack } from './types';

export interface TrackCommentary {
  hasDialogue: boolean;
  clint?: string;
  maica?: string;
  rawDescription?: string;
}

/**
 * Parses Clint and Maica commentary from a track description if present.
 */
export function getTrackCommentary(track?: MusicTrack): TrackCommentary {
  if (!track || !track.description) {
    return { hasDialogue: false };
  }

  const text = track.description;

  // Check for Clint and Maica markers
  const clintMatch = text.match(/(?:\*\*Clint:\*\*|Clint:)\s*([\s\S]*?)(?=(?:\*\*Maica:\*\*|Maica:)|$)/i);
  const maicaMatch = text.match(/(?:\*\*Maica:\*\*|Maica:)\s*([\s\S]*?)$/i);

  if (clintMatch || maicaMatch) {
    return {
      hasDialogue: true,
      clint: clintMatch ? clintMatch[1].trim() : undefined,
      maica: maicaMatch ? maicaMatch[1].trim() : undefined,
      rawDescription: text,
    };
  }

  return {
    hasDialogue: false,
    rawDescription: text,
  };
}
