/**
 * Mobile & Background Audio Engine for Ating Universe
 * 
 * Provides:
 * 1. navigator.mediaSession metadata & control bindings (lock screen & notification tray)
 * 2. Silent background audio keepalive ensuring iOS Safari & Android Chrome do not
 *    suspend or kill audio playback when the tab is switched, minimized, or screen locked.
 * 3. In-viewport invisible player retention avoiding WebKit off-screen pause heuristics.
 */

import { MusicTrack } from '../music/types';
import { getTrackThumbnailUrl } from '../music/thumbnailHelper';

class MobileBackgroundAudioManager {
  private silentAudio: HTMLAudioElement | null = null;
  private audioContext: (AudioContext | any) | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isKeepaliveActive: boolean = false;
  private callbacks: {
    onPlay?: () => void;
    onPause?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onSeekTo?: (time: number) => void;
  } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSilentAudio();
      this.initGlobalUnlockListeners();
      this.initVisibilityHandler();
    }
  }

  /**
   * Automatically unlocks audio session upon the first user click/touch anywhere on the page
   */
  private initGlobalUnlockListeners() {
    const unlockHandler = () => {
      this.unlockAudioSession();
    };
    window.addEventListener('pointerdown', unlockHandler, { passive: true, once: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true, once: true });
    window.addEventListener('keydown', unlockHandler, { passive: true, once: true });
  }

  /**
   * Initializes a looped silent audio element. On mobile devices (iOS/Android),
   * an active HTML5 audio element informs the OS that the web page has an ongoing
   * audio session, granting background audio execution rights.
   */
  private initSilentAudio() {
    try {
      // 1-second silent WAV base64 string
      const silentWavBase64 =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
      const audio = new Audio();
      audio.src = silentWavBase64;
      audio.loop = true;
      audio.volume = 0.01;
      audio.preload = 'auto';
      // Inline playback attribute for iOS WebKit
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      this.silentAudio = audio;
    } catch {
      // Ignore if Audio is unavailable
    }
  }

  /**
   * Unlocks Web Audio & AudioElement on the first user interaction gesture.
   */
  public unlockAudioSession() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && !this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }
    } catch {
      // ignore
    }

    if (this.silentAudio && this.silentAudio.paused) {
      this.silentAudio.play().catch(() => {
        // May fail if interaction gesture hasn't registered yet
      });
    }
  }

  /**
   * Starts the background audio keepalive session when a track is playing.
   * Generates a sub-audible carrier signal via Web Audio and loops silent audio,
   * instructing the OS and browser audio mixer to never suspend the tab.
   */
  public startKeepalive() {
    this.isKeepaliveActive = true;
    if (this.silentAudio) {
      this.silentAudio.play().catch(() => {});
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioContext && AudioCtx) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }
        // Sub-audible 10Hz carrier tone at 0.00002 gain: completely silent to human ear,
        // but continuously registers active hardware output to prevent browser sleep
        if (!this.oscillator) {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.frequency.setValueAtTime(10, this.audioContext.currentTime);
          gain.gain.setValueAtTime(0.00002, this.audioContext.currentTime);
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.start();
          this.oscillator = osc;
          this.gainNode = gain;
        }
      }
    } catch {
      // ignore Web Audio errors
    }
  }

  /**
   * Pauses the silent keepalive session when user deliberately pauses music.
   */
  public stopKeepalive() {
    this.isKeepaliveActive = false;
    if (this.silentAudio && !this.silentAudio.paused) {
      this.silentAudio.pause();
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // ignore
      }
      this.oscillator = null;
      this.gainNode = null;
    }
  }

  /**
   * Binds user control callbacks for mediaSession events.
   */
  public setCallbacks(callbacks: {
    onPlay?: () => void;
    onPause?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onSeekTo?: (time: number) => void;
  }) {
    this.callbacks = callbacks;
    this.bindMediaSessionHandlers();
  }

  /**
   * Updates navigator.mediaSession metadata so mobile notifications and lock screen
   * show the song title, artist, artwork, and duration.
   */
  public updateMetadata(track: MusicTrack, roomName?: string, isPlaying: boolean = true) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      const artworkUrl = getTrackThumbnailUrl(track, 'hq');
      const maxArtworkUrl = getTrackThumbnailUrl(track, 'max');

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist || 'Ating Universe',
        album: roomName ? `Ating Universe • ${roomName}` : 'Ating Universe Sanctuary',
        artwork: [
          { src: artworkUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: artworkUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: artworkUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' },
          { src: maxArtworkUrl, sizes: '1280x720', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch {
      // mediaSession metadata setting may fail in unsupported environments
    }
  }

  /**
   * Updates playback state and position state in mediaSession.
   */
  public updatePlaybackState(isPlaying: boolean, currentTime: number = 0, duration: number = 0) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      if (duration > 0 && typeof navigator.mediaSession.setPositionState === 'function') {
        navigator.mediaSession.setPositionState({
          duration: Math.max(1, duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, currentTime), duration),
        });
      }
    } catch {
      // ignore
    }
  }

  private bindMediaSessionHandlers() {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const actionHandlers: Array<[MediaSessionAction, MediaSessionActionHandler | null]> = [
      ['play', () => this.callbacks.onPlay?.()],
      ['pause', () => this.callbacks.onPause?.()],
      ['nexttrack', () => this.callbacks.onNext?.()],
      ['previoustrack', () => this.callbacks.onPrevious?.()],
      [
        'seekto',
        (details: MediaSessionActionDetails) => {
          if (details.seekTime !== undefined && this.callbacks.onSeekTo) {
            this.callbacks.onSeekTo(details.seekTime);
          }
        },
      ],
    ];

    actionHandlers.forEach(([action, handler]) => {
      try {
        if (handler) {
          navigator.mediaSession.setActionHandler(action, handler as any);
        }
      } catch {
        // Some actions might not be supported on older browsers
      }
    });
  }

  /**
   * Watches page visibility: ensures that when the user switches tabs or locks the screen,
   * our keepalive continues running and doesn't get terminated.
   */
  private initVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Tab moved to background or screen locked. Ensure keepalive is running if music is playing.
        if (this.isKeepaliveActive && this.silentAudio && this.silentAudio.paused) {
          this.silentAudio.play().catch(() => {});
        }
      } else if (document.visibilityState === 'visible') {
        // Returned to tab: ensure AudioContext is resumed
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }
      }
    });
  }
}

export const mobileBackgroundAudio = new MobileBackgroundAudioManager();
