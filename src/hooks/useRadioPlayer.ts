import { useCallback, useEffect, useRef, useState } from 'react';
import {
  STREAM_URL,
  RECONNECT_BASE_MS,
  RECONNECT_MAX_MS,
  RECONNECT_MAX_ATTEMPTS,
} from '../constants';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface TrackMeta {
  title: string;
  artist: string;
  art: string;
}

/**
 * Owns the <audio> element lifecycle: playback state derived from media events,
 * reconnection with exponential backoff, volume, Web Audio analyser and Media Session.
 */
export function useRadioPlayer(meta: TrackMeta | null) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const wantPlayingRef = useRef(false);
  const attemptsRef = useRef(0);
  const retryTimerRef = useRef<number | undefined>(undefined);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [volume, setVolumeState] = useState(1);

  const clearRetry = () => {
    window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = undefined;
  };

  const ensureAudioContext = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (!ctxRef.current) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        const ctx = new Ctor();
        const node = ctx.createAnalyser();
        const source = ctx.createMediaElementSource(audio);
        source.connect(node);
        node.connect(ctx.destination);
        ctxRef.current = ctx;
        setAnalyser(node);
      }
      if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    } catch {
      // Web Audio unavailable — playback still works, visualizer falls back to animation
    }
  };

  const startStream = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    audio.src = `${STREAM_URL}?t=${Date.now()}`;
    audio.load();
    return audio.play();
  }, []);

  const stopStream = useCallback(() => {
    const audio = audioRef.current;
    clearRetry();
    wantPlayingRef.current = false;
    attemptsRef.current = 0;
    if (audio) {
      audio.pause();
      // Drop the connection so a paused live stream stops buffering.
      audio.removeAttribute('src');
      audio.load();
    }
    setStatus('paused');
  }, []);

  const toggle = useCallback(() => {
    if (wantPlayingRef.current) {
      stopStream();
      return;
    }
    wantPlayingRef.current = true;
    attemptsRef.current = 0;
    setStatus('loading');
    ensureAudioContext();
    startStream().catch((err: unknown) => {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      wantPlayingRef.current = false;
      setStatus('error');
    });
  }, [startStream, stopStream]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  // Derive state from the real media events.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      attemptsRef.current = 0;
      setStatus('playing');
    };
    const onWaiting = () => {
      if (wantPlayingRef.current) setStatus('loading');
    };
    // Paused from outside (media keys, headphones unplugged, OS) while we wanted to play.
    const onPause = () => {
      if (wantPlayingRef.current && audio.getAttribute('src')) stopStream();
    };
    const scheduleRetry = () => {
      if (!wantPlayingRef.current) return;
      if (attemptsRef.current >= RECONNECT_MAX_ATTEMPTS) {
        wantPlayingRef.current = false;
        setStatus('error');
        return;
      }
      const delay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** attemptsRef.current);
      attemptsRef.current += 1;
      setStatus('loading');
      clearRetry();
      retryTimerRef.current = window.setTimeout(() => {
        if (wantPlayingRef.current) startStream().catch(() => {});
      }, delay);
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', scheduleRetry);
    audio.addEventListener('ended', scheduleRetry);
    audio.addEventListener('stalled', onWaiting);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', scheduleRetry);
      audio.removeEventListener('ended', scheduleRetry);
      audio.removeEventListener('stalled', onWaiting);
      clearRetry();
    };
  }, [startStream, stopStream]);

  // Lock-screen / media-key integration.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    ms.playbackState = status === 'playing' ? 'playing' : 'paused';
    ms.setActionHandler('play', () => { if (!wantPlayingRef.current) toggle(); });
    ms.setActionHandler('pause', () => { if (wantPlayingRef.current) toggle(); });
    ms.setActionHandler('stop', () => { if (wantPlayingRef.current) toggle(); });
  }, [status, toggle]);

  const title = meta?.title;
  const artist = meta?.artist;
  const art = meta?.art;
  useEffect(() => {
    if (!('mediaSession' in navigator) || !title || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: 'EthnAfrika',
      artwork: art ? [{ src: art }] : [],
    });
  }, [title, artist, art]);

  // Release the Web Audio context on unmount.
  useEffect(() => () => { void ctxRef.current?.close(); ctxRef.current = null; }, []);

  return { audioRef, status, analyser, volume, setVolume, toggle };
}
