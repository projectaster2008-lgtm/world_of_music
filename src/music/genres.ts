import { MusicTrack, AmbientPreset } from './types';

export type GenreId =
  | 'pop'
  | 'soft-rock'
  | 'indie'
  | 'jazz'
  | 'cinematic'
  | 'opm'
  | 'emo';

export interface GenreUiTheme {
  isDark: boolean;
  // Page canvas & text
  pageBgClass: string;
  pageTextClass: string;
  pageBackground?: string;
  textPrimary?: string;
  textSecondary?: string;
  // Containers & Showcase Cards
  cardBgClass: string;
  cardBorderClass: string;
  cardShadowClass: string;
  cardHoverClass: string;
  cardActiveClass: string;
  cardItemInactiveClass: string;
  cardBg?: string;
  cardBorder?: string;
  cardBgHover?: string;
  // Header
  headerBgClass: string;
  headerBorderClass: string;
  headerBg?: string;
  headerBorder?: string;
  // Navigation Tabs (RoomSelector)
  roomTabClass: string;
  roomTabActiveClass: string;
  // Form Inputs (Search & Filter)
  inputBgClass: string;
  inputBorderClass: string;
  inputTextClass: string;
  inputPlaceholderClass: string;
  tagActiveBgClass: string;
  tagInactiveBgClass: string;
  inputBg?: string;
  inputBorder?: string;
  inputFocus?: string;
  // Floating Player (NowPlayingBar)
  nowPlayingBgClass: string;
  nowPlayingBorderClass: string;
  playerBarBg?: string;
  playerBarBorder?: string;
  // Buttons & Controls
  primaryBtnClass: string;
  secondaryBtnClass: string;
  buttonPrimaryBg?: string;
  buttonSecondaryBg?: string;
  // Badges & Accents
  badgeStyle: string;
  accentTextColor: string;
  accentBgColor: string;
  equalizerBarColor: string;
  iconBgClass: string;
  turntableBorderClass: string;
  turntablePlatterGlow: string;
  progressBarClass: string;
  pulseDotClass: string;
  softGlowRgba: string;
  worldTagline: string;
  worldDetails: string;
}

export type ResolvedGenreUiTheme = GenreUiTheme & {
  pageBackground: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  cardBgHover: string;
  headerBg: string;
  headerBorder: string;
  playerBarBg: string;
  playerBarBorder: string;
  buttonPrimaryBg: string;
  buttonSecondaryBg: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
};

export interface GenreDefinition {
  id: GenreId;
  name: string;
  shortName: string;
  subtitle: string;
  worldState: string;
  environmentalIdentity: string;
  atmosphereDescription: string;
  icon: string;
  ambientPreset: AmbientPreset;
  primaryHue: number;
  secondaryHue: number;
  accentRgb: string;
  badgeStyle: string;
  uiTheme: GenreUiTheme;
  weatherType:
    | 'golden-dust'
    | 'vintage-wood'
    | 'fireflies'
    | 'rain-steam'
    | 'projector-stars'
    | 'balcony-glow'
    | 'midnight-rain';
  handwrittenQuotes?: string[];
}

