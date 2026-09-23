import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { RoomBackground } from './environment/RoomBackground';
import { YouTubePlayerHost } from './player/YouTubePlayerHost';
import { TurntableVisualizer } from './player/TurntableVisualizer';
import { NowPlayingBar } from './player/NowPlayingBar';
import { FullPlayerModal } from './player/FullPlayerModal';
import { RoomSelector } from './components/RoomSelector';
import { SearchAndFilterBar, SortOption } from './components/SearchAndFilterBar';
import { TrackList } from './components/TrackList';
import { UniverseRouletteModal } from './components/UniverseRouletteModal';
import { QueueDrawer } from './components/QueueDrawer';
import { RestModeOverlay } from './components/RestModeOverlay';
import { EnterSanctuaryModal } from './components/EnterSanctuaryModal';
import { AtingHeader } from './components/AtingHeader';
import { TrackCommentarySection } from './components/TrackCommentarySection';
import { PlaqueParticleCanvas } from './components/PlaqueParticleCanvas';
import { getTrackMoods } from './music/moods';
import { ATING_PORTAL_URL, handlePortalHomeClick } from './utils/portalNavigation';
import { useLenisSmoothScroll } from './utils/lenisSmoothScroll';
import { Sparkles, Compass, Activity, Home } from 'lucide-react';

