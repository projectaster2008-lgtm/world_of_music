import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import {
  getRandomMemoryPhoto,
  DriveMemoryPhoto,
  MEMORY_PHOTOS,
} from './driveBackgrounds';
import {
  Camera,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Eye,
  Sliders,
} from 'lucide-react';

interface MemoryBackgroundLayerProps {
  className?: string;
}

type OpacityMode = 'vivid' | 'cinema' | 'subtle';

export function MemoryBackgroundLayer({ className = '' }: MemoryBackgroundLayerProps) {
  const { isPlaying, currentTrack } = useMusic();

  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    Math.floor(Math.random() * MEMORY_PHOTOS.length)
  );
  const [opacityMode, setOpacityMode] = useState<OpacityMode>('vivid');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const currentPhoto = MEMORY_PHOTOS[currentIndex] || MEMORY_PHOTOS[0];

  const timerRef = useRef<number | null>(null);
  const lastTrackIdRef = useRef<string>(currentTrack.id);

  // Preload an image to prevent flicker during transitions
  const preloadImage = useCallback((url: string) => {
    const img = new Image();
    img.src = url;
  }, []);

  // Go to next photo
  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = (prev + 1) % MEMORY_PHOTOS.length;
      preloadImage(MEMORY_PHOTOS[(nextIdx + 1) % MEMORY_PHOTOS.length].imageUrl);
      return nextIdx;
    });
  }, [preloadImage]);

  // Go to previous photo
  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => {
      const pIdx = (prev - 1 + MEMORY_PHOTOS.length) % MEMORY_PHOTOS.length;
      return pIdx;
    });
  }, []);

  // Shuffle to a new random memory photo
  const shufflePhoto = useCallback(() => {
    setCurrentIndex((prev) => {
      let nextIdx = Math.floor(Math.random() * MEMORY_PHOTOS.length);
      if (nextIdx === prev && MEMORY_PHOTOS.length > 1) {
        nextIdx = (prev + 1) % MEMORY_PHOTOS.length;
      }
      preloadImage(MEMORY_PHOTOS[nextIdx].imageUrl);
      return nextIdx;
    });
  }, [preloadImage]);

  // When track changes, pick a new memory photo
  useEffect(() => {
    if (lastTrackIdRef.current !== currentTrack.id) {
      lastTrackIdRef.current = currentTrack.id;
      if (isPlaying) {
        shufflePhoto();
      }
    }
  }, [currentTrack.id, isPlaying, shufflePhoto]);

  // When song is playing, cycle background randomly every 6 seconds as requested
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        shufflePhoto();
      }, 6000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, shufflePhoto]);

  // Global listener for manual memory photo shuffle
  useEffect(() => {
    const handleManualShuffle = () => {
      shufflePhoto();
    };
    window.addEventListener('ating:shuffle-memory', handleManualShuffle);
    return () => {
      window.removeEventListener('ating:shuffle-memory', handleManualShuffle);
    };
  }, [shufflePhoto]);

  // Compute clear photo opacity based on user mode
  // The user explicitly stated: "the photo barely shows, fix it."
  // So we provide high visibility (0.82 to 1.0) while keeping delicate text contrast!
  const targetOpacity =
    opacityMode === 'cinema'
      ? 1.0
      : opacityMode === 'vivid'
      ? isPlaying
        ? 0.88
        : 0.78
      : 0.55;

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Animated Crossfading Background Photo */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{
            opacity: targetOpacity,
            scale: 1.02,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.label || 'Clint & Maica Memory'}
            className="w-full h-full object-cover object-center filter brightness-100 contrast-100 saturate-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== currentPhoto.thumbnailUrl) {
                target.src = currentPhoto.thumbnailUrl;
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gentle, Translucent Cinematic Edge Scrim */}
      {/* Note: Kept very light and feather-only so the photos are clearly and richly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f2]/35 via-transparent to-[#faf7f2]/45 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(250,247,242,0.30)_100%)] pointer-events-none" />

      {/* Interactive Memory Photo Toolbar */}
      <div className="absolute bottom-24 right-3 sm:bottom-28 sm:right-6 pointer-events-auto z-20 flex flex-col items-end gap-2">
        {/* Expanded Mode Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-xs text-stone-800"
            >
              <button
                onClick={prevPhoto}
                title="Previous Memory Photo"
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-amber-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={shufflePhoto}
                title="Random Memory Shuffle"
                className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[11px]">Shuffle (6s)</span>
              </button>

              <button
                onClick={nextPhoto}
                title="Next Memory Photo"
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-amber-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-stone-200 mx-0.5" />

              {/* Opacity Mode Selector */}
              <div className="flex items-center bg-stone-100/90 rounded-lg p-0.5 text-[10px]">
                <button
                  onClick={() => setOpacityMode('vivid')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    opacityMode === 'vivid'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Vivid (88% clarity)"
                >
                  Vivid
                </button>
                <button
                  onClick={() => setOpacityMode('cinema')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    opacityMode === 'cinema'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Cinema Pure (100% full photo)"
                >
                  Pure
                </button>
                <button
                  onClick={() => setOpacityMode('subtle')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    opacityMode === 'subtle'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Soft (55% subtle)"
                >
                  Soft
                </button>
              </div>

              <div className="h-4 w-[1px] bg-stone-200 mx-0.5" />

              <button
                onClick={() => setIsLightboxOpen(true)}
                title="Open Memory in Fullscreen"
                className="p-1.5 rounded-xl hover:bg-amber-100 text-amber-800 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Badge */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowControls((v) => !v)}
            title="Toggle Memory controls & photo visibility"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-amber-600/30 hover:border-amber-600 text-stone-800 hover:text-amber-950 text-[11px] font-medium transition-all shadow-[0_4px_16px_rgba(160,140,120,0.2)]"
          >
            <Camera className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif">
              Memory #{currentIndex + 1} / {MEMORY_PHOTOS.length}
            </span>
            <Sliders className="w-3 h-3 text-stone-500 group-hover:text-amber-700" />
          </button>

          <button
            onClick={shufflePhoto}
            title="Instant Shuffle to Next Memory Photo"
            className="p-1.5 rounded-full bg-white/95 hover:bg-white border border-stone-300/80 hover:border-amber-500 text-stone-700 hover:text-amber-900 transition-all shadow-[0_4px_14px_rgba(160,140,120,0.15)]"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPhoto.imageUrl}
                alt="Clint & Maica Memory Fullscreen"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                referrerPolicy="no-referrer"
              />

              <div className="flex items-center justify-between w-full mt-4 px-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-serif font-medium tracking-wide">
                    Memory #{currentIndex + 1} of {MEMORY_PHOTOS.length}
                  </span>
                  <span className="text-xs text-stone-400">• Clint & Maica</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPhoto}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={shufflePhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-medium text-xs transition-colors"
                    title="Shuffle Random Photo"
                  >
                    <Shuffle className="w-4 h-4" />
                    Shuffle
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 ml-2 rounded-xl bg-white/15 hover:bg-white/30 text-stone-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