export const GENRE_DEFINITIONS: Record<GenreId, GenreDefinition> = {
  pop: {
    id: 'pop',
    name: 'Pop / Contemporary Pop',
    shortName: 'Pop',
    subtitle: 'Accessible, romantic, mainstream love-song core',
    worldState: '🌤️ Golden Hour',
    environmentalIdentity: 'golden hour, soft daylight, warm sky, floating dust, gentle movement, romantic openness',
    atmosphereDescription:
      'Golden hour soft daylight, warm sky illumination, floating dust and dandelion seeds with buoyant romantic openness.',
    icon: 'Sun',
    ambientPreset: 'golden-pop',
    primaryHue: 44, // Warm Golden Honey
    secondaryHue: 28, // Soft Amber
    accentRgb: '245, 158, 11',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300 font-medium',
    uiTheme: {
      isDark: false,
      pageBgClass: 'bg-[#faf6ee] text-stone-850',
      pageTextClass: 'text-stone-850',
      cardBgClass: 'bg-white/80 border-amber-200/90 text-stone-900 shadow-[0_12px_40px_rgba(245,158,11,0.1)]',
      cardBorderClass: 'border-amber-200/90',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(245,158,11,0.1)]',
      cardHoverClass: 'hover:border-amber-400/50 hover:bg-white',
      cardActiveClass: 'bg-amber-50/95 border-amber-500/50 text-amber-950 shadow-[0_4px_18px_rgba(245,158,11,0.18)]',
      cardItemInactiveClass: 'bg-white/85 hover:bg-white border-stone-200/90 hover:border-amber-400/40 text-stone-800 shadow-sm',
      headerBgClass: 'bg-white/80 border-amber-200/70 text-stone-900',
      headerBorderClass: 'border-amber-200/70',
      roomTabClass: 'bg-white/85 text-stone-600 border-stone-200/90 hover:bg-white hover:text-stone-900 hover:border-stone-300 shadow-sm font-medium',
      roomTabActiveClass: 'bg-amber-600/15 text-amber-950 border-amber-600/40 shadow-[0_4px_14px_rgba(217,119,6,0.18)] font-semibold',
      inputBgClass: 'bg-white/90 border-stone-200/90 text-stone-900 placeholder-stone-400 focus:border-amber-500/60 focus:bg-white',
      inputBorderClass: 'border-stone-200/90',
      inputTextClass: 'text-stone-900',
      inputPlaceholderClass: 'placeholder-stone-400',
      tagActiveBgClass: 'bg-amber-600/20 text-amber-950 border-amber-600/40 font-semibold',
      tagInactiveBgClass: 'bg-white/85 text-stone-600 border-stone-200/90 hover:text-stone-900 hover:bg-white',
      nowPlayingBgClass: 'bg-[#fdfbf7]/95 border-amber-200/90 text-stone-900 shadow-[0_-8px_30px_rgba(180,160,140,0.16)]',
      nowPlayingBorderClass: 'border-amber-200/90',
      primaryBtnClass: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/25',
      secondaryBtnClass: 'bg-white/85 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200/90',
      badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300 font-medium',
      accentTextColor: 'text-amber-700',
      accentBgColor: 'bg-amber-600',
      equalizerBarColor: 'bg-amber-600',
      iconBgClass: 'bg-amber-100/90 border-amber-300/60',
      turntableBorderClass: 'border-amber-400/40 shadow-[0_0_35px_rgba(245,158,11,0.18)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.08) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-amber-500 to-amber-600',
      pulseDotClass: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
      softGlowRgba: 'rgba(245, 158, 11, 0.22)',
      worldTagline: 'Golden Hour • Soft Daylight',
      worldDetails: 'Warm sky, floating dust, gentle movement & romantic openness',
    },
    weatherType: 'golden-dust',
  },
  'soft-rock': {
    id: 'soft-rock',
    name: 'Soft Rock / Adult Contemporary',
    shortName: 'Soft Rock',
    subtitle: 'Timeless, nostalgic, old-love-record feeling',
    worldState: '💿 Vintage Room',
    environmentalIdentity: 'vintage lamps, wooden interiors, vinyl, subtle film grain, warm shadows, slow camera movement',
    atmosphereDescription:
      'Vintage desk lamps, mahogany wooden interiors, revolving vinyl records, subtle film grain, and warm shadows.',
    icon: 'Radio',
    ambientPreset: 'vintage-rock',
    primaryHue: 32, // Warm Birch / Edison Bulb
    secondaryHue: 18, // Mahogany
    accentRgb: '180, 83, 9',
    badgeStyle: 'bg-amber-950/40 text-amber-200 border-amber-700/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#140e0a] text-amber-100',
      pageTextClass: 'text-amber-100',
      cardBgClass: 'bg-[#1e130c]/50 backdrop-blur-2xl border border-amber-800/35 text-amber-50 shadow-[0_12px_40px_rgba(20,12,7,0.5)]',
      cardBorderClass: 'border-amber-800/35',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(20,12,7,0.5)]',
      cardHoverClass: 'hover:border-amber-600/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-amber-950/60 backdrop-blur-2xl border-amber-600/60 text-amber-100 shadow-[0_4px_18px_rgba(180,83,9,0.25)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-amber-700/50 text-amber-100/90 shadow-sm',
      headerBgClass: 'bg-[#140e0a]/55 backdrop-blur-2xl border-b border-amber-800/30 text-amber-100',
      headerBorderClass: 'border-amber-800/30',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-amber-200/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-amber-100 shadow-sm font-medium',
      roomTabActiveClass: 'bg-amber-700/35 backdrop-blur-xl text-amber-200 border-amber-500/60 shadow-[0_0_20px_rgba(180,83,9,0.3)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-amber-800/35 text-amber-100 placeholder-amber-400/40 focus:border-amber-500 focus:bg-black/50',
      inputBorderClass: 'border-amber-800/35',
      inputTextClass: 'text-amber-100',
      inputPlaceholderClass: 'placeholder-amber-400/40',
      tagActiveBgClass: 'bg-amber-700/35 backdrop-blur-md text-amber-200 border-amber-600/50 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-amber-200/60 border border-white/[0.08] hover:text-amber-100 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#140e0a]/75 backdrop-blur-2xl border-t border-amber-800/40 text-amber-100 shadow-[0_-8px_30px_rgba(15,9,6,0.6)]',
      nowPlayingBorderClass: 'border-amber-800/40',
      primaryBtnClass: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-600/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-amber-200 border border-amber-800/40',
      badgeStyle: 'bg-amber-950/40 text-amber-200 border-amber-700/40 font-medium',
      accentTextColor: 'text-amber-400',
      accentBgColor: 'bg-amber-600',
      equalizerBarColor: 'bg-amber-500',
      iconBgClass: 'bg-amber-950/60 border-amber-700/50',
      turntableBorderClass: 'border-amber-700/40 shadow-[0_0_35px_rgba(180,83,9,0.22)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(180, 83, 9, 0.28) 0%, rgba(120, 53, 15, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-amber-600 to-amber-400',
      pulseDotClass: 'bg-amber-500 shadow-[0_0_8px_#d97706]',
      softGlowRgba: 'rgba(180, 83, 9, 0.22)',
      worldTagline: 'Vintage Room • Old-Love Vinyl',
      worldDetails: 'Vintage lamps, wooden interiors, film grain & warm shadows',
    },
    weatherType: 'vintage-wood',
  },
  indie: {
    id: 'indie',
    name: 'Indie / Alternative / Indie Pop',
    shortName: 'Indie',
    subtitle: 'Intimate, atmospheric, slightly unusual, personal',
    worldState: '🌿 Twilight Garden',
    environmentalIdentity: 'twilight garden, moonlight, plants, fireflies, soft haze, drifting particles',
    atmosphereDescription:
      'Twilight garden with silver moonlight filtering through plants, soft haze, and bioluminescent fireflies pulsing gently.',
    icon: 'Sparkles',
    ambientPreset: 'twilight-indie',
    primaryHue: 155, // Twilight Emerald
    secondaryHue: 205, // Moonlit Cyan
    accentRgb: '16, 185, 129',
    badgeStyle: 'bg-emerald-950/40 text-emerald-200 border-emerald-600/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#051412] text-emerald-100',
      pageTextClass: 'text-emerald-100',
      cardBgClass: 'bg-[#071f1b]/50 backdrop-blur-2xl border border-emerald-500/25 text-emerald-50 shadow-[0_12px_40px_rgba(4,22,18,0.5)]',
      cardBorderClass: 'border-emerald-500/25',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(4,22,18,0.5)]',
      cardHoverClass: 'hover:border-emerald-400/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-emerald-950/60 backdrop-blur-2xl border-emerald-400/60 text-emerald-100 shadow-[0_4px_18px_rgba(16,185,129,0.25)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-emerald-600/50 text-emerald-100/90 shadow-sm',
      headerBgClass: 'bg-[#051412]/55 backdrop-blur-2xl border-b border-emerald-500/20 text-emerald-100',
      headerBorderClass: 'border-emerald-500/20',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-emerald-200/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-emerald-50 shadow-sm font-medium',
      roomTabActiveClass: 'bg-emerald-600/30 backdrop-blur-xl text-emerald-200 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-emerald-500/30 text-emerald-100 placeholder-emerald-400/40 focus:border-emerald-400 focus:bg-black/50',
      inputBorderClass: 'border-emerald-500/30',
      inputTextClass: 'text-emerald-100',
      inputPlaceholderClass: 'placeholder-emerald-400/40',
      tagActiveBgClass: 'bg-emerald-600/30 backdrop-blur-md text-emerald-200 border-emerald-400/50 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-emerald-200/60 border border-white/[0.08] hover:text-emerald-100 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#051412]/75 backdrop-blur-2xl border-t border-emerald-500/30 text-emerald-50 shadow-[0_-8px_30px_rgba(4,18,15,0.6)]',
      nowPlayingBorderClass: 'border-emerald-500/30',
      primaryBtnClass: 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-emerald-200 border border-emerald-500/30',
      badgeStyle: 'bg-emerald-950/40 text-emerald-200 border-emerald-600/40 font-medium',
      accentTextColor: 'text-emerald-400',
      accentBgColor: 'bg-emerald-500',
      equalizerBarColor: 'bg-emerald-400',
      iconBgClass: 'bg-emerald-950/60 border-emerald-600/50',
      turntableBorderClass: 'border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.22)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(6, 95, 70, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      pulseDotClass: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
      softGlowRgba: 'rgba(16, 185, 129, 0.22)',
      worldTagline: 'Twilight Garden • Moonlight & Mist',
      worldDetails: 'Plants, moonlight, fireflies, soft haze & drifting particles',
    },
    weatherType: 'fireflies',
  },
  jazz: {
    id: 'jazz',
    name: 'Jazz / Jazz-Pop / Bossa-Inspired',
    shortName: 'Jazz',
    subtitle: 'The little late-night café universe',
    worldState: '☕ Rainy Café',
    environmentalIdentity: 'intimate café, rain on windows, candles, coffee steam, curtains moving slightly, old speakers',
    atmosphereDescription:
      'Intimate café, rain dripping down the window glass, coffee steam, curtains moving slightly, and warm candlelight.',
    icon: 'Coffee',
    ambientPreset: 'rainy-cafe',
    primaryHue: 35, // Espresso Cream
    secondaryHue: 200, // Rain Blue
    accentRgb: '217, 119, 6',
    badgeStyle: 'bg-amber-950/45 text-amber-200 border-amber-700/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#110c09] text-amber-100',
      pageTextClass: 'text-amber-100',
      cardBgClass: 'bg-[#1a120e]/50 backdrop-blur-2xl border border-amber-700/30 text-amber-50 shadow-[0_12px_40px_rgba(18,10,7,0.5)]',
      cardBorderClass: 'border-amber-700/30',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(18,10,7,0.5)]',
      cardHoverClass: 'hover:border-amber-500/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-amber-950/60 backdrop-blur-2xl border-amber-500/60 text-amber-100 shadow-[0_4px_18px_rgba(217,119,6,0.25)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-amber-700/50 text-amber-100/90 shadow-sm',
      headerBgClass: 'bg-[#110c09]/55 backdrop-blur-2xl border-b border-amber-700/25 text-amber-100',
      headerBorderClass: 'border-amber-700/25',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-amber-200/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-amber-100 shadow-sm font-medium',
      roomTabActiveClass: 'bg-amber-700/35 backdrop-blur-xl text-amber-200 border-amber-500/60 shadow-[0_0_20px_rgba(217,119,6,0.35)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-amber-700/30 text-amber-100 placeholder-amber-400/40 focus:border-amber-500 focus:bg-black/50',
      inputBorderClass: 'border-amber-700/30',
      inputTextClass: 'text-amber-100',
      inputPlaceholderClass: 'placeholder-amber-400/40',
      tagActiveBgClass: 'bg-amber-700/35 backdrop-blur-md text-amber-200 border-amber-500/50 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-amber-200/60 border border-white/[0.08] hover:text-amber-100 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#110c09]/75 backdrop-blur-2xl border-t border-amber-700/35 text-amber-50 shadow-[0_-8px_30px_rgba(15,8,5,0.6)]',
      nowPlayingBorderClass: 'border-amber-700/35',
      primaryBtnClass: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-600/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-amber-200 border border-amber-700/35',
      badgeStyle: 'bg-amber-950/45 text-amber-200 border-amber-700/40 font-medium',
      accentTextColor: 'text-amber-400',
      accentBgColor: 'bg-amber-600',
      equalizerBarColor: 'bg-amber-500',
      iconBgClass: 'bg-amber-950/60 border-amber-700/50',
      turntableBorderClass: 'border-amber-600/40 shadow-[0_0_35px_rgba(217,119,6,0.22)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(217, 119, 6, 0.28) 0%, rgba(146, 64, 14, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      pulseDotClass: 'bg-amber-500 shadow-[0_0_8px_#d97706]',
      softGlowRgba: 'rgba(217, 119, 6, 0.22)',
      worldTagline: 'Intimate Café • Tactile Rain & Steam',
      worldDetails: 'Rain on windows, candles, coffee steam, swaying curtains & old speakers',
    },
    weatherType: 'rain-steam',
  },
  cinematic: {
    id: 'cinematic',
    name: 'Musical / Cinematic Romance',
    shortName: 'Cinematic',
    subtitle: 'Songs that make an ordinary moment feel like a movie scene',
    worldState: '🎬 Dream Theater',
    environmentalIdentity: 'theater curtains, projector light, floating dust, stars, dramatic depth, subtle lens bloom',
    atmosphereDescription:
      'Grand theater curtains, sweeping projector beam, floating dust, cinematic stars, and subtle lens bloom.',
    icon: 'Film',
    ambientPreset: 'dream-theater',
    primaryHue: 285, // Velvet Violet
    secondaryHue: 45, // Gold Starlight
    accentRgb: '168, 85, 247',
    badgeStyle: 'bg-purple-950/45 text-purple-200 border-purple-600/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#0f0718] text-purple-100',
      pageTextClass: 'text-purple-100',
      cardBgClass: 'bg-[#180a27]/50 backdrop-blur-2xl border border-purple-500/25 text-purple-50 shadow-[0_12px_40px_rgba(15,6,26,0.5)]',
      cardBorderClass: 'border-purple-500/25',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(15,6,26,0.5)]',
      cardHoverClass: 'hover:border-purple-400/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-purple-950/60 backdrop-blur-2xl border-purple-400/60 text-purple-100 shadow-[0_4px_18px_rgba(168,85,247,0.25)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-purple-600/50 text-purple-100/90 shadow-sm',
      headerBgClass: 'bg-[#0f0718]/55 backdrop-blur-2xl border-b border-purple-500/20 text-purple-100',
      headerBorderClass: 'border-purple-500/20',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-purple-200/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-purple-100 shadow-sm font-medium',
      roomTabActiveClass: 'bg-purple-600/30 backdrop-blur-xl text-purple-200 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-purple-500/30 text-purple-100 placeholder-purple-400/40 focus:border-purple-400 focus:bg-black/50',
      inputBorderClass: 'border-purple-500/30',
      inputTextClass: 'text-purple-100',
      inputPlaceholderClass: 'placeholder-purple-400/40',
      tagActiveBgClass: 'bg-purple-600/30 backdrop-blur-md text-purple-200 border-purple-400/50 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-purple-200/60 border border-white/[0.08] hover:text-purple-100 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#0f0718]/75 backdrop-blur-2xl border-t border-purple-500/35 text-purple-50 shadow-[0_-8px_30px_rgba(15,6,26,0.6)]',
      nowPlayingBorderClass: 'border-purple-500/35',
      primaryBtnClass: 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-purple-200 border border-purple-500/30',
      badgeStyle: 'bg-purple-950/45 text-purple-200 border-purple-600/40 font-medium',
      accentTextColor: 'text-purple-400',
      accentBgColor: 'bg-purple-600',
      equalizerBarColor: 'bg-purple-400',
      iconBgClass: 'bg-purple-950/60 border-purple-600/50',
      turntableBorderClass: 'border-purple-400/40 shadow-[0_0_35px_rgba(168,85,247,0.22)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(107, 33, 168, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-purple-500 to-indigo-400',
      pulseDotClass: 'bg-purple-400 shadow-[0_0_8px_#a855f7]',
      softGlowRgba: 'rgba(168, 85, 247, 0.22)',
      worldTagline: 'Dream Theater • Projector Beam',
      worldDetails: 'Theater curtains, projector light, dust, stars & dramatic lens bloom',
    },
    weatherType: 'projector-stars',
  },
  opm: {
    id: 'opm',
    name: 'Filipino / OPM',
    shortName: 'OPM',
    subtitle: 'Closer to home. Familiar, intimate, unmistakably Filipino',
    worldState: '🇵🇭 Home at Night',
    environmentalIdentity: 'quiet Filipino home/balcony at night, warm window light, distant city lights, plants, nostalgic texture',
    atmosphereDescription:
      'Quiet Filipino home and balcony at night, warm capiz window illumination, distant city lights, and nostalgic texture.',
    icon: 'HeartHandshake',
    ambientPreset: 'home-opm',
    primaryHue: 26, // Sincere Filipino Amber
    secondaryHue: 12, // Terracotta
    accentRgb: '249, 115, 22',
    badgeStyle: 'bg-orange-950/45 text-orange-200 border-orange-600/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#100d16] text-orange-100',
      pageTextClass: 'text-orange-100',
      cardBgClass: 'bg-[#191122]/50 backdrop-blur-2xl border border-orange-500/25 text-orange-50 shadow-[0_12px_40px_rgba(18,12,24,0.5)]',
      cardBorderClass: 'border-orange-500/25',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(18,12,24,0.5)]',
      cardHoverClass: 'hover:border-orange-400/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-orange-950/60 backdrop-blur-2xl border-orange-400/60 text-orange-100 shadow-[0_4px_18px_rgba(249,115,22,0.25)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-orange-600/50 text-orange-100/90 shadow-sm',
      headerBgClass: 'bg-[#100d16]/55 backdrop-blur-2xl border-b border-orange-500/20 text-orange-100',
      headerBorderClass: 'border-orange-500/20',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-orange-200/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-orange-100 shadow-sm font-medium',
      roomTabActiveClass: 'bg-orange-600/30 backdrop-blur-xl text-orange-200 border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.35)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-orange-500/30 text-orange-100 placeholder-orange-400/40 focus:border-orange-400 focus:bg-black/50',
      inputBorderClass: 'border-orange-500/30',
      inputTextClass: 'text-orange-100',
      inputPlaceholderClass: 'placeholder-orange-400/40',
      tagActiveBgClass: 'bg-orange-600/30 backdrop-blur-md text-orange-200 border-orange-400/50 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-orange-200/60 border border-white/[0.08] hover:text-orange-100 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#100d16]/75 backdrop-blur-2xl border-t border-orange-500/35 text-orange-50 shadow-[0_-8px_30px_rgba(18,12,24,0.6)]',
      nowPlayingBorderClass: 'border-orange-500/35',
      primaryBtnClass: 'bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold shadow-md shadow-orange-500/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-orange-200 border border-orange-500/30',
      badgeStyle: 'bg-orange-950/45 text-orange-200 border-orange-600/40 font-medium',
      accentTextColor: 'text-orange-400',
      accentBgColor: 'bg-orange-500',
      equalizerBarColor: 'bg-orange-400',
      iconBgClass: 'bg-orange-950/60 border-orange-600/50',
      turntableBorderClass: 'border-orange-400/40 shadow-[0_0_35px_rgba(249,115,22,0.22)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(249, 115, 22, 0.28) 0%, rgba(194, 65, 12, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      pulseDotClass: 'bg-orange-400 shadow-[0_0_8px_#f97316]',
      softGlowRgba: 'rgba(249, 115, 22, 0.22)',
      worldTagline: 'Home at Night • Quiet Balcony Breeze',
      worldDetails: 'Warm window light, distant city lights, house plants & nostalgic texture',
    },
    weatherType: 'balcony-glow',
  },
  emo: {
    id: 'emo',
    name: 'Emo / Pop-Punk / Alternative Emo',
    shortName: 'Emo',
    subtitle: 'Raw feelings, teenage nostalgia, relationship ache, longing & diary intimacy',
    worldState: '🌧️ Midnight Room',
    environmentalIdentity: 'midnight rain, streetlights, bedroom window, dim desk lamp, reflections',
    atmosphereDescription:
      '2:00 AM thoughts, midnight rain against bedroom window panes, soft sodium streetlights on wet glass, and dim desk lamp warmth.',
    icon: 'CloudRain',
    ambientPreset: 'midnight-emo',
    primaryHue: 228, // Soft Midnight Slate Blue
    secondaryHue: 250, // Periwinkle Mist
    accentRgb: '99, 102, 241',
    badgeStyle: 'bg-indigo-950/45 text-indigo-200 border-indigo-500/40 font-medium',
    uiTheme: {
      isDark: true,
      pageBgClass: 'bg-[#080c16] text-slate-100',
      pageTextClass: 'text-slate-100',
      cardBgClass: 'bg-[#0a0f1d]/50 backdrop-blur-2xl border border-indigo-500/25 text-slate-100 shadow-[0_12px_40px_rgba(4,7,18,0.55)]',
      cardBorderClass: 'border-indigo-500/25',
      cardShadowClass: 'shadow-[0_12px_40px_rgba(4,7,18,0.55)]',
      cardHoverClass: 'hover:border-indigo-400/50 hover:bg-white/[0.08]',
      cardActiveClass: 'bg-indigo-950/60 backdrop-blur-2xl border-indigo-400/70 text-indigo-100 shadow-[0_4px_24px_rgba(99,102,241,0.35)]',
      cardItemInactiveClass: 'bg-white/[0.035] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] hover:border-indigo-400/30 text-slate-200 shadow-sm',
      headerBgClass: 'bg-[#070a12]/55 backdrop-blur-2xl border-b border-indigo-500/20 text-slate-100',
      headerBorderClass: 'border-indigo-500/20',
      roomTabClass: 'bg-white/[0.04] backdrop-blur-md text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white shadow-sm font-medium',
      roomTabActiveClass: 'bg-indigo-600/35 backdrop-blur-xl text-indigo-200 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.35)] font-semibold',
      inputBgClass: 'bg-black/35 backdrop-blur-md border border-indigo-500/30 text-slate-100 placeholder-slate-400/40 focus:border-indigo-400 focus:bg-black/50',
      inputBorderClass: 'border-indigo-500/30',
      inputTextClass: 'text-slate-100',
      inputPlaceholderClass: 'placeholder-slate-400/40',
      tagActiveBgClass: 'bg-indigo-600/35 backdrop-blur-md text-indigo-200 border-indigo-400/60 font-semibold',
      tagInactiveBgClass: 'bg-white/[0.04] backdrop-blur-md text-slate-400 border border-white/[0.08] hover:text-slate-200 hover:bg-white/[0.08]',
      nowPlayingBgClass: 'bg-[#070a12]/75 backdrop-blur-2xl border-t border-indigo-500/30 text-slate-100 shadow-[0_-8px_32px_rgba(4,7,18,0.7)]',
      nowPlayingBorderClass: 'border-indigo-500/30',
      primaryBtnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30',
      secondaryBtnClass: 'bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-indigo-200 border border-indigo-500/30',
      badgeStyle: 'bg-indigo-950/45 text-indigo-200 border-indigo-500/40 font-medium',
      accentTextColor: 'text-indigo-400',
      accentBgColor: 'bg-indigo-600',
      equalizerBarColor: 'bg-indigo-400',
      iconBgClass: 'bg-indigo-950/60 border-indigo-500/50',
      turntableBorderClass: 'border-indigo-400/40 shadow-[0_0_35px_rgba(99,102,241,0.25)]',
      turntablePlatterGlow: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(67, 56, 202, 0.1) 70%, transparent 100%)',
      progressBarClass: 'bg-gradient-to-r from-indigo-500 to-purple-400',
      pulseDotClass: 'bg-indigo-400 shadow-[0_0_8px_#6366f1]',
      softGlowRgba: 'rgba(99, 102, 241, 0.22)',
      worldTagline: 'Midnight Room • 2:00 AM Rain',
      worldDetails: 'Rain against bedroom window, sodium streetlights, dim desk lamp & diary monologue',
    },
    weatherType: 'midnight-rain',
    handwrittenQuotes: [
      'Stay, stay, stay with me...',
      "Without you I feel broke, like I'm half of a whole.",
      'You are a stranger in my own head.',
      'Tonight I wanna say I miss you.',
      'Give me a therapy, someone tell me I am not crazy.',
      "I'm tongue tied, every single time you look my way.",
      '2:00 AM thoughts... the ones that hurt the most.',
      "We'll be a dream that never fades away.",
      'Watching through the bedroom window at the rain.',
      'Unspoken words written in the margins of a diary.',
    ],
  },
};