function MusicWorldContent() {
  // Initialize buttery-smooth Lenis scroll capped at 45-60 FPS
  useLenisSmoothScroll();

  const {
    activeRoom,
    currentPlaylist,
    currentTrack,
    favorites,
    allTracks,
    openRoulette,
    isPlaying,
    turntableTransitioning,
    beatDynamics,
    theme,
    genreAtmosphere,
  } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [showLinerNotes, setShowLinerNotes] = useState(true);

  // Derive 2-3 dynamic mood badges for the currently revolving track
  const currentTrackMoods = useMemo(() => getTrackMoods(currentTrack), [currentTrack]);

  // Filter and sort tracks according to current room, search query, tags, and favorites
  const displayedTracks = useMemo(() => {
    // 1. Start with room playlist
    let list = [...currentPlaylist];

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const artistMatch = t.artist?.toLowerCase().includes(q);
        const tagMatch = t.tags.some((tag) => tag.toLowerCase().includes(q));
        const yearMatch = t.year?.toString().includes(q);
        return titleMatch || artistMatch || tagMatch || yearMatch;
      });
    }

    // 3. Filter by selected tag
    if (selectedTag !== 'all') {
      list = list.filter((t) => t.tags.includes(selectedTag));
    }

    // 4. Filter by favorites
    if (filterFavoritesOnly) {
      list = list.filter((t) => favorites.includes(t.id));
    }

    // 5. Sort
    switch (sortBy) {
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'artist':
        return list.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
      case 'year':
        return list.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'recent':
        return list.sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''));
      case 'default':
      default:
        return list;
    }
  }, [currentPlaylist, searchQuery, selectedTag, filterFavoritesOnly, favorites, sortBy]);

  return (
    <div className={`min-h-screen relative flex flex-col font-sans pb-28 transition-colors duration-700 ${theme.textPrimary}`}>
      {/* Dynamic Atmospheric Background */}
      <RoomBackground />

      {/* Global YouTube Player Host */}
      <YouTubePlayerHost />

      {/* Top Header Bar */}
      <AtingHeader />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-8 z-10">
        {/* Room Atmosphere & Physical Turntable Showcase */}
        <section
          id="turntable-showcase"
          className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl overflow-hidden transition-all duration-700 ${theme.cardBg} ${theme.cardBorder} shadow-2xl`}
        >
          {/* Subtle top edge glass reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Turntable Platter */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <TurntableVisualizer size="standard" />
            </div>

            {/* Room Story & Currently Revolving Meta */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono self-center lg:self-start mb-3 font-semibold">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeRoom.subtitle || 'Sanctuary Corner'}</span>
              </div>

              <h1 className={`text-2xl sm:text-4xl font-serif font-bold tracking-tight leading-tight mb-2 transition-colors duration-500 ${theme.textPrimary}`}>
                {activeRoom.name}
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 font-normal transition-colors duration-500 ${theme.textSecondary}`}>
                {activeRoom.description}
              </p>

              {/* Current song highlighted plaque with Beat & Emotion Theme Dynamics */}
              <div
                id="current-song-plaque"
                className={`p-4 rounded-2xl text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-500 relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} shadow-lg`}
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: genreAtmosphere.accentRgb || `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 55%, 0.9)`,
                  boxShadow: isPlaying
                    ? `0 10px 30px rgba(0,0,0,0.25), 0 0 ${8 + beatDynamics.beatPulse * 16}px ${beatDynamics.emotionTheme.glowColor}`
                    : '0 6px 20px rgba(0,0,0,0.15)',
                }}
              >
                {/* Subtle canvas-based particle animation reacting to the track's primary mood tag color */}
                <PlaqueParticleCanvas
                  primaryHue={beatDynamics.emotionTheme.primaryHue}
                  secondaryHue={beatDynamics.emotionTheme.secondaryHue}
                  isPlaying={isPlaying}
                  beatPulse={beatDynamics.beatPulse}
                  measurePulse={beatDynamics.measurePulse}
                  dynamicsMode={beatDynamics.dynamicsMode}
                />

                {/* Subtle emotional aura background tint */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-20"
                  style={{
                    background: beatDynamics.emotionTheme.radialGradient,
                  }}
                />

                {/* Cross-fade transition aura sweep */}
                <AnimatePresence>
                  {turntableTransitioning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 pointer-events-none bg-gradient-to-r from-amber-400/20 via-white/10 to-transparent blur-md z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Cross-fade track metadata & mood aura */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTrack.id}
                    initial={{ opacity: 0, y: 7, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -7, filter: 'blur(4px)' }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0 flex-1 relative z-10"
                  >
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold flex items-center gap-1.5">
                        {isPlaying ? 'ACTIVE GROOVE' : 'CUED ON TURNTABLE'}
                        {/* Organic 4-bar equalizer indicator that moves with the beat */}
                        {isPlaying && (
                          <span className="inline-flex items-end gap-0.5 h-3 ml-0.5">
                            <span
                              className="w-0.5 rounded-full transition-all duration-100"
                              style={{
                                height: `${20 + beatDynamics.beatPulse * 75}%`,
                                backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 50%, 0.95)`,
                              }}
                            />
                            <span
                              className="w-0.5 rounded-full transition-all duration-100"
                              style={{
                                height: `${30 + beatDynamics.measurePulse * 65}%`,
                                backgroundColor: `hsla(${beatDynamics.emotionTheme.secondaryHue}, 90%, 50%, 0.95)`,
                              }}
                            />
                            <span
                              className="w-0.5 rounded-full transition-all duration-100"
                              style={{
                                height: `${15 + beatDynamics.beatPulse * 85}%`,
                                backgroundColor: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 50%, 0.95)`,
                              }}
                            />
                            <span
                              className="w-0.5 rounded-full transition-all duration-100"
                              style={{
                                height: `${25 + beatDynamics.measurePulse * 50}%`,
                                backgroundColor: `hsla(${beatDynamics.emotionTheme.secondaryHue}, 90%, 50%, 0.95)`,
                              }}
                            />
                          </span>
                        )}
                      </span>

                      {/* Dynamic Mood Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {currentTrackMoods.map((mood) => (
                          <span
                            key={mood.id}
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm ${mood.style}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                            {mood.label}
                          </span>
                        ))}
                      </div>

                      {/* Active Emotion Aura Label */}
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-serif px-2 py-0.5 rounded-full border font-medium ${theme.badgeStyle}`}
                        title={beatDynamics.emotionTheme.description}
                      >
                        ✦ {beatDynamics.emotionTheme.auraLabel}
                      </span>
                    </div>

                    <p className={`text-sm sm:text-base font-bold truncate transition-colors ${theme.textPrimary}`}>
                      {currentTrack.title}
                    </p>
                    <p className={`text-xs truncate font-medium transition-colors ${theme.textSecondary}`}>
                      {currentTrack.artist} {currentTrack.year ? `(${currentTrack.year})` : ''}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Right controls: Theme Dynamics Mode & Universe Choice */}
                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center relative z-10">
                  {/* Theme Dynamics Mode Selector */}
                  <button
                    onClick={beatDynamics.cycleDynamicsMode}
                    title="Click to cycle Beat & Emotion theme dynamics (Vibrant / Subtle / Ambient)"
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-sm ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
                  >
                    <Activity
                      className="w-3.5 h-3.5 transition-transform duration-150"
                      style={{
                        color: `hsla(${beatDynamics.emotionTheme.primaryHue}, 90%, 45%, 1)`,
                        transform: `scale(${isPlaying ? 1 + beatDynamics.beatPulse * 0.3 : 1})`,
                      }}
                    />
                    <span className="text-[11px] capitalize font-mono font-medium">
                      {beatDynamics.dynamicsMode}
                    </span>
                  </button>

                  <button
                    onClick={openRoulette}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Universe Choice</span>
                  </button>
                </div>
              </div>

              {/* Clint & Maica's Reflections / Liner Notes */}
              {currentTrack.description && (
                <div className={`mt-4 pt-3.5 border-t relative z-10 ${theme.cardBorder}`}>
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setShowLinerNotes((prev) => !prev)}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-serif font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>
                        {showLinerNotes ? "Hide Clint & Maica's Notes" : "Show Clint & Maica's Notes"}
                      </span>
                    </button>
                    <span className={`text-[10px] font-mono ${theme.textSecondary}`}>
                      Liner Notes
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {showLinerNotes && (
                      <motion.div
                        key={currentTrack.id}
                        initial={{ opacity: 0, y: 5, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -5, filter: 'blur(3px)' }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <TrackCommentarySection track={currentTrack} variant="compact" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Room Navigation Pill Bar */}
        <section id="room-navigation-section">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xs font-mono uppercase tracking-widest font-bold transition-colors ${theme.textSecondary}`}>
              SANCTUARY ROOMS
            </h2>
            <span className={`text-xs font-mono transition-colors opacity-75 ${theme.textSecondary}`}>
              7 Curated Atmospheres
            </span>
          </div>
          <RoomSelector />
        </section>

        {/* Search, Tag Filtering & Archive List */}
        <section id="music-archive-section" className="space-y-4">
          <SearchAndFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterFavoritesOnly={filterFavoritesOnly}
            onToggleFavoritesOnly={() => setFilterFavoritesOnly((p) => !p)}
            favoritesCount={favorites.length}
          />

          <TrackList
            tracks={displayedTracks}
            title={
              filterFavoritesOnly
                ? 'Your Cherished Favorites'
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : `${activeRoom.name} Playlist`
            }
            subtitle={
              filterFavoritesOnly
                ? 'Songs you have marked for eternal return.'
                : `Melodies woven for ${activeRoom.name.toLowerCase()}.`
            }
          />
        </section>

        {/* Gateway Footer: Portal Home to Ating Universe */}
        <footer
          id="ating-portal-home-footer"
          className="mt-6 pt-6 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none"
        >
          <div className="flex items-center gap-2.5">
            <a
              href={ATING_PORTAL_URL}
              target="_parent"
              onClick={handlePortalHomeClick}
              title="Return to Ating Universe Portal (replaces parent)"
              className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-amber-400/40 group hover:border-amber-300 transition-all cursor-pointer"
            >
              <img src="/favicon.svg" alt="Ating Universe" className="w-full h-full object-cover" />
            </a>
            <p className="font-serif italic text-stone-400">
              Ating Universe • Music Sanctuary
            </p>
          </div>

          <a
            id="portal-home-footer-btn"
            href={ATING_PORTAL_URL}
            target="_parent"
            onClick={handlePortalHomeClick}
            title="✦ Return to Ating Universe Portal (replaces parent, no new tab)"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 text-stone-300 hover:text-amber-300 transition-all group font-mono text-[11px] shadow-sm cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>← Return to Ating Universe Portal Home</span>
          </a>
        </footer>
      </main>

      {/* Global Persistent Mini Player Bar */}
      <NowPlayingBar />

      {/* Expanded Full Player Modal */}
      <FullPlayerModal />

      {/* Queue Drawer */}
      <QueueDrawer />

      {/* ✦ Let The Universe Choose Modal */}
      <UniverseRouletteModal />

      {/* Passive Listening Rest Mode Overlay */}
      <RestModeOverlay />

      {/* First-visit Entry Invitation Modal */}
      <EnterSanctuaryModal />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <MusicWorldContent />
    </MusicProvider>
  );
}
