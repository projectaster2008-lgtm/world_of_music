import { MusicTrack } from './types';

export interface MoodBadge {
  id: string;
  label: string;
  style: string;
  primaryHue: number;
  secondaryHue: number;
  glowColor: string;
  pulseIntensity: number;
  platterRgb: string;
}

export interface EmotionTheme {
  id: string;
  name: string;
  auraLabel: string;
  description: string;
  primaryHue: number;
  secondaryHue: number;
  bpm: number; // Organic tempo baseline
  pulseIntensity: number;
  radialGradient: string;
  glowColor: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

interface MoodRule {
  id: string;
  label: string;
  matchingTags: string[];
  style: string;
  primaryHue: number;
  secondaryHue: number;
  bpm: number;
  pulseIntensity: number;
  auraLabel: string;
  description: string;
  platterRgb: string;
}

const MOOD_RULES: MoodRule[] = [
  {
    id: 'calm',
    label: 'Calm',
    matchingTags: ['soothing', 'gentle', 'acoustic', 'piano', 'lofi', 'bedroom-pop', 'intimate'],
    style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-medium',
    primaryHue: 158, // Emerald
    secondaryHue: 180, // Teal
    bpm: 72,
    pulseIntensity: 0.85,
    auraLabel: 'Tranquil Hearth',
    description: 'Soft emerald glow & gentle meditative cadence',
    platterRgb: '16, 185, 129',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    matchingTags: ['romantic', 'sweet', 'wedding-song', 'duet', 'love', 'covenant'],
    style: 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300 font-medium',
    primaryHue: 348, // Rose
    secondaryHue: 38, // Warm Amber
    bpm: 78,
    pulseIntensity: 1.05,
    auraLabel: 'Velvet Rose Serenade',
    description: 'Warm rose embers & heartfelt devotion pulse',
    platterRgb: '244, 63, 94',
  },
  {
    id: 'upbeat',
    label: 'Upbeat',
    matchingTags: ['uplifting', 'playful', 'breezy', 'island', 'pop', 'bossa-nova', 'boyband', 'reggae-pop'],
    style: 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-300 font-medium',
    primaryHue: 42, // Solar Amber
    secondaryHue: 25, // Sunburst Orange
    bpm: 114,
    pulseIntensity: 1.25,
    auraLabel: 'Solar Radiance',
    description: 'Golden sunburst resonance & buoyant syncopated rhythm',
    platterRgb: '245, 158, 11',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    matchingTags: ['cinematic', 'soundtrack', 'orchestral', 'dramatic', 'anthem', 'epic'],
    style: 'bg-purple-500/15 border-purple-500/30 text-purple-800 dark:text-purple-300 font-medium',
    primaryHue: 275, // Regal Violet
    secondaryHue: 340, // Crimson
    bpm: 84,
    pulseIntensity: 1.15,
    auraLabel: 'Velvet Widescreen',
    description: 'Deep violet atmosphere & sweeping emotional swells',
    platterRgb: '168, 85, 247',
  },
  {
    id: 'nostalgic',
    label: 'Nostalgic',
    matchingTags: ['nostalgic', 'retro', 'classic', 'classic-opm', '50s-vibe', '2000s', 'fairytale', 'opm'],
    style: 'bg-orange-500/15 border-orange-500/30 text-orange-900 dark:text-orange-300 font-medium',
    primaryHue: 30, // Sepia Bronze
    secondaryHue: 48, // Honey Gold
    bpm: 80,
    pulseIntensity: 0.95,
    auraLabel: 'Vintage Sepia Echo',
    description: 'Aged vinyl warmth & bittersweet timeless reverie',
    platterRgb: '234, 88, 12',
  },
  {
    id: 'focus',
    label: 'Focus',
    matchingTags: ['late-night', 'jazz', 'neo-soul', 'atmospheric', 'haunting', 'strings', 'indie'],
    style: 'bg-sky-500/15 border-sky-500/30 text-sky-900 dark:text-sky-300 font-medium',
    primaryHue: 210, // Midnight Sky
    secondaryHue: 235, // Indigo
    bpm: 76,
    pulseIntensity: 0.9,
    auraLabel: 'Midnight Blue Reverie',
    description: 'Cerulean twilight waves & steady soothing focus',
    platterRgb: '14, 165, 233',
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    matchingTags: ['dreamy', 'folk', 'melodic'],
    style: 'bg-teal-500/15 border-teal-500/30 text-teal-900 dark:text-teal-300 font-medium',
    primaryHue: 175, // Seafoam Teal
    secondaryHue: 195, // Aqua
    bpm: 74,
    pulseIntensity: 0.85,
    auraLabel: 'Luminous Mist',
    description: 'Floating teal motes & ethereal floating cadence',
    platterRgb: '20, 184, 166',
  },
  {
    id: 'soulful',
    label: 'Soulful',
    matchingTags: ['soul', 'emotional', 'ballad', 'powerful', 'alt-rock', 'rnb', 'rock-ballad'],
    style: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-900 dark:text-indigo-300 font-medium',
    primaryHue: 245, // Deep Indigo
    secondaryHue: 290, // Mulberry
    bpm: 82,
    pulseIntensity: 1.1,
    auraLabel: 'Indigo Soul Fire',
    description: 'Rich resonant indigo depths & expressive rhythmic heartbeat',
    platterRgb: '99, 102, 241',
  },
];

/**
 * Derives 2 to 3 distinct mood badges for any given track based on its tags.
 */
export function getTrackMoods(track?: MusicTrack): MoodBadge[] {
  if (!track || !track.tags || track.tags.length === 0) {
    const calmRule = MOOD_RULES[0];
    const focusRule = MOOD_RULES[5];
    return [
      {
        id: calmRule.id,
        label: calmRule.label,
        style: calmRule.style,
        primaryHue: calmRule.primaryHue,
        secondaryHue: calmRule.secondaryHue,
        glowColor: `hsla(${calmRule.primaryHue}, 85%, 60%, 0.45)`,
        pulseIntensity: calmRule.pulseIntensity,
        platterRgb: calmRule.platterRgb,
      },
      {
        id: focusRule.id,
        label: focusRule.label,
        style: focusRule.style,
        primaryHue: focusRule.primaryHue,
        secondaryHue: focusRule.secondaryHue,
        glowColor: `hsla(${focusRule.primaryHue}, 85%, 60%, 0.45)`,
        pulseIntensity: focusRule.pulseIntensity,
        platterRgb: focusRule.platterRgb,
      },
    ];
  }

  const trackTagsLower = track.tags.map((t) => t.toLowerCase());
  const matchedMoods: MoodBadge[] = [];
  const seenMoodIds = new Set<string>();

  // Check matching predefined mood rules
  for (const rule of MOOD_RULES) {
    const hasMatch = rule.matchingTags.some((tag) => trackTagsLower.includes(tag));
    if (hasMatch && !seenMoodIds.has(rule.id)) {
      matchedMoods.push({
        id: rule.id,
        label: rule.label,
        style: rule.style,
        primaryHue: rule.primaryHue,
        secondaryHue: rule.secondaryHue,
        glowColor: `hsla(${rule.primaryHue}, 85%, 60%, 0.45)`,
        pulseIntensity: rule.pulseIntensity,
        platterRgb: rule.platterRgb,
      });
      seenMoodIds.add(rule.id);
      if (matchedMoods.length >= 3) break;
    }
  }

  // If fewer than 2 moods matched, format remaining tags
  if (matchedMoods.length < 2) {
    for (const tag of track.tags) {
      const formatted = tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ');
      if (!matchedMoods.some((m) => m.label.toLowerCase() === formatted.toLowerCase())) {
        matchedMoods.push({
          id: `tag-${tag}`,
          label: formatted,
          style: 'bg-stone-500/15 border-stone-400/30 text-stone-700 dark:text-stone-300 font-medium',
          primaryHue: 40, // Warm amber neutral
          secondaryHue: 30,
          glowColor: 'hsla(40, 80%, 55%, 0.4)',
          pulseIntensity: 0.9,
          platterRgb: '217, 119, 6',
        });
        if (matchedMoods.length >= 2) break;
      }
    }
  }

  // Ensure default fallback if still empty
  if (matchedMoods.length === 0) {
    const calmRule = MOOD_RULES[0];
    const focusRule = MOOD_RULES[5];
    matchedMoods.push(
      {
        id: calmRule.id,
        label: calmRule.label,
        style: calmRule.style,
        primaryHue: calmRule.primaryHue,
        secondaryHue: calmRule.secondaryHue,
        glowColor: `hsla(${calmRule.primaryHue}, 85%, 60%, 0.45)`,
        pulseIntensity: calmRule.pulseIntensity,
        platterRgb: calmRule.platterRgb,
      },
      {
        id: focusRule.id,
        label: focusRule.label,
        style: focusRule.style,
        primaryHue: focusRule.primaryHue,
        secondaryHue: focusRule.secondaryHue,
        glowColor: `hsla(${focusRule.primaryHue}, 85%, 60%, 0.45)`,
        pulseIntensity: focusRule.pulseIntensity,
        platterRgb: focusRule.platterRgb,
      }
    );
  }

  return matchedMoods.slice(0, 3);
}

/**
 * Returns the primary EmotionTheme for a track, dictating background lighting,
 * particle colors, beat pulse tempo (BPM), and aesthetic aura.
 */
export function getTrackEmotionTheme(track?: MusicTrack): EmotionTheme {
  if (!track || !track.tags || track.tags.length === 0) {
    return {
      id: 'calm',
      name: 'Calm & Warm',
      auraLabel: 'Tranquil Hearth',
      description: 'Soft ambient resonance',
      primaryHue: 40,
      secondaryHue: 30,
      bpm: 75,
      pulseIntensity: 0.9,
      radialGradient:
        'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.06) 45%, transparent 75%)',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      accentBorder: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/30',
    };
  }

  const trackTagsLower = track.tags.map((t) => t.toLowerCase());

  // Find the most salient matching mood rule
  let matchedRule = MOOD_RULES.find((rule) =>
    rule.matchingTags.some((tag) => trackTagsLower.includes(tag))
  );

  if (!matchedRule) {
    matchedRule = MOOD_RULES[0];
  }

  // Generate radial and glow gradients based on matched rule's hues
  const pHue = matchedRule.primaryHue;
  const sHue = matchedRule.secondaryHue;

  return {
    id: matchedRule.id,
    name: matchedRule.label,
    auraLabel: matchedRule.auraLabel,
    description: matchedRule.description,
    primaryHue: pHue,
    secondaryHue: sHue,
    bpm: matchedRule.bpm,
    pulseIntensity: matchedRule.pulseIntensity,
    radialGradient: `radial-gradient(circle at 50% 20%, hsla(${pHue}, 80%, 55%, 0.16) 0%, hsla(${sHue}, 75%, 45%, 0.08) 45%, transparent 75%)`,
    glowColor: `hsla(${pHue}, 85%, 60%, 0.35)`,
    accentBorder: `border-[hsla(${pHue},80%,60%,0.35)]`,
    badgeBg: matchedRule.style.split(' ')[0],
    badgeBorder: matchedRule.style.split(' ')[1],
    badgeText: matchedRule.style.split(' ')[2],
  };
}