// Normalize and attach convenience aliases to each genre's UI theme
Object.values(GENRE_DEFINITIONS).forEach((genre) => {
  const t = genre.uiTheme as any;
  const isDark = Boolean(t.isDark);
  t.pageBackground = t.pageBackground || t.pageBgClass;
  t.textPrimary = t.textPrimary || (isDark ? 'text-stone-100' : 'text-stone-900');
  t.textSecondary = t.textSecondary || (isDark ? 'text-stone-400' : 'text-stone-600');
  t.cardBg = isDark
    ? 'bg-[#0a0e17]/55 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]'
    : 'bg-white/80 backdrop-blur-xl border border-amber-200/80 shadow-[0_8px_32px_0_rgba(245,158,11,0.08)]';
  t.cardBorder = isDark ? 'border-white/10' : t.cardBorderClass;
  t.cardBgHover = isDark ? 'bg-white/[0.08]' : 'bg-white/95';
  t.headerBg = isDark ? 'bg-[#070a12]/55 backdrop-blur-2xl' : 'bg-white/80 backdrop-blur-xl';
  t.headerBorder = isDark ? 'border-white/10' : t.headerBorderClass;
  t.playerBarBg = isDark ? 'bg-[#070a12]/75 backdrop-blur-2xl' : 'bg-[#fdfbf7]/85 backdrop-blur-2xl';
  t.playerBarBorder = isDark ? 'border-white/10' : t.nowPlayingBorderClass;
  t.buttonPrimaryBg = t.buttonPrimaryBg || t.primaryBtnClass;
  t.buttonSecondaryBg = isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-stone-200 border border-white/10' : t.secondaryBtnClass;
  t.inputBg = isDark ? 'bg-black/35 backdrop-blur-md' : 'bg-white/90';
  t.inputBorder = isDark ? 'border-white/10' : t.inputBorderClass;
  t.inputFocus = isDark ? 'focus:border-amber-400/60 focus:bg-black/50' : 'focus:border-amber-500/60 focus:bg-white';
});

