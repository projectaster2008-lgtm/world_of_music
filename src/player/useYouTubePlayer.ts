import { useEffect, useRef, useState, useCallback } from 'react';
import { PlaybackStatus } from '../music/types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerProps {
  initialVideoId?: string;
  onTrackEnd?: () => void;
  onError?: (errorCode: number) => void;
  initialVolume?: number;
  initialMuted?: boolean;
}

export function useYouTubePlayer({
  initialVideoId,
  onTrackEnd,
  onError,
  initialVolume = 80,
  initialMuted = false,
}: UseYouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerIdRef = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('unstarted');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMutedState] = useState(initialMuted);
  const [lastError, setLastError] = useState<number | null>(null);

  // Tracks whether the user desires active playback (used for background & visibility recovery)
  const userWantsPlayingRef = useRef<boolean>(false);
  // Distinguishes intentional user pause from involuntary background/tab-switch pauses
  const isManualPauseRef = useRef<boolean>(false);

  // Active track and position tracking for stall and error recovery
  const currentVideoIdRef = useRef<string>(initialVideoId || '');
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const networkRetryCountRef = useRef<number>(0);

  // Slow internet & buffer stall tracking
  const lastProgressTimestampRef = useRef<number>(Date.now());
  const lastReportedTimeRef = useRef<number>(0);
  const stallCounterRef = useRef<number>(0);
  const isRecoveringStallRef = useRef<boolean>(false);

  // Auto-fallback queue for tracks with embed restrictions
  const fallbacksRef = useRef<string[]>([]);
  const currentFallbackIndexRef = useRef<number>(0);
  const isRetryingRef = useRef<boolean>(false);

  const onTrackEndRef = useRef(onTrackEnd);
  onTrackEndRef.current = onTrackEnd;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Determine safe origin for YouTube IFrame API
  const getSafeOrigin = () => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.location &&
        window.location.origin &&
        window.location.origin !== 'null' &&
        !window.location.origin.includes('null') &&
        window.location.origin.startsWith('http')
      ) {
        return window.location.origin;
      }
    } catch {
      // ignore
    }
    return undefined;
  };

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!window.YT || !window.YT.Player) {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      const container = document.getElementById(containerIdRef.current);
      if (!container || playerRef.current) return;

      try {
        const safeOrigin = getSafeOrigin();
        const playerVars: Record<string, any> = {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        };
        if (safeOrigin) {
          playerVars.origin = safeOrigin;
        }

        playerRef.current = new window.YT.Player(containerIdRef.current, {
          height: '100%',
          width: '100%',
          videoId: initialVideoId || '',
          playerVars,
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              event.target.setVolume(initialVolume);
              if (initialMuted) event.target.mute();
              try {
                // Request lowest video resolution (144p/240p) to conserve bandwidth for audio stream
                event.target.setPlaybackQuality?.('small');
              } catch {
                // ignore
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (window.YT) {
                switch (state) {
                  case window.YT.PlayerState.PLAYING:
                    setIsPlaying(true);
                    setPlaybackStatus('playing');
                    setLastError(null);
                    isRetryingRef.current = false;
                    networkRetryCountRef.current = 0;
                    stallCounterRef.current = 0;
                    lastProgressTimestampRef.current = Date.now();
                    try {
                      playerRef.current?.setPlaybackQuality?.('small');
                    } catch {
                      // ignore
                    }
                    break;
                  case window.YT.PlayerState.PAUSED:
                    // If the user desires active playback and has NOT manually paused:
                    // This pause was caused by background tab switching, screen sleep, or an internet hiccup.
                    // Wait 250ms and re-assert playVideo without flipping the UI to paused!
                    if (userWantsPlayingRef.current && !isManualPauseRef.current) {
                      setTimeout(() => {
                        try {
                          if (userWantsPlayingRef.current && !isManualPauseRef.current) {
                            playerRef.current?.playVideo();
                          }
                        } catch {
                          // ignore
                        }
                      }, 250);
                      return;
                    }
                    setIsPlaying(false);
                    setPlaybackStatus('paused');
                    break;
                  case window.YT.PlayerState.ENDED:
                    // Verify if this is a genuine track completion or a premature buffer underrun on slow connection!
                    try {
                      const currentT = playerRef.current?.getCurrentTime?.() || currentTimeRef.current || 0;
                      const totalD = playerRef.current?.getDuration?.() || durationRef.current || 0;
                      // If duration is known (>12s) and current time is still >3.5s away from the end,
                      // YouTube encountered a network stall / packet drop and fired ENDED prematurely!
                      if (totalD > 12 && currentT < totalD - 3.5) {
                        console.warn(
                          `[YouTubePlayer] Premature ENDED detected at ${currentT.toFixed(1)}s of ${totalD.toFixed(1)}s (slow connection buffer underrun). Resuming stream...`
                        );
                        setPlaybackStatus('buffering');
                        setTimeout(() => {
                          try {
                            if (playerRef.current) {
                              playerRef.current.seekTo?.(currentT, true);
                              playerRef.current.playVideo?.();
                            }
                          } catch {
                            // ignore
                          }
                        }, 400);
                        return;
                      }
                    } catch {
                      // ignore
                    }

                    setIsPlaying(false);
                    setPlaybackStatus('ended');
                    if (onTrackEndRef.current) {
                      onTrackEndRef.current();
                    }
                    break;
                  case window.YT.PlayerState.BUFFERING:
                    setPlaybackStatus('buffering');
                    break;
                  case window.YT.PlayerState.CUED:
                    setPlaybackStatus('cued');
                    break;
                  default:
                    setPlaybackStatus('unstarted');
                }
              }
            },
            onError: (event: any) => {
              const code = event.data;
              console.warn(`[YouTubePlayer] Error event code ${code} for video ${currentVideoIdRef.current}`);

              // Transient network or HTML5 media error (code 2 or 5)
              if ((code === 2 || code === 5) && networkRetryCountRef.current < 2) {
                networkRetryCountRef.current += 1;
                const resumePos = Math.max(0, currentTimeRef.current - 0.5);
                console.info(
                  `[YouTubePlayer] Transient network error ${code}. Retrying at position ${resumePos.toFixed(1)}s in 1.2s...`
                );
                setTimeout(() => {
                  try {
                    if (playerRef.current && currentVideoIdRef.current) {
                      playerRef.current.loadVideoById({
                        videoId: currentVideoIdRef.current,
                        startSeconds: resumePos,
                      });
                      playerRef.current.setPlaybackQuality?.('small');
                      setLastError(null);
                    }
                  } catch (err) {
                    console.warn('[YouTubePlayer] Retry attempt failed:', err);
                  }
                }, 1200);
                return;
              }

              // Check if we can automatically try a fallback YouTube ID (e.g. for error 150, 101, 100)
              const nextIndex = currentFallbackIndexRef.current + 1;
              if (nextIndex < fallbacksRef.current.length && !isRetryingRef.current) {
                isRetryingRef.current = true;
                currentFallbackIndexRef.current = nextIndex;
                const nextId = fallbacksRef.current[nextIndex];
                currentVideoIdRef.current = nextId;
                console.info(`[YouTubePlayer] Error code ${code}. Trying fallback audio stream (${nextId})...`);
                setTimeout(() => {
                  try {
                    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
                      playerRef.current.loadVideoById(nextId);
                      playerRef.current.setPlaybackQuality?.('small');
                      setLastError(null);
                    }
                  } catch (err) {
                    console.warn('[YouTubePlayer] Fallback attempt error:', err);
                  } finally {
                    isRetryingRef.current = false;
                  }
                }, 300);
                return;
              }

              setLastError(code);
              if (onErrorRef.current) {
                onErrorRef.current(code);
              }
            },
          },
        });
      } catch (err) {
        console.warn('YouTube player initialization notice:', err);
      }
    }

    return () => {
      // Clean up player on unmount
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, []);

  // Time, Duration & Slow Internet Buffer Stall Recovery loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
            const curr = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || 0;

            currentTimeRef.current = curr;
            setCurrentTime(curr);

            if (dur > 0 && dur !== durationRef.current) {
              durationRef.current = dur;
              setDuration(dur);
            }

            // Slow Internet Buffer Stall Detection
            if (Math.abs(curr - lastReportedTimeRef.current) > 0.2) {
              // Audio progress confirmed: reset stall counters
              lastReportedTimeRef.current = curr;
              lastProgressTimestampRef.current = Date.now();
              stallCounterRef.current = 0;
              isRecoveringStallRef.current = false;
            } else if (userWantsPlayingRef.current && !isManualPauseRef.current) {
              // Audio position is frozen! Check stall duration
              const stallTimeMs = Date.now() - lastProgressTimestampRef.current;

              // If stalled for over 3.5s while user desires playback
              if (stallTimeMs > 3500 && !isRecoveringStallRef.current) {
                stallCounterRef.current += 1;
                const count = stallCounterRef.current;

                // Stage 1 (after ~4s stall): soft resume
                if (count === 4) {
                  console.info('[YouTubePlayer] Buffer stall detected. Attempting soft resume...');
                  playerRef.current.playVideo?.();
                }
                // Stage 2 (after ~7.5s stall): micro-reseek forces YouTube HTML5 engine to flush stale buffer chunk
                else if (count === 8) {
                  console.info('[YouTubePlayer] Buffer stall persisting (>7.5s). Micro-reseeking to flush stale stream...');
                  playerRef.current.seekTo?.(curr, true);
                  playerRef.current.playVideo?.();
                }
                // Stage 3 (after ~14s stall): reload stream at current position with lowest bitrate
                else if (count === 14) {
                  console.info('[YouTubePlayer] Severe network stall (>14s). Reloading stream at current position...');
                  if (typeof playerRef.current.loadVideoById === 'function' && currentVideoIdRef.current) {
                    playerRef.current.loadVideoById({
                      videoId: currentVideoIdRef.current,
                      startSeconds: Math.max(0, curr - 0.5),
                    });
                    playerRef.current.setPlaybackQuality?.('small');
                  }
                }
                // Stage 4 (after ~22s stall): try fallback if available
                else if (count === 22) {
                  const nextIdx = currentFallbackIndexRef.current + 1;
                  if (nextIdx < fallbacksRef.current.length) {
                    currentFallbackIndexRef.current = nextIdx;
                    const nextId = fallbacksRef.current[nextIdx];
                    currentVideoIdRef.current = nextId;
                    console.info(`[YouTubePlayer] Prolonged stall (>22s). Switching to fallback stream (${nextId})...`);
                    playerRef.current.loadVideoById?.(nextId);
                    playerRef.current.setPlaybackQuality?.('small');
                  }
                }
              }
            }
          }
        } catch {
          // ignore polling error
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Resilient Background Watchdog:
  // Runs every 500ms. If user desires playback and has not manually paused,
  // but YouTube has stalled or fallen into PAUSED (2), CUED (5), or UNSTARTED (-1)
  // because of tab switching or OS background energy throttling, continuously re-assert playVideo!
  useEffect(() => {
    const watchdog = setInterval(() => {
      if (userWantsPlayingRef.current && !isManualPauseRef.current && playerRef.current) {
        try {
          const state = playerRef.current.getPlayerState?.();
          if (state === 2 /* PAUSED */ || state === 5 /* CUED */ || state === -1 /* UNSTARTED */) {
            playerRef.current.playVideo?.();
          }
        } catch {
          // ignore
        }
      }
    }, 500);

    return () => clearInterval(watchdog);
  }, []);

  // Tab & screen visibility restoration: ensure music keeps playing on focus/pageshow
  useEffect(() => {
    const handleRestore = () => {
      if (userWantsPlayingRef.current && !isManualPauseRef.current && playerRef.current) {
        try {
          const state = playerRef.current.getPlayerState?.();
          if (state !== 1 /* PLAYING */ && state !== 3 /* BUFFERING */) {
            playerRef.current.playVideo?.();
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('focus', handleRestore);
    window.addEventListener('pageshow', handleRestore);
    document.addEventListener('visibilitychange', handleRestore);
    return () => {
      window.removeEventListener('focus', handleRestore);
      window.removeEventListener('pageshow', handleRestore);
      document.removeEventListener('visibilitychange', handleRestore);
    };
  }, []);

  const loadTrack = useCallback((videoId: string, autoPlay: boolean = true, fallbacks: string[] = []) => {
    setLastError(null);
    isRetryingRef.current = false;
    currentFallbackIndexRef.current = 0;
    currentVideoIdRef.current = videoId;
    networkRetryCountRef.current = 0;
    stallCounterRef.current = 0;
    lastProgressTimestampRef.current = Date.now();
    lastReportedTimeRef.current = 0;
    currentTimeRef.current = 0;
    fallbacksRef.current = [videoId, ...fallbacks].filter((id, i, arr) => id && arr.indexOf(id) === i);
    userWantsPlayingRef.current = Boolean(autoPlay);
    if (autoPlay) {
      isManualPauseRef.current = false;
    }

    if (!playerRef.current) return;
    try {
      if (autoPlay) {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(videoId);
          playerRef.current.setPlaybackQuality?.('small');
        }
      } else {
        if (typeof playerRef.current.cueVideoById === 'function') {
          playerRef.current.cueVideoById(videoId);
          playerRef.current.setPlaybackQuality?.('small');
        }
      }
    } catch (e) {
      console.warn('Could not load track:', e);
    }
  }, []);

  const play = useCallback(() => {
    userWantsPlayingRef.current = true;
    isManualPauseRef.current = false;
    lastProgressTimestampRef.current = Date.now();
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
        playerRef.current.setPlaybackQuality?.('small');
      }
    } catch (e) {
      console.warn('Play video failed:', e);
    }
  }, []);

  const pause = useCallback((isManual: boolean = true) => {
    if (isManual) {
      userWantsPlayingRef.current = false;
      isManualPauseRef.current = true;
    }
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.warn('Pause video failed:', e);
    }
    if (isManual) {
      setIsPlaying(false);
      setPlaybackStatus('paused');
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
      }
    } catch (e) {
      console.warn('Seek failed:', e);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.setVolume === 'function') {
        playerRef.current.setVolume(clamped);
        if (clamped > 0 && isMuted) {
          playerRef.current.unMute();
          setIsMutedState(false);
        }
      }
    } catch {
      // ignore
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMutedState(false);
      } else {
        playerRef.current.mute();
        setIsMutedState(true);
      }
    } catch {
      // ignore
    }
  }, [isMuted]);

  return {
    containerId: containerIdRef.current,
    isReady,
    isPlaying,
    playbackStatus,
    currentTime,
    duration,
    volume,
    isMuted,
    lastError,
    loadTrack,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
  };
}