/**
 * Resolves the primary genre for a music track based on its metadata and tags.
 */
export function getTrackGenre(track?: MusicTrack): GenreId {
  if (!track) return 'pop';

  // 1. If explicitly defined
  if (track.genre && GENRE_DEFINITIONS[track.genre]) {
    return track.genre;
  }

  const tags = track.tags.map((t) => t.toLowerCase());
  const title = track.title.toLowerCase();
  const artist = (track.artist || '').toLowerCase();

  // Emo & Alternative Emo matching
  if (
    tags.some((t) =>
      ['emo', 'pop-punk', 'post-hardcore', 'alternative-rock', 'alt-rock', 'ache', 'diary'].includes(t)
    ) ||
    ['mayday parade', 'we the kings', 'second hand serenade', 'safetysuit', 'fm static', 'faber drive', 'all time low'].includes(artist) ||
    ['stay', 'sad song', "we'll be a dream", 'stranger', "you don't see me", 'tonight', 'tongue tied', 'therapy'].includes(title)
  ) {
    return 'emo';
  }

  // OPM matching
  if (
    tags.includes('opm') ||
    tags.includes('classic-opm') ||
    ['silent sanctuary', 'moira dela torre', 'sponge cola', 'april boys', 'juris', 'darren espanto'].some((a) =>
      artist.includes(a)
    )
  ) {
    return 'opm';
  }

  // Jazz matching
  if (
    tags.includes('jazz') ||
    tags.includes('bossa-nova') ||
    artist.includes('laufey') ||
    artist.includes('pink sweat$') ||
    artist.includes('sasha alex sloan') ||
    artist.includes('arthur miguel') ||
    title.includes('here with me') ||
    ['at my worst', 'dancing with your ghost', 'i see the light', 'i need you'].includes(title)
  ) {
    return 'jazz';
  }

  // Soft Rock / Adult Contemporary
  if (
    tags.includes('boyband') ||
    tags.includes('soft-rock') ||
    ['george benson', 'shania twain', 'westlife', 'goo goo dolls', 'lewis capaldi'].some((a) =>
      artist.includes(a)
    ) ||
    ["nothing's gonna change my love for you", "you're still the one", 'i lay my love on you', 'my love', 'iris', 'before you go', 'die with a smile'].includes(title)
  ) {
    return 'soft-rock';
  }

  // Indie / Alternative
  if (
    tags.includes('indie') ||
    tags.includes('indie-pop') ||
    tags.includes('lofi') ||
    ['stephen sanchez', 'pamungkas', 'seafret', 'rex orange county', 'd4vd'].some((a) =>
      artist.includes(a)
    ) ||
    title.includes('count on me')
  ) {
    return 'indie';
  }

  // Cinematic
  if (
    tags.includes('cinematic') ||
    tags.includes('soundtrack') ||
    ['zac efron', 'christina perri', 'billie eilish'].some((a) => artist.includes(a)) ||
    ['rewrite the stars', 'a thousand years', 'lovely'].includes(title)
  ) {
    return 'cinematic';
  }

  // Default to Pop
  return 'pop';
}
